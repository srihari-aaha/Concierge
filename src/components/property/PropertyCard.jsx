import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Users, MapPin, Sparkles } from 'lucide-react';
import Badge from '../common/Badge';
import './PropertyCard.css';

export default function PropertyCard({ property }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link to={`/property/${property.id}`} className="property-card">
      <div className="property-image-container">
        <img
          src={property.coverImage}
          alt={property.name}
          className="property-image"
          loading="lazy"
        />
        <div className="property-image-overlay" />

        {/* Favorite Heart Button */}
        <button
          type="button"
          className={`property-fav-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={toggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={18} fill={isFavorite ? '#ED7014' : 'none'} color={isFavorite ? '#ED7014' : '#FFFFFF'} />
        </button>

        {/* Top Badges */}
        <div className="property-top-badges">
          <Badge variant="sage" size="sm">
            {property.type}
          </Badge>
          {property.featured && (
            <Badge variant="accent" size="sm">
              <Sparkles size={11} /> Featured
            </Badge>
          )}
        </div>
      </div>

      <div className="property-content">
        <div className="property-header-row">
          <div className="property-location">
            <MapPin size={13} className="pin-icon" />
            <span>{property.location}</span>
          </div>
          <div className="property-rating">
            <Star size={13} fill="var(--accent-gold)" color="var(--accent-gold)" />
            <span className="rating-score">{property.rating.toFixed(2)}</span>
            <span className="reviews-count">({property.reviewsCount})</span>
          </div>
        </div>

        <h3 className="property-title">{property.name}</h3>
        <p className="property-tagline">{property.tagline}</p>

        <div className="property-specs">
          <span>{property.guests} Guests</span>
          <span className="spec-dot">•</span>
          <span>{property.bedrooms} Bedrooms</span>
          <span className="spec-dot">•</span>
          <span>{property.bathrooms} Baths</span>
        </div>

        <div className="property-footer-row">
          <div className="property-price-block">
            <span className="property-price">₹{property.pricePerNight.toLocaleString('en-IN')}</span>
            <span className="property-price-period">/ night</span>
          </div>

          <span className="property-view-cta">
            View Stay & Concierge →
          </span>
        </div>
      </div>
    </Link>
  );
}
