// core/shuffleEngine.js

const { isRecentlyUsed, addToHistory } = require("./sessionMemory");

/**
 * Compute weight
 */
function computeWeight(ep, context) {
  let weight = 1;

  if (context.maxSeason) {
    weight += (ep.season / context.maxSeason) * 2;
  }

  if (ep.number === 1) weight *= 0.7;
  if (ep.number > 3 && ep.number < 15) weight *= 1.2;

  return weight;
}

/**
 * Weighted pick
 */
function weightedPick(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;

  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }

  return items[items.length - 1];
}

/**
 * Main function with memory awareness
 */
function pickRandomEpisodes(videos, options = {}) {
  const mode = options.mode || "all";
  const count = options.count || 1;
  const imdbId = options.imdbId;

  let eligible = videos.filter((v) => v.season > 0);

  // Mode filtering
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

  const maxSeason = Math.max(...eligible.map((v) => v.season));

  // 🔥 FILTER OUT RECENTLY USED
  let pool = eligible.filter(
    (ep) => !isRecentlyUsed(imdbId, `${ep.season}:${ep.number}`),
  );

  // Fallback if everything filtered out
  if (pool.length < count) {
    pool = [...eligible];
  }

  const results = [];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const weights = pool.map((ep) => computeWeight(ep, { maxSeason }));

    const selected = weightedPick(pool, weights);

    results.push(selected);

    // Save to memory
    addToHistory(imdbId, `${selected.season}:${selected.number}`);

    // Remove from pool
    pool = pool.filter((ep) => ep !== selected);
  }

  return results;
}

module.exports = {
  pickRandomEpisodes,
};
