import { Link } from 'react-router-dom';
import LookCard from '../components/LookCard.jsx';
import { useCatalog } from '../context/catalogStore.js';
import './Looks.css';

export default function Looks() {
  const { looks } = useCatalog();
  return (
    <div className="container section looks-page">
      <p className="eyebrow">Styled by Rose Uju</p>
      <h1>Shop the Look</h1>
      <p className="looks-page__lead">
        Complete outfits, put together the way we would wear them. Take the whole look in one tap, or choose only the pieces you love.
      </p>
      {looks.length === 0 ? (
        <p className="cart-empty">New looks are on their way. <Link to="/shop">Browse the shop</Link> in the meantime.</p>
      ) : (
        <div className="looks-page__list">
          {looks.map((look) => <LookCard key={look.id} look={look} />)}
        </div>
      )}
    </div>
  );
}
