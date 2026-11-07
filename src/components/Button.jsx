import './Button.css';

export default function Button({ children, variant = 'solid', as: As = 'button', ...props }) {
  return (
    <As className={`btn btn--${variant}`} {...props}>
      {children}
    </As>
  );
}
