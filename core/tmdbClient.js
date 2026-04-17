// core/tmdbClient.js

const axios = require("axios");

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

/**
 * Get TMDB poster using IMDb ID
 */
async function getPosterFromIMDb(imdbId) {
  try {
    // Convert IMDb → TMDB ID
    const findRes = await axios.get(`${BASE_URL}/find/${imdbId}`, {
      params: {
        api_key: API_KEY,
        external_source: "imdb_id",
      },
    });

    const tv = findRes.data.tv_results?.[0];

    if (!tv || !tv.poster_path) return null;

    // High quality poster (w500 or original)
    return `https://image.tmdb.org/t/p/w500${tv.poster_path}`;
  } catch (e) {
    console.error("TMDB error:", e.message);
    return null;
  }
}

module.exports = {
  getPosterFromIMDb,
};
