import { useState } from 'react';
import { api, uploadImage } from '../../api/client.js';
import { useCatalog } from '../../context/catalogStore.js';
import ImageUpload from './ImageUpload.jsx';
import { useApiList } from './useApiList.js';

const EMPTY = { name: '', description: '', image_url: '', ai_generated: false, product_ids: [], position: '0', active: true };
const AI_IDLE = { busy: false, saving: false, src: '', error: '' };

export default function AdminLooks() {
  const looks = useApiList('/api/admin/looks');
  const products = useApiList('/api/admin/products');
  const { refresh, config } = useCatalog();
  const [ai, setAi] = useState(AI_IDLE);
  const [aiStyle, setAiStyle] = useState('editorial');
  const [aiNote, setAiNote] = useState('');
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(EMPTY);
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  function open(look) {
    setEditing(look ? look.id : 'new');
    setDraft(
      look
        ? { name: look.name, description: look.description, image_url: look.image_url, ai_generated: look.ai_generated, product_ids: look.product_ids, position: String(look.position), active: look.active }
        : EMPTY
    );
    setFormError('');
    setAi(AI_IDLE);
  }

  async function generate() {
    setAi({ ...AI_IDLE, busy: true });
    try {
      const res = await api('/api/admin/looks/model-photo', {
        method: 'POST',
        body: { product_ids: draft.product_ids, style: aiStyle, model_note: aiNote },
      });
      setAi({ ...AI_IDLE, src: `data:${res.mime_type};base64,${res.data}` });
    } catch (err) {
      setAi({ ...AI_IDLE, error: err.message });
    }
  }

  async function useAiPhoto() {
    setAi((prev) => ({ ...prev, saving: true, error: '' }));
    try {
      const blob = await (await fetch(ai.src)).blob();
      const url = await uploadImage(new File([blob], 'look-model.png', { type: blob.type || 'image/png' }));
      setDraft((prev) => ({ ...prev, image_url: url, ai_generated: true }));
      setAi(AI_IDLE);
    } catch (err) {
      setAi((prev) => ({ ...prev, saving: false, error: err.message }));
    }
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

        <ImageUpload
          label="Lookbook photo (optional). Without one, the look is composed from the product images."
          value={draft.image_url}
          onChange={(url) => setDraft((prev) => ({ ...prev, image_url: url, ai_generated: false }))}
        />
        {draft.image_url && draft.ai_generated && <p className="admin-note">This photo is AI-generated, so the shop labels it "AI-generated image".</p>}
        {draft.image_url && (
          <button type="button" className="admin-link" onClick={() => setDraft((prev) => ({ ...prev, image_url: '', ai_generated: false }))}>Remove photo</button>
        )}

        {config.aiPreview && (
          <div className="look-ai">
            <strong>Create a model photo with AI</strong>
            <p className="look-ai__intro">
              Makes a picture of a fictional model wearing the pieces you picked above. You review it before it is used, and the shop
              labels it "AI-generated image". Always check that every piece still looks like the real product.
            </p>
            <div className="admin-row">
              <label>Style
                <select value={aiStyle} onChange={(e) => setAiStyle(e.target.value)}>
                  <option value="editorial">Outdoor editorial (golden hour)</option>
                  <option value="studio">Clean studio</option>
                  <option value="street">City street</option>
                </select>
              </label>
              <label>Describe the model (optional)
                <input value={aiNote} maxLength={120} placeholder="woman in her thirties, short natural hair" onChange={(e) => setAiNote(e.target.value)} />
              </label>
            </div>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={generate} disabled={ai.busy || ai.saving || draft.product_ids.length < 2}>
              {ai.busy ? 'Creating… (about 20 seconds)' : ai.src ? 'Try again' : 'Create model photo'}
            </button>
            {draft.product_ids.length < 2 && <small>Pick at least two pieces first.</small>}
            {ai.error && <p className="admin-error" role="alert">{ai.error}</p>}
            {ai.src && (
              <div className="look-ai__result">
                <img src={ai.src} alt="AI-generated model photo, for your review" />
                <div className="look-ai__actions">
                  <button type="button" className="admin-btn" onClick={useAiPhoto} disabled={ai.saving}>{ai.saving ? 'Saving…' : 'Use this photo'}</button>
                  <button type="button" className="admin-link" onClick={() => setAi(AI_IDLE)} disabled={ai.saving}>Discard</button>
                  <small>Remember to press Save look afterwards.</small>
                </div>
              </div>
            )}
          </div>
        )}

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
