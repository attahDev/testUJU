import { useEffect, useRef, useState } from 'react';
import './ShareButton.css';

const onTouchDevice = () => typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;

/**
 * Phones open the system share sheet (WhatsApp, Instagram, Messages and so on). Computers get a small menu
 * with WhatsApp, Facebook, X, email and copy-link.
 */
export default function ShareButton({ url, title, text = '', variant = 'text', className = '' }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const root = useRef(null);
  const link = url || window.location.href;
  const message = [text || title, link].filter(Boolean).join(' ');

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (root.current && !root.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  async function onClick() {
    if (navigator.share && onTouchDevice()) {
      try {
        await navigator.share({ title, text, url: link });
      } catch (err) {
        if (err?.name !== 'AbortError') setOpen(true); // the sheet failed to open: fall back to the menu
      }
      return;
    }
    setOpen((o) => !o);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const box = document.createElement('textarea');
      box.value = link;
      box.style.position = 'fixed';
      box.style.opacity = '0';
      document.body.appendChild(box);
      box.select();
      document.execCommand('copy');
      box.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  const encoded = encodeURIComponent(link);
  const options = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(message)}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodeURIComponent(text || title || '')}` },
    { label: 'Email', href: `mailto:?subject=${encodeURIComponent(title || '')}&body=${encodeURIComponent(message)}`, same: true },
  ];

  return (
    <span className={`share ${className}`.trim()} ref={root}>
      <button
        type="button"
        className={`share__btn share__btn--${variant}`}
        onClick={onClick}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={variant === 'icon' ? `Share ${title || 'this page'}` : undefined}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="12" cy="3.5" r="1.8" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="4" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="12" cy="12.5" r="1.8" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5.7 7.1l4.6-2.7M5.7 8.9l4.6 2.7" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        {variant === 'text' && <span>Share</span>}
      </button>
      {open && (
        <div className="share__menu" role="group" aria-label="Share options">
          {options.map((o) => (
            <a key={o.label} href={o.href} {...(o.same ? {} : { target: '_blank', rel: 'noopener noreferrer' })} onClick={() => setOpen(false)}>
              {o.label}
            </a>
          ))}
          <button type="button" onClick={copy}>{copied ? 'Link copied ✓' : 'Copy link'}</button>
        </div>
      )}
      <span className="share__status" role="status" aria-live="polite">{copied ? 'Link copied' : ''}</span>
    </span>
  );
}
