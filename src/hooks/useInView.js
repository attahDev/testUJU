import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './useReducedMotion.js';

const waiting = new Set();
let queued = false;
let listening = false;

function sweep() {
  queued = false;
  for (const item of [...waiting]) {
    if (item.el.getBoundingClientRect().top < 0) item.reveal();
  }
}

function onScroll() {
  if (!queued) {
    queued = true;
    requestAnimationFrame(sweep);
  }
}

function watch(item) {
  waiting.add(item);
  if (!listening) {
    listening = true;
    window.addEventListener('scroll', onScroll, { passive: true });
  }
}

function unwatch(item) {
  waiting.delete(item);
  if (waiting.size === 0 && listening) {
    listening = false;
    window.removeEventListener('scroll', onScroll);
  }
}

export function useInView({ threshold = 0.15, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(() => prefersReducedMotion() || typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (inView) return undefined;
    const el = ref.current;
    const item = {
      el,
      reveal() {
        unwatch(item);
        observer.disconnect();
        setInView(true);
      },
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) item.reveal();
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    watch(item);
    return () => {
      unwatch(item);
      observer.disconnect();
    };
  }, [inView, threshold, rootMargin]);

  return [ref, inView];
}

export function stagger(index, columns = 3, step = 90) {
  return (index % columns) * step;
}
