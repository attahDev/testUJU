import { Link } from 'react-router-dom';

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
