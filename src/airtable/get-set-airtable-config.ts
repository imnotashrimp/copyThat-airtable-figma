// {{copyThat.airtable}} - Plugin for using Airtable as a CMS for Figma designs
// Copyright (C) 2020 Stefan (Shalom) Boroda

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

import { stringifyDatetime } from '../date-time'

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

  // Load config into an allConfigArr[]
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
  setData(airtableMap.lastUpdatedDate, generateLastSavedStr());
  return;
}

const generateLastSavedStr = () => {
  const dateTime = stringifyDatetime()
  return 'Last saved ' + dateTime.date + ' at ' + dateTime.time
}
