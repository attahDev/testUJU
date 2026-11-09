import { formatDate } from '../api/mappers.js';
import './TrackingInfo.css';

/** Carrier, number and a link to the carrier's own tracking page. Renders nothing until the order has tracking. */
export default function TrackingInfo({ order }) {
  if (!order.tracking_number) return null;
  const carrier = order.carrier && order.carrier !== 'Other' ? order.carrier : '';
  return (
    <div className="tracking-info">
      <p className="tracking-info__label">Tracking</p>
      <p className="tracking-info__number">
        {carrier && <span>{carrier} </span>}
        <strong>{order.tracking_number}</strong>
      </p>
      {order.shipped_at && <p className="tracking-info__date">Shipped on {formatDate(order.shipped_at)}</p>}
      {order.tracking_url && (
        <a className="tracking-info__link" href={order.tracking_url} target="_blank" rel="noopener noreferrer">
          Track your parcel →
        </a>
      )}
    </div>
  );
}
