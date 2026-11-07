import { useState } from 'react';
import { api } from '../../api/client.js';
import { formatDate } from '../../api/mappers.js';
import Stars from '../../components/Stars.jsx';
import { useApiList } from './useApiList.js';

export default function AdminReviews() {
  const [pendingOnly, setPendingOnly] = useState(true);
  const { data, error, reload } = useApiList(`/api/admin/reviews${pendingOnly ? '?approved=false' : ''}`);

  async function approve(review) {
    await api(`/api/admin/reviews/${review.id}/approve`, { method: 'POST' });
    await reload();
  }

  async function remove(review) {
    await api(`/api/admin/reviews/${review.id}`, { method: 'DELETE' });
    await reload();
  }

  if (error) return <p className="admin-error">{error}</p>;
  if (!data) return <p>Loading…</p>;

  return (
    <div>
      <div className="admin-bar">
        <h2>Reviews ({data.length})</h2>
        <label className="admin-check">
          <input type="checkbox" checked={pendingOnly} onChange={(e) => setPendingOnly(e.target.checked)} /> Awaiting approval only
        </label>
      </div>
      {data.length === 0 && <p>Nothing to review.</p>}
      {data.map((r) => (
        <div key={r.id} className="admin-comment">
          <div>
            <strong>{r.product_name}</strong> <Stars value={r.rating} />
            <p>{r.body}</p>
            <small>{r.name} · {r.email} · {formatDate(r.created_at)} · {r.approved ? 'Approved' : 'Pending'}</small>
          </div>
          <div className="admin-table__actions">
            {!r.approved && <button className="admin-link" onClick={() => approve(r)}>Approve</button>}
            <button className="admin-link" onClick={() => remove(r)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
