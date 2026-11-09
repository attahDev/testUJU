import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authStore.js';
import AdminArticles from './AdminArticles.jsx';
import AdminComments from './AdminComments.jsx';
import AdminLooks from './AdminLooks.jsx';
import AdminOrders from './AdminOrders.jsx';
import AdminProducts from './AdminProducts.jsx';
import AdminReviews from './AdminReviews.jsx';
import './Admin.css';

const TABS = [
  { id: 'products', label: 'Products', View: AdminProducts },
  { id: 'looks', label: 'Looks', View: AdminLooks },
  { id: 'journal', label: 'Journal', View: AdminArticles },
  { id: 'orders', label: 'Orders', View: AdminOrders },
  { id: 'comments', label: 'Comments', View: AdminComments },
  { id: 'reviews', label: 'Reviews', View: AdminReviews },
];

export default function Admin() {
  const { user, ready } = useAuth();
  const [tab, setTab] = useState('products');

  if (!ready) return <div className="container section"><p>Loading…</p></div>;
  if (!user || !user.is_admin) {
    return (
      <div className="container section admin-denied">
        <h1>Admin</h1>
        <p>{user ? 'This account does not have admin access.' : 'Sign in with an admin account to continue.'}</p>
        <p><Link to="/account">Go to account</Link></p>
      </div>
    );
  }

  const { View } = TABS.find((t) => t.id === tab);

  return (
    <div className="container section admin">
      <h1>Admin</h1>
      <div className="admin-tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'is-active' : ''} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <View key={tab} />
    </div>
  );
}
