import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { useCatalog } from '../context/catalogStore.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import './About.css';

export default function About() {
  usePageMeta({ title: 'Our Story', description: 'The story behind Rose Uju: Afro-Caribbean luxury translating heritage into modern elegance.' });
  const { siteImage } = useCatalog();
  return (
    <div className="about-page">
      <section className="about-hero">
        <img
          className="about-hero__bg"
          src={siteImage('about-hero')}
          alt=""
        />
        <div className="about-hero__top container">
          <p className="crumb crumb--light">Home / About</p>
          <p className="about-hero__label">About us</p>
        </div>
        <div className="about-hero__inner container">
          <img
            className="about-hero__side about-hero__side--left"
            src={siteImage('about-scarf')}
            alt="Silk scarf detail"
          />
          <div className="about-hero__center">
            <h1>We don’t make fashion.<br />We make statements.</h1>
          </div>
          <img
            className="about-hero__side about-hero__side--right"
            src={siteImage('about-jewelry')}
            alt="Gold jewellery detail"
          />
        </div>
      </section>

      <section className="container section about-craft">
        <div className="about-craft__copy">
          <h2>Our craft</h2>
          <p>
            Every Rose Uju piece starts with a pattern that has a story behind
            it. We take motifs from Afro-Caribbean heritage and rework them into
            scarves, jewellery and tailoring you can wear every day.
          </p>
        </div>
        <img
          className="about-craft__image"
          src={siteImage('about-portrait')}
          alt="Portrait in natural setting"
        />
        <p className="about-craft__copy about-craft__copy--right">
          Our made-to-order pieces are cut and finished just for you, so what
          you design in Customise is what we make. For everything else, we
          describe each piece as accurately as we can, including its colour,
          material and care.
        </p>
      </section>

      <section className="about-feel">
        <img
          src={siteImage('about-closing')}
          alt="Model in Rose Uju garment"
        />
        <div className="about-feel__card">
          <h2>Wear your heritage</h2>
          <p>Clothing and jewellery that carry Afro-Caribbean culture into everyday life.</p>
        </div>
      </section>

      <section className="container section about-cta">
        <p>Ready to see the pieces behind the story?</p>
        <Button as={Link} to="/shop">Shop the collection</Button>
      </section>
    </div>
  );
}
