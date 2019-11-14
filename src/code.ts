var _ = require('lodash');

const getData = (key: string) => {
  return figma.root.getPluginData(key);
}

const setData = (key: string, value: string) => {
  figma.root.setPluginData(key, value);
  return;
}

const airtableKeys = {
  apiKey: 'apiKey',
  baseId: 'baseId',
  tableName: 'tableName',
  primaryKeyField: 'primaryKeyField',
  theCopyField: 'theCopyField'
};

var airtableConfig = {
  apiKey: getData(airtableKeys.apiKey),
  baseId: getData(airtableKeys.baseId),
  tableName: getData(airtableKeys.tableName),
  primaryKeyField: getData(airtableKeys.primaryKeyField),
  theCopyField: getData(airtableKeys.theCopyField)
}

var setAirtableConfig = {
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

if (figma.command === 'config') {
  figma.showUI(__html__);
  figma.ui.postMessage( { type: 'config', airtableConfig } );
}

if (figma.command === 'sync' ) {
  figma.showUI(__html__, { visible: false });
  figma.ui.postMessage({ type: 'sync', airtableConfig });
}

const variablePattern = /^\{{2}.+\}{2}$/m;
function isVariable(testString: string) {
  // Test if input string is a variable
  return variablePattern.test(testString);
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg) => {
  // console.log(msg) // for debugging. comment out this line.

  if (msg.type === 'save-airtable-config') {
    const keys = msg.keys;
    setAirtableConfig.apiKey(keys.apiKey);
    setAirtableConfig.baseId(keys.baseId);
    setAirtableConfig.tableName(keys.tableName);
    setAirtableConfig.primaryKeyField(keys.primaryKeyField);
    setAirtableConfig.theCopyField(keys.theCopyField);
    console.log('Saved new airtable config: ', airtableConfig);
  }

  if (msg.type = 'sync-airtable-strings') {
    // console.log('sync msg received'); // for debugging
    console.log(msg.response); // for debugging
  }

  figma.closePlugin();
}

// function changeTextToTag () {
//   for (const node of figma.currentPage.selection) {

//     // If it's not a variable or a text, move along.
//     if (node.type !== 'TEXT') { break; }
//     if (!isVariable(node.characters) && !isVariable(node.name)) {
//       console.log(node.name + ' not a variable. Moving along.');
//       break;
//     }

//     node.autoRename = false;

//     //  TODO confirmation dialog

//     if (isVariable(node.name) === true && node.name !== node.characters)
//       updateText(node, node.name);

//   };
//   figma.closePlugin();
// }

// async function updateText(node, text) {
//   if (node.hasMissingFont) {

//     // TODO handle missing fonts
//     console.log('There are missing fonts. Not updating ' + node.name + '.')

//   } else {

//     // Figma requires this bit when replacing text
//     await figma.loadFontAsync(node.fontName);

//     // Replace the text in the node
//     node.characters = text;

//   }
// }



// flow - save Airtable info
// need - API key, base ID, view name, primary key field

// flow - update all strings
// under the hood:
//    1. get airtable data
//    2. transform -
//        a. traverse to 'records'
//        b. iterate thru array, replace the "id" field with "key"
//    3. 