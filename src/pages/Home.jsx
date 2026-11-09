import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ProductCard from '../components/ProductCard.jsx';
import LookCarousel from '../components/LookCarousel.jsx';
import { useCatalog } from '../context/catalogStore.js';
import './Home.css';

const COLLECTION_TILES = [
  { name: 'Adornments', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=700&q=80' },
  { name: 'Apparel', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700&q=80' },
  { name: 'Foundations', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=700&q=80' },
  { name: 'Rituals', image: 'https://images.unsplash.com/photo-1608181831718-c9ffd8a4fc03?w=700&q=80' },
  { name: 'Legacy', image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=700&q=80' },
  { name: 'Modern Aesthetics', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=700&q=80' },
];

export default function Home() {
  const { products, articles, looks } = useCatalog();
  const newThisWeek = products.slice(0, 3);
  const featured = products.slice(3, 7);
  const stories = articles.slice(0, 3);

  return (
    <>
      <section className="hero">
        <img
          className="hero__image"
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1600&q=80"
          alt="Model wearing a Rose Uju silk wrap"
        />
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1>Cultivated Beauty,<br />Worn Well</h1>
          <p>Afro-Caribbean luxury translating heritage into modern elegance.</p>
          <div className="hero__actions">
            <Button as={Link} to="/shop">Shop Collection</Button>
            <Button as={Link} to="/about" variant="outline">Explore Story</Button>
          </div>
        </div>
      </section>

      <section className="container section">
        <p className="eyebrow eyebrow--center">The Prints Collection</p>
        <div className="collection-grid">
          {COLLECTION_TILES.map((tile) => (
            <Link key={tile.name} to="/collections" className="collection-tile">
              <img src={tile.image} alt={tile.name} loading="lazy" />
              <span>{tile.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <SectionHeading title={<>New<br />This Week</>} linkTo="/shop" />
        <div className="product-grid product-grid--3">
          {newThisWeek.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {looks.length > 0 && (
        <section className="container section">
          <SectionHeading eyebrow="Styled by Rose Uju" title="Shop the Look" linkTo="/looks" linkLabel="All looks" />
          <LookCarousel looks={looks} />
        </section>
      )}

      <section className="container section">
        <SectionHeading title="Featured Product" linkTo="/shop" />
        <div className="product-grid product-grid--4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="container section story">
        <img
          className="story__image"
          src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=900&q=80"
          alt="Rose Uju founder portrait"
        />
        <div className="story__copy">
          <p className="eyebrow">Rooted in Heritage, Crafted for Today</p>
          <p>
            Rose Uju was born from the desire to seamlessly weave the profound
            narratives of Afro-Caribbean culture into the fabric of modern
            luxury. We believe true elegance is cultivated through an
            appreciation of origin — every piece is a testament to the
            meticulous craftsmanship, thoughtful design, and deep respect for
            the stories that shape us.
          </p>
          <Button as={Link} to="/about" variant="outline">Read More</Button>
        </div>
      </section>

      <section className="container section">
        <div className="journal-heading">
          <p className="eyebrow eyebrow--center">The Rose Uju Journal</p>
          <h2>Stories of culture, style, and cultivated living</h2>
        </div>
        <div className="journal-grid">
          {stories.map((a) => (
            <Link key={a.id} to={"/journal/" + a.id} className="journal-card">
              <img src={a.image} alt="" loading="lazy" />
              <span className="journal-card__meta">{a.tag} · {a.readTime}</span>
              <h3>{a.title}</h3>
              <p>{a.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section gifting">
        <div className="gifting__copy">
          <p className="eyebrow">Gifting</p>
          <h2>The Cultivated Sets</h2>
          <p>
            Curated collections designed to introduce the senses to the world
            of Rose Uju. Perfectly packaged for giving, or for honoring your
            own daily rituals.
          </p>
          <Button as={Link} to="/collections">Read More</Button>
        </div>
        <img
          className="gifting__image"
          src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=900&q=80"
          alt="Gift box set"
        />
      </section>
    </>
  );
}
