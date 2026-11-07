import { Fragment, useState } from 'react';
import { api } from '../../api/client.js';
import { formatDate } from '../../api/mappers.js';
import { useCatalog } from '../../context/catalogStore.js';
import { useApiList } from './useApiList.js';

const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'];
const REFUNDABLE = ['paid', 'shipped', 'delivered'];

export default function AdminOrders() {
  const { moneyPence: money } = useCatalog();
  const [filter, setFilter] = useState('');
  const { data, error, reload } = useApiList(`/api/admin/orders${filter ? `?status=${filter}` : ''}`);
  const [open, setOpen] = useState(null);
  const [refund, setRefund] = useState({ amount: '', restock: false });
  const [refundError, setRefundError] = useState('');
  const [refunding, setRefunding] = useState(false);

  async function setStatus(order, status) {
    await api(`/api/admin/orders/${order.id}`, { method: 'PATCH', body: { status } });
    await reload();
  }

  async function submitRefund(order) {
    const remaining = order.total_pence - order.refunded_pence;
    const entered = refund.amount === '' ? remaining : Math.round(parseFloat(refund.amount) * 100);
    if (!entered || entered <= 0 || entered > remaining) {
      setRefundError(`Enter an amount up to ${money(remaining)}`);
      return;
    }
    if (!window.confirm(`Refund ${money(entered)} to ${order.email}? This cannot be undone.`)) return;
    setRefunding(true);
    setRefundError('');
    try {
      await api(`/api/admin/orders/${order.id}/refund`, {
        method: 'POST',
        body: { amount_pence: entered, restock: refund.restock },
      });
      setRefund({ amount: '', restock: false });
      await reload();
    } catch (err) {
      setRefundError(err.message);
    }
    setRefunding(false);
  }

  if (error) return <p className="admin-error">{error}</p>;
  if (!data) return <p>Loading…</p>;

  return (
    <div>
      <div className="admin-bar">
        <h2>Orders ({data.length})</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {data.length === 0 && <p>No orders yet.</p>}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {data.map((o) => (
              <Fragment key={o.id}>
                <tr>
                  <td>{o.id}</td>
                  <td>{formatDate(o.created_at)}</td>
                  <td>{o.name}<br /><small>{o.email}</small></td>
                  <td>{money(o.total_pence)}</td>
                  <td>
                    <select value={o.status} onChange={(e) => setStatus(o, e.target.value)} aria-label={`Status for ${o.id}`}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="admin-table__actions">
                    <button className="admin-link" onClick={() => { setOpen(open === o.id ? null : o.id); setRefund({ amount: '', restock: false }); setRefundError(''); }}>{open === o.id ? 'Hide' : 'Details'}</button>
                  </td>
                </tr>
                {open === o.id && (
                  <tr className="admin-table__details">
                    <td colSpan={6}>
                      <div className="admin-details">
                        <div>
                          {o.items.map((i) => (
                            <p key={i.id}>{i.qty} × {i.name} {[i.color, i.size].filter(Boolean).join(' / ')} — {money(i.unit_pence * i.qty)}</p>
                          ))}
                          <p>Shipping ({o.shipping_method}): {money(o.shipping_pence)}</p>
                          {o.refunded_pence > 0 && <p>Refunded so far: {money(o.refunded_pence)}</p>}
                          {REFUNDABLE.includes(o.status) && o.total_pence > o.refunded_pence && (
                            <div className="admin-refund">
                              <input
                                type="number" min="0" step="0.01" placeholder={`Amount (max ${money(o.total_pence - o.refunded_pence)})`}
                                aria-label="Refund amount" value={refund.amount} onChange={(e) => setRefund({ ...refund, amount: e.target.value })}
                              />
                              <label className="admin-check">
                                <input type="checkbox" checked={refund.restock} onChange={(e) => setRefund({ ...refund, restock: e.target.checked })} /> Return items to stock (full refunds)
                              </label>
                              <button className="admin-btn" disabled={refunding} onClick={() => submitRefund(o)}>
                                {refunding ? 'Refunding…' : refund.amount ? 'Refund amount' : 'Refund in full'}
                              </button>
                              {refundError && <span className="admin-error" role="alert">{refundError}</span>}
                            </div>
                          )}
                        </div>
                        <div>
                          <p>{o.name}</p>
                          <p>{o.address.line1}</p>
                          <p>{[o.address.city, o.address.region, o.address.postcode].filter(Boolean).join(', ')}</p>
                          <p>{o.address.country}</p>
                          {o.phone && <p>{o.phone}</p>}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
