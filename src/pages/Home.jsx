import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ProductCard from '../components/ProductCard.jsx';
import JournalCard from '../components/JournalCard.jsx';
import { stagger } from '../hooks/useInView.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import Hero from '../components/Hero.jsx';
import Reveal from '../components/Reveal.jsx';
import LookCarousel from '../components/LookCarousel.jsx';
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
  const { products, articles, looks, siteImage } = useCatalog();
  const newThisWeek = products.slice(0, 3);
  const featured = products.slice(3, 7);
  const stories = articles.slice(0, 3);

  return (
    <>
      <Hero />

      <section className="container section">
        <Reveal as="p" className="eyebrow eyebrow--center">Shop by collection</Reveal>
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
        <SectionHeading title={<>New<br />this week</>} linkTo="/shop" />
        <div className="product-grid product-grid--3">
          {newThisWeek.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {looks.length > 0 && (
        <section className="container section">
          <SectionHeading eyebrow="Styled by Rose Uju" title="Shop the Look" linkTo="/looks" linkLabel="All looks" />
          <LookCarousel looks={looks} />
        </section>
      )}

      <section className="container section">
        <SectionHeading title="Featured pieces" linkTo="/shop" />
        <div className="product-grid product-grid--4">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} columns={4} />)}
        </div>
      </section>

      <section className="container section story">
        <img
          className="story__image"
          src={siteImage('story')}
          alt="Rose Uju founder portrait"
        />
        <div className="story__copy">
          <p className="eyebrow">Rooted in heritage, made for today</p>
          <p>
            Rose Uju weaves Afro-Caribbean culture into modern luxury. Every
            piece is designed with care and with respect for the stories
            behind it, from the patterns we choose to the way we finish them.
          </p>
          <Button as={Link} to="/about" variant="outline">Read our story</Button>
        </div>
      </section>

      <section className="container section">
        <div className="journal-heading">
          <p className="eyebrow eyebrow--center">The Rose Uju Journal</p>
          <h2>Stories of culture, style and cultivated living</h2>
        </div>
        <div className="journal-grid">
          {stories.map((a, i) => (
            <JournalCard key={a.id} article={a} meta={`${a.tag} · ${a.readTime}`} delay={stagger(i)} />
          ))}
        </div>
      </section>

      <section className="container section gifting">
        <div className="gifting__copy">
          <p className="eyebrow">Gifting</p>
          <h2>The Cultivated Sets</h2>
          <p>
            Curated sets, packaged for giving. Choose one as a gift, or keep it
            for your own daily rituals.
          </p>
          <Button as={Link} to="/collections">Explore the collections</Button>
        </div>
        <img
          className="gifting__image"
          src={siteImage('gifting')}
          alt="Gift box set"
        />
      </section>
    </>
  );
}
