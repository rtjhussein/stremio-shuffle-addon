// core/sessionMemory.js

/**
 * In-memory session store
 *
 * Structure:
 * {
 *   imdbId: Set of episodeIds
 * }
 */
const memory = new Map();

// Max history per series
const MAX_HISTORY = 20;

/**
 * Get history for a series
 */
function getHistory(imdbId) {
  if (!memory.has(imdbId)) {
    memory.set(imdbId, []);
  }
  return memory.get(imdbId);
}

/**
 * Add episode to history
 */
function addToHistory(imdbId, episodeId) {
  const history = getHistory(imdbId);

  history.push(episodeId);

  // Trim history
  if (history.length > MAX_HISTORY) {
    history.shift();
  }
}

/**
 * Check if episode was recently used
 */
function isRecentlyUsed(imdbId, episodeId) {
  const history = getHistory(imdbId);
  return history.includes(episodeId);
}

module.exports = {
  addToHistory,
  isRecentlyUsed,
};
