import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useCatalog } from '../context/catalogStore.js';
import NotFound from './NotFound.jsx';
import { usePageMeta } from '../hooks/usePageMeta.js';
import './JournalDetail.css';

const SHARE = [
  { label: 'LinkedIn', href: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, d: 'M3.5 6.2h2.7V15H3.5V6.2Zm1.35-3.7a1.55 1.55 0 1 1 0 3.1 1.55 1.55 0 0 1 0-3.1ZM8 6.2h2.6v1.2c.4-.7 1.3-1.4 2.6-1.4 2.8 0 3.3 1.8 3.3 4.2V15h-2.7v-4.3c0-1 0-2.3-1.4-2.3s-1.7 1.1-1.7 2.2V15H8V6.2Z' },
  { label: 'Facebook', href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`, d: 'M10.2 16.5v-6h2l.3-2.4h-2.3V6.6c0-.7.2-1.1 1.2-1.1h1.2V3.4c-.2 0-.9-.1-1.8-.1-1.8 0-3 1.1-3 3.1v1.7H5.8v2.4h2v6h2.4Z' },
  { label: 'Twitter', href: (u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}`, d: 'M17 5.3c-.5.2-1 .4-1.6.4.6-.3 1-.9 1.2-1.5-.5.3-1.1.5-1.8.7a2.8 2.8 0 0 0-4.800 2.500A8 8 0 0 1 4 4.500a2.800 2.800 0 0 0 .9 3.800c-.4 0-.9-.1-1.300-.4 0 1.400 1 2.500 2.200 2.800-.4.100-.8.100-1.200 0 .3 1.100 1.400 1.900 2.600 1.900A5.600 5.600 0 0 1 3 13.800 8 8 0 0 0 7.300 15c5.200 0 8-4.300 8-8v-.4c.6-.4 1.200-1 1.700-1.700Z' },
];

const IMAGE_LINE = /^https?:\/\/\S+\.(jpe?g|png|webp|avif)(\?\S*)?$/i;

export default function JournalDetail() {
  const { id } = useParams();
  const { getArticle } = useCatalog();
  const article = getArticle(id);
  if (!article) return <NotFound />;
  return <ArticleView key={article.id} article={article} />;
}

function ArticleView({ article }) {
  usePageMeta({ title: article.title, description: article.excerpt, image: article.image, type: 'article' });
  const [form, setForm] = useState({ name: '', email: '', comment: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
  const paragraphs = article.body.split(/\n{2,}/).filter(Boolean);

  useEffect(() => {
    api(`/api/articles/${article.id}/comments`, { auth: false }).then(setComments).catch(() => setComments([]));
  }, [article.id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await api(`/api/articles/${article.id}/comments`, {
        method: 'POST',
        auth: false,
        body: { name: form.name, email: form.email, body: form.comment },
      });
      setStatus('sent');
      setForm({ name: '', email: '', comment: '' });
    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  }

  return (
    <article className="journal-detail">
      <header className="journal-detail__head">
        <p className="journal-detail__tag">{article.tag}</p>
        <h1>{article.title}</h1>
        <div className="journal-detail__meta">
          <span>By {article.author}</span>
          <span>{article.date}</span>
          <span>{article.readTime}</span>
          <span className="journal-detail__share">
            {SHARE.map((n) => (
              <a
                key={n.label}
                href={n.href(encodeURIComponent(window.location.href), encodeURIComponent(article.title))}
                target="_blank"
                rel="noreferrer"
                aria-label={`Share on ${n.label}`}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d={n.d} /></svg>
              </a>
            ))}
          </span>
        </div>
      </header>

      {article.image && <img className="journal-detail__hero" src={article.image} alt="" />}

      <div className="journal-detail__content">
        <div className="journal-detail__body">
          {paragraphs.map((text, i) =>
            IMAGE_LINE.test(text.trim()) ? (
              <img key={i} className="journal-detail__inline" src={text.trim()} alt="" />
            ) : (
              <p key={i}>{text}</p>
            )
          )}
        </div>

        {comments.length > 0 && (
          <section className="journal-comments">
            <h3>Comments</h3>
            {comments.map((c) => (
              <div key={c.id} className="journal-comments__item">
                <strong>{c.name}</strong>
                <p>{c.body}</p>
              </div>
            ))}
          </section>
        )}

        <section className="journal-comment">
          <h3 className="journal-comment__heading">Leave a Comment</h3>
          <form onSubmit={handleSubmit}>
            <div className="journal-comment__row">
              <div className="journal-comment__col">
                <input
                  type="text" placeholder="Your Name*" required
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  type="email" placeholder="Your Email*" required
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <textarea
                placeholder="Your Comments*" required
                value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })}
              />
            </div>
            {error && <p className="journal-comment__error">{error}</p>}
            {status === 'sent' && <p className="journal-comment__note">Thank you. Your comment will appear once it has been approved.</p>}
            <button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Leave a Comment'}</button>
          </form>
        </section>

        <p className="journal-detail__back">
          <Link to="/journal">← Back to The Journal</Link>
        </p>
      </div>
    </article>
  );
}
