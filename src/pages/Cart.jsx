import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/Button.jsx';
import HeartButton from '../components/HeartButton.jsx';
import { useAuth } from '../context/authStore.js';
import { useCart } from '../context/cartStore.js';
import { useCatalog } from '../context/catalogStore.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import './Cart.css';

export default function Cart() {
  usePageMeta({ title: 'Your Bag', noindex: true });
  const { items, removeItem, setQty, subtotal } = useCart();
  const { config, money, getProduct } = useCatalog();
  const { user } = useAuth();
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const shipping = items.length ? config.shipping[0].price : 0;
  const total = subtotal + shipping;

  return (
    <div className="cart-page">
      <h1>Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.length === 0 && (
            <p className="cart-empty">
              Your cart is empty. <Link to="/shop">Continue shopping</Link>.
            </p>
          )}
          <div className="cart-grid">
            {items.map((item) => {
              const hex = getProduct(item.id)?.colors?.find((c) => c.name === item.color)?.hex;
              return (
                <article key={item.key} className="cart-card">
                  <div className="cart-card__media">
                    <img src={item.image} alt={item.name} />
                    {!item.custom && <HeartButton productId={item.id} className="cart-card__like" />}
                  </div>
                  <div className="cart-card__side">
                    <button className="cart-card__remove" onClick={() => removeItem(item.key)} aria-label={`Remove ${item.name}`}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="m1 1 10 10M11 1 1 11" stroke="currentColor" strokeWidth="1.2" /></svg>
                    </button>
                    {item.size && <span className="cart-card__size">{item.size}</span>}
                    {item.color && (hex
                      ? <span className="cart-card__swatch" style={{ backgroundColor: hex }} title={item.color} />
                      : <span className="cart-card__colour">{item.color}</span>)}
                    <div className="cart-card__qty">
                      <button onClick={() => setQty(item.key, item.qty + 1)} aria-label="Increase quantity">+</button>
                      <span>{item.qty}</span>
                      <button onClick={() => setQty(item.key, item.qty - 1)} aria-label="Decrease quantity">–</button>
                    </div>
                  </div>
                  <div className="cart-card__info">
                    <p className="cart-card__collection">{item.collection}</p>
                    <p className="cart-card__row"><span>{item.name}</span><strong>{money(item.price * item.qty)}</strong></p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-summary__row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="order-summary__row"><span>Shipping</span><span>{money(shipping)}</span></div>
          <div className="order-summary__row order-summary__row--total"><span>Total (Tax incl.)</span><span>{money(total)}</span></div>

          <label className="cart-agree">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>I agree to the <Link to="/terms">Terms and Conditions</Link> and <Link to="/returns">Returns &amp; Shipping</Link></span>
          </label>

          <Button
            variant="outline"
            disabled={!agreed || !items.length}
            onClick={() => navigate('/checkout')}
            className="order-summary__continue"
          >
            {user ? 'Continue' : 'Sign in to continue'}
          </Button>
        </aside>
      </div>
    </div>
  );
}
