import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useCatalog } from '../context/catalogStore.js';
import NotFound from './NotFound.jsx';
import './JournalDetail.css';

const IMAGE_LINE = /^https?:\/\/\S+\.(jpe?g|png|webp|avif)(\?\S*)?$/i;

export default function JournalDetail() {
  const { id } = useParams();
  const { getArticle } = useCatalog();
  const article = getArticle(id);
  if (!article) return <NotFound />;
  return <ArticleView key={article.id} article={article} />;
}

function ArticleView({ article }) {
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

  const pageUrl = encodeURIComponent(window.location.href);
  const shareLinks = [
    { label: 'Share on LinkedIn', text: 'in', href: `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}` },
    { label: 'Share on Facebook', text: 'f', href: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}` },
    { label: 'Share on X', text: 'X', href: `https://twitter.com/intent/tweet?url=${pageUrl}&text=${encodeURIComponent(article.title)}` },
  ];

  return (
    <article className="journal-detail">
      <header className="container journal-detail__head">
        <p className="journal-detail__tag">{article.tag}</p>
        <h1>{article.title}</h1>
        <div className="journal-detail__meta">
          <span>By {article.author}</span>
          <span>{article.date}</span>
          <span>{article.readTime}</span>
          <span className="journal-detail__share">
            {shareLinks.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>{s.text}</a>
            ))}
          </span>
        </div>
      </header>

      {article.image && <img className="journal-detail__hero" src={article.image} alt="" />}

      <div className="container journal-detail__content">
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
