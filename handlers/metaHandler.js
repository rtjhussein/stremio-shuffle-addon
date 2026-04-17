// handlers/metaHandler.js

const { pickRandomEpisodes } = require("../core/shuffleEngine");
const { getSeriesMeta } = require("../core/cinemetaClient");

/**
 * Label pool (more cinematic, less mechanical)
 */
const LABELS = ["🎲 Smart Pick", "🎲 Try This", "🎲 Shuffle Selection"];

/**
 * Phrase styles (adds variety + tone)
 */
function formatDescription(name, year) {
  if (!name) return "A mystery episode awaits";

  const formats = [
    `“${name}”`,
    `Tonight: “${name}”`,
    `A random drop: “${name}”`,
  ];

  const base = formats[Math.floor(Math.random() * formats.length)];

  return year ? `${base} • ${year}` : base;
}

/**
 * Get random label
 */
function getRandomLabel() {
  return LABELS[Math.floor(Math.random() * LABELS.length)];
}

/**
 * Meta Handler
 *
 * CONTROLLED ANONYMITY MODE:
 * - Clean, cinematic presentation
 * - No structural identifiers (S/E hidden)
 * - Soft phrasing instead of mechanical UI
 */
async function metaHandler({ id }) {
  if (id.includes(":shuffle")) {
    const imdbId = id.split(":")[0];

    try {
      const meta = await getSeriesMeta(imdbId);
      const videos = meta.videos;

      const randomEpisodes = pickRandomEpisodes(videos, {
        mode: "all",
        count: 1,
        imdbId,
      });

      return {
        meta: {
          id,
          type: "series",

          /**
           * Simplified naming (less noisy)
           */
          name: `${meta.name} — 🎲 Shuffle`,

          poster: meta.poster,
          background: meta.background,

          videos: randomEpisodes.map((ep) => {
            const episodeId = `${imdbId}:${ep.season}:${ep.number}`;

            const year = ep.released
              ? new Date(ep.released).getFullYear()
              : null;

            return {
              id: episodeId,

              /**
               * Primary label
               */
              title: getRandomLabel(),

              /**
               * Cinematic description (less robotic)
               */
              description: formatDescription(
                ep.name || "Mystery Episode",
                year,
              ),

              /**
               * Hidden structure (still required internally)
               */
              season: ep.season,
              number: ep.number,

              /**
               * Visual anchor
               */
              thumbnail: ep.thumbnail || meta.poster,
            };
          }),
        },
      };
    } catch (e) {
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

  return { meta: null };
}

module.exports = metaHandler;
