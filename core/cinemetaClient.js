// core/cinemetaClient.js

const axios = require("axios");

// Base Cinemeta endpoint
const BASE_URL = "https://v3-cinemeta.strem.io/meta/series";

// In-memory cache (simple key-value store)
const cache = new Map();

// Cache TTL (10 minutes)
const TTL = 1000 * 60 * 10;

/**
 * Fetch series metadata from Cinemeta with caching
 *
 * @param {string} imdbId
 * @returns {Object} meta
 */
async function getSeriesMeta(imdbId) {
  const now = Date.now();

  // Check cache first
  if (cache.has(imdbId)) {
    const { data, expiry } = cache.get(imdbId);

    // Return cached data if still valid
    if (now < expiry) {
      return data;
    }

    // Otherwise delete expired entry
    cache.delete(imdbId);
  }

  // Fetch fresh data from Cinemeta
  const res = await axios.get(`${BASE_URL}/${imdbId}.json`);
  const meta = res.data.meta;

  // Store in cache
  cache.set(imdbId, {
    data: meta,
    expiry: now + TTL,
  });

  return meta;
}

module.exports = {
  getSeriesMeta,
};
