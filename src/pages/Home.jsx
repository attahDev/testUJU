import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ProductCard from '../components/ProductCard.jsx';
import JournalCard from '../components/JournalCard.jsx';
import { stagger } from '../hooks/useInView.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import Hero from '../components/Hero.jsx';
import Reveal from '../components/Reveal.jsx';
import NewsletterBand from '../components/NewsletterBand.jsx';
import { useCatalog } from '../context/catalogStore.js';
import './Home.css';

const COLLECTION_TILES = [
  { name: 'Adornments', key: 'tile-adornments' },
  { name: 'Apparel', key: 'tile-apparel' },
  { name: 'Foundations', key: 'tile-foundations' },
  { name: 'Rituals', key: 'tile-rituals' },
  { name: 'Legacy', key: 'tile-legacy' },
  { name: 'Modern Aesthetics', key: 'tile-modern-aesthetics' },
];

export default function Home() {
  usePageMeta();
  const { products, articles, siteImage } = useCatalog();
  const newThisWeek = products.slice(0, 3);
  const featured = products.slice(3, 7);
  const stories = articles.slice(0, 3);

  return (
    <>
      <Hero />

      <section className="container section">
        <Reveal as="p" className="eyebrow eyebrow--center eyebrow--rule">The Petals Collection</Reveal>
        <div className="collection-grid">
          {COLLECTION_TILES.map((tile, i) => (
            <Reveal key={tile.name} as={Link} to="/collections" className="collection-tile" delay={120 + (i % 3) * 130}>
              <img src={siteImage(tile.key)} alt={tile.name} loading="lazy" />
              <span>{tile.name}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container section">
        <SectionHeading title={<>New<br />This Week</>} linkTo="/shop" />
        <div className="product-grid product-grid--3 product-grid--tall">
          {newThisWeek.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      <section className="container section">
        <SectionHeading title="Featured Product" linkTo="/shop" />
        <div className="product-grid product-grid--4">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} columns={4} />)}
        </div>
      </section>

      <section className="story-band">
        <div className="container story">
          <img
            className="story__image"
            src={siteImage('story')}
            alt="Rose Uju founder portrait"
          />
          <div className="story__copy">
            <p className="story__eyebrow">Rooted in Heritage. Crafted for Today.</p>
            <p>
              ROSE UJU is born from the desire to seamlessly weave the profound
              narratives of Afro-Caribbean culture into the fabric of modern
              luxury. We believe that true elegance is cultivated through an
              appreciation of origins. Every piece in our collection is a
              testament to meticulous craftsmanship, thoughtful design, and a
              deep respect for the stories that shape us.
            </p>
            <Button as={Link} to="/about" variant="outline">Read More</Button>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="journal-heading">
          <p className="journal-heading__eyebrow">The ROSE UJU Journal</p>
          <p className="journal-heading__sub">Stories of culture, style, and cultivated living.</p>
        </div>
        <div className="journal-grid">
          {stories.map((a, i) => (
            <JournalCard key={a.id} article={a} meta={`${a.tag} · ${a.readTime}`} delay={stagger(i)} />
          ))}
        </div>
      </section>

      <section className="gifting-wrap">
        <div className="gifting">
          <div className="gifting__copy">
            <p className="gifting__eyebrow">Gifting</p>
            <h2>The Cultivated Sets</h2>
            <p>
              Curated collections designed to introduce the senses to the world
              of ROSE UJU. Perfectly packaged for giving, or for honoring your
              own daily rituals.
            </p>
            <Button as={Link} to="/collections">Read More</Button>
          </div>
          <img
            className="gifting__image"
            src={siteImage('gifting')}
            alt="Gift box set"
          />
        </div>
      </section>

      <NewsletterBand />
    </>
  );
}
