import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({
  rating = 5,
  max = 5,
  size = 16,
  interactive = false,
  onChange,
  showLabel = false
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'inline-flex', gap: '2px' }}>
        {Array.from({ length: max }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= displayRating;

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              style={{
                background: 'none',
                border: 'none',
                padding: '1px',
                cursor: interactive ? 'pointer' : 'default',
                color: isFilled ? 'var(--accent-gold)' : 'var(--border-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.1s ease',
                transform: interactive && hoverRating === starValue ? 'scale(1.2)' : 'scale(1)'
              }}
              aria-label={`${starValue} out of ${max} stars`}
            >
              <Star
                size={size}
                fill={isFilled ? 'var(--accent-gold)' : 'none'}
                strokeWidth={isFilled ? 0 : 1.5}
              />
            </button>
          );
        })}
      </div>
      {showLabel && (
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: '600',
            color: 'var(--text)',
            marginLeft: '0.35rem'
          }}
        >
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
}
