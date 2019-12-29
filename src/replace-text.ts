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

export const replaceText = (airtableData: object) => {
  const nodes = figma.root.findAll(node => node.type === "TEXT")
  nodes.forEach(async (node: TextNode) => {
    if (!isVar(node.name)) return

    node.autoRename = false // Don't auto-rename node on text change
    let nodeHierarchy = getNodeHierarchy(node)
    console.log(`Working on ${nodeHierarchy}...`)

    if (node.hasMissingFont) {
      console.log(`Node has missing fonts. Not updating.`)
      amendReportNode(node, nodeHierarchy, 'MISSING_FONT')
      return
    }

    replaceTheText(node, nodeHierarchy, airtableData)

    console.log('-----------------------')
  })
}

function handleMissingFont (node: TextNode, nodeHierarchy: string) {
  console.log(`Missing fonts. Not updating ${nodeHierarchy}.`)
  amendReportNode(node, nodeHierarchy, 'MISSING_FONT')
}

const replaceTheText = async (node: TextNode, nodeHierarchy: string, airtableData: object) => {
  console.info(`  Replacing copy...`)
  let str = airtableData[getVarName(node.name)]

  // Handle a string that wasn't found in Airtable
  if (!str) {
    console.warn(getVarName(node.name), 'not in airtable')
    amendReportNode(node, nodeHierarchy, 'NOT_IN_AIRTABLE')
    node.characters = `!! This string isn't in Airtable`
    return
  }

  // Get fontName of first character
  let firstCharFontName = node.getRangeFontName(0,1) as FontName
  // Get font family for the node
  let fontFamily = firstCharFontName.family

  // Apply font to the entire node
  node.setRangeFontName(0, node.characters.length, firstCharFontName)

  // Replace the node and apply formatting
  // formatNode(node, str, fontFamily) // TODO debug this

  // Replace the node
  console.info(`  Original: '${node.characters}' , New: '${str}'`)
  node.characters = str
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

const getNodeHierarchy = (node) => {
  let hierarchy: string[] = [node.name]
  while (node && node.type !== 'PAGE') {
     node = node.parent // Move up 1 level
     hierarchy.unshift(node.name) // Add node name to beginning of array
  }

  return `"${hierarchy.join(' ▹ ')}"`
}