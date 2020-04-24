// {{copyThat.airtable}} - Plugin for using Airtable as a CMS for Figma designs
// Copyright (C) 2020 Stefan (Shalom) Boroda

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

import * as React from 'react'

export function AirtableInput(props) {
  let validationClass = `${props.id}-validation`

  return <div className='configFormField'>
    <label htmlFor={props.id}>{props.label}</label>
    <input id={props.id} placeholder={props.placeholder} />
    <span className='validation' id={validationClass}></span>
    <span className='caption'>{props.caption}</span>
  </div>
}