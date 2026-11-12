import { useState } from 'react';
import { api } from '../api/client.js';
import { formatDate } from '../api/mappers.js';
import Stars from './Stars.jsx';
import './ProductReviews.css';

export default function ProductReviews({ productId, summary }) {
  const [form, setForm] = useState({ name: '', email: '', rating: 5, body: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await api(`/api/products/${productId}/reviews`, { method: 'POST', auth: false, body: form });
      setForm({ name: '', email: '', rating: 5, body: '' });
      setStatus('sent');
    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  }

  return (
    <section id="reviews" className="product-reviews">
      <h2 className="product-reviews__title">Reviews</h2>
      <div className="product-reviews__layout">
        <div>
          {summary && summary.count > 0 ? (
            <>
              <p className="product-reviews__summary">
                <Stars value={summary.average} /> {summary.average.toFixed(1)} · {summary.count} {summary.count === 1 ? 'review' : 'reviews'}
              </p>
              {summary.reviews.map((r) => (
                <div key={r.id} className="product-reviews__item">
                  <Stars value={r.rating} />
                  <p>{r.body}</p>
                  <small>{r.name} · {formatDate(r.created_at)}</small>
                </div>
              ))}
            </>
          ) : (
            <p className="product-reviews__empty">No reviews yet. Be the first to review this piece.</p>
          )}
        </div>

        <form className="product-reviews__form" onSubmit={handleSubmit}>
          <h3>Write a review</h3>
          <div className="product-reviews__rating" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={form.rating === n}
                aria-label={`${n} stars`}
                className={n <= form.rating ? 'is-on' : ''}
                onClick={() => setForm({ ...form, rating: n })}
              >
                ★
              </button>
            ))}
          </div>
          <input type="text" placeholder="Your name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="email" placeholder="Your email (not shown)" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <textarea placeholder="Your review" required rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          {error && <span className="product-reviews__error">{error}</span>}
          {status === 'sent' && <span className="product-reviews__note">Thank you. Your review will appear once it has been approved.</span>}
          <button className="product-reviews__submit" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Post review'}
          </button>
        </form>
      </div>
    </section>
  );
}
