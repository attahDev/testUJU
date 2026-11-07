import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cartStore.js';
import './Header.css';

const NAV = [
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/collections' },
  { label: 'Customise', to: '/customise' },
  { label: 'The Journal', to: '/journal' },
  { label: 'About', to: '/about' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { count } = useCart();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const overlay = pathname === '/';

  function submitSearch(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/shop?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setQuery('');
  }

  return (
    <header className={`site-header${overlay ? ' site-header--overlay' : ''}`}>
      <div className="site-header__inner">
        <button
          className="site-header__burger"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
        </button>

        <Link to="/" className="site-header__logo">Rose Uju</Link>

        <nav className={`site-header__nav ${open ? 'is-open' : ''}`}>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 'site-header__link' + (isActive ? ' is-active' : '')}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__icons">
          <button aria-label="Search" aria-expanded={searchOpen} className="icon-btn" onClick={() => setSearchOpen((v) => !v)}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.3"/><line x1="12.6" y1="12.6" x2="17" y2="17" stroke="currentColor" strokeWidth="1.3"/></svg>
          </button>
          <Link to="/account" aria-label="Account" className="icon-btn">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="5.5" r="3.25" stroke="currentColor" strokeWidth="1.3"/><path d="M2.5 16c1-3.2 4-5 6.5-5s5.5 1.8 6.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          </Link>
          <Link to="/cart" aria-label="Cart" className="icon-btn icon-btn--cart">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 5h12l-1 9.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 4 14.5L3 5Z" stroke="currentColor" strokeWidth="1.3"/><path d="M6.2 5V3.8a2.8 2.8 0 0 1 5.6 0V5" stroke="currentColor" strokeWidth="1.3"/></svg>
            {count > 0 && <span className="icon-btn__badge">{count}</span>}
          </Link>
        </div>
      </div>
      {searchOpen && (
        <form className="site-header__search" onSubmit={submitSearch} role="search">
          <input
            autoFocus
            type="search"
            placeholder="Search products, collections, materials"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
          />
          <button type="submit">Search</button>
        </form>
      )}
    </header>
  );
}
