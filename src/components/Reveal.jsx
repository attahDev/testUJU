import { useInView } from '../hooks/useInView.js';
import './Reveal.css';

/** Fades and lifts its content into view the first time it scrolls on screen. */
export default function Reveal({ as: As = 'div', delay = 0, className = '', children, style, ...props }) {
  const [ref, visible] = useInView();
  return (
    <As
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ ...style, '--reveal-delay': `${delay}ms` }}
      {...props}
    >
      {children}
    </As>
  );
}
