import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import StarRating from '../common/StarRating';
import { useApp } from '../../context/AppContext';
import './ReviewModal.css';

export default function ReviewModal({
  isOpen,
  onClose,
  property,
  service
}) {
  const { submitReview, currentUser } = useApp();

  const [overallRating, setOverallRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [commRating, setCommRating] = useState(5);
  const [locRating, setLocRating] = useState(5);
  const [valRating, setValRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      submitReview({
        propertyId: property ? property.id : 'prop-1',
        propertyName: property ? property.name : 'Palm Grove Villa',
        serviceReviewed: service ? service.serviceTitle || service.title : 'Stay Experience & Concierge',
        rating: overallRating,
        ratingsBreakdown: {
          cleanliness: cleanlinessRating,
          communication: commRating,
          location: locRating,
          value: valRating
        },
        comment: comment || 'Wonderful tranquil holiday stay. The concierge team took care of every request promptly.'
      });

      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Your Experience"
      subtitle={`Review for ${property ? property.name : 'StayEase Stay & Concierge'}`}
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit} className="review-modal-form">
        {/* Overall Star Rating */}
        <div className="review-overall-block">
          <label className="review-block-label">Overall Experience</label>
          <div className="review-stars-wrap">
            <StarRating
              rating={overallRating}
              interactive
              size={28}
              onChange={(val) => setOverallRating(val)}
              showLabel
            />
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="review-categories-grid">
          <div className="review-cat-item">
            <span className="cat-label">Cleanliness</span>
            <StarRating
              rating={cleanlinessRating}
              interactive
              size={18}
              onChange={(val) => setCleanlinessRating(val)}
            />
          </div>

          <div className="review-cat-item">
            <span className="cat-label">Communication</span>
            <StarRating
              rating={commRating}
              interactive
              size={18}
              onChange={(val) => setCommRating(val)}
            />
          </div>

          <div className="review-cat-item">
            <span className="cat-label">Location Serenity</span>
            <StarRating
              rating={locRating}
              interactive
              size={18}
              onChange={(val) => setLocRating(val)}
            />
          </div>

          <div className="review-cat-item">
            <span className="cat-label">Value & Concierge</span>
            <StarRating
              rating={valRating}
              interactive
              size={18}
              onChange={(val) => setValRating(val)}
            />
          </div>
        </div>

        {/* Written Review */}
        <div className="review-input-group">
          <label className="field-label">Written Feedback</label>
          <textarea
            className="review-textarea"
            rows={4}
            placeholder="Tell future travelers about the atmosphere, the concierge hospitality, and your favorite memory of this stay..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>

        <div className="review-actions">
          <Button variant="ghost" size="md" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" loading={isSubmitting}>
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  );
}
