import { useState } from 'react';
import { api } from '../../api/client.js';
import { formatDate } from '../../api/mappers.js';
import { useApiList } from './useApiList.js';

export default function AdminComments() {
  const [pendingOnly, setPendingOnly] = useState(true);
  const { data, error, reload } = useApiList(`/api/admin/comments${pendingOnly ? '?approved=false' : ''}`);

  async function approve(comment) {
    await api(`/api/admin/comments/${comment.id}/approve`, { method: 'POST' });
    await reload();
  }

  async function remove(comment) {
    await api(`/api/admin/comments/${comment.id}`, { method: 'DELETE' });
    await reload();
  }

  if (error) return <p className="admin-error">{error}</p>;
  if (!data) return <p>Loading…</p>;

  return (
    <div>
      <div className="admin-bar">
        <h2>Comments ({data.length})</h2>
        <label className="admin-check">
          <input type="checkbox" checked={pendingOnly} onChange={(e) => setPendingOnly(e.target.checked)} /> Awaiting approval only
        </label>
      </div>
      {data.length === 0 && <p>Nothing to review.</p>}
      {data.map((c) => (
        <div key={c.id} className="admin-comment">
          <div>
            <strong>{c.name}</strong> <small>{c.email} · {formatDate(c.created_at)} · {c.approved ? 'Approved' : 'Pending'}</small>
            <p>{c.body}</p>
          </div>
          <div className="admin-table__actions">
            {!c.approved && <button className="admin-link" onClick={() => approve(c)}>Approve</button>}
            <button className="admin-link" onClick={() => remove(c)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
