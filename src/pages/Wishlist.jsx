import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { useCatalog } from '../context/catalogStore.js';
import { useWishlist } from '../context/wishlistStore.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import './Cart.css';
import EmptyState from '../components/EmptyState.jsx';
import './Wishlist.css';

export default function Wishlist() {
  usePageMeta({ title: 'Wishlist', noindex: true });
  const { ids, synced } = useWishlist();
  const { getProduct } = useCatalog();
  const products = ids.map(getProduct).filter(Boolean);

  return (
    <div className="container section wishlist-page">
      <h1>Wishlist</h1>
      {products.length === 0 ? (
        <EmptyState title="Nothing saved yet" text="Tap the heart on any piece to keep it here." to="/shop" action="Browse the shop" />
      ) : (
        <>
          <p className="wishlist-page__note">
            {synced ? 'Saved to your account, so it is here on every device.' : (
              <>Saved on this device. <Link to="/account">Sign in</Link> to keep it across devices.</>
            )}
          </p>
          <div className="wishlist-grid">
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} columns={4} />)}
          </div>
        </>
      )}
    </div>
  );
}
