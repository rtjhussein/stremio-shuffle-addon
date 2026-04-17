// index.js

require("dotenv").config(); // 👈 add this

const { serveHTTP } = require("stremio-addon-sdk");
const addonInterface = require("./addon");

serveHTTP(addonInterface, { port: 7000 });

console.log("Addon running at: http://localhost:7000/manifest.json");
