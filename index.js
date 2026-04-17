const { serveHTTP } = require("stremio-addon-sdk");
const addonInterface = require("./addon");

const port = 7000;
serveHTTP(addonInterface, { port });

console.log(`Addon running at: http://localhost:${port}/manifest.json`);
