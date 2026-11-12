import { useState } from 'react';
import { api } from '../api/client.js';

// One newsletter sign-up used in the footer and on the Collections page, so both behave the same way.
export default function NewsletterForm({ formClass, thanksClass, errorClass, thanks = 'Thank you for joining the Cultivated Circle.' }) {
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubscribe(e) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('newsletter');
    setError('');
    setBusy(true);
    try {
      await api('/api/newsletter', { method: 'POST', auth: false, body: { email } });
      setSubscribed(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (subscribed) return <p className={thanksClass} role="status">{thanks}</p>;

  return (
    <form className={formClass} onSubmit={handleSubscribe}>
      <input type="email" name="newsletter" placeholder="Email address" aria-label="Email address" autoComplete="email" required />
      <button type="submit" disabled={busy}>{busy ? 'Subscribing…' : 'Subscribe'}</button>
      {error && <span className={errorClass} role="alert">{error}</span>}
    </form>
  );
}
