import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useCatalog } from '../context/catalogStore.js';
import './Footer.css';

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const { settings } = useCatalog();
  const hasContact = settings.support_email || settings.support_phone || settings.business_address;

  const [error, setError] = useState('');

  async function handleSubscribe(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setError('');
    try {
      await api('/api/newsletter', { method: 'POST', auth: false, body: { email: new FormData(form).get('newsletter') } });
      setSubscribed(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <h3>Join the Cultivated Circle</h3>
          <p>Be the first to hear about new collections, journal stories and private events.</p>
        </div>
        {subscribed ? (
          <p className="site-footer__thanks">Thank you for joining the Cultivated Circle.</p>
        ) : (
          <form className="site-footer__form" onSubmit={handleSubscribe}>
            <input type="email" name="newsletter" placeholder="Email address" aria-label="Email address" required />
            <button type="submit">Subscribe</button>
            {error && <span className="site-footer__error">{error}</span>}
          </form>
        )}
      </div>

      <div className="site-footer__grid">
        <div className="site-footer__col site-footer__col--logo">
          <span className="site-footer__mark">RU</span>
          <p>{settings.business_name}</p>
        </div>
        <div className="site-footer__col">
          <h4>Explore</h4>
          <Link to="/about">Our craft</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/customise">Customise</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/journal">The journal</Link>
          <Link to="/account">My account</Link>
          <Link to="/track-order">Find my order</Link>
        </div>
        {hasContact ? (
          <div className="site-footer__col">
            <h4>Contact us</h4>
            {settings.support_phone && <a href={`tel:${settings.support_phone.replace(/[^+\d]/g, '')}`}>{settings.support_phone}</a>}
            {settings.support_email && <a href={`mailto:${settings.support_email}`}>{settings.support_email}</a>}
            {settings.business_address && <p>{settings.business_address}</p>}
          </div>
        ) : (
          <div className="site-footer__col">
            <h4>Help</h4>
            <Link to="/track-order">Find my order</Link>
            <Link to="/returns">Returns &amp; Shipping</Link>
          </div>
        )}
      </div>

      <div className="site-footer__bottom">
        <p>© 2026 {settings.business_name}. All rights reserved</p>
        <nav className="site-footer__legal" aria-label="Legal">
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/returns">Returns &amp; Shipping</Link>
        </nav>
      </div>
    </footer>
  );
}
