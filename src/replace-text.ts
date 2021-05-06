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
import { formatNode } from './format-text'

// Given a target node, returns a string of nodes leading to the target node
const getNodeHierarchy = (node) => {
  let hierarchy: string[] = [node.name]
  while (node && node.type !== 'PAGE') {
     node = node.parent // Move up 1 level
     hierarchy.unshift(node.name) // Add node name to beginning of array
  }

  return `"${hierarchy.join(' ▸ ')}"`
}

/**
 * EVERYTHING TO DO WITH REPLACING CONTENT
 */

export const syncStrings = (airtableData: object) => {
  const nodes = figma.root.findAll(node => node.type === "TEXT")

  nodes.forEach(async (node: TextNode) => {
    if (!isVar(node.name)) return

    let nodeHierarchy = getNodeHierarchy(node)

    // If there are missing fonts, fail gracefully and move on.
    if (handleMissingFont(node, nodeHierarchy) === true) return

    node.autoRename = false // Don't auto-rename node on text change

    replaceTheText(node, nodeHierarchy, airtableData)
  })
}

export const syncStringsSelected = (airtableData: object) => {
  if (figma.currentPage.selection.length < 1) {
    figma.notify('Nothing is selected!', { timeout: 10000 })
    figma.closePlugin();
  }
  else {
    const nodes = (figma.currentPage.selection[0] as ChildrenMixin).findAll(node => node.type === "TEXT");

    nodes.forEach(async (node: TextNode) => {
      if (!isVar(node.name)) return
  
      let nodeHierarchy = getNodeHierarchy(node)
  
      // If there are missing fonts, fail gracefully and move on.
      if (handleMissingFont(node, nodeHierarchy) === true) return
  
      node.autoRename = false // Don't auto-rename node on text change
  
      replaceTheText(node, nodeHierarchy, airtableData)
    })
  }
}

const handleMissingFont = (node: TextNode, nodeHierarchy: string) => {
  if (node.hasMissingFont === true) {
    console.log(`  Node has missing fonts. Not updating.`)
    amendReportNode(node, nodeHierarchy, 'MISSING_FONT')
    return true
  }

  return false
}

const replaceTheText = (
  node: TextNode,
  nodeHierarchy: string,
  airtableData: object
) => {
  console.info(`  Replacing copy...`)
  let str = airtableData[getVarName(node.name)]

  // Handle a string that wasn't found in Airtable
  if (!str) {
    console.warn(getVarName(node.name), 'not in airtable')
    amendReportNode(node, nodeHierarchy, 'NOT_IN_AIRTABLE')
    node.characters = `!! This string isn't in Airtable`
    return
  }

  // Get fontName of first character & apply to the entire node
  if (node.fontName === figma.mixed)
    node.fontName = node.getRangeFontName(0,1) as FontName

  // Replace the node and apply formatting
  // formatNode(node, str, fontFamily) // TODO debug this

  console.info(`  Original: '${node.characters}' , New: '${str}'`)
  // Replace the node
  node.characters = str
  // Confirm replacement
  console.info(`  Content replaced. In the node now: '${node.characters}'`)
  return
}

/**
 * THE REPORT NODE
 */

const reportNodeName = 'copyThat.airtable.sync.report'

export const createReportNode = async () => {
  const existingNodes = figma.root.findAll(
    node => node.type === "TEXT" && node.name === reportNodeName
  ) as TextNode[]
  existingNodes.forEach(node => node.remove())

  // Create the node
  figma.createText().name = reportNodeName

  // Load the font
  const node = figma.currentPage.findOne(
    node => node.type === "TEXT" && node.name === reportNodeName
  ) as TextNode
  await figma.loadFontAsync(node.fontName as FontName)

  const dateTime = stringifyDatetime()

  // Populate first text
  node.characters = '{{copyThat.airtable}} report — synced '
    + dateTime.date
    + ', '
    + dateTime.time
    + '\n===================================\n'

}

const amendReportNode = (problematicNode: TextNode, nodeHierarchy: string, type: 'MISSING_FONT' | 'NOT_IN_AIRTABLE' | 'JUST_TESTING') => {
  const msgMap = {
      JUST_TESTING: 'Just testing to see if this works. Nothing to see here.',
      MISSING_FONT: 'Missing font. Node not updated.'
    , NOT_IN_AIRTABLE: 'String wasn\'t found in Airtable.'
  }

  let msg = msgMap[type]

  const reportNode = figma.currentPage.findOne(
    node => node.type === "TEXT" && node.name === reportNodeName
  ) as TextNode
  reportNode.characters += `\n ${nodeHierarchy}\n     ${msg}`
}
