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
};

export var airtableConfig = {
  apiKey: getData(airtableMap.apiKey),
  baseId: getData(airtableMap.baseId),
  tableName: getData(airtableMap.tableName),
  primaryKeyField: getData(airtableMap.primaryKeyField),
  theCopyField: getData(airtableMap.theCopyField)
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
  }
}
