const slugifyLib = require('slugify');

const makeSlug = (text, unique = true) => {
  const base = slugifyLib(text, { lower: true, strict: true });
  if (!unique) return base;
  return `${base}-${Date.now().toString().slice(-5)}`;
};

module.exports = makeSlug;
