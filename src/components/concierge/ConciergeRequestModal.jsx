import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Timeline from '../common/Timeline';
import './ConciergeRequestModal.css';

export default function ConciergeRequestModal({
  isOpen,
  onClose,
  service,
  property,
  onSuccess
}) {
  const { createConciergeRequest, bookings } = useApp();

  const [date, setDate] = useState('2024-10-13');
  const [timeSlot, setTimeSlot] = useState('11:00 AM');
  const [guestNotes, setGuestNotes] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState(() => {
    return bookings[0] ? bookings[0].id : 'booking-1';
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRequest, setCreatedRequest] = useState(null);

  if (!service) return null;

  const currentBooking = bookings.find((b) => b.id === selectedBookingId) || bookings[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const req = createConciergeRequest({
        bookingId: currentBooking ? currentBooking.id : 'booking-1',
        bookingRef: currentBooking ? currentBooking.reference : 'SE-2024-8942',
        propertyId: property ? property.id : currentBooking ? currentBooking.propertyId : 'prop-1',
        propertyName: property ? property.name : currentBooking ? currentBooking.propertyName : 'Palm Grove Villa',
        serviceId: service.id,
        serviceTitle: service.title,
        category: service.category,
        date,
        timeSlot,
        specialInstructions: guestNotes || 'Standard concierge fulfillment requested.',
        cost: service.price || 0
      });

      setCreatedRequest(req);
      if (onSuccess) onSuccess(req);
    }, 600);
  };

  const handleClose = () => {
    setCreatedRequest(null);
    onClose();
  };

  const timelineSteps = [
    { label: 'Requested', time: 'Just now' },
    { label: 'Accepted', time: 'Awaiting host' },
    { label: 'Provider Assigned', time: 'Pending' },
    { label: 'In Progress', time: 'Pending' },
    { label: 'Completed', time: 'Pending' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={createdRequest ? 'Request Submitted' : `Request ${service.title}`}
      subtitle={
        createdRequest
          ? 'Your request has been received by our concierge desk'
          : `For ${currentBooking ? currentBooking.propertyName : 'your upcoming stay'}`
      }
      maxWidth="540px"
    >
      {createdRequest ? (
        <div className="concierge-submitted-view animate-fade-in">
          <div className="submitted-icon-wrap">
            <CheckCircle2 size={44} className="submitted-check-icon" />
          </div>

          <h4 className="submitted-title">Your request has been received.</h4>
          <p className="submitted-desc">
            The property host and StayEase local concierge coordinator have been alerted. You can monitor live progress below:
          </p>

          <div className="submitted-timeline-box">
            <Timeline steps={timelineSteps} currentStepIndex={0} orientation="horizontal" />
          </div>

          <div className="submitted-summary-card">
            <div className="summary-row">
              <span className="label">Service</span>
              <span className="val">{createdRequest.serviceTitle}</span>
            </div>
            <div className="summary-row">
              <span className="label">Scheduled For</span>
              <span className="val">{createdRequest.date} at {createdRequest.timeSlot}</span>
            </div>
            <div className="summary-row">
              <span className="label">Stay</span>
              <span className="val">{createdRequest.propertyName}</span>
            </div>
            <div className="summary-row">
              <span className="label">Estimated Fee</span>
              <span className="val highlight">
                {createdRequest.cost > 0 ? `₹${createdRequest.cost.toLocaleString('en-IN')}` : 'Complimentary'}
              </span>
            </div>
          </div>

          <Button variant="primary" size="md" fullWidth onClick={handleClose}>
            Done & Return to Concierge
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="concierge-request-form">
          <div className="service-header-highlight">
            <div className="highlight-desc">{service.shortDesc}</div>
            <div className="highlight-price">
              {service.price > 0 ? (
                <>
                  <strong>₹{service.price.toLocaleString('en-IN')}</strong> {service.priceUnit}
                </>
              ) : (
                <span className="complimentary-text">Complimentary Stay Feature</span>
              )}
            </div>
          </div>

          {/* Select Associated Stay */}
          {bookings.length > 0 && (
            <div className="form-field-group">
              <label className="field-label">Apply to Reservation</label>
              <select
                className="field-select"
                value={selectedBookingId}
                onChange={(e) => setSelectedBookingId(e.target.value)}
              >
                {bookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.propertyName} ({b.reference}) — {b.checkIn} to {b.checkOut}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Preferred Date & Time */}
          <div className="form-grid-two">
            <div className="form-field-group">
              <label className="field-label">Preferred Date</label>
              <div className="input-with-icon">
                <Calendar size={15} className="input-icon" />
                <input
                  type="date"
                  className="field-input"
                  value={date}
                  min="2024-01-01"
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-field-group">
              <label className="field-label">Preferred Time Slot</label>
              <div className="input-with-icon">
                <Clock size={15} className="input-icon" />
                <select
                  className="field-select"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                >
                  <option value="8:00 AM">Morning (8:00 AM)</option>
                  <option value="11:00 AM">Late Morning (11:00 AM)</option>
                  <option value="2:00 PM">Afternoon (2:00 PM)</option>
                  <option value="5:30 PM">Evening / Sunset (5:30 PM)</option>
                  <option value="7:30 PM">Dinner (7:30 PM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Special Requirements / Notes */}
          <div className="form-field-group">
            <label className="field-label">Special Requirements & Preferences</label>
            <textarea
              className="field-textarea"
              rows={3}
              placeholder="e.g. dietary restrictions, flight numbers, luggage size, beverage brands, or specific setup requests..."
              value={guestNotes}
              onChange={(e) => setGuestNotes(e.target.value)}
            />
          </div>

          <div className="concierge-notice">
            <Shield size={16} />
            <span>
              StayEase local coordinator will confirm your assigned vetted provider within 2 hours.
            </span>
          </div>

          <div className="form-actions">
            <Button variant="ghost" size="md" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              loading={isSubmitting}
              icon={Sparkles}
            >
              Submit Concierge Request
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
