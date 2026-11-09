import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';

export default function JournalCard({ article, meta, delay = 0 }) {
  return (
    <Reveal as={Link} to={`/journal/${article.id}`} className="journal-card" delay={delay}>
      <span className="journal-card__media">
        <img src={article.image} alt="" loading="lazy" />
      </span>
      <span className="journal-card__meta">{meta}</span>
      <h3>{article.title}</h3>
      <p>{article.excerpt}</p>
    </Reveal>
  );
}
