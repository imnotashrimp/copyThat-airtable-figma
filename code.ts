const getData = (key: string) => {
  return figma.root.getPluginData(key) || undefined;
}

const setData = (key: string, value: string) => {
  figma.root.setPluginData(key, value);
  return;
}

const airtableKeys = {
  apiKey: 'apiKey',
  baseId: 'baseId',
  primaryKey: 'primaryKey',
  viewName: 'viewName'
};


var airtable = {
  config: {
    apiKey: getData(airtableKeys.apiKey),
    baseId: getData(airtableKeys.baseId),
    primaryKey: getData(airtableKeys.primaryKey),
    viewName: getData(airtableKeys.viewName)
  },

  set: {
    setApiKey: (apiKey: string) => {
      setData(airtableKeys.apiKey, apiKey);
      airtable.config.apiKey = getData(airtableKeys.apiKey);
    },

    setBaseId: (baseId: string) => {
      setData(airtableKeys.baseId, baseId);
      airtable.config.apiKey = getData(airtableKeys.baseId);
    },

    setPrimaryKey: (primaryKey: string) => {
      setData(airtableKeys.primaryKey, primaryKey);
      airtable.config.apiKey = getData(airtableKeys.primaryKey);
    },

    setViewName: (viewName: string) => {
      setData(airtableKeys.viewName, viewName);
      airtable.config.apiKey = getData(airtableKeys.viewName);
    }
  }
}

figma.showUI(__html__);
figma.ui.postMessage(airtable.config)

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
    console.log('Message received from Figma UI: ', msg.keys)
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