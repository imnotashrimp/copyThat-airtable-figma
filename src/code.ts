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
  primaryKey: 'primaryKey',
  viewName: 'viewName'
};

var airtableConfig = {
  apiKey: getData(airtableKeys.apiKey),
  baseId: getData(airtableKeys.baseId),
  tableName: getData(airtableKeys.tableName),
  primaryKey: getData(airtableKeys.primaryKey),
  viewName: getData(airtableKeys.viewName)
}

var setAirtableConfig = {
  apiKey: (apiKey: string) => {
    setData(airtableKeys.apiKey, apiKey);
    airtableConfig.apiKey = getData(airtableKeys.apiKey);
  },

  baseId: (baseId: string) => {
    setData(airtableKeys.baseId, baseId);
    airtableConfig.baseId = getData(airtableKeys.baseId);
  },

  tableName: (tableName: string) => {
    setData(airtableKeys.tableName, tableName);
    airtableConfig.tableName = getData(airtableKeys.tableName);
  },

  primaryKey: (primaryKey: string) => {
    setData(airtableKeys.primaryKey, primaryKey);
    airtableConfig.primaryKey = getData(airtableKeys.primaryKey);
  },

  viewName: (viewName: string) => {
    setData(airtableKeys.viewName, viewName);
    airtableConfig.viewName = getData(airtableKeys.viewName);
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
  if (msg.type === 'save-airtable-config') {
    const keys = msg.keys;
    setAirtableConfig.apiKey(keys.apiKey);
    setAirtableConfig.baseId(keys.baseId);
    setAirtableConfig.tableName(keys.tableName);
    setAirtableConfig.primaryKey(keys.primaryKey);
    setAirtableConfig.viewName(keys.viewName);
    console.log('Saved new airtable config: ', airtableConfig);
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