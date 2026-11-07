export default function Stars({ value, label }) {
  const filled = Math.round(value);
  return (
    <span className="stars" role="img" aria-label={label || `${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= filled ? 'stars__on' : 'stars__off'}>★</span>
      ))}
    </span>
  );
}
