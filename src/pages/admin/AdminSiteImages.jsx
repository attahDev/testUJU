import { useState } from 'react';
import { api, uploadImage } from '../../api/client.js';
import { useCatalog } from '../../context/catalogStore.js';
import { SITE_IMAGES, SITE_IMAGE_GROUPS } from '../../data/siteImages.js';

function Slot({ slot }) {
  const { siteImages, siteImage, refresh } = useCatalog();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const custom = Boolean(siteImages[slot.key]);

  async function upload(e) {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const url = await uploadImage(file);
      await api(`/api/admin/site-images/${slot.key}`, { method: 'PUT', body: { url } });
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    setBusy(true);
    setError('');
    try {
      await api(`/api/admin/site-images/${slot.key}`, { method: 'DELETE' });
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="site-slot">
      <img src={siteImage(slot.key)} alt="" />
      <div className="site-slot__body">
        <strong>{slot.label}</strong>
        <span className={`site-slot__state${custom ? ' is-custom' : ''}`}>{custom ? 'Your photo' : 'Placeholder photo'}</span>
        <small>{slot.hint}</small>
        <div className="site-slot__actions">
          <label className="admin-btn admin-btn--ghost">
            {busy ? 'Working…' : custom ? 'Replace photo' : 'Upload photo'}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} disabled={busy} hidden />
          </label>
          {custom && <button type="button" className="admin-link" onClick={reset} disabled={busy}>Use the original</button>}
        </div>
        {error && <span className="admin-error" role="alert">{error}</span>}
      </div>
    </div>
  );
}

export default function AdminSiteImages() {
  return (
    <div>
      <div className="admin-bar"><h2>Site images</h2></div>
      <p className="site-slots__intro">
        Replace the pictures built into the storefront with your own photography. Large camera photos are
        resized automatically, so you can upload them straight from your camera or phone. Product, Journal and Look
        photos are edited in their own tabs.
      </p>
      {SITE_IMAGE_GROUPS.map((group) => (
        <section key={group} className="site-slots__group">
          <h3>{group}</h3>
          <div className="site-slots__grid">
            {SITE_IMAGES.filter((s) => s.group === group).map((slot) => <Slot key={slot.key} slot={slot} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
