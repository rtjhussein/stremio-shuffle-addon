// handlers/catalogHandler.js

const axios = require("axios");
const { getPosterFromIMDb } = require("../core/tmdbClient");

/**
 * Fetch series from Cinemeta search
 */
async function searchSeries(query) {
  const url = `https://v3-cinemeta.strem.io/catalog/series/top/search=${encodeURIComponent(
    query,
  )}.json`;

  const res = await axios.get(url);
  return res.data.metas || [];
}

/**
 * Catalog Handler
 */
async function catalogHandler({ type, id, extra }) {
  if (type === "series" && id === "shuffle_catalog") {
    const searchQuery = extra?.search;

    if (!searchQuery) {
      return { metas: [] };
    }

    try {
      const results = await searchSeries(searchQuery);

      // Fetch posters in parallel
      const metas = await Promise.all(
        results.map(async (series) => {
          const tmdbPoster = await getPosterFromIMDb(series.id);

          return {
            id: `${series.id}:shuffle`,
            type: "series",
            name: `${series.name} — 🎲 Smart Shuffle`,

            // Prefer TMDB, fallback to Cinemeta
            poster: tmdbPoster || series.poster,
          };
        }),
      );

      return { metas };
    } catch (e) {
      console.error("Catalog search error:", e.message);
      return { metas: [] };
    }
  }

  return { metas: [] };
}

module.exports = catalogHandler;
