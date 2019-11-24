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

export const setAirtableConfig = (apiKey: string, baseId: string, tableName: string, primaryKeyField: string, theCopyField: string) => {
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
