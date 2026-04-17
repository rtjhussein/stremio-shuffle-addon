const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");
const manifest = require("./manifest");
const { pickRandomEpisode } = require("./core/shuffleEngine");
const { getSeriesMeta } = require("./core/cinemetaClient");

const builder = new addonBuilder(manifest);

// Catalog: Shows the "Shuffle" row on your home screen
builder.defineCatalogHandler(({ type, id }) => {
  if (type === "series" && id === "shuffle_catalog") {
    return Promise.resolve({
      metas: [
        {
          id: "tt0182576:shuffle", // Family Guy
          type: "series",
          name: "Shuffle: Family Guy",
          poster: "https://images.metahub.space/poster/medium/tt0182576/img",
        },
        {
          id: "tt0397306:shuffle", // American Dad!
          type: "series",
          name: "Shuffle: American Dad!",
          poster: "https://images.metahub.space/poster/medium/tt0397306/img",
        },
      ],
    });
  }
  return Promise.resolve({ metas: [] });
});

// The Brain: Selects the random episode
builder.defineMetaHandler(async ({ type, id }) => {
  if (id.endsWith(":shuffle")) {
    const imdbId = id.split(":")[0];

    try {
      const meta = await getSeriesMeta(imdbId);
      const videos = meta.videos;
      const randomVid = pickRandomEpisode(videos);

      console.log(
        `Decision: Shuffled to S${randomVid.season} E${randomVid.number}`,
      );

      return {
        meta: {
          id: id,
          type: "series",
          name: `🎲 Playing: ${randomVid.name}`,
          videos: [
            {
              id: `${imdbId}:${randomVid.season}:${randomVid.number}`,
              title: `Shuffle Result: ${randomVid.name || "Episode " + randomVid.number}`,
              season: randomVid.season,
              number: randomVid.number,
              overview: "Click to find streams for this random episode",
            },
          ],
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

// Dummy Stream Handler: Satisfies the SDK requirements
builder.defineStreamHandler(() => {
  return Promise.resolve({ streams: [] });
});

module.exports = builder.getInterface();
