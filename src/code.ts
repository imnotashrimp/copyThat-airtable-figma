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

import { getAirtableConfig, setAirtableConfig } from './airtable/get-set-airtable-config'
import { isVar, getVarName } from './var-test'
import { syncStrings, syncStringsSelected, createReportNode } from './replace-text'
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

  // Find all text nodes
  const nodes = figma.root.findAll(node => node.type === "TEXT");

  // Delete the old report node (if it's there), and make a new one
  createReportNode();

  // If variable is found in node name, add to varNames array
  nodes.forEach(async (node: TextNode) => {
    if (!isVar(node.name)) return;

    getNodeFonts(node).forEach((font) => fontsToLoad.push(font))
    varNames.push(getVarName(node.name));
  });

  // Continue only after the fonts load
  Promise.all([loadFontList(fontsToLoad)]).then(() => {
    figma.showUI(__html__, { visible: false });
    figma.ui.postMessage({ type: 'sync', airtableConfig, varNames });
  })
}

if (figma.command === 'sync-selected' ) {
  // Initialize empty array for Airtable filter
  let varNames = [];
  let fontsToLoad: FontName[] = [];

  if (figma.currentPage.selection.length < 1) {
    figma.notify('Nothing is selected!', { timeout: 10000 })
    figma.closePlugin();
  }
  else {
    // Find all text nodes
    const nodes = (figma.currentPage.selection[0] as ChildrenMixin).findAll(node => node.type === "TEXT");

    // Delete the old report node (if it's there), and make a new one
    createReportNode();

    // If variable is found in node name, add to varNames array
    nodes.forEach(async (node: TextNode) => {
      if (!isVar(node.name)) return;

      getNodeFonts(node).forEach((font) => fontsToLoad.push(font))
      varNames.push(getVarName(node.name));
    });

    // Continue only after the fonts load
    Promise.all([loadFontList(fontsToLoad)]).then(() => {
      figma.showUI(__html__, { visible: false });
      figma.ui.postMessage({ type: 'sync-selected', airtableConfig, varNames });
    })
  }
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg) => {

  // Triggers if user clicks 'save' button in the UI
  if (msg.type === 'save-airtable-config') {
    const keys = msg.keys;
    setAirtableConfig(keys.apiKey, keys.baseId, keys.tableName, keys.primaryKeyField, keys.theCopyField)
  }

  if (msg.type === 'sync-airtable-strings') {
    syncStrings(msg.strings);
  }

  if (msg.type === 'sync-airtable-strings-selected') {
    syncStringsSelected(msg.strings);
  }

  if (msg.type === 'error') {
    figma.notify(msg.error.message, { timeout: 10000 })
  }

  figma.closePlugin();
}
