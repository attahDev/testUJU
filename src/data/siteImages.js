/*
 * Every built-in picture on the storefront that the owner can swap from the admin ("Site images").
 * `fallback` is what shows until a replacement is uploaded, so nothing ever breaks.
 */
const u = (id, w) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;

export const SITE_IMAGE_GROUPS = ['Homepage', 'About page', 'Other pages'];

export const SITE_IMAGES = [
  {
    key: 'hero', group: 'Homepage', label: 'Hero (top of the homepage)',
    hint: 'Landscape, at least 2000px wide. Keep the model toward the right so the headline stays readable on the left.',
    fallback: u('1544005313-94ddf0286df2', 1600),
  },
  { key: 'tile-adornments', group: 'Homepage', label: 'Collection tile: Adornments', hint: 'Portrait or square, about 900px wide.', fallback: u('1617038260897-41a1f14a8ca0', 700) },
  { key: 'tile-apparel', group: 'Homepage', label: 'Collection tile: Apparel', hint: 'Portrait or square, about 900px wide.', fallback: u('1591047139829-d91aecb6caea', 700) },
  { key: 'tile-foundations', group: 'Homepage', label: 'Collection tile: Foundations', hint: 'Portrait or square, about 900px wide.', fallback: u('1620916566398-39f1143ab7be', 700) },
  { key: 'tile-rituals', group: 'Homepage', label: 'Collection tile: Rituals', hint: 'Portrait or square, about 900px wide.', fallback: u('1608181831718-c9ffd8a4fc03', 700) },
  { key: 'tile-legacy', group: 'Homepage', label: 'Collection tile: Legacy', hint: 'Portrait or square, about 900px wide.', fallback: u('1591561954557-26941169b49e', 700) },
  { key: 'tile-modern-aesthetics', group: 'Homepage', label: 'Collection tile: Modern Aesthetics', hint: 'Portrait or square, about 900px wide.', fallback: u('1578500494198-246f612d3b3d', 700) },
  { key: 'story', group: 'Homepage', label: 'Founder portrait (story section)', hint: 'Portrait, about 1200px wide.', fallback: u('1531123897727-8f129e1688ce', 900) },
  { key: 'gifting', group: 'Homepage', label: 'Gifting image', hint: 'Landscape or square, about 1200px wide.', fallback: u('1607344645866-009c320b63e0', 900) },

  { key: 'about-hero', group: 'About page', label: 'Top banner', hint: 'Wide landscape, at least 2000px wide.', fallback: u('1531123897727-8f129e1688ce', 1400) },
  { key: 'about-scarf', group: 'About page', label: 'Detail: silk scarf', hint: 'Close-up detail, about 800px wide.', fallback: u('1601924994987-69e26d50dc26', 500) },
  { key: 'about-jewelry', group: 'About page', label: 'Detail: gold jewellery', hint: 'Close-up detail, about 800px wide.', fallback: u('1611591437281-460bfbe1220a', 500) },
  { key: 'about-portrait', group: 'About page', label: 'Portrait (our craft)', hint: 'Portrait, about 1200px wide.', fallback: u('1614093302611-8efc4de12407', 800) },
  { key: 'about-closing', group: 'About page', label: 'Closing image ("This is what we feel")', hint: 'Wide landscape, at least 2000px wide.', fallback: u('1544947950-fa07a98d237f', 1400) },

  { key: 'shop-banner', group: 'Other pages', label: 'Shop page banner', hint: 'Wide landscape, at least 2000px wide.', fallback: u('1601924994987-69e26d50dc26', 1400) },
  { key: 'product-banner', group: 'Other pages', label: 'Product page banner ("Style in Elegance")', hint: 'Wide landscape, at least 2000px wide.', fallback: u('1617038260897-41a1f14a8ca0', 1400) },
  { key: 'customise-banner', group: 'Other pages', label: 'Customise page banner', hint: 'Wide landscape, at least 2000px wide.', fallback: u('1558769132-cb1aea458c5e', 1600) },
  { key: 'journal-deco', group: 'Other pages', label: 'Journal decorative image', hint: 'Small accent image, about 800px wide.', fallback: u('1544947950-fa07a98d237f', 500) },
];

export const SITE_IMAGE_DEFAULTS = Object.fromEntries(SITE_IMAGES.map((s) => [s.key, s.fallback]));
