import { useState } from 'react';
import { api } from '../../api/client.js';
import { useCatalog } from '../../context/catalogStore.js';
import ImageUpload from './ImageUpload.jsx';
import { useApiList } from './useApiList.js';

const EMPTY = {
  name: '',
  description: '',
  price: '',
  collection: '',
  category: '',
  material: '',
  stock: '0',
  sizes: 'XS, S, M, L, XL',
  colors: '',
  image_url: '',
  gallery: [],
  active: true,
};

function toDraft(p) {
  return {
    name: p.name,
    description: p.description,
    price: String(p.price),
    collection: p.collection,
    category: p.category,
    material: p.material,
    stock: String(p.stock),
    sizes: p.sizes.join(', '),
    colors: p.colors.map((c) => `${c.name}:${c.hex}`).join(', '),
    image_url: p.image_url,
    gallery: p.gallery,
    active: p.active,
  };
}

function toBody(d) {
  return {
    name: d.name.trim(),
    description: d.description,
    price: parseFloat(d.price) || 0,
    collection: d.collection.trim(),
    category: d.category.trim(),
    material: d.material.trim(),
    stock: parseInt(d.stock, 10) || 0,
    sizes: d.sizes.split(',').map((s) => s.trim()).filter(Boolean),
    colors: d.colors
      .split(',')
      .map((c) => c.split(':').map((t) => t.trim()))
      .filter(([name]) => name)
      .map(([name, hex]) => ({ name, hex: hex || '#999999' })),
    image_url: d.image_url,
    gallery: d.gallery,
    active: d.active,
  };
}

export default function AdminProducts() {
  const { data, error, reload } = useApiList('/api/admin/products');
  const { refresh, config, money } = useCatalog();
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(EMPTY);
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  function open(product) {
    setEditing(product ? product.id : 'new');
    setDraft(product ? toDraft(product) : EMPTY);
    setFormError('');
  }

  function set(name, value) {
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setFormError('');
    try {
      const body = toBody(draft);
      if (editing === 'new') await api('/api/admin/products', { method: 'POST', body });
      else await api(`/api/admin/products/${editing}`, { method: 'PATCH', body });
      setEditing(null);
      await Promise.all([reload(), refresh()]);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(product) {
    await api(`/api/admin/products/${product.id}`, { method: 'PATCH', body: { active: !product.active } });
    await Promise.all([reload(), refresh()]);
  }

  if (error) return <p className="admin-error">{error}</p>;
  if (!data) return <p>Loading…</p>;

  if (editing !== null) {
    return (
      <form className="admin-form" onSubmit={save}>
        <h2>{editing === 'new' ? 'New product' : 'Edit product'}</h2>
        <label>Name<input required value={draft.name} onChange={(e) => set('name', e.target.value)} /></label>
        <label>Description<textarea rows={4} value={draft.description} onChange={(e) => set('description', e.target.value)} /></label>
        <div className="admin-row">
          <label>Price ({config.currency})<input required type="number" min="0" step="0.01" value={draft.price} onChange={(e) => set('price', e.target.value)} /></label>
          <label>Stock<input required type="number" min="0" step="1" value={draft.stock} onChange={(e) => set('stock', e.target.value)} /></label>
        </div>
        <div className="admin-row">
          <label>Collection<input required list="collections" value={draft.collection} onChange={(e) => set('collection', e.target.value)} /></label>
          <label>Category<input required value={draft.category} onChange={(e) => set('category', e.target.value)} /></label>
          <label>Material<input value={draft.material} onChange={(e) => set('material', e.target.value)} /></label>
        </div>
        <datalist id="collections">
          {[...new Set(data.map((p) => p.collection))].map((c) => <option key={c} value={c} />)}
        </datalist>
        <label>Sizes (comma separated)<input value={draft.sizes} onChange={(e) => set('sizes', e.target.value)} /></label>
        <label>Colors (Name:#hex, comma separated)<input value={draft.colors} onChange={(e) => set('colors', e.target.value)} placeholder="Clay:#B5592F, Blush:#E7C2B4" /></label>
        <ImageUpload label="Main image" value={draft.image_url} onChange={(url) => set('image_url', url)} />
        <div className="admin-gallery">
          <span className="admin-label">Gallery</span>
          <div className="admin-gallery__list">
            {draft.gallery.map((url) => (
              <div key={url} className="admin-gallery__item">
                <img src={url} alt="" />
                <button type="button" onClick={() => set('gallery', draft.gallery.filter((u) => u !== url))}>Remove</button>
              </div>
            ))}
          </div>
          <ImageUpload label="Add gallery image" value="" onChange={(url) => set('gallery', [...draft.gallery, url])} />
        </div>
        <label className="admin-check"><input type="checkbox" checked={draft.active} onChange={(e) => set('active', e.target.checked)} /> Visible in the shop</label>
        {formError && <p className="admin-error" role="alert">{formError}</p>}
        <div className="admin-actions">
          <button className="admin-btn" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save product'}</button>
          <button className="admin-btn admin-btn--ghost" type="button" onClick={() => setEditing(null)}>Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="admin-bar">
        <h2>Products ({data.length})</h2>
        <button className="admin-btn" onClick={() => open(null)}>New product</button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th></th><th>Name</th><th>Collection</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id}>
                <td><img className="admin-thumb" src={p.image_url} alt="" /></td>
                <td>{p.name}</td>
                <td>{p.collection}</td>
                <td>{money(p.price)}</td>
                <td>{p.stock}</td>
                <td>{p.active ? 'Visible' : 'Archived'}</td>
                <td className="admin-table__actions">
                  <button className="admin-link" onClick={() => open(p)}>Edit</button>
                  <button className="admin-link" onClick={() => toggleActive(p)}>{p.active ? 'Archive' : 'Restore'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
