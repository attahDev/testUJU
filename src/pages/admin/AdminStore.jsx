import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client.js';
import { useCatalog } from '../../context/catalogStore.js';

const FIELDS = [
  { key: 'business_name', label: 'Business name', hint: 'Used across the legal pages and the footer.', placeholder: 'Rose Uju' },
  { key: 'support_email', label: 'Support email', hint: 'Customers use this to reach you. Shown in the footer and legal pages.', placeholder: 'hello@yourdomain.com', type: 'email' },
  { key: 'support_phone', label: 'Support phone (optional)', hint: 'Leave empty if you do not want to show a phone number.', placeholder: '+44 20 7946 0000' },
  { key: 'business_address', label: 'Business address (optional)', hint: 'Shown in the footer and Terms if you fill it in.', placeholder: '' },
  { key: 'return_days', label: 'Return window in days', hint: 'For ready-made items. Enter 0 if you do not accept change-of-mind returns.', placeholder: '14', type: 'number' },
  { key: 'processing_days', label: 'Preparation time (optional)', hint: 'For example "2 to 3 working days".', placeholder: '2 to 3 working days' },
  { key: 'ships_to', label: 'Countries you ship to (optional)', hint: 'For example "the UK, Nigeria and the EU".', placeholder: 'the UK and Nigeria' },
  { key: 'governing_law', label: 'Governing law (optional)', hint: 'For example "England and Wales". Only shown in the Terms if you fill it in. Ask a lawyer what to put here.', placeholder: '' },
];

export default function AdminStore() {
  const { settings, refresh } = useCatalog();
  const [draft, setDraft] = useState(settings);
  const [state, setState] = useState({ busy: false, saved: false, error: '' });

  function set(key, value) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setState((prev) => ({ ...prev, saved: false }));
  }

  async function save(e) {
    e.preventDefault();
    setState({ busy: true, saved: false, error: '' });
    try {
      const body = Object.fromEntries(FIELDS.map((f) => [f.key, String(draft[f.key] ?? '').trim()]));
      body.legal_reviewed = draft.legal_reviewed;
      await api('/api/admin/site-settings', { method: 'PUT', body });
      await refresh();
      setState({ busy: false, saved: true, error: '' });
    } catch (err) {
      setState({ busy: false, saved: false, error: err.message });
    }
  }

  return (
    <form className="admin-form" onSubmit={save}>
      <h2>Store details</h2>
      <p className="site-slots__intro">
        These fill in your footer and your legal pages: <Link to="/terms" target="_blank">Terms</Link>,{' '}
        <Link to="/privacy" target="_blank">Privacy</Link> and <Link to="/returns" target="_blank">Returns &amp; Shipping</Link>.
        Anything you leave empty is left out instead of showing a placeholder.
      </p>

      {!draft.legal_reviewed && (
        <p className="admin-warning" role="note">
          <strong>Before you launch:</strong> your legal pages are templates written to match how this site works. Read all three,
          make sure they match your real policies, and ideally have a lawyer check them. Then tick the box at the bottom of this page.
        </p>
      )}

      {FIELDS.map((f) => (
        <label key={f.key}>
          {f.label}
          <input
            type={f.type || 'text'} min={f.type === 'number' ? 0 : undefined} max={f.type === 'number' ? 365 : undefined}
            value={draft[f.key] ?? ''} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)}
          />
          <small>{f.hint}</small>
        </label>
      ))}

      <label className="admin-check">
        <input type="checkbox" checked={draft.legal_reviewed === 'yes'} onChange={(e) => set('legal_reviewed', e.target.checked ? 'yes' : '')} />
        I have read the legal pages and checked they match my policies
      </label>

      {state.error && <p className="admin-error" role="alert">{state.error}</p>}
      {state.saved && <p className="admin-note" role="status">Saved. Your footer and legal pages are updated.</p>}
      <div className="admin-actions">
        <button className="admin-btn" type="submit" disabled={state.busy}>{state.busy ? 'Saving…' : 'Save details'}</button>
      </div>
    </form>
  );
}
