import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useCatalog } from '../context/catalogStore.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import './Collections.css';

const BLURBS = {
  Adornments: 'Jewelry and scarves that carry pattern and story in every fold.',
  Apparel: 'Tailoring shaped by comfort, cut for a life in motion.',
  Foundations: 'Beauty rituals built on botanicals passed down through generations.',
  Rituals: 'Objects for slowing down — candles, oils, and quiet moments.',
  Legacy: 'Leather goods made to be handed down, not worn out.',
  'Modern Aesthetics': 'Sculptural objects for the home, rooted in tradition.',
};

const slugOf = (name) => name.toLowerCase().replace(/\s+/g, '-');

export default function Collections() {
  usePageMeta({ title: 'Collections', description: 'Explore the Rose Uju collections, each one rooted in heritage and made for modern wear.' });
  const { products: PRODUCTS, collections: COLLECTIONS, money, siteImage } = useCatalog();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function subscribe(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setError('');
    try {
      await api('/api/newsletter', { method: 'POST', auth: false, body: { email: new FormData(form).get('email') } });
      setSent(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="collections-page">
      <section className="collections-hero">
        <div className="collections-hero__copy">
          <p className="collections-hero__year">(2026)</p>
          <h1>Rose Uju<br />Collections</h1>
          <p className="collections-hero__sub">Explore our captivating collections embracing elegance in unparalleled luxury style</p>
        </div>
        <img className="collections-hero__image" src={siteImage('shop-banner')} alt="" />
      </section>

      {COLLECTIONS.map((name, i) => {
        const items = PRODUCTS.filter((p) => p.collection === name).slice(0, 2);
        const flipped = i % 2 === 1;
        return (
          <section key={name} className={'collection-block' + (flipped ? ' is-flipped' : '')}>
            <h2 className="collection-block__title">{name}</h2>
            <p className="collection-block__text">{BLURBS[name]}</p>
            <div className="collection-block__products">
              {items.map((p, n) => (
                <Link key={p.id} to={`/product/${p.id}`} className={`collection-block__item collection-block__item--${n + 1}`}>
                  <img src={p.image} alt={p.name} loading="lazy" />
                  <span>{p.name}</span>
                  <span>{money(p.price)}</span>
                </Link>
              ))}
              <Link to="/shop" className="discover-dot">
                <svg width="30" height="20" viewBox="0 0 30 20" fill="none"><path d="M3 18 26 3m-12 0h12v12" stroke="currentColor" strokeWidth="1.6" /></svg>
                Discover
              </Link>
            </div>
            <img className="collection-block__image" src={siteImage(`tile-${slugOf(name)}`)} alt={name} loading="lazy" />
          </section>
        );
      })}

      <section className="collections-cta">
        <div className="collections-cta__inner">
          <h2 aria-label="Stay Stylish"><span>Stay</span><span>Stylish</span></h2>
          <p>
            Join our list for early access to new collections, editorial stories from the journal,
            and invitations to intimate brand events.
          </p>
        </div>
        {sent ? (
          <p className="collections-cta__thanks">Thank you. You are on the list.</p>
        ) : (
          <form className="collections-cta__form" onSubmit={subscribe}>
            <label htmlFor="collections-email">Newsletter Sign Up</label>
            <input id="collections-email" name="email" type="email" placeholder="Enter your email here..." required />
            <button type="submit">Submit</button>
          </form>
        )}
        {error && <p className="collections-cta__error">{error}</p>}
      </section>
    </div>
  );
}
