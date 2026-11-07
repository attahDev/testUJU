import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCatalog } from '../context/catalogStore.js';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { money } = useCatalog();
  const [liked, setLiked] = useState(false);
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card__media">
        <img src={product.image} alt={product.name} loading="lazy" />
        <button
          className={`product-card__like ${liked ? 'is-liked' : ''}`}
          aria-label="Save to wishlist"
          onClick={(e) => { e.preventDefault(); setLiked((v) => !v); }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill={liked ? 'currentColor' : 'none'}>
            <path d="M8 14s-6-3.6-6-8.2A3.6 3.6 0 0 1 8 3.6 3.6 3.6 0 0 1 14 5.8C14 10.4 8 14 8 14Z" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </button>
      </Link>
      <Link to={`/product/${product.id}`} className="product-card__info">
        <span className="product-card__name">{product.name}</span>
        <span className="product-card__price">{money(product.price)}</span>
      </Link>
    </div>
  );
}
