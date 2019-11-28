import { getVarName, isVar } from './var-test'

export const replaceText = (airtableData: object) => {
  // console.log(airtableData); // debug
  const nodes = figma.root.findAll(node => node.type === "TEXT");

  nodes.forEach(async (node: TextNode) => {
    if (!isVar(node.name)) return;

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
      var str = airtableData[getVarName(node.name)]
      node.characters = str || '!! This string isn\'t in Airtable';
      // console.log(airtableData[getVarName(node.name)]); // debug
      // console.log(node.name, 'variable name: ', getVarName(node.name)); // debug

    }

  });
}
