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

const inlineStyles = {
  boldItalic: {
    htmlPattern: /(?:<[bi]>){2}(.+?)(?:<\/[bi]>){2}/g,
    code: 'bi'
  },
  bold: {
    htmlPattern: /(?:<b>)(.+?)(?:<\/b>)/g,
    code: 'b',
  },
  italic: {
    htmlPattern: /(?:<i>)(.+?)(?:<\/i>)/g,
    code: 'i'
  }
}

const styleMap = {
  b: 'Bold',
  i: 'Italic',
  bi: 'Bold Italic'
}

interface FormatInstruction {
  index: number,
  length: number,
  style: string
}

/**
 * Tag the inline styles
 */

const getFormatting = (str: string) => {
  Object.keys(inlineStyles).forEach((k) => {
    let key = inlineStyles[k]

    str = str.replace(key.htmlPattern, (match, $1) => { // You need `match` here
      let innerHtml = $1 as string

      // Convert to a format that the next function can understand
      return `{%${key.code}||${innerHtml}%}`
    })
  })

  return str
}

/**
 * Apply formatting
 */

export const formatNode = (node: TextNode, str: string, fontFamily: string) => {
  const capturePattern = /{%(\w+)\|{2}(.+?)%}/
  let formatInstructions: FormatInstruction[] = []
  str = getFormatting(str)

  // Read all strings with formatting instructions
  // and store those instructions in the formatInstructions array
  let result
  while (result = capturePattern.exec(str)) {
    let theString = result[2] // The string to be formatted
    // Add to formatInstructions array
    formatInstructions.push({
      index: result.index, // Position of the first character
      length: theString.length, // Length of the string
      style: styleMap[result[1]] // Style to be applied
    })

    // Redefine the string to remove the match we just read.
    // This makes it so we can can grab the next string's index lands from the
    // right place.
    str = str.replace(capturePattern, theString)
  }

  // Replace the text in the node
  node.characters = str

  console.log('Node formatInstructions:', formatInstructions)
  // Now format the node using formatInstructions
  formatInstructions.forEach((item) => {
    node.setRangeFontName(
      item.index, // First character
      item.index + item.length, // Length of the string
      { family: fontFamily, style: item.style } // FontName
    )
  })
}
