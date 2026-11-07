import { Link } from 'react-router-dom';
import './SectionHeading.css';

export default function SectionHeading({ eyebrow, title, linkTo, linkLabel }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="section-heading__eyebrow">{eyebrow}</p>}
        <h2 className="section-heading__title">{title}</h2>
      </div>
      {linkTo && (
        <Link to={linkTo} className="section-heading__link">
          {linkLabel || 'View more'} <span>→</span>
        </Link>
      )}
    </div>
  );
}
