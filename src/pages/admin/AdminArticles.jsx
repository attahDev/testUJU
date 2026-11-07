import { useState } from 'react';
import { api } from '../../api/client.js';
import { useCatalog } from '../../context/catalogStore.js';
import ImageUpload from './ImageUpload.jsx';
import { useApiList } from './useApiList.js';

const EMPTY = { title: '', tag: 'Fashion', author: 'Rose Uju', excerpt: '', body: '', image_url: '', read_time: '5 min read', published: true };

export default function AdminArticles() {
  const { data, error, reload } = useApiList('/api/admin/articles');
  const { refresh } = useCatalog();
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(EMPTY);
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  function open(article) {
    setEditing(article ? article.id : 'new');
    setDraft(
      article
        ? { title: article.title, tag: article.tag, author: article.author, excerpt: article.excerpt, body: article.body, image_url: article.image_url, read_time: article.read_time, published: article.published }
        : EMPTY
    );
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
      if (editing === 'new') await api('/api/admin/articles', { method: 'POST', body: draft });
      else await api(`/api/admin/articles/${editing}`, { method: 'PATCH', body: draft });
      setEditing(null);
      await Promise.all([reload(), refresh()]);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(article) {
    if (!window.confirm(`Delete "${article.title}"? This also deletes its comments.`)) return;
    await api(`/api/admin/articles/${article.id}`, { method: 'DELETE' });
    await Promise.all([reload(), refresh()]);
  }

  if (error) return <p className="admin-error">{error}</p>;
  if (!data) return <p>Loading…</p>;

  if (editing !== null) {
    return (
      <form className="admin-form" onSubmit={save}>
        <h2>{editing === 'new' ? 'New article' : 'Edit article'}</h2>
        <label>Title<input required value={draft.title} onChange={(e) => set('title', e.target.value)} /></label>
        <div className="admin-row">
          <label>Tag<input required value={draft.tag} onChange={(e) => set('tag', e.target.value)} /></label>
          <label>Author<input required value={draft.author} onChange={(e) => set('author', e.target.value)} /></label>
          <label>Read time<input value={draft.read_time} onChange={(e) => set('read_time', e.target.value)} /></label>
        </div>
        <label>Excerpt<textarea rows={2} value={draft.excerpt} onChange={(e) => set('excerpt', e.target.value)} /></label>
        <label>Body (blank line between paragraphs)<textarea rows={12} value={draft.body} onChange={(e) => set('body', e.target.value)} /></label>
        <ImageUpload label="Cover image" value={draft.image_url} onChange={(url) => set('image_url', url)} />
        <label className="admin-check"><input type="checkbox" checked={draft.published} onChange={(e) => set('published', e.target.checked)} /> Published</label>
        {formError && <p className="admin-error" role="alert">{formError}</p>}
        <div className="admin-actions">
          <button className="admin-btn" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save article'}</button>
          <button className="admin-btn admin-btn--ghost" type="button" onClick={() => setEditing(null)}>Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="admin-bar">
        <h2>Journal ({data.length})</h2>
        <button className="admin-btn" onClick={() => open(null)}>New article</button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th></th><th>Title</th><th>Tag</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {data.map((a) => (
              <tr key={a.id}>
                <td><img className="admin-thumb" src={a.image_url} alt="" /></td>
                <td>{a.title}</td>
                <td>{a.tag}</td>
                <td>{a.published ? 'Published' : 'Draft'}</td>
                <td className="admin-table__actions">
                  <button className="admin-link" onClick={() => open(a)}>Edit</button>
                  <button className="admin-link" onClick={() => remove(a)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
