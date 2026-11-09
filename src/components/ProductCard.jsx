import { Link } from 'react-router-dom';
import HeartButton from './HeartButton.jsx';
import Reveal from './Reveal.jsx';
import { stagger } from '../hooks/useInView.js';
import { useCatalog } from '../context/catalogStore.js';
import './ProductCard.css';

export default function ProductCard({ product, index = 0, columns = 3 }) {
  const { money } = useCatalog();
  return (
    <Reveal className="product-card" delay={stagger(index, columns)}>
      <Link to={`/product/${product.id}`} className="product-card__media">
        <img src={product.image} alt={product.name} loading="lazy" />
        <HeartButton productId={product.id} className="product-card__like" />
      </Link>
      <Link to={`/product/${product.id}`} className="product-card__info">
        <span className="product-card__name">{product.name}</span>
        <span className="product-card__price">{money(product.price)}</span>
      </Link>
    </Reveal>
  );
}
