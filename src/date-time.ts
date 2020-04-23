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

export const stringifyDatetime = (specifiedDateTime?: Date) => {
  let dateTime = specifiedDateTime ? new Date(specifiedDateTime) : new Date();

  return {
    date: dateString(dateTime),
    time: timeString(dateTime)
  };
}

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const addLeadingZero = (num: number) => {
  // Append leading zero to one-digit numbers (e.g., 1 => 01)
  return num <= 9 ? '0' + num : num;
}

const dateString = (dateTime) => {
  return dateTime.getDate()
    + ' ' + (months[dateTime.getMonth()]) // get name of month
    + ' ' + dateTime.getFullYear(); // get four-digit year
}

const timeString = (dateTime) => {
  return addLeadingZero(dateTime.getHours())
    + ':' + addLeadingZero(dateTime.getMinutes());
}
