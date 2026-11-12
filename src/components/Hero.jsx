import { Link } from 'react-router-dom';
import Button from './Button.jsx';
import { useCatalog } from '../context/catalogStore.js';
import './Hero.css';

export default function Hero() {
  const { siteImage } = useCatalog();

  return (
    <section className="hero">
      <div className="hero__stage">
        <h1 className="hero__title" aria-label="Cultivated Beauty, Worn Well">
          <span className="hero__line hero__line--back" aria-hidden="true"><span>Cultivated</span></span>
          <span className="hero__line hero__line--front" aria-hidden="true"><span>Beauty, Worn Well</span></span>
        </h1>
        <div className="hero__arch">
          <img src={siteImage('hero')} alt="Model wearing a Rose Uju silk wrap" fetchpriority="high" />
        </div>
      </div>

      <div className="hero__foot container">
        <p>Afro-Caribbean luxury translating heritage into modern elegance.</p>
        <div className="hero__actions">
          <Button as={Link} to="/shop">Shop the collection</Button>
          <Button as={Link} to="/about" variant="outline">Our story</Button>
        </div>
      </div>
    </section>
  );
}
