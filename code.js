var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const getData = (key) => {
    return figma.root.getPluginData(key);
};
const setData = (key, value) => {
    figma.root.setPluginData(key, value);
    return;
};
const airtableKeys = {
    apiKey: 'apiKey',
    baseId: 'baseId',
    primaryKey: 'primaryKey',
    viewName: 'viewName'
};
var airtableConfig = {
    apiKey: getData(airtableKeys.apiKey),
    baseId: getData(airtableKeys.baseId),
    primaryKey: getData(airtableKeys.primaryKey),
    viewName: getData(airtableKeys.viewName)
};
var setAirtableConfig = {
    apiKey: (apiKey) => {
        setData(airtableKeys.apiKey, apiKey);
        airtableConfig.apiKey = getData(airtableKeys.apiKey);
    },
    baseId: (baseId) => {
        setData(airtableKeys.baseId, baseId);
        airtableConfig.baseId = getData(airtableKeys.baseId);
    },
    primaryKey: (primaryKey) => {
        setData(airtableKeys.primaryKey, primaryKey);
        airtableConfig.primaryKey = getData(airtableKeys.primaryKey);
    },
    viewName: (viewName) => {
        setData(airtableKeys.viewName, viewName);
        airtableConfig.viewName = getData(airtableKeys.viewName);
    }
};
if (figma.command === 'config') {
    figma.showUI(__html__);
    figma.ui.postMessage({ type: 'config', airtableConfig });
}
if (figma.command === 'sync') {
    figma.showUI(__html__, { visible: false });
    figma.ui.postMessage({ type: 'sync', airtableConfig });
}
const variablePattern = /^\{{2}.+\}{2}$/m;
function isVariable(testString) {
    // Test if input string is a variable
    return variablePattern.test(testString);
}
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    if (msg.type === 'save-airtable-config') {
        const keys = msg.keys;
        setAirtableConfig.apiKey(keys.apiKey);
        setAirtableConfig.baseId(keys.baseId);
        setAirtableConfig.primaryKey(keys.primaryKey);
        setAirtableConfig.viewName(keys.viewName);
        console.log('Saved new airtable config: ', airtableConfig);
    }
    figma.closePlugin();
});
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
