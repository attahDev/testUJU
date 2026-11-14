import { formatDate } from '../api/mappers.js';
import './TrackingInfo.css';

export default function TrackingInfo({ order }) {
  if (!order.tracking_number && !(order.status === 'delivered' && order.delivered_at)) return null;
  const carrier = order.carrier && order.carrier !== 'Other' ? order.carrier : '';
  return (
    <div className="tracking-info">
      <p className="tracking-info__label">Tracking</p>
      {order.tracking_number && (
        <p className="tracking-info__number">
          {carrier && <span>{carrier} </span>}
          <strong>{order.tracking_number}</strong>
        </p>
      )}
      {order.shipped_at && <p className="tracking-info__date">Shipped on {formatDate(order.shipped_at)}</p>}
      {order.status === 'delivered' && order.delivered_at && <p className="tracking-info__date">Delivered on {formatDate(order.delivered_at)}</p>}
      {order.tracking_url && (
        <a className="tracking-info__link" href={order.tracking_url} target="_blank" rel="noopener noreferrer">
          Track your parcel →
        </a>
      )}
    </div>
  );
}
