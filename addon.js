// addon.js

const { addonBuilder } = require("stremio-addon-sdk");
const manifest = require("./manifest");

const { pickRandomEpisodes } = require("./core/shuffleEngine");
const { getSeriesMeta } = require("./core/cinemetaClient");

const builder = new addonBuilder(manifest);

/**
 * Catalog Handler
 */
builder.defineCatalogHandler(({ type, id }) => {
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

  return Promise.resolve({ metas: [] });
});

/**
 * Meta Handler
 */
builder.defineMetaHandler(async ({ type, id }) => {
  if (id.includes(":shuffle")) {
    const [imdbId, , mode = "all"] = id.split(":");

    try {
      const meta = await getSeriesMeta(imdbId);
      const videos = meta.videos;

      // Get 3 random episodes
      const randomEpisodes = pickRandomEpisodes(videos, {
        mode,
        count: 3,
      });

      console.log(
        `Shuffle (${mode}):`,
        randomEpisodes.map((v) => `S${v.season}E${v.number}`),
      );

      return {
        meta: {
          id,
          type: "series",
          name: `🎲 Random Episodes (${mode})`,

          // 🔥 MULTIPLE OPTIONS
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
});

/**
 * Stream Handler (unchanged)
 */
builder.defineStreamHandler(() => {
  return Promise.resolve({ streams: [] });
});

module.exports = builder.getInterface();
