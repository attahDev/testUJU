import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <img
          className="about-hero__bg"
          src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1400&q=80"
          alt=""
        />
        <div className="about-hero__top container">
          <p className="crumb crumb--light">Home / About</p>
          <p className="about-hero__label">About Us</p>
        </div>
        <div className="about-hero__inner container">
          <img
            className="about-hero__side about-hero__side--left"
            src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&q=80"
            alt="Silk scarf detail"
          />
          <div className="about-hero__center">
            <h1>We Don't Make Fashion<br />We Make Statements</h1>
          </div>
          <img
            className="about-hero__side about-hero__side--right"
            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80"
            alt="Gold jewelry detail"
          />
        </div>
      </section>

      <section className="container section about-craft">
        <div className="about-craft__copy">
          <h2>Our Craft</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.
            Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis
            ligula consectetur, ultrices mauris.
          </p>
        </div>
        <img
          className="about-craft__image"
          src="https://images.unsplash.com/photo-1614093302611-8efc4de12407?w=800&q=80"
          alt="Portrait in natural setting"
        />
        <p className="about-craft__copy about-craft__copy--right">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.
          Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis
          ligula consectetur, ultrices mauris. Nullam quis imperdiet augue. Vestibulum
          auctor ornare leo, non suscipit magna interdum eu.
        </p>
      </section>

      <section className="about-feel">
        <img
          src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1400&q=80"
          alt="Model in Rose Uju garment"
        />
        <div className="about-feel__card">
          <h2>This is What We Feel</h2>
          <p>Wear African clothes to the world and experience greatness in the culture</p>
        </div>
      </section>

      <section className="container section about-cta">
        <p>Ready to see the pieces behind the story?</p>
        <Button as={Link} to="/shop">Shop the Collection</Button>
      </section>
    </div>
  );
}
