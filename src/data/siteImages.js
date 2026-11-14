const u = (id, w) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;

export const SITE_IMAGE_GROUPS = ['Homepage', 'About page', 'Other pages'];

export const SITE_IMAGES = [
  {
    key: 'hero', group: 'Homepage', label: 'Hero (top of the homepage)',
    hint: 'Landscape, at least 2000px wide. Keep the model toward the right so the headline stays readable on the left.',
    fallback: u('1544005313-94ddf0286df2', 1600),
  },
  {
    key: 'hero-2', group: 'Homepage', label: 'Hero, second slide',
    hint: 'Landscape, at least 2000px wide. Keep the subject toward the right.',
    fallback: u('1531123897727-8f129e1688ce', 1600),
  },
  {
    key: 'hero-3', group: 'Homepage', label: 'Hero, third slide',
    hint: 'Landscape, at least 2000px wide. Keep the subject toward the right.',
    fallback: u('1544947950-fa07a98d237f', 1600),
  },
  { key: 'tile-adornments', group: 'Homepage', label: 'Collection tile: Adornments', hint: 'Portrait or square, about 900px wide.', fallback: '/images/tile-adornments.jpg' },
  { key: 'tile-apparel', group: 'Homepage', label: 'Collection tile: Apparel', hint: 'Portrait or square, about 900px wide.', fallback: '/images/tile-apparel.jpg' },
  { key: 'tile-foundations', group: 'Homepage', label: 'Collection tile: Foundations', hint: 'Portrait or square, about 900px wide.', fallback: '/images/tile-foundations.jpg' },
  { key: 'tile-rituals', group: 'Homepage', label: 'Collection tile: Rituals', hint: 'Portrait or square, about 900px wide.', fallback: '/images/tile-rituals.jpg' },
  { key: 'tile-legacy', group: 'Homepage', label: 'Collection tile: Legacy', hint: 'Portrait or square, about 900px wide.', fallback: '/images/tile-legacy.jpg' },
  { key: 'tile-modern-aesthetics', group: 'Homepage', label: 'Collection tile: Modern Aesthetics', hint: 'Portrait or square, about 900px wide.', fallback: '/images/tile-modern-aesthetics.jpg' },
  { key: 'story', group: 'Homepage', label: 'Founder portrait (story section)', hint: 'Portrait, about 1200px wide.', fallback: '/images/story.jpg' },
  { key: 'gifting', group: 'Homepage', label: 'Gifting image', hint: 'Landscape or square, about 1200px wide.', fallback: '/images/gifting.jpg' },

  { key: 'about-hero', group: 'About page', label: 'Top banner', hint: 'Wide landscape, at least 2000px wide.', fallback: u('1531123897727-8f129e1688ce', 1400) },
  { key: 'about-scarf', group: 'About page', label: 'Detail: silk scarf', hint: 'Close-up detail, about 800px wide.', fallback: '/images/about-scarf.jpg' },
  { key: 'about-jewelry', group: 'About page', label: 'Detail: gold jewellery', hint: 'Close-up detail, about 800px wide.', fallback: '/images/about-jewelry.jpg' },
  { key: 'about-portrait', group: 'About page', label: 'Portrait (our craft)', hint: 'Portrait, about 1200px wide.', fallback: '/images/about-portrait.jpg' },
  { key: 'about-closing', group: 'About page', label: 'Closing image ("This is what we feel")', hint: 'Wide landscape, at least 2000px wide.', fallback: u('1544947950-fa07a98d237f', 1400) },

  { key: 'shop-banner', group: 'Other pages', label: 'Shop page banner', hint: 'Wide landscape, at least 2000px wide.', fallback: '/images/banner.jpg' },
  { key: 'product-banner', group: 'Other pages', label: 'Product page banner ("Style in Elegance")', hint: 'Wide landscape, at least 2000px wide.', fallback: '/images/banner.jpg' },
  { key: 'customise-banner', group: 'Other pages', label: 'Customise page banner', hint: 'Wide landscape, at least 2000px wide.', fallback: u('1558769132-cb1aea458c5e', 1600) },
  { key: 'journal-deco', group: 'Other pages', label: 'Journal decorative image', hint: 'Small accent image, about 800px wide.', fallback: u('1544947950-fa07a98d237f', 500) },
];

export const SITE_IMAGE_DEFAULTS = Object.fromEntries(SITE_IMAGES.map((s) => [s.key, s.fallback]));
