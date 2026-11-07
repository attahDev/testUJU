import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { formatDate } from '../api/mappers.js';
import Button from '../components/Button.jsx';
import { useCart } from '../context/cartStore.js';
import { useCatalog } from '../context/catalogStore.js';
import NotFound from './NotFound.jsx';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const { clearCart } = useCart();
  const { moneyPence: money } = useCatalog();
  const [order, setOrder] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let timer;

    async function load() {
      try {
        const data = sessionId
          ? await api(`/api/orders/by-session/${sessionId}`, { auth: false })
          : await api(`/api/orders/${id}`);
        if (cancelled) return;
        setOrder(data);
        if (sessionId && data.status === 'pending' && attempts < 10) {
          attempts += 1;
          timer = setTimeout(load, 2000);
        }
      } catch {
        if (!cancelled) setMissing(true);
      }
    }

    load();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id, sessionId]);

  useEffect(() => {
    if (sessionId && order && order.status !== 'cancelled') clearCart();
  }, [sessionId, order, clearCart]);

  if (missing) return <NotFound />;
  if (!order) return <div className="container section"><p>Loading your order…</p></div>;

  const paid = order.status !== 'pending' && order.status !== 'cancelled';

  return (
    <div className="container section order-page">
      <p className="eyebrow">{paid ? 'Thank you' : 'Order received'}</p>
      <h1>
        {order.status === 'cancelled' ? 'This order was cancelled' : paid ? 'Your order is confirmed' : 'Confirming your payment…'}
      </h1>
      <p className="order-page__lead">
        Order <strong>{order.id}</strong> was placed on {formatDate(order.created_at)}.
        {paid && <> A confirmation will be sent to {order.email}.</>}
        {order.status === 'pending' && <> This can take a few seconds. You can safely refresh this page.</>}
        {order.status === 'cancelled' && <> <Link to="/cart">Return to your cart</Link> to try again.</>}
      </p>

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
          <h3>Delivery</h3>
          <p>{order.name}</p>
          <p>{order.address.line1}</p>
          <p>{[order.address.city, order.address.region, order.address.postcode].filter(Boolean).join(', ')}</p>
          <p>{order.address.country}</p>

          <div className="order-page__totals">
            <div><span>Subtotal</span><span>{money(order.subtotal_pence)}</span></div>
            <div><span>Shipping</span><span>{money(order.shipping_pence)}</span></div>
            <div className="order-page__grand"><span>Total</span><span>{money(order.total_pence)}</span></div>
          </div>
        </aside>
      </div>

      <div className="order-page__actions">
        <Button as={Link} to="/shop">Continue shopping</Button>
        <Button as={Link} to="/account" variant="outline">View my orders</Button>
      </div>
    </div>
  );
}
