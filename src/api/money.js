const LOCALES = { GBP: 'en-GB', USD: 'en-US', EUR: 'en-IE', NGN: 'en-NG', CAD: 'en-CA', AUD: 'en-AU' };

export function makeMoney(currency) {
  const locale = LOCALES[currency] || 'en-GB';
  const whole = new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const exact = new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const money = (amount) => (Number.isInteger(amount) ? whole : exact).format(amount);
  const moneyPence = (pence) => exact.format(pence / 100);
  return { money, moneyPence };
}
