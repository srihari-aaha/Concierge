import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Star,
  Users,
  Bed,
  Bath,
  Sparkles,
  ShieldCheck,
  Check,
  Calendar,
  Phone,
  MessageSquare,
  Award,
  Share2,
  Heart,
  ChevronLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import BookingWidget from '../../components/property/BookingWidget';
import ServiceCard from '../../components/concierge/ServiceCard';
import ConciergeRequestModal from '../../components/concierge/ConciergeRequestModal';
import StarRating from '../../components/common/StarRating';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import './PropertyDetailPage.css';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { properties, conciergeCategories, reviews } = useApp();

  const property = properties.find((p) => p.id === id) || properties[0];

  // Gallery active photo index & modal preview
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const images = property.images && property.images.length > 0 ? property.images : [property.coverImage];

  // Concierge services relevant to this property
  const relevantServices = conciergeCategories.flatMap((c) => c.services).slice(0, 4);

  // Reviews for this property
  const propertyReviews = reviews.filter((r) => r.propertyId === property.id);

  const handleOpenConciergeModal = (service) => {
    setSelectedService(service);
    setRequestModalOpen(true);
  };

  return (
    <div className="property-detail-page">
      {/* Top Breadcrumb & Actions */}
      <div className="container property-nav-bar">
        <Link to="/explore" className="back-link">
          <ChevronLeft size={16} />
          <span>Back to Stays</span>
        </Link>

        <div className="detail-top-actions">
          <button
            type="button"
            className="action-icon-btn"
            onClick={() => setIsSaved(!isSaved)}
          >
            <Heart size={16} fill={isSaved ? '#ED7014' : 'none'} color={isSaved ? '#ED7014' : 'currentColor'} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Title & Metadata Row */}
      <div className="container property-title-container">
        <div className="title-left">
          <div className="title-badges-row">
            <Badge variant="sage" size="sm">{property.type}</Badge>
            {property.featured && <Badge variant="accent" size="sm">StayEase Curated</Badge>}
          </div>
          <h1 className="detail-property-name">{property.name}</h1>
          <div className="detail-meta-line">
            <span className="rating-pill">
              <Star size={14} fill="var(--accent-gold)" color="var(--accent-gold)" />
              <strong>{property.rating.toFixed(2)}</strong> ({property.reviewsCount} verified reviews)
            </span>
            <span className="meta-sep">•</span>
            <span className="location-pill">
              <MapPin size={14} className="pin-icon" />
              {property.location}
            </span>
          </div>
        </div>
      </div>

      {/* Editorial Image Gallery */}
      <div className="container gallery-container">
        <div className="gallery-grid">
          <div className="gallery-main-image">
            <img
              src={images[activePhotoIdx] || property.coverImage}
              alt={property.name}
              className="main-img"
            />
          </div>

          <div className="gallery-thumbnails">
            {images.slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                className={`thumb-wrap ${activePhotoIdx === idx ? 'active' : ''}`}
                onClick={() => setActivePhotoIdx(idx)}
              >
                <img src={img} alt={`View ${idx + 1}`} className="thumb-img" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sticky Booking Widget */}
      <div className="container detail-content-layout">
        {/* Left Column: Property Narrative, Specs, Amenities, Rules, Reviews */}
        <div className="detail-main-col">
          {/* Key Specs Row */}
          <div className="specs-banner-card">
            <div className="spec-item">
              <Users size={18} className="spec-icon" />
              <div className="spec-text">
                <span className="spec-val">{property.guests} Guests</span>
                <span className="spec-lbl">Max Capacity</span>
              </div>
            </div>

            <div className="spec-item">
              <Bed size={18} className="spec-icon" />
              <div className="spec-text">
                <span className="spec-val">{property.bedrooms} Bedrooms</span>
                <span className="spec-lbl">{property.beds} Handcrafted Beds</span>
              </div>
            </div>

            <div className="spec-item">
              <Bath size={18} className="spec-icon" />
              <div className="spec-text">
                <span className="spec-val">{property.bathrooms} Bathrooms</span>
                <span className="spec-lbl">Ensuite Artisanal</span>
              </div>
            </div>

            <div className="spec-item">
              <Sparkles size={18} className="spec-icon highlight" />
              <div className="spec-text">
                <span className="spec-val">Dedicated</span>
                <span className="spec-lbl">On-Call Concierge</span>
              </div>
            </div>
          </div>

          {/* Host Card */}
          <div className="host-card">
            <img src={property.ownerAvatar} alt={property.ownerName} className="host-avatar" />
            <div className="host-details">
              <div className="host-name-row">
                <span className="host-name">Hosted with care by {property.ownerName}</span>
                {property.ownerSuperhost && (
                  <Badge variant="sage" size="sm">
                    <Award size={12} /> Superhost
                  </Badge>
                )}
              </div>
              <p className="host-story">
                Committed to thoughtful Indian hospitality, local culinary recommendations, and seamless concierge delivery for StayEase travelers.
              </p>
            </div>
          </div>

          <div className="divider" />

          {/* Description */}
          <div className="detail-section">
            <h3 className="detail-section-title">About this Sanctuary</h3>
            <p className="property-long-desc">{property.description}</p>
          </div>

          <div className="divider" />

          {/* Amenities Grid */}
          <div className="detail-section">
            <h3 className="detail-section-title">Curated Comforts & Amenities</h3>
            <div className="amenities-grid">
              {property.amenities.map((amenity) => (
                <div key={amenity} className="amenity-item">
                  <Check size={16} className="amenity-check" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* Concierge Available for this Property */}
          <div className="detail-section concierge-property-section">
            <div className="concierge-section-header">
              <div>
                <span className="section-subtitle">DEDICATED HOSPITALITY</span>
                <h3 className="detail-section-title">Concierge Available for this Stay</h3>
                <p className="section-desc">
                  You don't need to worry about anything. Request any of these on-ground services before or during your vacation.
                </p>
              </div>
              <Link to="/concierge">
                <Button variant="subtle" size="sm" icon={Sparkles}>
                  Full Concierge Menu
                </Button>
              </Link>
            </div>

            <div className="concierge-cards-row">
              {relevantServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onRequest={handleOpenConciergeModal}
                />
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* House Rules */}
          <div className="detail-section">
            <h3 className="detail-section-title">House Rules & Serenity Guidelines</h3>
            <ul className="house-rules-list">
              {property.houseRules.map((rule, idx) => (
                <li key={idx} className="rule-item">
                  <span className="rule-bullet">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="divider" />

          {/* Guest Reviews Section */}
          <div className="detail-section">
            <div className="reviews-header-block">
              <h3 className="detail-section-title">Guest Impressions</h3>
              <div className="reviews-score-summary">
                <Star size={18} fill="var(--accent-gold)" color="var(--accent-gold)" />
                <span className="overall-score">{property.rating.toFixed(2)}</span>
                <span className="overall-count">({property.reviewsCount} reviews)</span>
              </div>
            </div>

            <div className="reviews-list">
              {propertyReviews.length > 0 ? (
                propertyReviews.map((rev) => (
                  <div key={rev.id} className="review-card">
                    <div className="review-top">
                      <div>
                        <strong className="review-author">{rev.guestName}</strong>
                        <span className="review-author-loc">from {rev.guestLocation} • {rev.date}</span>
                      </div>
                      <StarRating rating={rev.rating} size={15} />
                    </div>
                    {rev.serviceReviewed && (
                      <span className="service-reviewed-tag">
                        Concierge: {rev.serviceReviewed}
                      </span>
                    )}
                    <p className="review-text">"{rev.comment}"</p>
                  </div>
                ))
              ) : (
                <p className="no-reviews-note">
                  Recent reviews are being curated by our StayEase hospitality desk.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div className="detail-sidebar-col">
          <BookingWidget property={property} />
        </div>
      </div>

      {/* Concierge Request Modal */}
      {selectedService && (
        <ConciergeRequestModal
          isOpen={requestModalOpen}
          onClose={() => setRequestModalOpen(false)}
          service={selectedService}
          property={property}
        />
      )}
    </div>
  );
}
