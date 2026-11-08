import { useWishlist } from '../context/wishlistStore.js';

export default function HeartButton({ productId, className = '' }) {
  const { has, toggle } = useWishlist();
  const liked = has(productId);
  return (
    <button
      type="button"
      className={`${className} ${liked ? 'is-liked' : ''}`.trim()}
      aria-label={liked ? 'Remove from wishlist' : 'Save to wishlist'}
      aria-pressed={liked}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill={liked ? 'currentColor' : 'none'}>
        <path d="M8 14s-6-3.6-6-8.2A3.6 3.6 0 0 1 8 3.6 3.6 3.6 0 0 1 14 5.8C14 10.4 8 14 8 14Z" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </button>
  );
}
