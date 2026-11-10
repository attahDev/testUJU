import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/authStore.js';
import { useCart } from '../context/cartStore.js';
import { useCatalog } from '../context/catalogStore.js';
import { readJSON, writeJSON } from '../utils/storage.js';
import './Customise.css';

const STEPS = ['Choose Product', 'Choose Pattern', 'Personalize', 'Preview', 'Checkout'];
const PRODUCT_TYPES = ['Scarf', 'Phone Case', 'Apparel', 'Jewelry'];
const PATTERNS = [
  { name: 'Ankara Bloom', tag: 'Ankara', image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500&q=80' },
  { name: 'Isi Agu Weave', tag: 'Isi Agu', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80' },
  { name: 'Coastal Abstract', tag: 'Abstract', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&q=80' },
  { name: 'Sienna Fold', tag: 'Ankara', image: 'https://images.unsplash.com/photo-1614093302611-8efc4de12407?w=500&q=80' },
  { name: 'Beaded Border', tag: 'Other', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80' },
  { name: 'Knit Weave', tag: 'Other', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80' },
];
const PATTERN_TAGS = ['All', 'Ankara', 'Isi Agu', 'Abstract', 'Other'];
const FINISHES = [
  { id: 'emboss', label: 'Emboss', hint: 'Raised' },
  { id: 'deboss', label: 'Deboss', hint: 'Pressed in' },
  { id: 'foil', label: 'Foil', hint: 'Metallic' },
  { id: 'embroidery', label: 'Embroidery', hint: 'Thread' },
];
const FONTS = [
  { id: 'serif', label: 'Serif' },
  { id: 'sans', label: 'Sans' },
  { id: 'script', label: 'Script' },
];
const PLACEMENTS = [
  { id: 'center', label: 'Centre' },
  { id: 'corner', label: 'Corner' },
  { id: 'edge', label: 'Edge' },
];
const COLORS = [
  { name: 'Gold', hex: '#C89B4A' },
  { name: 'Espresso', hex: '#3A2620' },
  { name: 'Ink', hex: '#211712' },
  { name: 'Olive', hex: '#6F7A4E' },
  { name: 'Crimson', hex: '#B5342E' },
  { name: 'Indigo', hex: '#3E5C82' },
];

const DRAFT_KEY = 'rose-uju-customise-draft-v1';

function loadDraft() {
  const d = readJSON(DRAFT_KEY, {});
  return {
    step: Number.isInteger(d.step) && d.step >= 0 && d.step < STEPS.length ? d.step : 0,
    product: PRODUCT_TYPES.includes(d.product) ? d.product : 'Scarf',
    pattern: PATTERNS.find((p) => p.name === d.pattern) || PATTERNS[0],
    color: COLORS.find((c) => c.name === d.color) || COLORS[0],
    text: typeof d.text === 'string' ? d.text.slice(0, 12) : '',
    finish: FINISHES.some((f) => f.id === d.finish) ? d.finish : 'emboss',
    font: FONTS.some((f) => f.id === d.font) ? d.font : 'serif',
    placement: PLACEMENTS.some((p) => p.id === d.placement) ? d.placement : 'center',
  };
}

export default function Customise() {
  const [draft] = useState(loadDraft);
  const [step, setStep] = useState(draft.step);
  const [product, setProduct] = useState(draft.product);
  const [pattern, setPattern] = useState(draft.pattern);
  const [tag, setTag] = useState('All');
  const [color, setColor] = useState(draft.color);
  const [text, setText] = useState(draft.text);
  const [finish, setFinish] = useState(draft.finish);
  const [font, setFont] = useState(draft.font);
  const [placement, setPlacement] = useState(draft.placement);
  const [ai, setAi] = useState({ status: 'idle', src: '', signature: '', error: '' });
  const [showAi, setShowAi] = useState(true);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { config, money, siteImage } = useCatalog();

  useEffect(() => {
    writeJSON(DRAFT_KEY, { step, product, pattern: pattern.name, color: color.name, text, finish, font, placement });
  }, [step, product, pattern, color, text, finish, font, placement]);
  const visiblePatterns = tag === 'All' ? PATTERNS : PATTERNS.filter((p) => p.tag === tag);
  const marked = text.trim() !== '';
  const price = config.customBase[product] / 100 + (marked ? config.finishFee[finish] : 0);
  const finishLabel = FINISHES.find((f) => f.id === finish).label;
  const signature = [product, pattern.name, color.name, marked ? `${finish}|${font}|${placement}|${text.trim()}` : 'plain'].join('~');
  const aiFresh = ai.status === 'done' && ai.signature === signature;

  async function generatePreview() {
    const requested = signature;
    setAi({ status: 'loading', src: '', signature: '', error: '' });
    try {
      const res = await api('/api/customise/preview', {
        method: 'POST',
        body: {
          product_type: product,
          pattern: pattern.name,
          pattern_image: pattern.image,
          color: color.name,
          text: text.trim(),
          finish: marked ? finish : 'none',
          font,
          placement,
        },
      });
      setAi({ status: 'done', src: `data:${res.mime_type};base64,${res.data}`, signature: requested, error: '' });
      setShowAi(true);
    } catch (err) {
      setAi({ status: 'error', src: '', signature: '', error: err.message });
    }
  }

  function goNext() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    addItem(
      {
        id: `custom-${product}-${pattern.name}-${marked ? `${finish}-${font}-${placement}-${text.trim()}` : 'plain'}`.replace(/\s+/g, '-'),
        name: `Custom ${product} — ${pattern.name}`,
        price,
        image: pattern.image,
        collection: 'Customised',
        custom: {
          product_type: product,
          pattern: pattern.name,
          pattern_image: pattern.image,
          color: color.name,
          text: text.trim(),
          finish: marked ? finish : 'none',
          font,
          placement,
        },
      },
      { color: color.name, size: marked ? `${finishLabel}: ${text.trim()}` : 'One size' }
    );
    navigate('/checkout');
  }

  function choosePattern(p) {
    setPattern(p);
    if (step === 0) setStep(1);
  }

  return (
    <div className="customise-page">
      <section className="customise-hero">
        <img src={siteImage('customise-banner')} alt="" />
        <div className="customise-hero__content container">
          <p className="crumb">Home &gt; <span>Customize</span></p>
          <h1>Customize Your Design</h1>
        </div>
      </section>

      <div className="container customise-body">
        <div className="customise-steps">
          {STEPS.map((label, i) => (
            <div key={label} className={"customise-step" + (i === step ? ' is-active' : i < step ? ' is-done' : '')}>
              <span className="customise-step__num">{i + 1}</span>
              {label}
              {i < STEPS.length - 1 && <span className="customise-step__arrow">→</span>}
            </div>
          ))}
        </div>

        <div className="customise-layout">
          <div className="customise-products">
            <h4>Choose Product</h4>
            <div className="product-type-list">
              {PRODUCT_TYPES.map((p) => (
                <button
                  key={p}
                  className={"product-type" + (product === p ? ' is-active' : '')}
                  onClick={() => setProduct(p)}
                >
                  {p} <span>›</span>
                </button>
              ))}
            </div>
          </div>

          <div className="customise-patterns">
            <h4>Choose Pattern</h4>
            <div className="pattern-filters">
              {PATTERN_TAGS.map((t) => (
                <button key={t} className={"pattern-filter" + (tag === t ? ' is-active' : '')} onClick={() => setTag(t)}>
                  {t}
                </button>
              ))}
            </div>
            <div className="pattern-grid">
              {visiblePatterns.map((p) => (
                <button
                  key={p.name}
                  className={"pattern-tile" + (pattern.name === p.name ? ' is-active' : '')}
                  onClick={() => choosePattern(p)}
                  aria-label={p.name}
                >
                  <img src={p.image} alt={p.name} />
                </button>
              ))}
            </div>

            {step >= 2 && (
              <div className="customise-personalize">
                <h4>Personalize</h4>
                <input
                  className="personalize-input"
                  type="text"
                  maxLength={12}
                  placeholder="Your initials or name (up to 12)"
                  aria-label="Text to add"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />

                <p className="personalize-label">Finish</p>
                <div className="option-row">
                  {FINISHES.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={"option-chip" + (finish === f.id ? ' is-active' : '')}
                      onClick={() => setFinish(f.id)}
                    >
                      <strong>{f.label}</strong>
                      <span>{f.hint} · +{money(config.finishFee[f.id])}</span>
                    </button>
                  ))}
                </div>

                <p className="personalize-label">Lettering</p>
                <div className="option-row option-row--compact">
                  {FONTS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={"option-chip option-chip--font font-" + f.id + (font === f.id ? ' is-active' : '')}
                      onClick={() => setFont(f.id)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <p className="personalize-label">Placement</p>
                <div className="option-row option-row--compact">
                  {PLACEMENTS.map((pl) => (
                    <button
                      key={pl.id}
                      type="button"
                      className={"option-chip" + (placement === pl.id ? ' is-active' : '')}
                      onClick={() => setPlacement(pl.id)}
                    >
                      {pl.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="customise-preview">
            <div className="customise-preview__frame" style={{ boxShadow: `inset 0 0 0 6px ${color.hex}22` }}>
              {aiFresh && showAi ? (
                <img src={ai.src} alt={`Realistic preview of your custom ${product}`} />
              ) : (
                <img src={pattern.image} alt="Preview" />
              )}
              {marked && !(aiFresh && showAi) && (
                <span
                  className={`customise-mark mark-${finish} font-${font} place-${placement}`}
                  style={{ '--len': Math.max(text.trim().length, 3), '--thread': color.hex }}
                >
                  {text.trim()}
                </span>
              )}
            </div>

            {config.aiPreview && (
              <div className="ai-preview">
                {user ? (
                  <button type="button" className="ai-preview__btn" onClick={generatePreview} disabled={ai.status === 'loading'}>
                    {ai.status === 'loading' ? 'Creating your preview… (about 15s)' : aiFresh ? 'Regenerate realistic preview' : 'See it realistically'}
                  </button>
                ) : (
                  <Link to="/account" className="ai-preview__btn ai-preview__btn--link">Sign in to see a realistic preview</Link>
                )}
                {ai.status === 'done' && !aiFresh && <p className="ai-preview__note">You changed your design. Generate again to update the preview.</p>}
                {aiFresh && (
                  <div className="ai-preview__toggle" role="group" aria-label="Preview style">
                    <button type="button" className={showAi ? 'is-active' : ''} onClick={() => setShowAi(true)}>Realistic</button>
                    <button type="button" className={!showAi ? 'is-active' : ''} onClick={() => setShowAi(false)}>Pattern</button>
                  </div>
                )}
                {ai.status === 'error' && <p className="ai-preview__error" role="alert">{ai.error}</p>}
                <p className="ai-preview__note">AI-generated illustration. Your finished piece may differ slightly in detail.</p>
              </div>
            )}

            <h4>Colours</h4>
            <div className="colour-dots">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  className={"colour-dot" + (color.name === c.name ? ' is-active' : '')}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setColor(c)}
                  aria-label={c.name}
                />
              ))}
            </div>

            {step >= 3 && (
              <p className="customise-summary">
                {product} · {pattern.name} · {color.name}{marked ? ` · ${finishLabel} "${text.trim()}"` : ''}
              </p>
            )}
            <p className="customise-price">{product} · {money(price)}</p>

            <button className="next-steps-btn" onClick={goNext}>
              {step < STEPS.length - 1 ? 'Next Steps' : 'Add to Cart & Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
