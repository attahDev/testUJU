import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../hooks/useReducedMotion.js';
import './Reveal.css';

/** Fades and lifts its content into view the first time it scrolls on screen. */
export default function Reveal({ as: As = 'div', delay = 0, className = '', children, style, ...props }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(() => prefersReducedMotion() || typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (visible) return undefined;
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <As
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ ...style, '--reveal-delay': `${delay}ms` }}
      {...props}
    >
      {children}
    </As>
  );
}
