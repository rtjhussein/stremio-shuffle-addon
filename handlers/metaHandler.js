// handlers/metaHandler.js

const { pickRandomEpisodes } = require("../core/shuffleEngine");
const { getSeriesMeta } = require("../core/cinemetaClient");

/**
 * Meta Handler
 */
async function metaHandler({ type, id }) {
  if (id.includes(":shuffle")) {
    const [imdbId] = id.split(":");

    try {
      const meta = await getSeriesMeta(imdbId);
      const videos = meta.videos;

      // Default mode = "all"
      const randomEpisodes = pickRandomEpisodes(videos, {
        mode: "all",
        count: 3,
      });

      return {
        meta: {
          id,
          type: "series",

          // Cleaner title
          name: `🎲 Smart Shuffle`,

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

  return { meta: null };
}

module.exports = metaHandler;
