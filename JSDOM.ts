import { JSDOM } from 'jsdom';
import "./ReactKiller";
const dom = new JSDOM(`
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vite + TS</title>

  <style>
    .app-root {
      width: 100px;
      height: 100px;
      background-color: #000;
    }
  </style>

</head>

<body class="p-10">

  <div class="flex gap-4 justify-center">
    <button id="init-root" class="p-2 bg-blue-500 rounded-md border-blue-500 text-white">Init Root</button>
    <button id="destroy-root" class="p-2 bg-red-500 rounded-md border-red-500 text-white">Destroy Root</button>
  </div>


  <div id="root" widget="widgets/app">
  </div>


</body>

</html>
`, { runScripts: "dangerously", resources: "usable" });

// @ts-ignore
global.window = { ...dom.window, ...global };

// @ts-ignore
global.document = dom.window.document;


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const widgetsResolver = {
    import: async (widgetName) => {
        return import(`./${widgetName}.ts`)
    }
}

const reactKiller = window.ReactKiller.getInstance({
    widgetsResolver
});

const appRoot = global.document.getElementById("root");

if (!appRoot) throw new Error("Root element not found");

reactKiller.init(appRoot, ({ errors }) => {
    console.log(global.document?.body?.innerHTML);

    console.log("ReactKiller.init callback root", errors);
});

setTimeout(() => {
    reactKiller.destroy(appRoot);
}, 200);






