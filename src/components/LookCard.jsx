import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/cartStore.js';
import { useCatalog } from '../context/catalogStore.js';
import './LookCard.css';

function inStock(p) {
  return p.stock > 0;
}

/** Lookbook photo if there is one; otherwise a collage composed from the product images. */
function LookMedia({ look }) {
  const [hero, ...rest] = look.products;
  if (look.image) {
    return (
      <div className="look-media look-media--photo">
        <img src={look.image} alt={look.name} loading="lazy" />
        <div className="look-media__strip">
          {look.products.map((p) => (
            <Link key={p.id} to={`/product/${p.id}`} aria-label={p.name}>
              <img src={p.image} alt="" loading="lazy" />
            </Link>
          ))}
        </div>
      </div>
    );
  }
  const side = rest.slice(0, 3);
  return (
    <div className={`look-media look-media--collage look-media--n${side.length}`}>
      <Link to={`/product/${hero.id}`} className="look-media__hero">
        <img src={hero.image} alt={hero.name} loading="lazy" />
      </Link>
      {side.map((p) => (
        <Link key={p.id} to={`/product/${p.id}`} className="look-media__side">
          <img src={p.image} alt={p.name} loading="lazy" />
        </Link>
      ))}
    </div>
  );
}

export default function LookCard({ look }) {
  const { addItem } = useCart();
  const { money } = useCatalog();
  const [chosen, setChosen] = useState(() =>
    Object.fromEntries(look.products.map((p) => [p.id, { on: inStock(p), size: '', color: p.colors[0]?.name || '' }]))
  );
  const [problem, setProblem] = useState('');
  const [added, setAdded] = useState(false);

  function patch(id, change) {
    setChosen((prev) => ({ ...prev, [id]: { ...prev[id], ...change } }));
    setProblem('');
    setAdded(false);
  }

  const picked = look.products.filter((p) => chosen[p.id].on);
  const total = picked.reduce((sum, p) => sum + p.price, 0);

  function addLook() {
    const needSize = picked.find((p) => p.sizes.length > 0 && !chosen[p.id].size);
    if (picked.length === 0) {
      setProblem('Select at least one piece.');
      return;
    }
    if (needSize) {
      setProblem(`Choose a size for ${needSize.name}.`);
      return;
    }
    picked.forEach((p) => addItem(p, { color: chosen[p.id].color, size: chosen[p.id].size }));
    setProblem('');
    setAdded(true);
  }

  return (
    <article className="look-card">
      <LookMedia look={look} />

      <div className="look-card__body">
        <p className="look-card__eyebrow">The Look</p>
        <h3 className="look-card__title">{look.name}</h3>
        {look.description && <p className="look-card__desc">{look.description}</p>}

        <ul className="look-pieces">
          {look.products.map((p) => {
            const c = chosen[p.id];
            const soldOut = !inStock(p);
            return (
              <li key={p.id} className={`look-piece${c.on ? '' : ' is-off'}`}>
                <label className="look-piece__check">
                  <input
                    type="checkbox"
                    checked={c.on}
                    disabled={soldOut}
                    onChange={(e) => patch(p.id, { on: e.target.checked })}
                    aria-label={`Include ${p.name}`}
                  />
                </label>
                <Link to={`/product/${p.id}`} className="look-piece__thumb">
                  <img src={p.image} alt="" loading="lazy" />
                </Link>
                <div className="look-piece__info">
                  <Link to={`/product/${p.id}`} className="look-piece__name">{p.name}</Link>
                  {soldOut ? (
                    <span className="look-piece__sold">Sold out</span>
                  ) : (
                    <div className="look-piece__opts">
                      {p.colors.length > 1 && (
                        <select value={c.color} onChange={(e) => patch(p.id, { color: e.target.value })} aria-label={`Colour for ${p.name}`}>
                          {p.colors.map((col) => <option key={col.name} value={col.name}>{col.name}</option>)}
                        </select>
                      )}
                      {p.sizes.length > 0 && (
                        <select value={c.size} onChange={(e) => patch(p.id, { size: e.target.value })} aria-label={`Size for ${p.name}`}>
                          <option value="">Size</option>
                          {p.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      )}
                    </div>
                  )}
                </div>
                <span className="look-piece__price">{money(p.price)}</span>
              </li>
            );
          })}
        </ul>

        {problem && <p className="look-card__problem" role="alert">{problem}</p>}

        <div className="look-card__foot">
          <button type="button" className="look-card__add" onClick={addLook} disabled={picked.length === 0}>
            {added ? 'Added to bag ✓' : `Add full look · ${money(total)}`}
          </button>
          {added && <Link to="/cart" className="look-card__bag">View bag →</Link>}
        </div>
      </div>
    </article>
  );
}
