import Button from '../components/Button.jsx';
import { usePageMeta } from '../hooks/usePageMeta.js';
import './NotFound.css';

export default function NotFound() {
  usePageMeta({ title: 'Page not found', noindex: true });
  return (
    <div className="container section not-found">
      <p className="eyebrow">404</p>
      <h1>This page has wandered off</h1>
      <p>The page you are looking for does not exist or has moved.</p>
      <div className="not-found__actions">
        <Button as="a" href="/shop">Continue shopping</Button>
        <Button as="a" href="/" variant="outline">Back home</Button>
      </div>
    </div>
  );
}
