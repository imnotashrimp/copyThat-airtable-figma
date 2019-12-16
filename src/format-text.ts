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
  boldItal: {
    htmlPattern: /(?:<[bi]>){2}(.+?)(?:<\/[bi]>){2}/g,
    code: 'bi'
  },
  bold: {
    htmlPattern: /(?:<b>)(.+?)(?:<\/b>)/g,
    code: 'b',
  },
  ital: {
    htmlPattern: /(?:<i>)(.+?)(?:<\/i>)/g,
    code: 'i'
  }
}

const styleMap = {
  b: 'Bold',
  i: 'Italic',
  bi: 'Bold Italic'
}

export const getFormatting = (str: string) => {
  Object.keys(inlineStyles).forEach((k) => {
    let key = inlineStyles[k]
    str = str.replace(key.htmlPattern, (match, $1) => {
      let innerHtml = $1 as string
      let len = innerHtml.length
      return `{%${key.code},${len}%}${innerHtml}`
    })
  })

  return str
}
