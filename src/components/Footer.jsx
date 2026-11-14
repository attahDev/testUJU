import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useCatalog } from '../context/catalogStore.js';
import './Footer.css';

const SOCIALS = [
  {
    key: 'social_linkedin',
    label: 'LinkedIn',
    icon: <path d="M3.5 6.2h2.7V15H3.5V6.2Zm1.35-3.7a1.55 1.55 0 1 1 0 3.1 1.55 1.55 0 0 1 0-3.1ZM8 6.2h2.6v1.2c.4-.7 1.3-1.4 2.6-1.4 2.8 0 3.3 1.8 3.3 4.2V15h-2.7v-4.3c0-1 0-2.3-1.4-2.3s-1.7 1.1-1.7 2.2V15H8V6.2Z" />,
  },
  {
    key: 'social_facebook',
    label: 'Facebook',
    icon: <path d="M10.2 16.5v-6h2l.3-2.4h-2.3V6.6c0-.7.2-1.1 1.2-1.1h1.2V3.4c-.2 0-.9-.1-1.8-.1-1.8 0-3 1.1-3 3.100v1.700H5.800v2.400h2v6h2.400Z" />,
  },
  {
    key: 'social_twitter',
    label: 'Twitter',
    icon: <path d="M17 5.300c-.5.200-1 .4-1.600.4.600-.3 1-.9 1.200-1.500-.5.300-1.100.5-1.800.7a2.800 2.800 0 0 0-4.800 2.500A8 8 0 0 1 4 4.500a2.800 2.800 0 0 0 .9 3.800c-.4 0-.9-.1-1.300-.4 0 1.400 1 2.500 2.200 2.800-.4.100-.8.100-1.200 0 .3 1.100 1.400 1.900 2.600 1.900A5.600 5.600 0 0 1 3 13.800 8 8 0 0 0 7.300 15c5.200 0 8-4.300 8-8v-.4c.600-.4 1.200-1 1.700-1.700Z" />,
  },
];

function Mark() {
  return (
    <svg className="site-footer__mark" viewBox="0 0 170 150" role="img" aria-label="Rose Uju">
      <path d="M43 6C14 28 8 60 8 80c0 25 14 50 38 64" fill="none" stroke="#C4583B" strokeWidth="2.5" />
      <path d="M127 6c29 22 35 54 35 74 0 25-14 50-38 64" fill="none" stroke="#C4583B" strokeWidth="2.5" />
      <text x="85" y="98" textAnchor="middle" fontFamily="'Playfair Display', serif" fontSize="68" fill="#F7F3EE">RU</text>
    </svg>
  );
}

export default function Footer() {
  const { settings } = useCatalog();
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const socials = SOCIALS.filter((s) => settings[s.key]);
  const hasContact = settings.support_email || settings.support_phone || settings.business_address;

  async function subscribe(e) {
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
      <div className="site-footer__grid">
        <Link to="/" className="site-footer__logo" aria-label="Rose Uju home"><Mark /></Link>

        <div className="site-footer__col">
          <h4>Quick Links</h4>
          <Link to="/about">Our Craft</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/customise">Customize</Link>
          <Link to="/collections">Collections</Link>
        </div>

        <div className="site-footer__col">
          <h4>Contact Us</h4>
          {hasContact ? (
            <>
              {settings.support_phone && <a href={`tel:${settings.support_phone.replace(/[^+\d]/g, '')}`}>{settings.support_phone}</a>}
              {settings.support_email && <a href={`mailto:${settings.support_email}`}>{settings.support_email}</a>}
              {settings.business_address && <p>{settings.business_address}</p>}
            </>
          ) : (
            <Link to="/track-order">Find My Order</Link>
          )}
          {socials.length > 0 && (
            <div className="site-footer__social">
              {socials.map((s) => (
                <a key={s.key} href={settings[s.key]} target="_blank" rel="noreferrer" aria-label={s.label}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">{s.icon}</svg>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="site-footer__col site-footer__col--subscribe">
          <h4>Subscribe</h4>
          {subscribed ? (
            <p className="site-footer__thanks">Thank you for subscribing.</p>
          ) : (
            <form onSubmit={subscribe}>
              <input type="email" name="newsletter" placeholder="Get product updates" aria-label="Email address" required />
              <button type="submit" aria-label="Subscribe">
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none"><path d="M1 8h19m-6-7 7 7-7 7" stroke="currentColor" strokeWidth="2.2" /></svg>
              </button>
            </form>
          )}
          {error && <span className="site-footer__error">{error}</span>}
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© 2026 Rose UJU. All rights reserved</p>
        <nav className="site-footer__legal" aria-label="Legal">
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/returns">Returns &amp; Shipping</Link>
          <Link to="/track-order">Find My Order</Link>
        </nav>
      </div>
    </footer>
  );
}
