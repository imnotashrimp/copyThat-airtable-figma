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

import { getAirtableConfig, setAirtableConfig } from './airtable'
import { isVar, getVarName } from './var-test'
import { replaceText, createReportNode } from './replace-text'
import { getNodeFonts, loadFontList } from './fonts'

const airtableConfig = getAirtableConfig();

if (figma.command === 'config') {
  figma.showUI(__html__, { width: 500, height: 500 });
  figma.ui.postMessage( { type: 'config', airtableConfig } );
}

if (figma.command === 'sync' ) {
  // Initialize empty array for Airtable filter
  let varNames = [];
  let fontsToLoad: FontName[] = [];

  const nodes = figma.root.findAll(node => node.type === "TEXT");
  createReportNode();

  // Add variable name to varNames array
  nodes.forEach(async (node: TextNode) => {
    if (!isVar(node.name)) return;

    getNodeFonts(node).forEach((font) => fontsToLoad.push(font))
    varNames.push(getVarName(node.name));
  });

  Promise.all([loadFontList(fontsToLoad)]).then(() => {
    figma.showUI(__html__, { visible: false });
    figma.ui.postMessage({ type: 'sync', airtableConfig, varNames });
  })
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
