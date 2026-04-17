// handlers/streamHandler.js

/**
 * Stream Handler
 * Required by Stremio SDK
 *
 * We intentionally return empty streams so that
 * external providers (Torrentio, etc.) handle playback.
 */
function streamHandler() {
  return Promise.resolve({ streams: [] });
}

module.exports = streamHandler;
