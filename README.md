# Airtable CMS for Figma

## Installation

<!-- TODO installation -->

## Using the plugin

<!-- TODO usage  -->

## Contributions

<!-- TODO - license & contributions -->

### Running locally

Figma recommends writing plugins in TypeScript.
I found it easy enough to learn.

If you're not familiar with TypeScript,
you can learn about it at https://www.typescriptlang.org/.

#### To develop & run the plugin

I'm on macOS.
These instructions should also work for Linux
(but I haven't tested yet).
If you're on Windows, please feel free to add separate instructions.

**Before you begin, you'll need**:
[Visual Studio Code](https://code.visualstudio.com/download),
[npm](https://www.npmjs.com/get-npm),
Figma Desktop (this won't work in your browser)

##### 1. Open this repo in Visual Studio Code

```shell
git clone https://github.com/imnotashrimp/figma-plugin-airtable-cms.git
code figma-plugin-airtable-cms
```

##### 2. Install TypeScript & other dependencies

In Visual Studio Code, open the terminal
(in the menu, **Terminal > New Terminal**).

Run these commands:

```shell
sudo npm install -g TypeScript
npm install
```

##### 3. Run the plugin

In the menu, run **Terminal > Run Task...**,
then select **webpack: run locally**.

Keep the plugin running in the background
so you can develop & test in Figma.

##### 4. Load the plugin in Figma

Open Figma Desktop.
In the menu, select **Plugins > Development > New Plugin...**.
Click the button under **Link existing plugin**, and select `manifest.json` from this project.

After that, you can use the plugin under the **Plugins > Development** menu.

## Roadmap

In no particular order, here's what I'm thinking for future development:

1. Strip spaces from beginning and end of all strings.
1. Filter Airtable requests to only strings in this design
  (Currently: Plugin requests all strings.
  It's fine for the 135 I have, but probably an issue when you get to the thousands.)
1. Replace only the strings on _this_ page, the strings contained in _this_ node
  (Currently: Replace all strings in the design)
1. Show/hide status indicators over affected text boxes.
  For example, a green dot = text was synced, red = failed sync.
1. A "last sync" text box above each page