import { Link, useParams } from 'react-router-dom';
import LookCard from '../components/LookCard.jsx';
import { useCatalog } from '../context/catalogStore.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import NotFound from './NotFound.jsx';
import './Looks.css';

export default function LookDetail() {
  const { slug } = useParams();
  const { looks } = useCatalog();
  const look = looks.find((l) => l.slug === slug);
  if (!look) return <NotFound />;
  return <LookView key={look.slug} look={look} />;
}

function LookView({ look }) {
  usePageMeta({
    title: look.name,
    description: look.description || `Shop the full look: ${look.products.map((p) => p.name).join(', ')}.`,
    image: look.image || look.products[0]?.image,
  });
  return (
    <div className="container section looks-page">
      <p className="looks-page__back"><Link to="/looks">← All looks</Link></p>
      <LookCard look={look} />
    </div>
  );
}
