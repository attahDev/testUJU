import { useState } from 'react';
import { api } from '../../api/client.js';
import { useCatalog } from '../../context/catalogStore.js';
import ImageUpload from './ImageUpload.jsx';
import { useApiList } from './useApiList.js';

const EMPTY = { name: '', description: '', image_url: '', product_ids: [], position: '0', active: true };

export default function AdminLooks() {
  const looks = useApiList('/api/admin/looks');
  const products = useApiList('/api/admin/products');
  const { refresh } = useCatalog();
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(EMPTY);
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  function open(look) {
    setEditing(look ? look.id : 'new');
    setDraft(
      look
        ? { name: look.name, description: look.description, image_url: look.image_url, product_ids: look.product_ids, position: String(look.position), active: look.active }
        : EMPTY
    );
    setFormError('');
  }

  function set(name, value) {
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  function toggleProduct(id) {
    setDraft((prev) => {
      const has = prev.product_ids.includes(id);
      if (!has && prev.product_ids.length >= 6) return prev;
      return { ...prev, product_ids: has ? prev.product_ids.filter((i) => i !== id) : [...prev.product_ids, id] };
    });
  }

  async function save(e) {
    e.preventDefault();
    if (draft.product_ids.length < 2) {
      setFormError('Pick at least two products for a look.');
      return;
    }
    setBusy(true);
    setFormError('');
    const body = { ...draft, name: draft.name.trim(), position: parseInt(draft.position, 10) || 0 };
    try {
      if (editing === 'new') await api('/api/admin/looks', { method: 'POST', body });
      else await api(`/api/admin/looks/${editing}`, { method: 'PATCH', body });
      setEditing(null);
      await Promise.all([looks.reload(), refresh()]);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(look) {
    if (!window.confirm(`Delete the look "${look.name}"? The products themselves are not affected.`)) return;
    await api(`/api/admin/looks/${look.id}`, { method: 'DELETE' });
    await Promise.all([looks.reload(), refresh()]);
  }

  if (looks.error || products.error) return <p className="admin-error">{looks.error || products.error}</p>;
  if (!looks.data || !products.data) return <p>Loading…</p>;

  if (editing !== null) {
    return (
      <form className="admin-form" onSubmit={save}>
        <h2>{editing === 'new' ? 'New look' : 'Edit look'}</h2>
        <label>Name<input required value={draft.name} onChange={(e) => set('name', e.target.value)} placeholder="The Evening Wrap" /></label>
        <label>Description<textarea rows={2} maxLength={600} value={draft.description} onChange={(e) => set('description', e.target.value)} /></label>

        <div>
          <span className="admin-label">Pieces ({draft.product_ids.length}/6). Click to add in the order they should appear; the first one leads.</span>
          <div className="look-picker">
            {products.data.map((p) => {
              const order = draft.product_ids.indexOf(p.id);
              return (
                <button
                  type="button"
                  key={p.id}
                  className={`look-picker__item${order >= 0 ? ' is-on' : ''}`}
                  onClick={() => toggleProduct(p.id)}
                  aria-pressed={order >= 0}
                >
                  <img src={p.image_url} alt="" />
                  <span>{p.name}{p.active ? '' : ' (hidden)'}</span>
                  {order >= 0 && <strong className="look-picker__num">{order + 1}</strong>}
                </button>
              );
            })}
          </div>
        </div>

        <ImageUpload label="Lookbook photo (optional). Without one, the look is composed from the product images." value={draft.image_url} onChange={(url) => set('image_url', url)} />
        {draft.image_url && <button type="button" className="admin-link" onClick={() => set('image_url', '')}>Remove photo</button>}

        <div className="admin-row">
          <label>Order (lower shows first)<input type="number" value={draft.position} onChange={(e) => set('position', e.target.value)} /></label>
        </div>
        <label className="admin-check"><input type="checkbox" checked={draft.active} onChange={(e) => set('active', e.target.checked)} /> Visible on the storefront</label>
        {formError && <p className="admin-error" role="alert">{formError}</p>}
        <div className="admin-actions">
          <button className="admin-btn" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save look'}</button>
          <button className="admin-btn admin-btn--ghost" type="button" onClick={() => setEditing(null)}>Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="admin-bar">
        <h2>Looks ({looks.data.length})</h2>
        <button className="admin-btn" onClick={() => open(null)}>New look</button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th></th><th>Name</th><th>Pieces</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {looks.data.map((l) => (
              <tr key={l.id}>
                <td><img className="admin-thumb" src={l.image_url || l.products[0]?.image_url} alt="" /></td>
                <td>{l.name}</td>
                <td>{l.products.map((p) => p.name).join(', ')}</td>
                <td>{l.active ? 'Visible' : 'Hidden'}</td>
                <td className="admin-table__actions">
                  <button className="admin-link" onClick={() => open(l)}>Edit</button>
                  <button className="admin-link" onClick={() => remove(l)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
