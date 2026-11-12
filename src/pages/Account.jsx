import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { formatDate } from '../api/mappers.js';
import Button from '../components/Button.jsx';
import { useAuth } from '../context/authStore.js';
import { useCatalog } from '../context/catalogStore.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import EmptyState from '../components/EmptyState.jsx';
import './Account.css';

export function AuthForm({ heading, lead } = {}) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [sent, setSent] = useState(false);

  function switchMode(next) {
    setMode(next);
    setError('');
    setSent(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (mode === 'forgot') {
        await api('/api/auth/forgot', { method: 'POST', auth: false, body: { email: form.email } });
        setSent(true);
      } else if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  return (
    <div className="container section account-page account-page--narrow">
      <h1>{heading && mode !== 'forgot' ? heading : mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create account' : 'Reset password'}</h1>
      <p className="account-page__lead">
        {mode === 'login' && (lead || 'Welcome back. Sign in to see your orders.')}
        {mode === 'register' && (lead || 'Create an account to track your orders and check out faster.')}
        {mode === 'forgot' && 'Enter your email and we will send you a link to choose a new password.'}
      </p>
      <form className="account-form" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <input
            type="text" placeholder="Full name" aria-label="Full name" required autoComplete="name"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}
        <input
          type="email" placeholder="Email address" aria-label="Email address" required autoComplete="email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {mode !== 'forgot' && (
          <input
            type="password" placeholder="Password (8+ characters)" aria-label="Password" required minLength={8}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        )}
        {mode === 'register' && (
          <span className="account-form__note account-form__legal">
            By creating an account you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.
          </span>
        )}
        {error && <span className="account-form__error" role="alert">{error}</span>}
        {sent && <span className="account-form__note">If an account exists for that email, a reset link is on its way.</span>}
        <Button type="submit" variant="dark" disabled={busy}>
          {mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create account' : 'Send reset link'}
        </Button>
      </form>
      <p className="account-page__switch">
        {mode === 'login' && (
          <>
            <button type="button" onClick={() => switchMode('forgot')}>Forgot password?</button>
            {' · New to Rose Uju? '}
            <button type="button" onClick={() => switchMode('register')}>Create an account</button>
          </>
        )}
        {mode === 'register' && (
          <>Already have an account? <button type="button" onClick={() => switchMode('login')}>Sign in</button></>
        )}
        {mode === 'forgot' && <button type="button" onClick={() => switchMode('login')}>Back to sign in</button>}
      </p>
    </div>
  );
}

function Orders() {
  const { moneyPence } = useCatalog();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    api('/api/orders').then(setOrders).catch(() => setOrders([]));
  }, []);

  if (orders === null) return <p>Loading your orders…</p>;
  if (orders.length === 0) {
    return (
      <EmptyState title="No orders yet" text="Orders you place will show up here." to="/shop" action="Start shopping">
        <p className="cart-empty__note">Ordered before without an account? <Link to="/track-order">Find your order</Link></p>
      </EmptyState>
    );
  }
  return (
    <div className="account-orders">
      {orders.map((order) => (
        <Link key={order.id} to={`/order/${order.id}`} className="account-order">
          <div>
            <p className="account-order__id">{order.id}</p>
            <p className="account-order__meta">
              {formatDate(order.created_at)} · {order.items.reduce((sum, i) => sum + i.qty, 0)} items · {order.status}
            </p>
          </div>
          <div className="account-order__thumbs">
            {order.items.slice(0, 3).map((item) => (
              <img key={item.id} src={item.image_url} alt="" />
            ))}
          </div>
          <strong>{moneyPence(order.total_pence)}</strong>
        </Link>
      ))}
      <p className="account-orders__guest">
        Missing an older order placed without an account? <Link to="/track-order">Find it with its order number</Link>.
      </p>
    </div>
  );
}

function Details() {
  const { user, updateName, changePassword } = useAuth();
  const [name, setName] = useState(user.name);
  const [nameMsg, setNameMsg] = useState('');
  const [passwords, setPasswords] = useState({ current: '', next: '' });
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  async function saveName(e) {
    e.preventDefault();
    try {
      await updateName(name);
      setNameMsg('Saved');
    } catch (err) {
      setNameMsg(err.message);
    }
  }

  async function savePassword(e) {
    e.preventDefault();
    try {
      await changePassword(passwords.current, passwords.next);
      setPasswords({ current: '', next: '' });
      setPassMsg({ type: 'ok', text: 'Password updated' });
    } catch (err) {
      setPassMsg({ type: 'error', text: err.message });
    }
  }

  return (
    <div className="account-details">
      <form className="account-form" onSubmit={saveName}>
        <h3>Your details</h3>
        <input type="text" aria-label="Full name" required value={name} onChange={(e) => { setName(e.target.value); setNameMsg(''); }} />
        {nameMsg && <span className="account-form__note">{nameMsg}</span>}
        <Button type="submit" variant="outline">Save name</Button>
      </form>
      <form className="account-form" onSubmit={savePassword}>
        <h3>Change password</h3>
        <input
          type="password" placeholder="Current password" aria-label="Current password" required autoComplete="current-password"
          value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
        />
        <input
          type="password" placeholder="New password (8+ characters)" aria-label="New password" required minLength={8} autoComplete="new-password"
          value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
        />
        {passMsg.text && <span className={passMsg.type === 'error' ? 'account-form__error' : 'account-form__note'}>{passMsg.text}</span>}
        <Button type="submit" variant="outline">Update password</Button>
      </form>
    </div>
  );
}

function VerifyBanner() {
  const [status, setStatus] = useState('idle');

  async function resend() {
    setStatus('sending');
    try {
      await api('/api/auth/resend-verification', { method: 'POST' });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="account-verify" role="status">
      <p>
        Verify your email to see orders you placed before creating this account. We sent you a link when you signed up.
      </p>
      <button type="button" onClick={resend} disabled={status === 'sending' || status === 'sent'}>
        {status === 'sent' ? 'Email sent' : status === 'error' ? 'Try again' : 'Resend email'}
      </button>
    </div>
  );
}

export default function Account() {
  usePageMeta({ title: 'My Account', noindex: true });
  const { user, ready, logout } = useAuth();

  if (!ready) return <div className="container section"><p>Loading…</p></div>;
  if (!user) return <AuthForm />;

  return (
    <div className="container section account-page">
      <div className="account-page__head">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>{user.name}</h1>
          <p className="account-page__lead">{user.email}</p>
        </div>
        <div className="account-page__actions">
          {user.is_admin && <Button as={Link} to="/admin" variant="dark">Admin</Button>}
          <Button variant="outline" onClick={logout}>Sign out</Button>
        </div>
      </div>

      {!user.email_verified && <VerifyBanner />}

      <h2 className="account-page__title">Order history</h2>
      <Orders />

      <h2 className="account-page__title account-page__title--spaced">Account settings</h2>
      <Details />
    </div>
  );
}
