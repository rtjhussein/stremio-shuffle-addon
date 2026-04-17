// core/cinemetaClient.js

const axios = require("axios");

const BASE_URL = "https://v3-cinemeta.strem.io/meta/series";

// Simple in-memory cache
const cache = new Map();

// Cache TTL (ms) — adjust later
const TTL = 1000 * 60 * 10; // 10 minutes

async function getSeriesMeta(imdbId) {
  const now = Date.now();

  // Cache hit
  if (cache.has(imdbId)) {
    const { data, expiry } = cache.get(imdbId);

    if (now < expiry) {
      return data;
    } else {
      cache.delete(imdbId);
    }
  }

  // Fetch fresh
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
