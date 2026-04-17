// core/shuffleEngine.js

const { isRecentlyUsed, addToHistory } = require("./sessionMemory");

/**
 * Get a random item from array (uniform distribution)
 */
function randomPick(items) {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

/**
 * Pure random episode picker (no weighting)
 *
 * Guarantees:
 * - Equal probability for all episodes
 * - No recent repeats (session memory)
 */
function pickRandomEpisodes(videos, options = {}) {
  const mode = options.mode || "all";
  const count = options.count || 1;
  const imdbId = options.imdbId;

  let eligible = videos.filter((v) => v.season > 0);

  // Mode filtering (optional behavior)
  if (mode === "recent") {
    const max = Math.max(...eligible.map((v) => v.season));
    eligible = eligible.filter((v) => v.season >= max - 2);
  }

  if (mode === "pilot") {
    eligible = eligible.filter((v) => v.number === 1);
  }

  if (eligible.length === 0) {
    throw new Error("No eligible episodes");
  }

  /**
   * Remove recently used episodes
   */
  let pool = eligible.filter(
    (ep) => !isRecentlyUsed(imdbId, `${ep.season}:${ep.number}`),
  );

  // Fallback if everything was filtered out
  if (pool.length < count) {
    pool = [...eligible];
  }

  const results = [];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const selected = randomPick(pool);

    results.push(selected);

    // Store in memory to avoid repeats
    addToHistory(imdbId, `${selected.season}:${selected.number}`);

    // Remove from pool to avoid duplicates in same request
    pool = pool.filter((ep) => ep !== selected);
  }

  return results;
}

module.exports = {
  pickRandomEpisodes,
};
