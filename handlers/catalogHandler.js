// handlers/catalogHandler.js

/**
 * List of supported series (expand this over time)
 * Each entry contains:
 * - IMDb ID
 * - Display name
 * - Poster
 */
const SERIES = [
  {
    id: "tt0182576",
    name: "Family Guy",
    poster: "https://images.metahub.space/poster/medium/tt0182576/img",
  },
  {
    id: "tt0096697",
    name: "The Simpsons",
    poster: "https://images.metahub.space/poster/medium/tt0096697/img",
  },
  {
    id: "tt0397306",
    name: "American Dad!",
    poster: "https://images.metahub.space/poster/medium/tt0397306/img",
  },
];

/**
 * Shuffle modes
 */
const MODES = [
  { key: "all", label: "🎲 Shuffle (All Episodes)" },
  { key: "recent", label: "🔥 Shuffle (Recent Seasons)" },
  { key: "pilot", label: "🎬 Shuffle (Season Premieres)" },
];

/**
 * Catalog Handler
 */
function catalogHandler({ type, id }) {
  if (type === "series" && id === "shuffle_catalog") {
    const metas = [];

    // Generate entries for each series + each mode
    for (const series of SERIES) {
      for (const mode of MODES) {
        metas.push({
          id: `${series.id}:shuffle:${mode.key}`,

          type: "series",

          // Combine series + mode in UI
          name: `${series.name} — ${mode.label}`,

          poster: series.poster,
        });
      }
    }

    return Promise.resolve({ metas });
  }

  return Promise.resolve({ metas: [] });
}

module.exports = catalogHandler;
