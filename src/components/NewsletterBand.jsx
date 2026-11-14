import { useState } from 'react';
import { api } from '../api/client.js';
import './NewsletterBand.css';

export default function NewsletterBand() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setError('');
    try {
      await api('/api/newsletter', { method: 'POST', auth: false, body: { email: new FormData(form).get('email') } });
      setDone(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="newsletter">
      <h2>Join the Cultivated Circle</h2>
      <p>Subscribe to receive early access to new collections, exclusive editorial content, and invitations to intimate brand events.</p>
      {done ? (
        <p className="newsletter__thanks">Thank you for joining the Cultivated Circle.</p>
      ) : (
        <form className="newsletter__form" onSubmit={submit}>
          <input type="email" name="email" placeholder="Email address" aria-label="Email address" required />
          <button type="submit">Subscribe</button>
        </form>
      )}
      {error && <p className="newsletter__error">{error}</p>}
    </section>
  );
}
