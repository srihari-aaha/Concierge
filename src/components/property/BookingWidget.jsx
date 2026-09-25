import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, ShieldCheck, Sparkles, CheckCircle2, CreditCard, QrCode, Building, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import './BookingWidget.css';

export default function BookingWidget({ property }) {
  const navigate = useNavigate();
  const { createBooking } = useApp();

  // Booking parameters
  const [checkIn, setCheckIn] = useState('2026-11-10');
  const [checkOut, setCheckOut] = useState('2026-11-13');
  const [guestsCount, setGuestsCount] = useState(2);

  // Concierge add-ons during reservation
  const [selectedAddons, setSelectedAddons] = useState({
    airportTransfer: false,
    preStockFridge: false,
    privateChef: false
  });

  // Modal checkout state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('traveler@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Financial calculations
  const calculateNights = () => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const baseRate = property.pricePerNight * nights;
  const cleaningFee = 2500;
  const serviceFee = Math.round(baseRate * 0.06); // 6% StayEase concierge & platform fee
  
  // Add-on fees
  let addonFees = 0;
  if (selectedAddons.airportTransfer) addonFees += 2400;
  if (selectedAddons.preStockFridge) addonFees += 1500;
  if (selectedAddons.privateChef) addonFees += 4500;

  const subtotal = baseRate + cleaningFee + serviceFee + addonFees;
  const gst = Math.round(subtotal * 0.12); // 12% Indian GST
  const grandTotal = subtotal + gst;

  const handleAddonToggle = (key) => {
    setSelectedAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newBooking = createBooking({
        propertyId: property.id,
        propertyName: property.name,
        propertyLocation: property.location,
        propertyImage: property.coverImage,
        checkIn,
        checkOut,
        nights,
        guestsCount,
        pricePerNight: property.pricePerNight,
        totalBase: baseRate,
        cleaningFee,
        serviceFee,
        gst,
        totalAmount: grandTotal,
        paymentMethod: paymentMethod === 'upi' ? `UPI (${upiId})` : paymentMethod === 'card' ? 'Credit Card (Axis Bank)' : 'Net Banking (HDFC Bank)'
      });

      setBookingSuccess(newBooking);
    }, 1200);
  };

  const handleFinishAndGoToStay = () => {
    setCheckoutModalOpen(false);
    navigate('/guest/my-stay');
  };

  return (
    <div className="booking-widget-card">
      <div className="booking-widget-header">
        <div className="booking-price-line">
          <span className="booking-big-price">₹{property.pricePerNight.toLocaleString('en-IN')}</span>
          <span className="booking-night-unit">/ night</span>
        </div>
        <div className="booking-verified-pill">
          <ShieldCheck size={14} className="verified-icon" />
          <span>StayEase Guarantee</span>
        </div>
      </div>

      {/* Date Selectors */}
      <div className="booking-inputs-grid">
        <div
          className="booking-input-col"
          onClick={() => {
            const el = document.getElementById('booking-checkin-date');
            if (el && el.showPicker) {
              try { el.showPicker(); } catch (_) {}
            }
          }}
        >
          <label className="booking-input-label" htmlFor="booking-checkin-date">CHECK-IN</label>
          <div className="booking-input-wrap">
            <input
              id="booking-checkin-date"
              type="date"
              value={checkIn}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setCheckIn(e.target.value)}
              className="booking-native-date"
            />
          </div>
        </div>

        <div
          className="booking-input-col"
          onClick={() => {
            const el = document.getElementById('booking-checkout-date');
            if (el && el.showPicker) {
              try { el.showPicker(); } catch (_) {}
            }
          }}
        >
          <label className="booking-input-label" htmlFor="booking-checkout-date">CHECK-OUT</label>
          <div className="booking-input-wrap">
            <input
              id="booking-checkout-date"
              type="date"
              value={checkOut}
              min={checkIn || new Date().toISOString().split('T')[0]}
              onChange={(e) => setCheckOut(e.target.value)}
              className="booking-native-date"
            />
          </div>
        </div>
      </div>

      {/* Guest Selector */}
      <div className="booking-guest-row">
        <label className="booking-input-label">GUESTS</label>
        <div className="booking-input-wrap">
          <Users size={14} className="booking-icon" />
          <select
            value={guestsCount}
            onChange={(e) => setGuestsCount(Number(e.target.value))}
            className="booking-guest-select"
          >
            {Array.from({ length: property.guests }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pre-arrival Concierge Addons */}
      <div className="booking-addons-box">
        <div className="booking-addons-title">
          <Sparkles size={14} className="sparkle-icon" />
          <span>Add Concierge Comforts (Optional)</span>
        </div>

        <label className="booking-addon-item">
          <input
            type="checkbox"
            checked={selectedAddons.airportTransfer}
            onChange={() => handleAddonToggle('airportTransfer')}
          />
          <div className="addon-text">
            <span className="addon-name">Airport Chauffeur Transfer</span>
            <span className="addon-rate">+₹2,400</span>
          </div>
        </label>

        <label className="booking-addon-item">
          <input
            type="checkbox"
            checked={selectedAddons.preStockFridge}
            onChange={() => handleAddonToggle('preStockFridge')}
          />
          <div className="addon-text">
            <span className="addon-name">Pre-Arrival Fridge Stocking</span>
            <span className="addon-rate">+₹1,500</span>
          </div>
        </label>

        <label className="booking-addon-item">
          <input
            type="checkbox"
            checked={selectedAddons.privateChef}
            onChange={() => handleAddonToggle('privateChef')}
          />
          <div className="addon-text">
            <span className="addon-name">Private In-Villa Chef (Dinner)</span>
            <span className="addon-rate">+₹4,500</span>
          </div>
        </label>
      </div>

      {/* Pricing Calculation Breakdown */}
      <div className="booking-price-breakdown">
        <div className="breakdown-row">
          <span>₹{property.pricePerNight.toLocaleString('en-IN')} × {nights} nights</span>
          <span>₹{baseRate.toLocaleString('en-IN')}</span>
        </div>
        <div className="breakdown-row">
          <span>Villa Cleaning & Sanitization</span>
          <span>₹{cleaningFee.toLocaleString('en-IN')}</span>
        </div>
        <div className="breakdown-row">
          <span>StayEase Concierge & Support fee</span>
          <span>₹{serviceFee.toLocaleString('en-IN')}</span>
        </div>
        {addonFees > 0 && (
          <div className="breakdown-row addon-highlight">
            <span>Selected Concierge Add-ons</span>
            <span>+₹{addonFees.toLocaleString('en-IN')}</span>
          </div>
        )}
        <div className="breakdown-row">
          <span>Taxes (12% GST)</span>
          <span>₹{gst.toLocaleString('en-IN')}</span>
        </div>
        <div className="breakdown-divider" />
        <div className="breakdown-row total-row">
          <span>Total for {nights} {nights === 1 ? 'night' : 'nights'}</span>
          <span className="total-figure">₹{grandTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Main Reservation CTA */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={() => {
          setBookingSuccess(null);
          setCheckoutModalOpen(true);
        }}
      >
        Reserve Your Stay
      </Button>

      <p className="booking-helper-text">
        You won't be charged yet. Instant confirmation with full on-ground concierge support.
      </p>

      {/* Checkout & Mock Payment Modal */}
      <Modal
        isOpen={checkoutModalOpen}
        onClose={() => !isProcessing && setCheckoutModalOpen(false)}
        title={bookingSuccess ? 'Booking Confirmed!' : 'Review & Confirm Reservation'}
        subtitle={
          bookingSuccess
            ? 'Your stay is booked and concierge desk is notified'
            : `${property.name} • ${nights} Nights (${checkIn} to ${checkOut})`
        }
        maxWidth="540px"
      >
        {bookingSuccess ? (
          <div className="booking-success-view animate-fade-in">
            <div className="success-icon-wrap">
              <CheckCircle2 size={48} className="success-check-icon" />
            </div>

            <h4 className="success-heading">You're heading to {property.name}!</h4>
            <p className="success-ref">
              Booking Reference: <strong>{bookingSuccess.reference}</strong>
            </p>

            <div className="success-details-card">
              <div className="success-detail-item">
                <span className="label">Dates</span>
                <span className="val">{bookingSuccess.checkIn} to {bookingSuccess.checkOut} ({bookingSuccess.nights} nights)</span>
              </div>
              <div className="success-detail-item">
                <span className="label">Guests</span>
                <span className="val">{bookingSuccess.guestsCount} Adults</span>
              </div>
              <div className="success-detail-item">
                <span className="label">Total Paid (Mock)</span>
                <span className="val highlight">₹{bookingSuccess.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="success-detail-item">
                <span className="label">Payment Source</span>
                <span className="val">{bookingSuccess.paymentMethod}</span>
              </div>
            </div>

            <p className="success-info-notice">
              Your host ({property.ownerName}) and dedicated concierge team have received your itinerary. All Wi-Fi codes, door locks, and concierge service buttons are now ready in your <strong>My Stay</strong> portal.
            </p>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon={ArrowRight}
              iconPosition="right"
              onClick={handleFinishAndGoToStay}
            >
              Go to My Stay Experience
            </Button>
          </div>
        ) : (
          <div className="booking-modal-body">
            {/* Price Snapshot */}
            <div className="modal-summary-box">
              <div className="summary-left">
                <span className="summary-prop-name">{property.name}</span>
                <span className="summary-prop-loc">{property.location}</span>
              </div>
              <div className="summary-right">
                <span className="summary-price-tag">₹{grandTotal.toLocaleString('en-IN')}</span>
                <span className="summary-price-all">Inclusive of taxes & fees</span>
              </div>
            </div>

            {/* Prototype Payment Notice */}
            <div className="prototype-payment-notice">
              <ShieldCheck size={16} />
              <span>Prototype payment simulation — no real currency will be charged.</span>
            </div>

            {/* Payment Method Selector */}
            <div className="payment-method-selector">
              <label className="section-label">Select Simulated Payment Method</label>
              <div className="payment-options-grid">
                <button
                  type="button"
                  className={`payment-opt-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <QrCode size={18} />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  className={`payment-opt-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard size={18} />
                  <span>Debit / Card</span>
                </button>
                <button
                  type="button"
                  className={`payment-opt-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('netbanking')}
                >
                  <Building size={18} />
                  <span>Net Banking</span>
                </button>
              </div>

              {paymentMethod === 'upi' && (
                <div className="payment-input-group animate-fade-in">
                  <label className="field-label">Virtual Payment Address (VPA)</label>
                  <input
                    type="text"
                    className="modal-field-input"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. yourname@oksbi"
                  />
                  <span className="field-hint">Supports Google Pay, PhonePe, Paytm, BHIM</span>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="payment-input-group animate-fade-in">
                  <label className="field-label">Card Number</label>
                  <input
                    type="text"
                    className="modal-field-input"
                    defaultValue="4532 •••• •••• 8821"
                    readOnly
                  />
                  <div className="card-sub-fields">
                    <input type="text" className="modal-field-input" defaultValue="10/28" readOnly />
                    <input type="text" className="modal-field-input" defaultValue="734" readOnly />
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="payment-input-group animate-fade-in">
                  <label className="field-label">Select Bank</label>
                  <select className="modal-field-input" defaultValue="hdfc">
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="axis">Axis Bank</option>
                  </select>
                </div>
              )}
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={isProcessing}
              onClick={handleConfirmPayment}
            >
              Confirm & Pay ₹{grandTotal.toLocaleString('en-IN')}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
