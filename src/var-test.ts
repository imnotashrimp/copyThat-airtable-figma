const variablePattern = /(?:.*\{{2})(.+)(?:\}{2}.*)/;

export const isVar = (testString: string) => {
  // If input string is a variable, return `true`
  return variablePattern.test(testString);
}

export const getVarName = (testString: string) => {
  return testString.replace(variablePattern, '$1');
}
