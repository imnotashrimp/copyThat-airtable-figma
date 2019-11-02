// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    if (node.type === 'TEXT' && (isVariable(node.characters) || isVariable(node.name))) {
        autoRenameOff(node);
        //  TODO confirmation dialog
        if (isVariable(node.name) === true && node.name !== node.characters)
            updateText(node, node.name);
    }
}
;
figma.closePlugin();
function autoRenameOff(node) {
    if (node.autoRename === true) {
        console.log('Setting autoRename to false');
        node.autoRename = false;
    }
    else {
        console.log('autoRename is already false');
    }
}
function updateText(node, text) {
    return __awaiter(this, void 0, void 0, function* () {
        if (node.hasMissingFont) {
            // TODO handle missing fonts
            console.log('There are missing fonts. Not updating ' + node.name + '.');
        }
        else {
            // Figma requires this bit when replacing text
            yield figma.loadFontAsync(node.fontName);
            // Replace the text in the node
            node.characters = text;
        }
    });
}
