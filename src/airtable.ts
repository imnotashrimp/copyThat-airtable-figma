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

export var airtableConfig = {
    apiKey: getData(airtableMap.apiKey)
  , baseId: getData(airtableMap.baseId)
  , tableName: getData(airtableMap.tableName)
  , primaryKeyField: getData(airtableMap.primaryKeyField)
  , theCopyField: getData(airtableMap.theCopyField)
  , lastUpdatedDate: getData(airtableMap.lastUpdatedDate)
}

export const setAirtableConfig = {
  apiKey: (val: string) => {
    setData(airtableMap.apiKey, val);
    airtableConfig.apiKey = getData(airtableMap.apiKey);
  },

  baseId: (val: string) => {
    setData(airtableMap.baseId, val);
    airtableConfig.baseId = getData(airtableMap.baseId);
  },

  tableName: (val: string) => {
    setData(airtableMap.tableName, val);
    airtableConfig.tableName = getData(airtableMap.tableName);
  },

  primaryKeyField: (val: string) => {
    setData(airtableMap.primaryKeyField, val);
    airtableConfig.primaryKeyField = getData(airtableMap.primaryKeyField);
  },

  theCopyField: (val: string) => {
    setData(airtableMap.theCopyField, val);
    airtableConfig.theCopyField = getData(airtableMap.theCopyField);
  },

  lastUpdatedDate: () => {
    setData(airtableMap.lastUpdatedDate, stringifyDatetime());
    airtableConfig.lastUpdatedDate = getData(airtableMap.lastUpdatedDate);
  },
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
