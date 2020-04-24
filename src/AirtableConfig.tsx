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
import { AirtableInput } from './components/AirtableInput'

export function AirtableConfig(props) {
  

  return <>
    <div className="formGroup noBorder">
      <h1>Airtable credentials</h1>

      <AirtableInput
        label='Airtable API key'
        id='api-key'
        placeholder='keyhxUJ1JCprehxk2'
        caption={<>
          From your Airtable&nsbp;
          <a href="https://airtable.com/account" target="_blank">account overview</a>.
        </>}
      />

      <AirtableInput
        label='Base ID'
        id='base-id'
        placeholder='appQy9RSBxIY61OxM'
        caption={<>
          In the&nbsp;
          <a href="https://airtable.com/api" target="_blank">Airtable API menu</a>,
          click the base you want to sync.
          It's in the URL as <code>https://airtable.com/<b><i>BASE_ID</i></b>/...</code>
        </>}
      />

      <AirtableInput
        label='Table'
        id='table-name'
        caption={<>
          You assign this name in the base.
          To find it, go to your base, and copy the tab name.
        </>}
      />
    </div>

    <div className="formGroup">
      <h1>The fields</h1>

      <AirtableInput
        label='Primary key field'
        id='primary-key-field'
        caption='You assign this in the base.'
      />

      <AirtableInput
        label='Field with the copy'
        id='the-copy-field'
        caption='You assign this in the base.'
      />
    </div>
  </>
}