import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { formatDate } from '../api/mappers.js';
import Button from '../components/Button.jsx';
import { useAuth } from '../context/authStore.js';
import { useCatalog } from '../context/catalogStore.js';
import './Account.css';
import './OrderConfirmation.css';
import './TrackOrder.css';

const STEPS = ['Confirmed', 'Shipped', 'Delivered'];
const STEP_OF = { paid: 0, shipped: 1, delivered: 2 };

const HEADLINE = {
  pending: 'We have not received payment yet',
  paid: 'Confirmed, and being prepared',
  shipped: 'On its way to you',
  delivered: 'Delivered',
  cancelled: 'This order was cancelled',
  refunded: 'This order was refunded',
};

function Progress({ status }) {
  const current = STEP_OF[status];
  if (current === undefined) return null;
  return (
    <ol className="track-steps" aria-label="Order progress">
      {STEPS.map((label, i) => (
        <li key={label} className={i < current ? 'is-done' : i === current ? 'is-current' : ''} aria-current={i === current ? 'step' : undefined}>
          <span className="track-steps__dot" aria-hidden="true" />
          {label}
        </li>
      ))}
    </ol>
  );
}

function Result({ order }) {
  const { moneyPence: money } = useCatalog();
  return (
    <div className="track-result">
      <p className="eyebrow">Order {order.id}</p>
      <h2>{HEADLINE[order.status] || order.status}</h2>
      <p className="order-page__lead">
        Placed on {formatDate(order.created_at)} for {order.name}
        {order.destination && <>, delivering to {order.destination}</>}.
        {order.status === 'pending' && <> If you were charged, please get in touch and quote this order number.</>}
        {order.status === 'refunded' && order.refunded_pence > 0 && <> {money(order.refunded_pence)} was returned to your original payment method.</>}
      </p>

      <Progress status={order.status} />

      <div className="order-page__grid">
        <div className="order-page__items">
          {order.items.map((item) => (
            <div key={item.id} className="order-page__item">
              <img src={item.image_url} alt={item.name} />
              <div>
                <p className="order-page__name">{item.name}</p>
                <p className="order-page__meta">{[item.color, item.size].filter(Boolean).join(' / ')} · Qty {item.qty}</p>
              </div>
              <strong>{money(item.unit_pence * item.qty)}</strong>
            </div>
          ))}
        </div>
        <aside className="order-page__side">
          <h3>Summary</h3>
          <div className="order-page__totals" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
            <div><span>Subtotal</span><span>{money(order.subtotal_pence)}</span></div>
            <div><span>Shipping</span><span>{money(order.shipping_pence)}</span></div>
            <div className="order-page__grand"><span>Total</span><span>{money(order.total_pence)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function TrackOrder() {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const [orderId, setOrderId] = useState(params.get('order') || '');
  const [email, setEmail] = useState(user?.email || '');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setOrder(null);
    try {
      setOrder(await api('/api/orders/lookup', { method: 'POST', auth: false, body: { order_id: orderId.trim(), email: email.trim() } }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container section account-page track-page">
      <p className="eyebrow">Orders</p>
      <h1>Find my order</h1>
      <p className="account-page__lead">
        Enter your order number and the email you ordered with to see where your order is. No account needed.
      </p>

      <form className="account-form track-form" onSubmit={submit}>
        <input
          required
          placeholder="Order number, e.g. RU-AB12CD34"
          aria-label="Order number"
          autoCapitalize="characters"
          autoComplete="off"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <input
          required
          type="email"
          placeholder="Email used for the order"
          aria-label="Email used for the order"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <span className="account-form__error" role="alert">{error}</span>}
        <Button type="submit" variant="dark" disabled={busy}>{busy ? 'Looking…' : 'Find my order'}</Button>
      </form>

      <p className="track-page__alt">
        Have an account? <Link to="/account">Sign in</Link> to see all your orders in one place.
      </p>

      {order && <Result order={order} />}
    </div>
  );
}
