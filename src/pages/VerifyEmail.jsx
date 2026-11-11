import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, getToken } from '../api/client.js';
import { useAuth } from '../context/authStore.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import './Account.css';

export default function VerifyEmail() {
  usePageMeta({ title: 'Verify email', noindex: true });
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const { refreshUser } = useAuth();
  const [state, setState] = useState(token ? 'working' : 'invalid');

  useEffect(() => {
    if (!token) return;
    api('/api/auth/verify', { method: 'POST', auth: false, body: { token } })
      .then(() => {
        setState('done');
        if (getToken()) refreshUser().catch(() => {});
      })
      .catch(() => setState('invalid'));
  }, [token, refreshUser]);

  return (
    <div className="container section account-page account-page--narrow">
      <h1>Verify email</h1>
      {state === 'working' && <p className="account-page__lead">Verifying your email…</p>}
      {state === 'done' && (
        <p className="account-page__lead">Your email is verified. <Link to="/account">Go to your account</Link>.</p>
      )}
      {state === 'invalid' && (
        <p className="account-page__lead">This verification link is invalid or has expired. Sign in and request a new one from your account page.</p>
      )}
    </div>
  );
}
