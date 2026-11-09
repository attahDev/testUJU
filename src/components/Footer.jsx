import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import './Footer.css';

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);

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
          <p>Subscribe to receive early access to new collections, editorial content, and invitations to intimate brand events.</p>
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
          <p>Rose Uju</p>
        </div>
        <div className="site-footer__col">
          <h4>Quick Links</h4>
          <Link to="/about">Our Craft</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/customise">Customise</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/journal">The Journal</Link>
          <Link to="/account">My Account</Link>
          <Link to="/track-order">Find My Order</Link>
        </div>
        <div className="site-footer__col">
          <h4>Contact Us</h4>
          <p>+1 (2345) 679-01-23</p>
          <p>support@roseuju.agency</p>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© 2026 Rose Uju. All rights reserved</p>
      </div>
    </footer>
  );
}
