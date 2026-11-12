import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NotFound from './NotFound.jsx';
import Button from '../components/Button.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductReviews from '../components/ProductReviews.jsx';
import Stars from '../components/Stars.jsx';
import { api } from '../api/client.js';
import { useCatalog } from '../context/catalogStore.js';
import HeartButton from '../components/HeartButton.jsx';
import ShareButton from '../components/ShareButton.jsx';
import { useCart } from '../context/cartStore.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import './Product.css';

const PANELS = [
  { title: 'Cultural story', body: 'Our pieces draw on motifs carried across generations in Afro-Caribbean culture, reinterpreted for a modern wardrobe.' },
  { title: 'Materials', body: '' },
  { title: 'Care guide', body: 'Follow the care label on your piece. Store it flat or rolled to avoid creasing, and keep it out of direct sunlight.' },
];

export default function Product() {
  const { id } = useParams();
  const { getProduct } = useCatalog();
  const product = getProduct(id);
  if (!product) return <NotFound />;
  return <ProductView key={product.id} product={product} />;
}

function ProductView({ product }) {
  const { addItem } = useCart();
  const { products, money, siteImage, config } = useCatalog();
  const page = typeof window === 'undefined' ? '' : `${window.location.origin}${window.location.pathname}`;
  usePageMeta({
    title: product.name,
    description: product.description,
    image: product.image,
    type: 'product',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: [product.image, ...(product.gallery || [])].filter(Boolean),
      sku: String(product.id),
      offers: {
        '@type': 'Offer',
        url: page,
        priceCurrency: (config?.currency || 'GBP').toUpperCase(),
        price: Number(product.price).toFixed(2),
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    },
  });
  const colors = product.colors;
  const sizes = product.sizes;
  const gallery = [product.image, ...product.gallery].filter(Boolean);
  const soldOut = product.stock < 1;
  const [color, setColor] = useState(colors[0]?.name || '');
  const [size, setSize] = useState(sizes.includes('M') ? 'M' : sizes[0] || '');
  const [mainImage, setMainImage] = useState(gallery[0]);
  const [qty, setQty] = useState(1);
  const [openPanel, setOpenPanel] = useState(-1);
  const [added, setAdded] = useState(false);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api(`/api/products/${product.id}/reviews`, { auth: false }).then(setSummary).catch(() => setSummary(null));
  }, [product.id]);

  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  function handleAdd() {
    addItem(product, { color, size, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="container section">
      <p className="crumb">Home &gt; Shop &gt; {product.collection} &gt; <span>{product.name}</span></p>

      <div className="product-top">
        <div className="product-gallery">
          <div className="product-gallery__thumbs">
            {gallery.map((src) => (
              <img key={src} src={src} alt="" onClick={() => setMainImage(src)} style={{ cursor: 'pointer' }} />
            ))}
          </div>
          <div className="product-gallery__main">
            <img src={mainImage} alt={product.name} />
          </div>
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <div className="product-info__price-row">
            <span className="product-info__price">{money(product.price)}</span>
            {summary && summary.count > 0 && (
              <a className="product-info__rating" href="#reviews">
                <Stars value={summary.average} /> ({summary.count} {summary.count === 1 ? 'review' : 'reviews'})
              </a>
            )}
            {soldOut && <span className="product-info__rating">Sold out</span>}
          </div>
          {product.description && <p className="product-info__desc">{product.description}</p>}

          {colors.length > 0 && <div className="product-option">
            <span className="product-option__label">Colour: {color}</span>
            <div className="swatches">
              {colors.map((c) => (
                <button
                  key={c.name}
                  className={"swatch" + (color === c.name ? ' is-active' : '')}
                  style={{ backgroundColor: c.hex }}
                  aria-label={c.name}
                  onClick={() => setColor(c.name)}
                />
              ))}
            </div>
          </div>}

          {sizes.length > 0 && <div className="product-option">
            <span className="product-option__label">Size</span>
            <div className="size-options">
              {sizes.map((s) => (
                <button
                  key={s}
                  className={"size-btn" + (size === s ? ' is-active' : '')}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>}

          <div className="product-cta">
            <div className="qty-stepper">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">–</button>
              <span>{String(qty).padStart(2, '0')}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
            </div>
            <Button onClick={handleAdd} disabled={soldOut}>{soldOut ? 'Sold out' : added ? 'Added ✓' : 'Add to cart'}</Button>
            <HeartButton productId={product.id} className="product-cta__like" />
            <ShareButton variant="icon" url={page} title={`${product.name} | Rose Uju`} text={`${product.name} from Rose Uju`} />
          </div>
        </div>
      </div>

      <div className="product-details">
        <h2 className="product-details__label">Product details</h2>
        <div className="accordion">
          <div className={"accordion__item" + (openPanel === -1 ? ' is-open' : '')}>
            <button className="accordion__head" onClick={() => setOpenPanel(openPanel === -1 ? -2 : -1)}>
              Description <span>{openPanel === -1 ? '–' : '+'}</span>
            </button>
            {openPanel === -1 && (
              <p className="accordion__body">{product.description || 'Details for this piece are coming soon.'}</p>
            )}
          </div>
          {PANELS.map((panel, i) => (
            <div key={panel.title} className={"accordion__item" + (openPanel === i ? ' is-open' : '')}>
              <button className="accordion__head" onClick={() => setOpenPanel(openPanel === i ? -2 : i)}>
                {panel.title} <span>{openPanel === i ? '–' : '+'}</span>
              </button>
              {openPanel === i && <p className="accordion__body">{panel.title === 'Materials' ? (product.material ? `Material: ${product.material}.` : 'Material details for this piece are coming soon.') : panel.body}</p>}
            </div>
          ))}
        </div>
      </div>

      <ProductReviews productId={product.id} summary={summary} />

      <section className="product-banner">
        <img src={siteImage('product-banner')} alt="" />
        <div className="product-banner__copy">
          <h2>Made to be worn</h2>
          <p>Heritage patterns, tailored for everyday life.</p>
        </div>
      </section>

      <section className="section">
        <h2 className="related-title">You may also like</h2>
        <div className="product-grid product-grid--4">
          {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} columns={4} />)}
        </div>
      </section>
    </div>
  );
}
