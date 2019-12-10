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
  amendReportNode(node, 'MISSING_FONT');
}

async function replaceTheText (node: TextNode, airtableData: object) {
  // Figma requires this bit when replacing text
  await figma.loadFontAsync(node.fontName as FontName);

  // Replace the text in the node
  var str = airtableData[getVarName(node.name)]
  node.characters = str || '!! This string isn\'t in Airtable';
  if (!str) amendReportNode(node, 'NOT_IN_AIRTABLE');
  // console.log(airtableData[getVarName(node.name)]); // debug
  // console.log(node.name, 'variable name: ', getVarName(node.name)); // debug
}

/**
 * THE REPORT NODE
 */

const reportNodeName = 'copyThat.airtable.sync.report'

export const createReportNode = async () => {
  const existingNodes = figma.root.findAll(node => node.type === "TEXT" && node.name === reportNodeName) as TextNode[];
  existingNodes.forEach(node => {
    node.remove();
  })

  // Create the node
  figma.createText().name = reportNodeName;

  // Load the font
  const node = figma.currentPage.findOne(node => node.type === "TEXT" && node.name === reportNodeName) as TextNode;
  await figma.loadFontAsync(node.fontName as FontName);

  const dateTime = stringifyDatetime();

  // Populate first text
  node.characters = '{{copyThat.airtable}} report — synced '
    + dateTime.date
    + ', '
    + dateTime.time
    + '\n===================================\n'
    ;

}

const amendReportNode = (problematicNode, type: 'MISSING_FONT' | 'NOT_IN_AIRTABLE') => {
  const msgMap = {
      MISSING_FONT: 'Missing font. Node not updated.'
    , NOT_IN_AIRTABLE: 'String wasn\'t found in Airtable.'
  }

  let pageName = getPage(problematicNode).name;
  let nodeName = problematicNode.name;
  let msg = msgMap[type];

  const reportNode = figma.currentPage.findOne(node => node.type === "TEXT" && node.name === reportNodeName) as TextNode;
  reportNode.characters += '\n' + pageName + ' > ' + nodeName + ' — ' + msg;
}

const getPage = (node) => {
  // Returns the name of the page where the node is
  while (node && node.type !== 'PAGE') { node = node.parent; }
  return node;
}