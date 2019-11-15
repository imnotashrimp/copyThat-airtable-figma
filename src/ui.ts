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

    var allStrings = {};
    const addStrings = (records) => {
      // Parses Airtable response fields, generates new object, and appends to
      // allStrings array
      records.forEach((record) => {
        var key = record.fields[primaryKeyField];
        var value = record.fields[theCopyField];

        // Update allStrings object, to be sent to the plugin
        allStrings = Object.assign(allStrings, {[key]: value});
      })
    }

    const apiKey = airtableConfig.apiKey;
    const baseId = airtableConfig.baseId;
    const tableName = airtableConfig.tableName;
    const primaryKeyField = airtableConfig.primaryKeyField;
    const theCopyField = airtableConfig.theCopyField;
    const apiBaseUrl = 'https://api.airtable.com/v0/'
      + baseId
      + '/'
      + tableName
      + '?api_key='
      + apiKey;

    const pageToFetch = (page: 'first' | 'next', offset?: string) => {
      switch(page) {
        case 'first':
          return apiBaseUrl
            + '&fields=' + primaryKeyField
            + '&fields=' + theCopyField
            ;

        case 'next':
          return apiBaseUrl + '&offset=' + offset;
      }
    }

    const getResults = async (page: 'first' | 'next', offset?: string) => {
      var url = pageToFetch(page, offset);
      var records: string;
      var response = await makeAirtableCall(url);

      // Amend the allStrings object, to be passed back to the plugin
      if (typeof(response) === 'string') {
        records = JSON.parse(response).records;
        offset = JSON.parse(response).offset;
        addStrings(records);
      }

      // Get next page if it's there
      if (offset) getResults('next', offset);
    }

    getResults('first');
    // console.log(allStrings); // debug

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
