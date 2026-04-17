// handlers/catalogHandler.js

const axios = require("axios");

/**
 * Shuffle modes
 */
const MODES = [
  { key: "all", label: "🎲 Shuffle (All Episodes)" },
  { key: "recent", label: "🔥 Shuffle (Recent Seasons)" },
  { key: "pilot", label: "🎬 Shuffle (Season Premieres)" },
];

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
  // Only respond to our catalog
  if (type === "series" && id === "shuffle_catalog") {
    const searchQuery = extra?.search;

    // If no search → return empty (clean UI)
    if (!searchQuery) {
      return { metas: [] };
    }

    try {
      // Fetch matching series
      const results = await searchSeries(searchQuery);

      const metas = [];

      // For each found series → create shuffle entries
      for (const series of results) {
        for (const mode of MODES) {
          metas.push({
            id: `${series.id}:shuffle:${mode.key}`,
            type: "series",
            name: `${series.name} — ${mode.label}`,
            poster: series.poster,
          });
        }
      }

      return { metas };
    } catch (e) {
      console.error("Catalog search error:", e.message);
      return { metas: [] };
    }
  }

  return { metas: [] };
}

module.exports = catalogHandler;
