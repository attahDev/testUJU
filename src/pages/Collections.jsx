import { Link } from 'react-router-dom';
import { useCatalog } from '../context/catalogStore.js';
import './Collections.css';

const BLURBS = {
  Adornments: 'Jewelry and scarves that carry pattern and story in every fold.',
  Apparel: 'Tailoring shaped by comfort, cut for a life in motion.',
  Foundations: 'Beauty rituals built on botanicals passed down through generations.',
  Rituals: 'Objects for slowing down — candles, oils, and quiet moments.',
  Legacy: 'Leather goods made to be handed down, not worn out.',
  'Modern Aesthetics': 'Sculptural objects for the home, rooted in tradition.',
};

export default function Collections() {
  const { products: PRODUCTS, collections: COLLECTIONS, money } = useCatalog();
  return (
    <div className="collections-page">
      <section className="collections-hero container">
        <p className="eyebrow">(2026)</p>
        <h1>Rose Uju Collections</h1>
        <p className="collections-hero__sub">
          Explore our captivating collections embracing elegance in unparalleled luxury style.
        </p>
      </section>

      {COLLECTIONS.map((name, i) => {
        const items = PRODUCTS.filter((p) => p.collection === name).slice(0, 2);
        const reversed = i % 2 === 1;
        return (
          <section key={name} className={"collection-row container" + (reversed ? ' is-reversed' : '')}>
            <div className="collection-row__copy">
              <h2>{name}</h2>
              <p>{BLURBS[name]}</p>
              <Link to="/shop" className="discover-dot">Discover</Link>
            </div>
            <div className="collection-row__items">
              {items.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="collection-row__item">
                  <img src={p.image} alt={p.name} loading="lazy" />
                  <span>{p.name}</span>
                  <strong>{money(p.price)}</strong>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <section className="collections-cta">
        <div className="container collections-cta__inner">
          <div>
            <h2>Stay<br />Stylish</h2>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in
            hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur.
          </p>
          <form className="collections-cta__form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Newsletter Sign Up" aria-label="Email" required />
            <button type="submit">→</button>
          </form>
        </div>
      </section>
    </div>
  );
}
