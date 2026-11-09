import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { useCatalog } from '../context/catalogStore.js';
import './Shop.css';


export default function Shop() {
  const { products: PRODUCTS, collections: COLLECTIONS, money } = useCatalog();
  const CATEGORIES = [...new Set(PRODUCTS.map((p) => p.category))];
  const MATERIALS = [...new Set(PRODUCTS.map((p) => p.material).filter(Boolean))];
  const [activeCollections, setActiveCollections] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [activeMaterials, setActiveMaterials] = useState([]);
  const [sort, setSort] = useState('featured');
  const [priceMin, setPriceMin] = useState(null);
  const [priceMax, setPriceMax] = useState(null);
  const [params, setParams] = useSearchParams();
  const query = (params.get('q') || '').trim().toLowerCase();

  const prices = PRODUCTS.map((p) => p.price);
  const boundMin = prices.length ? Math.floor(Math.min(...prices)) : 0;
  const boundMax = prices.length ? Math.ceil(Math.max(...prices)) : 0;
  const lo = priceMin ?? boundMin;
  const hi = priceMax ?? boundMax;

  function toggle(list, setList, value) {
    setList((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  }

  const filtered = useMemo(() => {
    let result = PRODUCTS.filter((p) => {
      if (activeCollections.length && !activeCollections.includes(p.collection)) return false;
      if (activeCategories.length && !activeCategories.includes(p.category)) return false;
      if (activeMaterials.length && !activeMaterials.includes(p.material)) return false;
      if (p.price < lo || p.price > hi) return false;
      if (query && ![p.name, p.collection, p.category, p.material].some((v) => v.toLowerCase().includes(query))) return false;
      return true;
    });
    if (sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [PRODUCTS, activeCollections, activeCategories, activeMaterials, sort, query, lo, hi]);

  const hasFilters = Boolean(
    activeCollections.length || activeCategories.length || activeMaterials.length || priceMin !== null || priceMax !== null
  );

  return (
    <>
      <section className="shop-hero">
        <img src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=1400&q=80" alt="" />
        <div className="shop-hero__content container">
          <p className="shop-hero__crumb">Home / Shop</p>
          <h1>Shop All</h1>
        </div>
      </section>

      <section className="container section shop-layout">
        <aside className="shop-filters">
          <h4>Filter By</h4>

          <div className="filter-group">
            <h5>Collection</h5>
            {COLLECTIONS.map((c) => (
              <label key={c} className="filter-check">
                <input type="checkbox" checked={activeCollections.includes(c)} onChange={() => toggle(activeCollections, setActiveCollections, c)} />
                {c}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h5>Category</h5>
            {CATEGORIES.map((c) => (
              <label key={c} className="filter-check">
                <input type="checkbox" checked={activeCategories.includes(c)} onChange={() => toggle(activeCategories, setActiveCategories, c)} />
                {c}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h5>Price</h5>
            <div className="price-range">
              <input type="range" min={boundMin} max={boundMax} value={lo} aria-label="Minimum price" onChange={(e) => setPriceMin(Math.min(Number(e.target.value), hi))} />
              <input type="range" min={boundMin} max={boundMax} value={hi} aria-label="Maximum price" onChange={(e) => setPriceMax(Math.max(Number(e.target.value), lo))} />
              <div className="price-range__labels"><span>{money(lo)}</span><span>{money(hi)}</span></div>
            </div>
          </div>

          <div className="filter-group">
            <h5>Materials</h5>
            <div className="filter-pills">
              {MATERIALS.map((m) => (
                <button
                  key={m}
                  className={"filter-pill" + (activeMaterials.includes(m) ? ' is-active' : '')}
                  onClick={() => toggle(activeMaterials, setActiveMaterials, m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <button className="clear-filters" onClick={() => { setActiveCollections([]); setActiveCategories([]); setActiveMaterials([]); setPriceMin(null); setPriceMax(null); }}>
              Clear all filters
            </button>
          )}
        </aside>

        <div className="shop-results">
          <div className="shop-results__bar">
            <p>
              Showing {filtered.length} of {PRODUCTS.length} results
              {query && (
                <>
                  {' '}for “{params.get('q')}” <button className="clear-filters" onClick={() => setParams({})}>Clear search</button>
                </>
              )}
            </p>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="shop-empty">No products match those filters yet.</p>
          ) : (
            <div className="product-grid product-grid--3">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
