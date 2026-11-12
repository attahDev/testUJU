import { Link } from 'react-router-dom';

// One empty-state panel for cart, wishlist, looks and orders, so they all read and look the same.
export default function EmptyState({ title, text, to, action, children }) {
  return (
    <div className="cart-empty">
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      {to && <Link to={to} className="btn btn--solid">{action}</Link>}
      {children}
    </div>
  );
}
