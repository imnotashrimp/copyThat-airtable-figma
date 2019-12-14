// {{copyThat.airtable}} - Plugin for using Airtable as a CMS for Figma designs
// Copyright (C) 2019 Stefan (Shalom) Boroda

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { stringifyDatetime } from './date-time'

const getData = (key: string) => {
  return figma.root.getPluginData(key);
}

const setData = (key: string, value: string) => {
  figma.root.setPluginData(key, value);
  return;
}

export const airtableMap = {
    apiKey: 'apiKey'
  , baseId: 'baseId'
  , tableName: 'tableName'
  , primaryKeyField: 'primaryKeyField'
  , theCopyField: 'theCopyField'
  , lastUpdatedDate: 'lastUpdatedDate'
};

export const getAirtableConfig = (key?: string) => {
  if (key && key !== 'all') return getData(airtableMap[key]) as string;

  var allConfigArr = [];
  Object.keys(airtableMap).forEach((key) => {
    allConfigArr.push({[key]: getAirtableConfig(key)});
  });
  var allConfigObj = Object.assign({}, ...allConfigArr)
  return allConfigObj as object;
}

export const setAirtableConfig = (
    apiKey: string
  , baseId: string
  , tableName: string
  , primaryKeyField: string
  , theCopyField: string
) => {
  setData(airtableMap.apiKey, apiKey);
  setData(airtableMap.baseId, baseId);
  setData(airtableMap.tableName, tableName);
  setData(airtableMap.primaryKeyField, primaryKeyField);
  setData(airtableMap.theCopyField, theCopyField);
  setData(airtableMap.lastUpdatedDate, lastSavedString());
  return;
}

const lastSavedString = () => {
  const dateTime = stringifyDatetime();
  return 'Last saved ' + dateTime.date + ' at ' + dateTime.time;
}

export const getStringsFromAirtable = async (airtableConfig, varNames) => {
  let allStringsArr = [];
  const apiKey = airtableConfig.apiKey;
  const baseId = airtableConfig.baseId;
  const tableName = airtableConfig.tableName;
  const primaryKeyField = airtableConfig.primaryKeyField;
  const theCopyField = airtableConfig.theCopyField;
  const filter = makeAirtableFilter(varNames, primaryKeyField);

  const apiBaseUrl = 'https://api.airtable.com/v0/'
  + baseId
  + '/'
  + tableName
  + '?api_key='
  + apiKey;

  const addStrings = (records) => {
    // Parses Airtable response fields, generates new object, and appends to
    // allStrings array
    records.forEach((record) => {

      var key = record.fields[primaryKeyField];
      var value = record.fields[theCopyField] || '!! STRING IS EMPTY';

      if (!key) {
        return;
      }

      // Update allStrings object, to be sent to the plugin
      allStringsArr.push({[key]: value})
      // console.log(allStrings[key]); // debug
    })
  }

  const pageToFetch = (page: 'first' | 'next', offset?: string) => {
    switch(page) {
      case 'first':
        return apiBaseUrl
          + '&fields=' + primaryKeyField
          + '&fields=' + theCopyField
          + '&filterByFormula=' + filter
          ;

      case 'next':
        return apiBaseUrl
          + '&offset=' + offset
          ;
    }
  }

  const getResults = async (page: 'first' | 'next', offset?: string) => {
    var url = pageToFetch(page, offset);
    var records: string;
    var response = JSON.parse(await makeAirtableCall(url) as string);

    // If Airtable returned an error, this should kill the plugin and report it
    // to the user
    handleBadResponse(response);

    // Amend the allStrings object, to be passed back to the plugin
    records = response.records;
    offset = response.offset;
    // console.log(records); // debug
    addStrings(records);

    // Get next page if it's there
    if (offset) await getResults('next', offset);
  }

  await getResults('first');
  return allStringsArr as string[];
}

const makeAirtableFilter = (varNames, primaryKeyField: string) => {
  let filterString = []

  varNames.forEach(element => {
    filterString.push(primaryKeyField + '=\'' + element + '\'');
  });

  return 'OR(' + filterString.join(',') + ')';
}

const makeAirtableCall = (url: string) => {
  return new Promise( (resolve, reject) => {
    var request = new XMLHttpRequest()
    request.open('GET', url);
    setTimeout(() => {
      console.log('timed out');
      const timedOutMsg = {
        error: {
          type: 'REQUEST_TIMED_OUT'
        }
      };
      handleBadResponse(timedOutMsg);
   }, 10000);

    request.responseType = 'text';
    try {
      console.log('sending request: ', request);
      request.send();
    } catch (error) {
      console.log('caught error: ', error);
      return reject(error);
    }
    request.onload = () => {
      return resolve (request.response);
    }
  })
}

const handleBadResponse = (response) => {
  const error = response.error;
  if (!error) return;

  console.log('Handling a bad response');
  console.log(response);
  let errorType: string;

  // If it's a bad Base ID, Airtable doesn't return the full object.
  // This will handle that case.
  if (error === "NOT_FOUND") {
    errorType = 'BASE_ID_NOT_FOUND';
  } else {
    errorType = error.type;
  }

  const msgPrepend = '⛔️ Sync failed. ';
  const msgAppend = ' ⛔️';
  const msgMap = {
      BASE_ID_NOT_FOUND: 'Check the Base ID.'
    , AUTHENTICATION_REQUIRED: 'Check the Airtable API key.'
    , TABLE_NOT_FOUND: 'Check the table name.'
    , UNKNOWN_FIELD_NAME: 'Check the primary key or copy field names.'
    , REQUEST_TIMED_OUT: 'Airtable didn\'t respond. Try again in a few moments.'
  }

  let msgToPlugin = {
    type: 'error',
    error: {
      type: errorType,
      message: msgPrepend + msgMap[errorType] + msgAppend
    }
  }

  parent.postMessage({ pluginMessage: msgToPlugin }, '*')
}
