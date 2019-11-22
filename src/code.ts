import { airtableConfig, setAirtableConfig } from './airtable'

if (figma.command === 'config') {
  figma.showUI(__html__, { width: 500, height: 500 });
  figma.ui.postMessage( { type: 'config', airtableConfig } );
}

if (figma.command === 'sync' ) {
  figma.showUI(__html__, { visible: false });
  figma.ui.postMessage({ type: 'sync', airtableConfig });
}

const variablePattern = /(?:.*\{{2})(.+)(?:\}{2}.*)/;

const isVariable = (testString: string) => {
  // Test if input string is a variable
  return variablePattern.test(testString);
}

const getVariableName = (testString: string) => {
  return testString.replace(variablePattern, '$1');
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg) => {
  // console.log(msg) // debug

  if (msg.type === 'save-airtable-config') {
    const keys = msg.keys;
    setAirtableConfig.apiKey(keys.apiKey);
    setAirtableConfig.baseId(keys.baseId);
    setAirtableConfig.tableName(keys.tableName);
    setAirtableConfig.primaryKeyField(keys.primaryKeyField);
    setAirtableConfig.theCopyField(keys.theCopyField);
    setAirtableConfig.lastUpdatedDate();
    console.log('Saved new airtable config: ', airtableConfig);
  }

  if (msg.type = 'sync-airtable-strings') {
    // console.log('Plugin received from UI: ', msg.strings); // debug
    replaceText(msg.strings);
  }

  figma.closePlugin();
}

function replaceText(airtableData: object) {
  console.log(airtableData);
  const nodes = figma.root.findAll(node => node.type === "TEXT");

  nodes.forEach(async (node: TextNode) => {
    if (!isVariable(node.name)) return;

    // console.log(node.name + 'is a variable. Replacing text.')
    node.autoRename = false;

    if (node.hasMissingFont) {

      // TODO handle missing fonts
      console.log('There are missing fonts. Not updating ', node.name, '.')
      return;

    } else {

      // Figma requires this bit when replacing text
      await figma.loadFontAsync(node.fontName as FontName);

      // Replace the text in the node
      var str = airtableData[getVariableName(node.name)] || '!! This string isn\'t in the database'
      node.characters = str;
      // console.log(airtableData[getVariableName(node.name)]); // debug
      // console.log(node.name, 'variable name: ', getVariableName(node.name)); // debug

    }

  });
}
