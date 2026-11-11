import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/Button.jsx';
import { useAuth } from '../context/authStore.js';
import { useCart } from '../context/cartStore.js';
import { useCatalog } from '../context/catalogStore.js';
import './Cart.css';

export default function Cart() {
  const { items, removeItem, setQty, subtotal } = useCart();
  const { config, money } = useCatalog();
  const { user } = useAuth();
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const shipping = items.length ? config.shipping[0].price : 0;
  const total = subtotal + shipping;

  return (
    <div className="container section cart-page">
      <h1>Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.length === 0 && (
            <p className="cart-empty">
              Your cart is empty. <Link to="/shop">Continue shopping</Link>.
            </p>
          )}
          {items.map((item) => (
            <div key={item.key} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item__info">
                <div className="cart-item__top">
                  <div>
                    <p className="cart-item__name">{item.name}</p>
                    <p className="cart-item__desc">{item.collection}</p>
                  </div>
                  <button className="cart-item__remove" onClick={() => removeItem(item.key)} aria-label="Remove item">×</button>
                </div>
                <div className="cart-item__bottom">
                  <span className="cart-item__color">{[item.color, item.size].filter(Boolean).join(' / ')}</span>
                  <div className="qty-stepper qty-stepper--small">
                    <button onClick={() => setQty(item.key, item.qty - 1)}>–</button>
                    <span>{item.qty}</span>
                    <button onClick={() => setQty(item.key, item.qty + 1)}>+</button>
                  </div>
                  <strong>{money(item.price * item.qty)}</strong>
                </div>
              </div>
            </div>
          ))}
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
            variant={agreed && items.length ? 'dark' : 'outline'}
            disabled={!agreed || !items.length}
            onClick={() => navigate('/checkout')}
            style={{ width: '100%', opacity: agreed && items.length ? 1 : 0.5 }}
          >
            {user ? 'Continue' : 'Sign in to continue'}
          </Button>
        </aside>
      </div>
    </div>
  );
}
