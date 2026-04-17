// handlers/catalogHandler.js

const axios = require("axios");
const { getPosterFromIMDb } = require("../core/tmdbClient");

/**
 * Generate random ID suffix
 */
function generateNonce() {
  return Math.random().toString(36).substring(2, 8);
}

/**
 * Fetch series
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

    if (!searchQuery) return { metas: [] };

    try {
      const results = await searchSeries(searchQuery);

      const metas = await Promise.all(
        results.map(async (series) => {
          const poster = (await getPosterFromIMDb(series.id)) || series.poster;

          return {
            // 🔥 UNIQUE ID EACH TIME
            id: `${series.id}:shuffle:${generateNonce()}`,

            type: "series",
            name: `${series.name} — 🎲 Smart Shuffle`,
            poster,
          };
        }),
      );

      return { metas };
    } catch (e) {
      console.error("Catalog error:", e.message);
      return { metas: [] };
    }
  }

  return { metas: [] };
}

module.exports = catalogHandler;
