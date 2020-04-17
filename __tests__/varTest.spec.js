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

import { isVar, getVarName } from "../src/var-test";

// Variables
const variableOnly = '{{var.name}}';
const stringBeforeVariable = 'string {{var.name}}';
const stringAfterVariable = '{{var.name}} string';
const stringsBeforeAndAfterVariable = 'string1 {{var.name}} string2';

// Not variables
const stringOnly = 'string only';
const openingBracketsOnly = '{{var.name';
const closingBracketsOnly = 'var.name}}';

describe('Is this string a variable', () => {
  test('given a variable only, returns true', () => {
    expect(isVar(variableOnly)).toBe(true);
  });

  test('given a string before variable, returns true', () => {
    expect(isVar(stringBeforeVariable)).toBe(true);
  });

  test('given a string after variable, returns true', () => {
    expect(isVar(stringAfterVariable)).toBe(true);
  });

  test('given strings before and after variable, returns true', () => {
    expect(isVar(stringsBeforeAndAfterVariable)).toBe(true);
  });

  test('given no variable, returns false', () => {
    expect(isVar(stringOnly)).toBe(false);
  });

  test('given opening brackets only, returns false', () => {
    expect(isVar(openingBracketsOnly)).toBe(false);
  });

  test('given closing brackets only, returns false', () => {
    expect(isVar(closingBracketsOnly)).toBe(false);
  });
});


describe('Do I get the right variable name', () => {
  const output = 'var.name'

  test('given a variable, returns variable name', () => {
    expect(getVarName(variableOnly)).toBe(output);
  });

  test('given a string before the variable, return variable name', () => {
    expect(getVarName(stringBeforeVariable)).toBe(output)
  });

  test('given a string after the variable, return variable name', () => {
    expect(getVarName(stringAfterVariable)).toBe(output)
  });

  test('given strings before and after the variable, return variable name', () => {
    expect(getVarName(stringsBeforeAndAfterVariable)).toBe(output)
  });

});
