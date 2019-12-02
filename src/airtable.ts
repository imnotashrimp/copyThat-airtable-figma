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
  setData(airtableMap.lastUpdatedDate, stringifyDatetime());
  return;
}

const stringifyDatetime = () => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Append leading zero to one-digit numbers (e.g., 1 => 01)
  const addLeadingZero = (num: number) => {
    return num <= 9 ? '0' + num : num;
  }

  let currentDatetime = new Date();

  let dateString = currentDatetime.getDate()
    + ' ' + (months[currentDatetime.getMonth()]) // get name of month
    + ' ' + currentDatetime.getFullYear(); // get four-digit year

  let timeString = addLeadingZero(currentDatetime.getHours())
    + ':' + addLeadingZero(currentDatetime.getMinutes());

  return dateString + ' at ' + timeString;
}

export const getStringsFromAirtable = async (airtableConfig, varNames) => {
  var allStringsArr = [];
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
      var value = record.fields[theCopyField] || '!! UNDEFINED';

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
    var response = await makeAirtableCall(url) as string;

    // Amend the allStrings object, to be passed back to the plugin
    records = JSON.parse(response).records;
    offset = JSON.parse(response).offset;
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

    request.responseType = 'text';
    try {
      request.send();
    } catch (error) {
      return reject(error);
    }
    request.onload = () => {
      return resolve (request.response);
    }
  })
}
