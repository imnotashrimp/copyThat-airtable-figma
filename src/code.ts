import { getAirtableConfig, setAirtableConfig } from './airtable'
import { isVar, getVarName } from './var-test'
import { replaceText } from './replace-text'

const airtableConfig = getAirtableConfig();

if (figma.command === 'config') {
  figma.showUI(__html__, { width: 500, height: 500 });
  figma.ui.postMessage( { type: 'config', airtableConfig } );
}

if (figma.command === 'sync' ) {
  // Initialize empty array for Airtable filter
  var varNames = [];

  const nodes = figma.root.findAll(node => node.type === "TEXT");

  // Add variable name to varNames array
  nodes.forEach(async (node: TextNode) => {
    if (!isVar(node.name)) return;

    // console.log(node.name, ' is variable') // debug
    varNames.push(getVarName(node.name));
  });

  // console.log(varNames); // debug

  figma.showUI(__html__, { visible: false });
  figma.ui.postMessage({ type: 'sync', airtableConfig, varNames });
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg) => {
  // console.log(msg) // debug

  if (msg.type === 'save-airtable-config') {
    const keys = msg.keys;
    setAirtableConfig(keys.apiKey, keys.baseId, keys.tableName, keys.primaryKeyField, keys.theCopyField)
    // console.log('Saved new airtable config: ', getAirtableConfig()); // debug
  }

  if (msg.type === 'sync-airtable-strings') {
    // console.log('Plugin received from UI: ', msg.strings); // debug
    replaceText(msg.strings);
  }

  if (msg.type === 'error') {
    // console.log(msg.error.message);
    figma.notify(msg.error.message, {timeout: 10000})
  }

  figma.closePlugin();
}
