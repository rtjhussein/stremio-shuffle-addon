// core/shuffleEngine.js

/**
 * Compute a weight score for an episode
 * Higher weight = higher chance of being selected
 */
function computeWeight(ep, context) {
  let weight = 1;

  // Bias toward newer seasons
  if (context.maxSeason) {
    const seasonScore = ep.season / context.maxSeason;
    weight += seasonScore * 2; // strong influence
  }

  // Slight penalty for pilots (often weaker or overplayed)
  if (ep.number === 1) {
    weight *= 0.7;
  }

  // Slight boost for mid-season episodes
  if (ep.number > 3 && ep.number < 15) {
    weight *= 1.2;
  }

  return weight;
}

/**
 * Select one item using weighted randomness
 */
function weightedPick(items, weights) {
  const total = weights.reduce((sum, w) => sum + w, 0);
  let threshold = Math.random() * total;

  for (let i = 0; i < items.length; i++) {
    threshold -= weights[i];
    if (threshold <= 0) {
      return items[i];
    }
  }

  return items[items.length - 1];
}

/**
 * Returns multiple weighted-random episodes (no duplicates)
 */
function pickRandomEpisodes(videos, options = {}) {
  if (!Array.isArray(videos)) {
    throw new Error("Invalid videos input");
  }

  const mode = options.mode || "all";
  const count = options.count || 1;

  // Remove specials
  let eligible = videos.filter((v) => v.season > 0);

  // Apply mode filtering
  switch (mode) {
    case "recent":
      const maxSeasonRecent = Math.max(...eligible.map((v) => v.season));
      eligible = eligible.filter((v) => v.season >= maxSeasonRecent - 2);
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

  const maxSeason = Math.max(...eligible.map((v) => v.season));

  const results = [];
  const pool = [...eligible];

  // Pick multiple WITHOUT duplicates
  for (let i = 0; i < count && pool.length > 0; i++) {
    // Compute weights dynamically
    const weights = pool.map((ep) => computeWeight(ep, { maxSeason }));

    const selected = weightedPick(pool, weights);

    results.push(selected);

    // Remove selected episode from pool
    const index = pool.indexOf(selected);
    pool.splice(index, 1);
  }

  return results;
}

module.exports = {
  pickRandomEpisodes,
};
