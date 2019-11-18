const getData = (key: string) => {
  return figma.root.getPluginData(key);
}

const setData = (key: string, value: string) => {
  figma.root.setPluginData(key, value);
  return;
}

export const airtableKeys = {
  apiKey: 'apiKey',
  baseId: 'baseId',
  tableName: 'tableName',
  primaryKeyField: 'primaryKeyField',
  theCopyField: 'theCopyField'
};

export var airtableConfig = {
  apiKey: getData(airtableKeys.apiKey),
  baseId: getData(airtableKeys.baseId),
  tableName: getData(airtableKeys.tableName),
  primaryKeyField: getData(airtableKeys.primaryKeyField),
  theCopyField: getData(airtableKeys.theCopyField)
}

export const setAirtableConfig = {
  apiKey: (val: string) => {
    setData(airtableKeys.apiKey, val);
    airtableConfig.apiKey = getData(airtableKeys.apiKey);
  },

  baseId: (val: string) => {
    setData(airtableKeys.baseId, val);
    airtableConfig.baseId = getData(airtableKeys.baseId);
  },

  tableName: (val: string) => {
    setData(airtableKeys.tableName, val);
    airtableConfig.tableName = getData(airtableKeys.tableName);
  },

  primaryKeyField: (val: string) => {
    setData(airtableKeys.primaryKeyField, val);
    airtableConfig.primaryKeyField = getData(airtableKeys.primaryKeyField);
  },

  theCopyField: (val: string) => {
    setData(airtableKeys.theCopyField, val);
    airtableConfig.theCopyField = getData(airtableKeys.theCopyField);
  }
}
