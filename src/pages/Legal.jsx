import { Link } from 'react-router-dom';
import { useCatalog } from '../context/catalogStore.js';
import { LEGAL_UPDATED } from '../data/storeDefaults.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import './Legal.css';

function LegalPage({ title, description, children }) {
  usePageMeta({ title, description });
  return (
    <div className="container section legal">
      <p className="eyebrow">Information</p>
      <h1>{title}</h1>
      <p className="legal__updated">Last updated {LEGAL_UPDATED}</p>
      <div className="legal__body">{children}</div>
    </div>
  );
}

function useContact() {
  const { settings } = useCatalog();
  const email = settings.support_email;
  return {
    settings,
    name: settings.business_name || 'Rose Uju',
    link: email ? <a href={`mailto:${email}`}>{email}</a> : <>the contact details on this site</>,
  };
}

export function Terms() {
  const { settings, name, link } = useContact();
  return (
    <LegalPage title="Terms & Conditions" description="The terms that apply when you use the Rose Uju website and place an order.">
      <p>
        These terms apply when you use this website and buy from {name}. By placing an order you agree to them. Please read
        them alongside our <Link to="/returns">Returns &amp; Shipping</Link> and <Link to="/privacy">Privacy</Link> pages.
      </p>

      <h2>About us</h2>
      <p>
        This website is run by {name}.
        {settings.business_address && <> Our address is {settings.business_address}.</>} You can reach us at {link}
        {settings.support_phone && <> or on {settings.support_phone}</>}.
      </p>

      <h2>Your account</h2>
      <p>
        You need an account to place an order, so that we can keep your order history and contact you about your delivery.
        Please keep your details accurate and your password private. You are responsible for activity on your account.
      </p>

      <h2>Products and prices</h2>
      <p>
        Prices are shown in the currency displayed at checkout. We take care to describe our products accurately, but colours
        can look different on different screens. If we spot a pricing or stock error, we may correct it and will contact you
        before going ahead with an affected order.
      </p>

      <h2>Placing an order and paying</h2>
      <p>
        When you place an order you are making an offer to buy. We accept it once your payment has gone through and we send
        you an order confirmation email. Payments are handled securely by Stripe. We never see or store your full card details.
      </p>

      <h2>Customised items</h2>
      <p>
        Items you customise are made to order for you. The realistic preview shown in our Customise tool is an AI-generated
        illustration to help you imagine the result. Your finished piece may differ slightly in fine detail, colour and
        texture. Text is made exactly as you type it, so please check spelling before you order.
      </p>

      <h2>Delivery, returns and refunds</h2>
      <p>
        Delivery options, timings and costs, and how returns and refunds work, are set out on
        our <Link to="/returns">Returns &amp; Shipping</Link> page, which forms part of these terms.
      </p>

      <h2>Our content</h2>
      <p>
        The photographs, text, designs and logos on this site belong to {name} or are used with permission. Please do not
        copy or reuse them without asking us first.
      </p>

      <h2>Our responsibility to you</h2>
      <p>
        We do not exclude or limit our liability where the law does not allow us to, including for death or personal injury
        caused by our negligence, for fraud, or for your legal rights as a consumer. Otherwise, we are not responsible for
        losses that were not a reasonably foreseeable result of us breaking these terms, or for delays caused by events
        outside our reasonable control.
      </p>

      <h2>Changes to these terms</h2>
      <p>We may update these terms from time to time. The version that applies to your order is the one on this page when you placed it.</p>

      {settings.governing_law && (
        <>
          <h2>Governing law</h2>
          <p>These terms are governed by the law of {settings.governing_law}.</p>
        </>
      )}

      <h2>Questions</h2>
      <p>If anything here is unclear, contact us at {link} and we will be glad to help.</p>
    </LegalPage>
  );
}

