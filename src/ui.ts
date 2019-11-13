var apiKey = document.getElementById('api-key');
var baseId = document.getElementById('base-id');
var tableName = document.getElementById('table-name')
var primaryKey = document.getElementById('primary-key');
var viewName = document.getElementById('view-name');

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
    primaryKey['value'] = getFieldValue(data.primaryKey);
    viewName['value'] = getFieldValue(data.viewName);
  }

  if (type === 'sync') {
    console.log('sync called');
    const airtableConfig = msg.airtableConfig;

    const getAirtableStrings = async (airtableConfig) => {
      var request = new XMLHttpRequest()
      // This link has random lorem ipsum text
      const apiKey = airtableConfig.apiKey;
      const baseId = airtableConfig.baseId;
      const tableName = airtableConfig.tableName;
      const primaryKey = airtableConfig.primaryKey;
      const viewName = airtableConfig.viewName;

      const endpointUrl =
        'https://api.airtable.com/v0/'
        + baseId
        + '/'
        + tableName
        + '?api_key='
        + apiKey
        + '&view='
        + viewName
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
    primaryKey: getFieldValue(primaryKey['value']),
    viewName: getFieldValue(viewName['value'])
  };

  console.log('Sending to plugin: ', keys);
  parent.postMessage({ pluginMessage: { type: 'save-airtable-config', keys } }, '*');
}

document.getElementById('cancel').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
}
