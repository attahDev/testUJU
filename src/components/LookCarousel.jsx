import { useRef, useState } from 'react';
import LookCard from './LookCard.jsx';
import './LookCard.css';

export default function LookCarousel({ looks }) {
  const track = useRef(null);
  const [index, setIndex] = useState(0);

  function go(delta) {
    const el = track.current;
    if (el) el.scrollBy({ left: delta * el.clientWidth, behavior: 'smooth' });
  }

  function onScroll() {
    const el = track.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <div className="look-carousel">
      <div className="look-carousel__track" ref={track} onScroll={onScroll}>
        {looks.map((look) => (
          <div key={look.id} className="look-carousel__slide">
            <LookCard look={look} />
          </div>
        ))}
      </div>
      {looks.length > 1 && (
        <div className="look-carousel__nav">
          <button type="button" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous look">←</button>
          <span aria-live="polite">{index + 1} / {looks.length}</span>
          <button type="button" onClick={() => go(1)} disabled={index >= looks.length - 1} aria-label="Next look">→</button>
        </div>
      )}
    </div>
  );
}
