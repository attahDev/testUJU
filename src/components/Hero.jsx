import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button.jsx';
import { useCatalog } from '../context/catalogStore.js';
import { prefersReducedMotion } from '../hooks/useReducedMotion.js';
import './Hero.css';

const SLIDE_KEYS = ['hero', 'hero-2', 'hero-3'];
const SLIDE_MS = 7000;

export default function Hero() {
  const { siteImage } = useCatalog();
  const slides = SLIDE_KEYS.map((key) => siteImage(key)).filter(Boolean);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const hero = useRef(null);

  const go = useCallback((n) => setActive((n + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || slides.length < 2 || prefersReducedMotion()) return undefined;
    const timer = setTimeout(() => go(active + 1), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [active, paused, slides.length, go]);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const el = hero.current;
    let frame = 0;
    function update() {
      frame = 0;
      const height = el.offsetHeight;
      const y = Math.min(Math.max(window.scrollY, 0), height);
      el.style.setProperty('--hero-shift', `${(y * 0.12).toFixed(1)}px`);
      el.style.setProperty('--hero-lift', `${(-y * 0.08).toFixed(1)}px`);
      el.style.setProperty('--hero-fade', String(Math.max(0, 1 - (y / height) * 1.25).toFixed(3)));
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      className="hero"
      ref={hero}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero__media">
        {slides.map((src, i) => (
          <img
            key={src}
            className={`hero__image${i === active ? ' is-active' : ''}`}
            src={src}
            alt={i === 0 ? 'Model wearing a Rose Uju silk wrap' : ''}
          />
        ))}
      </div>
      <div className="hero__overlay" />
      <div className="hero__content">
        <h1 className="hero__rise" style={{ '--rise-delay': '0.3s' }}>Cultivated Beauty.<br />Worn Well</h1>
        <p className="hero__rise" style={{ '--rise-delay': '0.55s' }}>Afro-Caribbean luxury translating heritage into modern elegance</p>
        <div className="hero__actions hero__rise" style={{ '--rise-delay': '0.8s' }}>
          <Button as={Link} to="/shop">Shop Collection</Button>
          <Button as={Link} to="/about" variant="outline">Explore Story</Button>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button type="button" className="hero__arrow hero__arrow--prev" aria-label="Previous slide" onClick={() => go(active - 1)}>
            <svg width="22" height="40" viewBox="0 0 22 40" fill="none"><path d="M19 2 3 20l16 18" stroke="currentColor" strokeWidth="2" /></svg>
          </button>
          <button type="button" className="hero__arrow hero__arrow--next" aria-label="Next slide" onClick={() => go(active + 1)}>
            <svg width="22" height="40" viewBox="0 0 22 40" fill="none"><path d="m3 2 16 18L3 38" stroke="currentColor" strokeWidth="2" /></svg>
          </button>
          <div className="hero__dots">
            {slides.map((src, i) => (
              <button
                key={src}
                type="button"
                className={i === active ? 'is-active' : ''}
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === active}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
