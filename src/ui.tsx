// {{copyThat.airtable}} - Plugin for using Airtable as a CMS for Figma designs
// Copyright (C) 2019 Stefan (Shalom) Boroda

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

import { getStringsFromAirtable } from './airtable/get-airtable-records'

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
  if (!data) return ''
  return data
}

onmessage = (event) => {
  const msg = event.data.pluginMessage
  const type = msg.type

  if (type === 'config') {
    const data = msg.airtableConfig
    // console.log("Received from plugin: ", data) // debug

    formFields.apiKey['value'] = getFieldValue(data.apiKey)
    formFields.baseId['value'] = getFieldValue(data.baseId)
    formFields.tableName['value'] = getFieldValue(data.tableName)
    formFields.primaryKeyField['value'] = getFieldValue(data.primaryKeyField)
    formFields.theCopyField['value'] = getFieldValue(data.theCopyField)
    formFields.lastUpdatedDate['innerHTML'] = getFieldValue(data.lastUpdatedDate)
  }

  if (type === 'sync') {
    console.log('sync called')
    const getAllStrings = async () => {

      let allStringsArr = await getStringsFromAirtable(msg.airtableConfig, msg.varNames)

      // Convert allStringsArr to an object
      var allStringsObj = Object.assign({}, ...allStringsArr)
      // console.log(allStringsObj) // debug

      var msgToPlugin = {
        type: 'sync-airtable-strings',
        strings: allStringsObj
      }

      // console.log(msgToPlugin) // debug
      parent.postMessage({ pluginMessage: msgToPlugin }, '*')
    }
    getAllStrings()
  }
}

document.getElementById('save').onclick = () => {
  const keys = {
      apiKey: getFieldValue(formFields.apiKey['value'])
    , baseId: getFieldValue(formFields.baseId['value'])
    , tableName: getFieldValue(formFields.tableName['value'])
    , primaryKeyField: getFieldValue(formFields.primaryKeyField['value'])
    , theCopyField: getFieldValue(formFields.theCopyField['value'])
  }

  // Validate
  var isValid = validateForm(keys)
  // Prevent saving if form isn't valid
  if (isValid === false) return

  console.log('Sending to plugin: ', keys)
  parent.postMessage({ pluginMessage: { type: 'save-airtable-config', keys } }, '*')
}

document.getElementById('cancel').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
}

function validateForm (keys) {
  var formIsValid = true
  const isRequired = 'This is required'
  const mainMsg = 'Please fix the issues in red and try again.'

  if (keys.apiKey === '') {
    formIsValid = false
    validationMsg.apiKey.innerText = isRequired
  } else {
    validationMsg.apiKey.innerText = ''
  }

  if (keys.baseId === '') {
    formIsValid = false
    validationMsg.baseId.innerText = isRequired
  } else {
    validationMsg.baseId.innerText = ''
  }

  if (keys.tableName === '') {
    formIsValid = false
    validationMsg.tableName.innerText = isRequired
  } else {
    validationMsg.tableName.innerText = ''
  }

  if (keys.primaryKeyField === '') {
    formIsValid = false
    validationMsg.primaryKeyField.innerText = isRequired
  } else {
    validationMsg.primaryKeyField.innerText = ''
  }

  if (keys.theCopyField === '') {
    formIsValid = false
    validationMsg.theCopyField.innerText = isRequired
  } else {
    validationMsg.theCopyField.innerText = ''
  }

  if (formIsValid === false)
    validationMsg.mainValidationMsg.innerText = mainMsg
  return formIsValid
}
