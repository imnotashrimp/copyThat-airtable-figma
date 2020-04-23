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

import { stringifyDatetime } from "../src/date-time";
// Returns object formatted as `{date: "18 Apr 2020", time: "23:24"}`

const expectedFormat = {
  date: expect.stringMatching(/^\d{1,2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}$/),
  time: expect.stringMatching(/^\d{2}:\d{2}$/)
}

const timeWithSingleDigit = Date.UTC(2019, 0, 1, 1, 5);
// 2019-Jan-01, 01:05:00.000, UTC

const timeWithDoubleDigits = Date.UTC(2020, 8, 15, 14, 30);
// 2020-Aug-15, 14:30:00.000, UTC

describe("What's the stringified date", () => {
  test('always returns two-digit times', () => {
    expect(stringifyDatetime(timeWithSingleDigit)).toMatchObject(expectedFormat)
    expect(stringifyDatetime(timeWithDoubleDigits)).toMatchObject(expectedFormat)
  });

  test('given no parameters, returns current time', () => {
    expect(stringifyDatetime()).toMatchObject(expectedFormat)
  });
});
