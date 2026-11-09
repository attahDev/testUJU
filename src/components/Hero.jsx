import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button.jsx';
import { prefersReducedMotion } from '../hooks/useReducedMotion.js';
import './Hero.css';

export default function Hero() {
  const hero = useRef(null);

  // Slow parallax: the photo drifts a little slower than the page, and the text eases away as you scroll.
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
    <section className="hero" ref={hero}>
      <div className="hero__media">
        <img
          className="hero__image"
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1600&q=80"
          alt="Model wearing a Rose Uju silk wrap"
        />
      </div>
      <div className="hero__overlay" />
      <div className="hero__content">
        <h1 className="hero__rise" style={{ '--rise-delay': '0.3s' }}>Cultivated Beauty,<br />Worn Well</h1>
        <p className="hero__rise" style={{ '--rise-delay': '0.55s' }}>Afro-Caribbean luxury translating heritage into modern elegance.</p>
        <div className="hero__actions hero__rise" style={{ '--rise-delay': '0.8s' }}>
          <Button as={Link} to="/shop">Shop Collection</Button>
          <Button as={Link} to="/about" variant="outline">Explore Story</Button>
        </div>
      </div>
      <div className="hero__scroll" aria-hidden="true"><span /></div>
    </section>
  );
}
