const manifest = {
  id: "org.shuffler.stremio",
  version: "1.1.4",
  name: "Series Shuffler Pro",
  description:
    "Professional orchestration layer to play random episodes using your own scrapers.",
  resources: ["catalog", "meta", "stream"],
  types: ["series"],
  idPrefixes: ["tt"],
  catalogs: [
    {
      type: "series",
      id: "shuffle_catalog",
      name: "Shuffle TV",
      extra: [{ name: "search", isRequired: false }],
    },
  ],
};

module.exports = manifest;
