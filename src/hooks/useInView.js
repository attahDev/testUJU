import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './useReducedMotion.js';

/*
 * An IntersectionObserver only reports when an element crosses the edge of the screen, so a big jump
 * (the End key, a restored scroll position) can carry an element from "below" to "above" the viewport
 * without it ever being reported. One shared, throttled scroll check catches those: anything already
 * scrolled past is simply shown.
 */
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

/** True once the element has scrolled into view (and stays true). Instantly true when motion is reduced. */
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

/** Staggers items by their column so a row arrives left to right instead of all at once. */
export function stagger(index, columns = 3, step = 90) {
  return (index % columns) * step;
}
