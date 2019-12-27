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

export const getNodeFonts = (node: TextNode) => {
  let fontName = node.fontName
  return fontName === figma.mixed ? getMixedNodeFonts(node) : [fontName]
}

const getMixedNodeFonts = (node: TextNode) => {
  let len = node.characters.length
  let fonts = []
  for (let i = 0; i < len; i++) {
    fonts.push(node.getRangeFontName(i, i+1))
  }
  return fonts
}

// Dedupe the fonts
export const loadFontList = async(fontList: FontName[]) => {
  console.info('Raw font list, before deduping:', fontList)
  let uniqueFontsToLoad: FontName[] = []

  // FUTURE WORK: When supporting HTML and markdown styling, add bold, italic,
  // & bold italic to the list

  // Dedupe the font list so load times are quicker
  fontList.forEach(font => {
    if (isFontDupe(font, uniqueFontsToLoad) === false)
      uniqueFontsToLoad.push(font) // If it's unique, add to uniqueFontsToLoad
  })


  // Load the fonts
  console.log('Deduped font list:', uniqueFontsToLoad)
  return fontList.forEach(async (font) => await figma.loadFontAsync(font))
}

const isFontDupe = (thisFont: FontName, comparisonFontList: FontName[]) => {
  let isDupe = false // Assume font is NOT a dupe
  let fontAFamily = thisFont.family
  let fontAStyle = thisFont.style

  // Compare this font against the list
  comparisonFontList.forEach(comparisonFont => {
    let fontBFamily = comparisonFont.family
    let fontBStyle = comparisonFont.style

    // If font family & style match, this is a dupe
    if (fontAFamily === fontBFamily && fontAStyle === fontBStyle)
      isDupe = true
  })

  return isDupe
}
