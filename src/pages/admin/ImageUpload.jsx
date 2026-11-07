import { useState } from 'react';
import { uploadImage } from '../../api/client.js';

export default function ImageUpload({ label, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e) {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="image-upload">
      <span className="admin-label">{label}</span>
      {value && <img src={value} alt="" />}
      <label className="admin-btn admin-btn--ghost">
        {busy ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
        <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleFile} disabled={busy} hidden />
      </label>
      {error && <span className="admin-error">{error}</span>}
    </div>
  );
}
