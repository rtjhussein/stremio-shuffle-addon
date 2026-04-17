// core/shuffleEngine.js

/**
 * Picks a random episode from a list of videos
 * @param {Array} videos - Cinemeta videos array
 * @param {Object} options - future extension (filters, weights, etc.)
 */
function pickRandomEpisode(videos, options = {}) {
  if (!Array.isArray(videos)) {
    throw new Error("Invalid videos input");
  }

  // Exclude specials (season 0)
  const eligible = videos.filter((v) => v.season > 0);

  if (eligible.length === 0) {
    throw new Error("No eligible episodes found");
  }

  const index = Math.floor(Math.random() * eligible.length);
  return eligible[index];
}

module.exports = {
  pickRandomEpisode,
};
