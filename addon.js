const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");
const manifest = require("./manifest");

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
      // Fetch episodes from Cinemeta
      const metaRes = await axios.get(
        `https://v3-cinemeta.strem.io/meta/series/${imdbId}.json`,
      );
      const videos = metaRes.data.meta.videos.filter((v) => v.season > 0);

      // Random Decision
      const randomVid = videos[Math.floor(Math.random() * videos.length)];

      console.log(
        `[Shuffle] Selected: S${randomVid.season} E${randomVid.number}`,
      );

      return {
        meta: {
          id: id,
          type: "series",
          name: `🎲 Playing: S${randomVid.season} E${randomVid.number}`,
          videos: [
            {
              id: `${imdbId}:${randomVid.season}:${randomVid.number}`, // Real ID for scrapers
              title: `Shuffle Result: ${randomVid.name || "Episode " + randomVid.number}`,
              season: randomVid.season,
              number: randomVid.number,
              released: randomVid.released,
              overview:
                "Your scrapers are now finding the best links for this random episode...",
            },
          ],
        },
      };
    } catch (e) {
      console.error("Meta Error:", e.message);
    }
  }
  return Promise.resolve({ meta: null });
});

// Dummy Stream Handler: Satisfies the SDK requirements
builder.defineStreamHandler(() => {
  return Promise.resolve({ streams: [] });
});

module.exports = builder.getInterface();
