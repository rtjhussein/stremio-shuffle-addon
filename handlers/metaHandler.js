// handlers/metaHandler.js

// Import shuffle logic (weighted + memory-aware)
const { pickRandomEpisodes } = require("../core/shuffleEngine");

// Import Cinemeta client (gives us full series + episode metadata)
const { getSeriesMeta } = require("../core/cinemetaClient");

/**
 * Meta Handler
 *
 * Responsible for constructing the "virtual series"
 * that Stremio displays when user clicks "Smart Shuffle"
 *
 * This is where we inject:
 * - Random episode selection
 * - Smart-Start metadata (overview, thumbnail, etc.)
 */
async function metaHandler({ id }) {
  // Only handle our shuffle IDs
  if (id.includes(":shuffle")) {
    // Extract IMDb ID from composite ID
    const imdbId = id.split(":")[0];

    try {
      // Fetch full series metadata (includes ALL episodes)
      const meta = await getSeriesMeta(imdbId);

      // All available episodes
      const videos = meta.videos;

      /**
       * Pick random episode(s)
       *
       * NOTE:
       * - count = 1 → feels like a curated recommendation
       * - count > 1 → feels more like "random list"
       */
      const randomEpisodes = pickRandomEpisodes(videos, {
        mode: "all",
        count: 1, // 🔥 Stronger UX: single recommendation
        imdbId, // required for memory system
      });

      /**
       * Construct virtual meta response
       *
       * This is what Stremio renders as the "series page"
       */
      return {
        meta: {
          id,
          type: "series",

          // 🔥 Replace generic title with contextual one
          name: `${meta.name} — 🎲 Smart Picks`,

          // Use real show visuals for immersion
          poster: meta.poster,
          background: meta.background,

          /**
           * 🔥 SMART-START METADATA INJECTION
           *
           * Instead of generic episode entries,
           * we inject real episode-level metadata:
           * - overview (synopsis)
           * - thumbnail (episode still image)
           */
          videos: randomEpisodes.map((ep) => {
            // Construct canonical episode ID
            const episodeId = `${imdbId}:${ep.season}:${ep.number}`;

            return {
              id: episodeId,

              // Clean, structured episode title
              title: `S${ep.season}E${ep.number} — ${ep.name || "Episode"}`,

              season: ep.season,
              number: ep.number,

              /**
               * 🔥 KEY UPGRADE FIELDS
               */

              // Episode synopsis (Netflix-style preview text)
              overview: ep.overview || "No description available.",

              // Episode-specific still image (NOT series poster)
              thumbnail: ep.thumbnail || null,

              // Optional metadata (nice UX detail)
              released: ep.released || null,
            };
          }),
        },
      };
    } catch (e) {
      // Fail gracefully — never break Stremio UI
      return {
        meta: {
          id,
          type: "series",
          name: "⚠️ Shuffle failed",
          videos: [],
        },
      };
    }
  }

  // Default fallback for non-shuffle IDs
  return { meta: null };
}

module.exports = metaHandler;
