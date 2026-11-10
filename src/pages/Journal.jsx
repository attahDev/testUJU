import JournalCard from '../components/JournalCard.jsx';
import { stagger } from '../hooks/useInView.js';
import { Link } from 'react-router-dom';
import { useCatalog } from '../context/catalogStore.js';
import './Journal.css';

export default function Journal() {
  const { articles: ARTICLES, siteImage } = useCatalog();
  const [hero] = ARTICLES;
  const featured3 = ARTICLES.slice(0, 3);
  const grid3 = ARTICLES.slice(3);

  if (ARTICLES.length < 3) {
    return (
      <div className="container section">
        <h1 className="journal-page__title">The Journal</h1>
        {ARTICLES.length === 0 && <p>New stories are coming soon.</p>}
        <div className="journal-grid">
          {ARTICLES.map((a, i) => (
            <JournalCard key={a.id} article={a} meta={`${a.tag.toUpperCase()} • ${a.readTime}`} delay={stagger(i)} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="journal-page">
      <section className="journal-hero">
        <img src={hero.image} alt="" />
        <div className="journal-hero__content container">
          <h1>{hero.title}</h1>
        </div>
      </section>

      <section className="container section">
        <p className="eyebrow">Fashion</p>
        <h2 className="journal-page__title">Top Fashion Stories</h2>

        <div className="journal-feature-grid">
          <Link to={`/journal/${featured3[0].id}`} className="journal-feature journal-feature--tall">
            <img src={featured3[0].image} alt="" />
            <div className="journal-feature__caption">
              <span>{featured3[0].date} ISSUE</span>
              <h3>{featured3[0].title}</h3>
              <p>By {featured3[0].author}</p>
            </div>
          </Link>
          <div className="journal-feature-stack">
            <Link to={`/journal/${featured3[1].id}`} className="journal-feature">
              <img src={featured3[1].image} alt="" />
              <div className="journal-feature__caption journal-feature__caption--light">
                <span>{featured3[1].date} ISSUE</span>
                <h3>{featured3[1].title}</h3>
                <p>By {featured3[1].author}</p>
              </div>
            </Link>
            <img className="journal-feature-stack__deco" src={siteImage('journal-deco')} alt="" />
          </div>
          <Link to={`/journal/${featured3[2].id}`} className="journal-feature journal-feature--tall">
            <img src={featured3[2].image} alt="" />
            <div className="journal-feature__caption">
              <span>{featured3[2].date} ISSUE</span>
              <h3>{featured3[2].title}</h3>
              <p>By {featured3[2].author}</p>
            </div>
          </Link>
        </div>
      </section>

      {grid3.length > 0 && <section className="container section">
        <div className="journal-page__divider">
          <p className="eyebrow">Fashion</p>
          <hr />
        </div>
        <div className="journal-grid">
          {grid3.map((a, i) => (
            <JournalCard key={a.id} article={a} meta={`${a.tag.toUpperCase()} • ${a.readTime}`} delay={stagger(i)} />
          ))}
        </div>
      </section>}
    </div>
  );
}