export function Privacy() {
  const { settings, name, link } = useContact();
  return (
    <LegalPage title="Privacy Policy" description="What personal information Rose Uju collects, why, who it is shared with, and your choices.">
      <p>
        {name} respects your privacy. This page explains what personal information we collect on this website, why, who we
        share it with, and the choices you have.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Your account:</strong> your name, email address and a password (stored in scrambled form, never as plain text).</li>
        <li><strong>Your orders:</strong> your name, email, phone number, delivery address and what you bought.</li>
        <li><strong>Things you save or write:</strong> your wishlist, product reviews and journal comments, and your email if you join our newsletter.</li>
        <li><strong>Your designs:</strong> the pattern, colour, text and finish you choose in the Customise tool.</li>
        <li><strong>Technical details:</strong> basic information such as your IP address, used to keep the site secure and prevent misuse.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To take payment, make and deliver your order, and email you about it (confirmation, shipping and delivery updates).</li>
        <li>To run your account and help you if something goes wrong.</li>
        <li>To keep the site secure and prevent fraud and abuse.</li>
        <li>To send our newsletter, only if you subscribed. You can ask us to stop at any time.</li>
      </ul>

      <h2>AI previews</h2>
      <p>
        When you ask for a realistic preview in the Customise tool, the choices you made (product type, pattern, colour,
        text and finish) are sent to Google&apos;s Gemini service to create the picture. We do not send your name, contact
        details or any photo of you, and we do not keep the generated images.
      </p>

      <h2>Who we share it with</h2>
      <ul>
        <li><strong>Stripe</strong>, which processes your payment.</li>
        <li><strong>Delivery carriers</strong>, who need your name, address and phone number to deliver your parcel.</li>
        <li><strong>Our email delivery provider</strong>, to send you messages about your order and account.</li>
        <li><strong>Google</strong>, for AI previews as described above.</li>
        <li><strong>Our hosting and storage providers</strong>, who store the site&apos;s data on our behalf.</li>
        <li>Authorities or professional advisers where the law requires it.</li>
      </ul>
      <p>We do not sell your personal information. Some of these providers may process data outside your country.</p>

      <h2>Cookies and similar storage</h2>
      <p>
        We do not use advertising or tracking cookies. Your browser&apos;s storage is used only to make the site work: keeping you
        signed in, remembering your bag, your wishlist and your Customise draft. If we ever add analytics, we will update this page first.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep order records for as long as we need them for legal, tax and accounting purposes, and keep your account until you ask
        us to delete it.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to see the personal information we hold about you, to correct it, to delete it, or to object to how we use it,
        and you can withdraw your consent to our newsletter at any time. Contact us at {link}
        {settings.support_phone && <> or on {settings.support_phone}</>} and we will respond as quickly as we can. If you are
        unhappy with how we handle your information, you also have the right to complain to your local data protection authority.
      </p>

      <h2>Changes</h2>
      <p>We may update this policy as the site changes. The date at the top shows when it was last updated.</p>
    </LegalPage>
  );
}

export function Returns() {
  const { settings, name, link } = useContact();
  const { config, money } = useCatalog();
  const days = settings.return_days;
  return (
    <LegalPage title="Returns & Shipping" description="Shipping options and costs, how returns and refunds work, and how to track your Rose Uju order.">
      <h2>Shipping</h2>
      {config?.shipping?.length > 0 && (
        <div className="legal__table-wrap">
          <table className="legal__table">
            <thead><tr><th>Option</th><th>Estimated time</th><th>Cost</th></tr></thead>
            <tbody>
              {config.shipping.map((s) => (
                <tr key={s.id}><td>{s.label}</td><td>{s.detail}</td><td>{money(s.price)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ul>
        {settings.ships_to && <li>We currently ship to: {settings.ships_to}.</li>}
        {settings.processing_days && <li>Orders are usually prepared within {settings.processing_days} before they ship.</li>}
        <li>Customised items are made to order, so they can take longer to prepare than ready-made pieces.</li>
        <li>
          When your order ships we email you, with tracking details where the carrier provides them. You can also check
          progress any time with <Link to="/track-order">Find my order</Link>.
        </li>
        <li>International orders may be subject to import duties or taxes charged by the destination country. These are not included in our prices.</li>
      </ul>

      <h2>Returns</h2>
      {days && days !== '0' ? (
        <p>
          If you change your mind, you can return ready-made items within <strong>{days} days</strong> of receiving them, as long
          as they are unworn, unused and in their original condition and packaging.
        </p>
      ) : (
        <p>Please contact us if there is a problem with your order and we will do our best to help.</p>
      )}
      <p>
        To start a return, contact us at {link}
        {settings.support_phone && <> or on {settings.support_phone}</>} with your order number. Please do not send anything back
        before we have confirmed where to send it.
      </p>

      <h2>Customised items</h2>
      <p>
        Because customised items are made specially for you, we can only accept them back if they are faulty or not as described.
        Your choices, including any text, are made exactly as you entered them, so please check them carefully before you order.
      </p>

      <h2>Faulty or incorrect items</h2>
      <p>
        If something arrives damaged, faulty or not what you ordered, please tell us as soon as you can, with your order number and a
        photograph, and we will put it right with a replacement or a refund.
      </p>

      <h2>Refunds</h2>
      <p>
        Once we have received and checked a returned item, we refund you to the payment method you used. Depending on your bank,
        it can take several working days to appear in your account.
      </p>

      <h2>Cancelling an order</h2>
      <p>
        If you need to cancel, contact {name} as soon as possible. We can usually cancel an order that has not shipped yet.
      </p>
    </LegalPage>
  );
}
