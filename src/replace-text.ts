import { getVarName, isVar } from './var-test'
import { stringifyDatetime } from './date-time'

export const replaceText = (airtableData: object) => {
  // console.log(airtableData); // debug
  const nodes = figma.root.findAll(node => node.type === "TEXT");

  nodes.forEach(async (node: TextNode) => {
    if (!isVar(node.name)) return;

    // console.log(node.name + 'is a variable. Replacing text.')
    node.autoRename = false;

    if (node.hasMissingFont) {
      handleMissingFont(node);
      return;
    } else {
      replaceTheText(node, airtableData);
    }
  });
}

function handleMissingFont (node: TextNode) {
  console.log('There are missing fonts. Not updating ', node.name, '.');
  figma.notify('Missing fonts on ' + node.name + '. Not updating this node.');
}

async function replaceTheText (node: TextNode, airtableData: object) {
  // Figma requires this bit when replacing text
  await figma.loadFontAsync(node.fontName as FontName);

  // Replace the text in the node
  var str = airtableData[getVarName(node.name)]
  node.characters = str || '!! This string isn\'t in Airtable';
  if (!str) figma.notify(node.name + ' isn\'t in Airtable.');
  // console.log(airtableData[getVarName(node.name)]); // debug
  // console.log(node.name, 'variable name: ', getVarName(node.name)); // debug
}

/**
 * THE REPORT NODE
 */

const reportNodeName = 'copyThat.airtable.sync.report'

export const createReportNode = async () => {
  // Create the node
  figma.createText().name = reportNodeName;

  // Load the font
  const node = figma.currentPage.findOne(node => node.type === "TEXT" && node.name === reportNodeName) as TextNode;
  await figma.loadFontAsync(node.fontName as FontName);

  const dateTime = stringifyDatetime();

  // Populate first text
  node.characters = '{{copyThat.airtable}} report — '
    + dateTime.date
    + ', '
    + dateTime.time
    + '\n===================================\n'
    ;

}

const appendReportNode = (str: string) => {
  const node = figma.currentPage.findOne(node => node.type === "TEXT" && node.name === reportNodeName) as TextNode;
  node.characters += '\n' + str;
}