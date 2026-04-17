// addon.js

const { addonBuilder } = require("stremio-addon-sdk");
const manifest = require("./manifest");

// Import handlers (clean separation)
const catalogHandler = require("./handlers/catalogHandler");
const metaHandler = require("./handlers/metaHandler");
const streamHandler = require("./handlers/streamHandler");

// Initialize builder
const builder = new addonBuilder(manifest);

/**
 * Register handlers
 * This file now ONLY wires components together
 */
builder.defineCatalogHandler(catalogHandler);
builder.defineMetaHandler(metaHandler);
builder.defineStreamHandler(streamHandler);

// Export final addon interface
module.exports = builder.getInterface();
