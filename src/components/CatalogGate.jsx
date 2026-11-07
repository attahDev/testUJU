import { useCatalog } from '../context/catalogStore.js';
import Button from './Button.jsx';

export default function CatalogGate({ children }) {
  const { status, refresh } = useCatalog();

  if (status === 'loading') {
    return <div className="container section" style={{ textAlign: 'center', color: 'var(--color-text-soft)' }}>Loading…</div>;
  }
  if (status === 'error') {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <h2>We could not load the store</h2>
        <p style={{ margin: '12px 0 24px', color: 'var(--color-text-soft)' }}>Please check your connection and try again.</p>
        <Button onClick={refresh}>Try again</Button>
      </div>
    );
  }
  return children;
}
