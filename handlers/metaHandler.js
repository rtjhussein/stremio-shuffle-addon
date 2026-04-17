// handlers/metaHandler.js

const { pickRandomEpisodes } = require("../core/shuffleEngine");
const { getSeriesMeta } = require("../core/cinemetaClient");

/**
 * Meta Handler
 * Decides which episodes to return when user clicks
 */
async function metaHandler({ type, id }) {
  // Only handle shuffle IDs
  if (id.includes(":shuffle")) {
    // Parse: ttXXXX:shuffle:mode
    const [imdbId, , mode = "all"] = id.split(":");

    try {
      // Fetch metadata (cached)
      const meta = await getSeriesMeta(imdbId);

      // Extract episodes
      const videos = meta.videos;

      // Get weighted-random episodes
      const randomEpisodes = pickRandomEpisodes(videos, {
        mode,
        count: 3,
      });

      // Debug logging
      console.log(
        `Weighted Shuffle (${mode}):`,
        randomEpisodes.map((v) => `S${v.season}E${v.number}`),
      );

      return {
        meta: {
          id,
          type: "series",

          // UI label
          name: `🎲 Smart Shuffle (${mode})`,

          // Multiple episode options
          videos: randomEpisodes.map((ep) => ({
            id: `${imdbId}:${ep.season}:${ep.number}`,
            title: `S${ep.season}E${ep.number} — ${ep.name || "Episode"}`,
            season: ep.season,
            number: ep.number,
            overview: "Click to play this episode",
          })),
        },
      };
    } catch (e) {
      console.error("Meta Error:", e.message);

      return {
        meta: {
          id,
          type: "series",
          name: "⚠️ Shuffle failed",
          videos: [],
        },
      };
    }
  }

  return Promise.resolve({ meta: null });
}

module.exports = metaHandler;
