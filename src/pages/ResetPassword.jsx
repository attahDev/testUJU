import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client.js';
import Button from '../components/Button.jsx';
import './Account.css';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/api/auth/reset', { method: 'POST', auth: false, body: { token, password } });
      setDone(true);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  if (!token) {
    return (
      <div className="container section account-page account-page--narrow">
        <h1>Reset password</h1>
        <p className="account-page__lead">This link is missing its reset code. <Link to="/account">Request a new one</Link>.</p>
      </div>
    );
  }

  return (
    <div className="container section account-page account-page--narrow">
      <h1>Choose a new password</h1>
      {done ? (
        <p className="account-page__lead">Your password has been changed. <Link to="/account">Sign in</Link>.</p>
      ) : (
        <form className="account-form" onSubmit={handleSubmit}>
          <input
            type="password" placeholder="New password (8+ characters)" aria-label="New password" required minLength={8}
            autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)}
          />
          {error && <span className="account-form__error" role="alert">{error}</span>}
          <Button type="submit" variant="dark" disabled={busy}>Update password</Button>
        </form>
      )}
    </div>
  );
}
