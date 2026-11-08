import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { useCatalog } from '../context/catalogStore.js';
import { useWishlist } from '../context/wishlistStore.js';
import './Cart.css';
import './Wishlist.css';

export default function Wishlist() {
  const { ids } = useWishlist();
  const { getProduct } = useCatalog();
  // Ids of products that no longer exist are simply skipped.
  const products = ids.map(getProduct).filter(Boolean);

  return (
    <div className="container section wishlist-page">
      <h1>Wishlist</h1>
      {products.length === 0 ? (
        <p className="cart-empty">
          Nothing saved yet. Tap the heart on any piece to keep it here. <Link to="/shop">Browse the shop</Link>.
        </p>
      ) : (
        <>
          <p className="wishlist-page__note">Saved on this device. No account needed.</p>
          <div className="wishlist-grid">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
