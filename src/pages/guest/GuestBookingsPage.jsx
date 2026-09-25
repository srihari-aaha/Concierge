import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Sparkles, Calendar, CheckCircle2, Clock, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import './GuestBookingsPage.css';

const TABS = [
  { id: 'upcoming', label: 'Upcoming', icon: Clock },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 }
];

function statusVariant(status) {
  if (status === 'confirmed' || status === 'checked-in') return 'primary';
  if (status === 'completed') return 'sage';
  if (status === 'cancelled') return 'urgent';
  return 'default';
}

function BookingCard({ b, tab }) {
  const isUpcoming = tab === 'upcoming';
  return (
    <div className="booking-card">
      <div className="booking-card-image-wrap">
        <img src={b.propertyImage} alt={b.propertyName} className="booking-card-img" />
        <div className="booking-card-img-overlay" />
        <span className={`booking-status-chip status-${b.status}`}>
          {b.status.replace('-', ' ').toUpperCase()}
        </span>
      </div>

      <div className="booking-card-body">
        <div className="booking-ref-row">
          <span className="booking-ref">Ref: <strong>{b.reference}</strong></span>
          {b.paymentMethod && (
            <span className="booking-payment">
              <CreditCard size={12} />
              {b.paymentMethod}
            </span>
          )}
        </div>

        <h3 className="booking-property-name">{b.propertyName}</h3>

        <div className="booking-location">
          <MapPin size={13} color="var(--primary)" />
          <span>{b.propertyLocation}</span>
        </div>

        <div className="booking-dates-row">
          <div className="booking-date-block">
            <span className="date-label">Check-in</span>
            <span className="date-value">{b.checkIn}</span>
          </div>
          <div className="booking-date-arrow">→</div>
          <div className="booking-date-block">
            <span className="date-label">Check-out</span>
            <span className="date-value">{b.checkOut}</span>
          </div>
          <div className="booking-nights-pill">{b.nights}N</div>
        </div>
      </div>

      <div className="booking-card-aside">
        <div className="booking-amount">
          <span className="amount-label">Total Paid</span>
          <span className="amount-value">₹{b.totalAmount?.toLocaleString('en-IN')}</span>
        </div>
        <div className="booking-actions">
          {isUpcoming ? (
            <>
              <Link to="/guest/my-stay">
                <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                  Manage Stay
                </Button>
              </Link>
              <Link to="/concierge">
                <Button variant="subtle" size="sm" icon={Sparkles}>
                  Add Concierge
                </Button>
              </Link>
            </>
          ) : (
            <Link to={`/explore`}>
              <Button variant="subtle" size="sm" icon={Calendar}>
                Book Again
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ tab }) {
  return (
    <div className="bookings-empty">
      {tab === 'upcoming' ? (
        <>
          <div className="empty-icon">🏖️</div>
          <h3>No upcoming stays</h3>
          <p>You don't have any confirmed reservations yet. Start exploring curated villas across India.</p>
          <Link to="/explore">
            <Button variant="primary" size="md">Explore Stays</Button>
          </Link>
        </>
      ) : (
        <>
          <div className="empty-icon">✨</div>
          <h3>No completed stays yet</h3>
          <p>Your past stays will appear here once you've checked out. We can't wait to host you!</p>
        </>
      )}
    </div>
  );
}

export default function GuestBookingsPage() {
  const { bookings } = useApp();
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'checked-in'
  );
  const completedBookings = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  );

  const displayed = activeTab === 'upcoming' ? upcomingBookings : completedBookings;

  return (
    <DashboardLayout
      title="My Reservations"
      subtitle="View upcoming and past holiday stays across India"
    >
      <div className="bookings-page">
        {/* Sliding Tab Switcher */}
        <div className="bookings-tab-bar">
          <div className="tab-track">
            <div
              className="tab-slider"
              style={{ transform: `translateX(${activeTab === 'upcoming' ? '0%' : '100%'})` }}
            />
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const count = tab.id === 'upcoming' ? upcomingBookings.length : completedBookings.length;
              return (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                  {count > 0 && (
                    <span className={`tab-count ${activeTab === tab.id ? 'tab-count-active' : ''}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content — slides on tab change */}
        <div className="bookings-content" key={activeTab}>
          {displayed.length > 0 ? (
            <div className="bookings-list">
              {displayed.map((b) => (
                <BookingCard key={b.id} b={b} tab={activeTab} />
              ))}
            </div>
          ) : (
            <EmptyState tab={activeTab} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
