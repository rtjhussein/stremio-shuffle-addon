// core/shuffleEngine.js

/**
 * Returns multiple random episodes (no duplicates)
 *
 * @param {Array} videos
 * @param {Object} options
 * @param {string} options.mode
 * @param {number} options.count - number of results
 */
function pickRandomEpisodes(videos, options = {}) {
  if (!Array.isArray(videos)) {
    throw new Error("Invalid videos input");
  }

  const mode = options.mode || "all";
  const count = options.count || 1;

  let eligible = videos.filter((v) => v.season > 0);

  // Mode filtering
  switch (mode) {
    case "recent":
      const maxSeason = Math.max(...eligible.map((v) => v.season));
      eligible = eligible.filter((v) => v.season >= maxSeason - 2);
      break;

    case "pilot":
      eligible = eligible.filter((v) => v.number === 1);
      break;

    case "all":
    default:
      break;
  }

  if (eligible.length === 0) {
    throw new Error("No eligible episodes found");
  }

  // Shuffle array (Fisher-Yates)
  for (let i = eligible.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
  }

  // Return top N
  return eligible.slice(0, count);
}

module.exports = {
  pickRandomEpisodes,
};
