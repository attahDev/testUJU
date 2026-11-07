import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/authStore.js';
import { useCart } from '../context/cartStore.js';
import { useCatalog } from '../context/catalogStore.js';
import './Checkout.css';

const STEPS = ['Information', 'Shipping', 'Payment'];

function initialForm(user) {
  const [firstName = '', ...rest] = (user?.name || '').split(' ');
  return {
    email: user?.email || '',
    phone: '',
    firstName,
    lastName: rest.join(' '),
    country: 'United Kingdom',
    region: '',
    address: '',
    city: '',
    postcode: '',
  };
}

function validate(form) {
  const errors = {};
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address';
  if (!form.firstName.trim()) errors.firstName = 'Required';
  if (!form.lastName.trim()) errors.lastName = 'Required';
  if (!form.country.trim()) errors.country = 'Required';
  if (!form.address.trim()) errors.address = 'Required';
  if (!form.city.trim()) errors.city = 'Required';
  if (!form.postcode.trim()) errors.postcode = 'Required';
  return errors;
}

function toCartLine(item) {
  if (item.custom) return { custom: item.custom, qty: item.qty };
  return { product_id: item.id, qty: item.qty, color: item.color || '', size: item.size || '' };
}

export default function Checkout() {
  const { items, subtotal } = useCart();
  const { user } = useAuth();
  const { config, money } = useCatalog();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() => initialForm(user));
  const [errors, setErrors] = useState({});
  const [shippingId, setShippingId] = useState(config.shipping[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const shipping = config.shipping.find((s) => s.id === shippingId) || config.shipping[0];
  const total = subtotal + shipping.price;

  function update(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function field(name, placeholder, extra = {}) {
    return (
      <div className="field">
        <input
          name={name}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-invalid={Boolean(errors[name])}
          className={errors[name] ? 'has-error' : ''}
          value={form[name]}
          onChange={(e) => update(name, e.target.value)}
          {...extra}
        />
        {errors[name] && <span className="field__error">{errors[name]}</span>}
      </div>
    );
  }

  async function pay() {
    setSubmitting(true);
    setServerError('');
    try {
      const res = await api('/api/checkout', {
        method: 'POST',
        body: {
          items: items.map(toCartLine),
          email: form.email,
          name: `${form.firstName} ${form.lastName}`.trim(),
          phone: form.phone,
          shipping_method: shippingId,
          address: {
            line1: form.address,
            city: form.city,
            region: form.region,
            postcode: form.postcode,
            country: form.country,
          },
        },
      });
      window.location.assign(res.url);
    } catch (err) {
      setServerError(err.message);
      setSubmitting(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (step === 0) {
      const found = validate(form);
      setErrors(found);
      if (Object.keys(found).length) return;
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      pay();
    }
  }

  if (items.length === 0) {
    return (
      <div className="container section checkout-page">
        <h1>Checkout</h1>
        <p className="cart-empty">
          Your cart is empty. <Link to="/shop">Continue shopping</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="container section checkout-page">
      <button className="checkout-back" onClick={() => (step > 0 ? setStep(step - 1) : navigate(-1))} aria-label="Go back">←</button>
      <h1>Checkout</h1>

      <div className="checkout-steps">
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            disabled={i >= step}
            onClick={() => setStep(i)}
            className={i === step ? 'is-active' : i < step ? 'is-done' : ''}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          {step === 0 && (
            <>
              <h4>Contact Info</h4>
              {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
              {field('phone', 'Phone', { type: 'tel', autoComplete: 'tel' })}

              <h4>Shipping Address</h4>
              <div className="checkout-form__row">
                {field('firstName', 'First Name', { autoComplete: 'given-name' })}
                {field('lastName', 'Last Name', { autoComplete: 'family-name' })}
              </div>
              {field('country', 'Country', { autoComplete: 'country-name' })}
              {field('region', 'State / Region', { autoComplete: 'address-level1' })}
              {field('address', 'Address', { autoComplete: 'street-address' })}
              <div className="checkout-form__row">
                {field('city', 'City', { autoComplete: 'address-level2' })}
                {field('postcode', 'Postal Code', { autoComplete: 'postal-code' })}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h4>Shipping Method</h4>
              {config.shipping.map((option) => (
                <label key={option.id} className="shipping-option">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingId === option.id}
                    onChange={() => setShippingId(option.id)}
                  />
                  {option.label} — {option.detail} — {money(option.price)}
                </label>
              ))}
            </>
          )}

          {step === 2 && (
            <>
              <h4>Review &amp; Pay</h4>
              <div className="checkout-review">
                <p><strong>{form.firstName} {form.lastName}</strong></p>
                <p>{form.address}</p>
                <p>{[form.city, form.region, form.postcode].filter(Boolean).join(', ')}</p>
                <p>{form.country}</p>
                <p>{form.email}</p>
                <p>{shipping.label} — {shipping.detail}</p>
              </div>
              <p className="checkout-note">
                {config.paymentBypass
                  ? 'Test mode: no payment is taken and no card is needed. Your order will be marked as paid.'
                  : "You will be taken to Stripe's secure page to enter your card details. Rose Uju never sees or stores your card number."}
              </p>
              {serverError && <p className="field__error" role="alert">{serverError}</p>}
            </>
          )}

          <button className={`checkout-submit${step === STEPS.length - 1 ? ' is-final' : ''}`} type="submit" disabled={submitting}>
            {step < STEPS.length - 1
              ? <>{STEPS[step + 1]} <span>→</span></>
              : submitting ? (config.paymentBypass ? 'Placing order…' : 'Redirecting to Stripe…') : <>{config.paymentBypass ? 'Place order' : 'Pay'} {money(total)} <span>→</span></>}
          </button>
        </form>

        <aside className="checkout-summary">
          <div className="checkout-summary__head">
            <span>Your Order</span>
            <span className="checkout-summary__count">({items.length})</span>
          </div>
          {items.map((item) => (
            <div key={item.key} className="checkout-summary__item">
              <img src={item.image} alt={item.name} />
              <div>
                <div className="checkout-summary__item-top">
                  <span>{item.name}</span>
                  <Link to="/cart">Change</Link>
                </div>
                <p>{[item.color, item.size].filter(Boolean).join(' / ')}</p>
                <div className="checkout-summary__item-bottom">
                  <span>({item.qty})</span>
                  <strong>{money(item.price * item.qty)}</strong>
                </div>
              </div>
            </div>
          ))}
          <div className="checkout-summary__totals">
            <div><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div><span>Shipping</span>{step === 0 ? <span className="checkout-summary__pending">Calculated at next step</span> : <span>{money(shipping.price)}</span>}</div>
            <div className="checkout-summary__grand"><span>Total</span><span>{money(step === 0 ? subtotal : total)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
