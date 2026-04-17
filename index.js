// index.js

require("dotenv").config();

const { serveHTTP } = require("stremio-addon-sdk");
const addonInterface = require("./addon");

// 🔥 Use dynamic port (required for deployment)
const PORT = process.env.PORT || 7000;

serveHTTP(addonInterface, { port: PORT });

console.log(`Addon running at: http://localhost:${PORT}/manifest.json`);
