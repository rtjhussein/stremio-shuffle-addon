// handlers/metaHandler.js

const { pickRandomEpisodes } = require("../core/shuffleEngine");
const { getSeriesMeta } = require("../core/cinemetaClient");

async function metaHandler({ id }) {
  if (id.includes(":shuffle")) {
    // Extract imdbId only
    const imdbId = id.split(":")[0];

    try {
      const meta = await getSeriesMeta(imdbId);
      const videos = meta.videos;

      const randomEpisodes = pickRandomEpisodes(videos, {
        mode: "all",
        count: 3,
      });

      return {
        meta: {
          id,
          type: "series",
          name: `🎲 Smart Shuffle`,

          videos: randomEpisodes.map((ep) => ({
            id: `${imdbId}:${ep.season}:${ep.number}`,
            title: `S${ep.season}E${ep.number} — ${ep.name || "Episode"}`,
            season: ep.season,
            number: ep.number,
          })),
        },
      };
    } catch (e) {
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
