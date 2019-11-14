var apiKey = document.getElementById('api-key');
var baseId = document.getElementById('base-id');
var tableName = document.getElementById('table-name')
var primaryKeyField = document.getElementById('primary-key-field');
var theCopyField = document.getElementById('the-copy-field');

const getFieldValue = (data: string) => {
  if (!data) return '';
  return data;
}

onmessage = (event) => {
  const msg = event.data.pluginMessage;
  const type = msg.type;

  if (type === 'config') {
    const data = msg.airtableConfig;
    console.log("Received from plugin: ", data);

    apiKey['value'] = getFieldValue(data.apiKey);
    baseId['value'] = getFieldValue(data.baseId);
    tableName['value'] = getFieldValue(data.tableName);
    primaryKeyField['value'] = getFieldValue(data.primaryKeyField);
    theCopyField['value'] = getFieldValue(data.theCopyField);
  }

  if (type === 'sync') {
    console.log('sync called');
    const airtableConfig = msg.airtableConfig;

    const getAirtableStrings = async (airtableConfig) => {
      var request = new XMLHttpRequest()
      const apiKey = airtableConfig.apiKey;
      const baseId = airtableConfig.baseId;
      const tableName = airtableConfig.tableName;
      const primaryKeyField = airtableConfig.primaryKeyField;
      const theCopyField = airtableConfig.theCopyField;

      const endpointUrl =
        'https://api.airtable.com/v0/'
        + baseId
        + '/'
        + tableName
        + '?api_key='
        + apiKey
        + '&fields='
        + primaryKeyField
        + '&fields='
        + theCopyField
        ;

      request.open('GET', endpointUrl);

      request.responseType = 'text'
      request.onload = () => {
        const msg = {
          type: 'sync-airtable-strings',
          response: request.response
        }
        window.parent.postMessage({pluginMessage: msg}, '*')
      };
      request.send();

    }

    getAirtableStrings(airtableConfig);

  }
}

document.getElementById('save').onclick = () => {
  const keys = {
    apiKey: getFieldValue(apiKey['value']),
    baseId: getFieldValue(baseId['value']),
    tableName: getFieldValue(tableName['value']),
    primaryKeyField: getFieldValue(primaryKeyField['value']),
    theCopyField: getFieldValue(theCopyField['value'])
  };

  console.log('Sending to plugin: ', keys);
  parent.postMessage({ pluginMessage: { type: 'save-airtable-config', keys } }, '*');
}

document.getElementById('cancel').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
}
