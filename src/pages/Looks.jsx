import LookCard from '../components/LookCard.jsx';
import { useCatalog } from '../context/catalogStore.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import EmptyState from '../components/EmptyState.jsx';
import './Looks.css';

export default function Looks() {
  usePageMeta({ title: 'Shop the Look', description: 'Complete outfits styled by Rose Uju. Take the whole look in one tap, or choose only the pieces you love.' });
  const { looks } = useCatalog();
  return (
    <div className="container section looks-page">
      <p className="eyebrow">Styled by Rose Uju</p>
      <h1>Shop the Look</h1>
      <p className="looks-page__lead">
        Complete outfits, put together the way we would wear them. Take the whole look in one tap, or choose only the pieces you love.
      </p>
      {looks.length === 0 ? (
        <EmptyState title="New looks are on their way" text="In the meantime, you can browse the pieces on their own." to="/shop" action="Browse the shop" />
      ) : (
        <div className="looks-page__list">
          {looks.map((look) => <LookCard key={look.id} look={look} />)}
        </div>
      )}
    </div>
  );
}
