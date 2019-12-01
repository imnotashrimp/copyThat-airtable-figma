import { isVar } from "./var-test";

const fieldMap = {
    apiKey: 'api-key'
  , baseId: 'base-id'
  , tableName: 'table-name'
  , primaryKeyField: 'primary-key-field'
  , theCopyField: 'the-copy-field'
  , lastUpdatedDate: 'updated-date'
}

const formFields = {
    apiKey: document.getElementById(fieldMap.apiKey)
  , baseId: document.getElementById(fieldMap.baseId)
  , tableName: document.getElementById(fieldMap.tableName)
  , primaryKeyField: document.getElementById(fieldMap.primaryKeyField)
  , theCopyField: document.getElementById(fieldMap.theCopyField)
  , lastUpdatedDate: document.getElementById(fieldMap.lastUpdatedDate)
}

const validationMsg = {
    apiKey: document.getElementById(fieldMap.apiKey + '-validation')
  , baseId: document.getElementById(fieldMap.baseId + '-validation')
  , tableName: document.getElementById(fieldMap.tableName + '-validation')
  , primaryKeyField: document.getElementById(fieldMap.primaryKeyField + '-validation')
  , theCopyField: document.getElementById(fieldMap.theCopyField + '-validation')
  , mainValidationMsg: document.getElementById('main-validation-msg')
}

const getFieldValue = (data: string) => {
  if (!data) return '';
  return data;
}

onmessage = (event) => {
  const msg = event.data.pluginMessage;
  const type = msg.type;

  if (type === 'config') {
    const data = msg.airtableConfig;
    // console.log("Received from plugin: ", data); // debug

    formFields.apiKey['value'] = getFieldValue(data.apiKey);
    formFields.baseId['value'] = getFieldValue(data.baseId);
    formFields.tableName['value'] = getFieldValue(data.tableName);
    formFields.primaryKeyField['value'] = getFieldValue(data.primaryKeyField);
    formFields.theCopyField['value'] = getFieldValue(data.theCopyField);
    formFields.lastUpdatedDate['innerHTML'] = getFieldValue(data.lastUpdatedDate);
  }

  if (type === 'sync') {
    const getAllStrings = async () => {
      console.log('sync called');
      const airtableConfig = msg.airtableConfig;
      const varNames = msg.varNames;
      var allStringsArr = [];

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

      const createFilterString = (varNames, primaryKeyField: string) => {
        var filterString = []

        varNames.forEach(element => {
          filterString.push(primaryKeyField + '=\'' + element + '\'');
        });

        return 'OR(' + filterString.join(',') + ')';
      }

      const apiKey = airtableConfig.apiKey;
      const baseId = airtableConfig.baseId;
      const tableName = airtableConfig.tableName;
      const primaryKeyField = airtableConfig.primaryKeyField;
      const theCopyField = airtableConfig.theCopyField;
      const filter = createFilterString(varNames, primaryKeyField);

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

      // Convert allStringsArr to an object
      var allStringsObj = Object.assign({}, ...allStringsArr);
      // console.log(allStringsObj); // debug


      var msgToPlugin = {
        type: 'sync-airtable-strings',
        strings: allStringsObj
      }

      // console.log(msgToPlugin); // debug
      parent.postMessage({ pluginMessage: msgToPlugin }, '*');
    }
    getAllStrings();
  }
}

document.getElementById('save').onclick = () => {
  const keys = {
      apiKey: getFieldValue(formFields.apiKey['value'])
    , baseId: getFieldValue(formFields.baseId['value'])
    , tableName: getFieldValue(formFields.tableName['value'])
    , primaryKeyField: getFieldValue(formFields.primaryKeyField['value'])
    , theCopyField: getFieldValue(formFields.theCopyField['value'])
  };

  // Validate
  var isValid = validateForm(keys);
  // Prevent saving if form isn't valid
  if (isValid === false) return;

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

function validateForm (keys) {
  var formIsValid = true;
  const isRequired = 'This is required';
  const mainMsg = 'Please fix any issues';

  if (keys.apiKey === '') {
    formIsValid = false;
    validationMsg.apiKey.innerText = isRequired;
  } else {
    validationMsg.apiKey.innerText = '';
  }

  if (keys.baseId === '') {
    formIsValid = false;
    validationMsg.baseId.innerText = isRequired;
  } else {
    validationMsg.baseId.innerText = '';
  }

  if (keys.tableName === '') {
    formIsValid = false;
    validationMsg.tableName.innerText = isRequired;
  } else {
    validationMsg.tableName.innerText = '';
  }

  if (keys.primaryKeyField === '') {
    formIsValid = false;
    validationMsg.primaryKeyField.innerText = isRequired;
  } else {
    validationMsg.primaryKeyField.innerText = '';
  }

  if (keys.theCopyField === '') {
    formIsValid = false;
    validationMsg.theCopyField.innerText = isRequired;
  } else {
    validationMsg.theCopyField.innerText = '';
  }

  if (formIsValid === false)
    validationMsg.mainValidationMsg.innerText = mainMsg;
  return formIsValid;
}
