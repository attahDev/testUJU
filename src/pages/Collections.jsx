import { Link } from 'react-router-dom';
import { useCatalog } from '../context/catalogStore.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import NewsletterForm from '../components/NewsletterForm.jsx';
import './Collections.css';

const BLURBS = {
  Adornments: 'Jewellery and scarves that carry pattern and story in every fold.',
  Apparel: 'Tailoring shaped by comfort, cut for a life in motion.',
  Foundations: 'Beauty rituals built on botanicals passed down through generations.',
  Rituals: 'Objects for slowing down — candles, oils, and quiet moments.',
  Legacy: 'Leather goods made to be handed down, not worn out.',
  'Modern Aesthetics': 'Sculptural objects for the home, rooted in tradition.',
};

export default function Collections() {
  usePageMeta({ title: 'Collections', description: 'Explore the Rose Uju collections, each one rooted in heritage and made for modern wear.' });
  const { products: PRODUCTS, collections: COLLECTIONS, money } = useCatalog();
  return (
    <div className="collections-page">
      <section className="collections-hero container">
        <p className="eyebrow">Collections</p>
        <h1>Rose Uju collections</h1>
        <p className="collections-hero__sub">
          Each collection is rooted in heritage and made for modern wear.
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
              <Link to="/shop" className="discover-dot">Browse the shop</Link>
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
            <h2>Stay in<br />the loop</h2>
          </div>
          <p>
            Get new collections and journal stories in your inbox.
          </p>
          <NewsletterForm formClass="collections-cta__form" thanksClass="collections-cta__thanks" errorClass="collections-cta__error" thanks="Thank you. You’re on the list." />
        </div>
      </section>
    </div>
  );
}
