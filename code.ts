// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

const variablePattern = /^\{{2}.+\}{2}$/m;

function isVariable(string) {
  // Test if input string is a variable
  return variablePattern.test(string);
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
/* figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'create-rectangles') {
    const nodes: SceneNode[] = [];
    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};
*/

for (const node of figma.currentPage.selection) {

  // If it's not a variable or a text, move along.
  if (node.type !== 'TEXT') { break; }
  if (!isVariable(node.characters) && !isVariable(node.name)) {
    console.log(node.name + ' not a variable. Moving along.');
    break;
   }

  airtableTest();

  node.autoRename = false;

  //  TODO confirmation dialog

  if (isVariable(node.name) === true && node.name !== node.characters)
    updateText(node, node.name);

};
figma.closePlugin();

async function updateText(node, text) {
  if (node.hasMissingFont) {

    // TODO handle missing fonts
    console.log('There are missing fonts. Not updating ' + node.name + '.')

  } else {

    // Figma requires this bit when replacing text
    await figma.loadFontAsync(node.fontName);

    // Replace the text in the node
    node.characters = text;

  }
}

async function airtableTest() {
  console.log('Starting airtableTest function')

  // var request = new XMLHttpRequest();
  // request.withCredentials = true;

  // request.open("GET", "https://api.airtable.com/v0/appob2x3Fc4an3Uoq/logzio-ui?maxRecords=1&fields=key,theCopy&filterByFormula=AND%28key=%27alerts.triggerIfStep.stepTitle.text%27%29");
  // request.setRequestHeader("Authorization", "Bearer keyqUqOMoRi6L9ctP");
  // request.responseType = 'text'

  // request.onload = () => {
  //   // window.parent.postMessage({pluginMessage: request.response}, '*')
  //   console.log('onload hit');
  // };

  // request.send();

  // console.log(request.response);
  console.log('airtableTest function done')
}