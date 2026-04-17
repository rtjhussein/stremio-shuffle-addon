// handlers/catalogHandler.js

/**
 * Catalog Handler
 * Defines what appears in Stremio UI
 */
function catalogHandler({ type, id }) {
  // Only respond to our custom catalog
  if (type === "series" && id === "shuffle_catalog") {
    return Promise.resolve({
      metas: [
        {
          id: "tt0182576:shuffle:all",
          type: "series",
          name: "🎲 Shuffle (All Episodes)",
          poster: "https://images.metahub.space/poster/medium/tt0182576/img",
        },
        {
          id: "tt0182576:shuffle:recent",
          type: "series",
          name: "🔥 Shuffle (Recent Seasons)",
          poster: "https://images.metahub.space/poster/medium/tt0182576/img",
        },
        {
          id: "tt0182576:shuffle:pilot",
          type: "series",
          name: "🎬 Shuffle (Season Premieres)",
          poster: "https://images.metahub.space/poster/medium/tt0182576/img",
        },
      ],
    });
  }

  // Return empty if not matched
  return Promise.resolve({ metas: [] });
}

module.exports = catalogHandler;
