import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Sparkles,
  ArrowRight,
  Car,
  UtensilsCrossed,
  ShoppingBag,
  Wrench,
  Clock,
  CheckCircle,
  MessageSquare,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import './GuestDashboardPage.css';

export default function GuestDashboardPage() {
  const { currentUser, bookings, conciergeRequests, conciergeCategories } = useApp();

  const upcomingBooking = bookings.find((b) => b.status === 'confirmed') || bookings[0];
  const activeRequests = conciergeRequests.slice(0, 3);

  const quickConciergeServices = [
    { title: 'Airport Chauffeur', icon: Car, cat: 'transportation', desc: 'Private arrival transfer' },
    { title: 'In-Villa Chef', icon: UtensilsCrossed, cat: 'dining', desc: 'Bespoke coastal dining' },
    { title: 'Fridge Stocking', icon: ShoppingBag, cat: 'grocery', desc: 'Organic essentials & snacks' },
    { title: 'Quick Maintenance', icon: Wrench, cat: 'maintenance', desc: 'AC, plumbing or Wi-Fi help' }
  ];

  return (
    <DashboardLayout
      title={`Good morning, ${(currentUser?.name || 'Guest').split(' ')[0]}`}
      subtitle="Welcome to your StayEase guest portal. Everything for your retreat is prepared."
    >
      <div className="guest-dashboard-container">
        {/* Upcoming Stay Highlight Banner */}
        {upcomingBooking ? (
          <div className="upcoming-stay-card">
            <div className="stay-image-col">
              <img
                src={upcomingBooking.propertyImage}
                alt={upcomingBooking.propertyName}
                className="stay-cover-img"
              />
              <Badge variant="sage" size="sm" className="stay-status-pill">
                Confirmed Reservation
              </Badge>
            </div>

            <div className="stay-content-col">
              <div className="stay-pre-title">YOUR UPCOMING STAY</div>
              <h2 className="stay-prop-name">{upcomingBooking.propertyName}</h2>
              <div className="stay-loc">
                <MapPin size={14} className="pin-icon" />
                <span>{upcomingBooking.propertyLocation}</span>
              </div>

              <div className="stay-metrics-row">
                <div className="stay-metric">
                  <Calendar size={15} className="metric-icon" />
                  <div>
                    <span className="metric-lbl">DATES</span>
                    <strong className="metric-val">
                      {upcomingBooking.checkIn} — {upcomingBooking.checkOut}
                    </strong>
                  </div>
                </div>

                <div className="stay-metric">
                  <Users size={15} className="metric-icon" />
                  <div>
                    <span className="metric-lbl">GUESTS</span>
                    <strong className="metric-val">{upcomingBooking.guestsCount} Guests</strong>
                  </div>
                </div>

                <div className="stay-metric">
                  <ShieldCheck size={15} className="metric-icon" />
                  <div>
                    <span className="metric-lbl">BOOKING REF</span>
                    <strong className="metric-val">{upcomingBooking.reference}</strong>
                  </div>
                </div>
              </div>

              <div className="stay-actions-bar">
                <Link to="/guest/my-stay">
                  <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right">
                    View My Stay & Villa Guide
                  </Button>
                </Link>
                <Link to="/concierge">
                  <Button variant="secondary" size="md" icon={Sparkles}>
                    Order In-Stay Concierge
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-stay-card">
            <h3>No upcoming holiday stays yet</h3>
            <p>Explore our curated sanctuaries across Goa, Pondicherry, Kerala, and Coorg.</p>
            <Link to="/explore">
              <Button variant="primary" size="md">Explore Stays</Button>
            </Link>
          </div>
        )}

        {/* Quick Concierge Launchpad */}
        <div className="dashboard-section-block">
          <div className="section-title-row">
            <div>
              <h3 className="dash-section-title">Quick Concierge Requests</h3>
              <p className="dash-section-desc">Tap to dispatch local services straight to your villa</p>
            </div>
            <Link to="/concierge" className="see-all-link">
              <span>View All 7 Categories</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="quick-concierge-grid">
            {quickConciergeServices.map((svc) => {
              const Icon = svc.icon;
              return (
                <Link
                  key={svc.title}
                  to={`/concierge?category=${svc.cat}`}
                  className="quick-svc-card"
                >
                  <div className="quick-svc-icon">
                    <Icon size={22} />
                  </div>
                  <h4 className="quick-svc-name">{svc.title}</h4>
                  <p className="quick-svc-desc">{svc.desc}</p>
                  <span className="quick-svc-cta">Request service →</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Active Concierge Requests & Messages Grid */}
        <div className="requests-messages-grid">
          {/* Active Requests */}
          <div className="dash-box">
            <div className="dash-box-header">
              <h3 className="dash-box-title">Recent Concierge Requests</h3>
              <Link to="/guest/requests" className="dash-box-link">
                View Tracking
              </Link>
            </div>

            <div className="dash-requests-list">
              {activeRequests.length > 0 ? (
                activeRequests.map((req) => (
                  <Link
                    key={req.id}
                    to="/guest/requests"
                    className="dash-request-row"
                  >
                    <div className="req-title-col">
                      <span className="req-name">{req.serviceTitle}</span>
                      <span className="req-time">
                        {req.date} at {req.timeSlot}
                      </span>
                    </div>

                    <div className="req-status-col">
                      <Badge
                        variant={
                          req.status === 'completed'
                            ? 'completed'
                            : req.status === 'in_progress'
                              ? 'in_progress'
                              : req.status === 'assigned' || req.status === 'accepted'
                                ? 'assigned'
                                : req.status === 'requested' || req.status === 'pending'
                                  ? 'pending'
                                  : 'unassigned'
                        }
                        size="sm"
                        dot
                      >
                        {req.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="dash-empty-msg">No active concierge requests.</p>
              )}
            </div>
          </div>

          {/* Concierge Desk & Host Contact Box */}
          <div className="dash-box host-support-box">
            <div className="dash-box-header">
              <h3 className="dash-box-title">On-Ground Support</h3>
              <span className="live-status-pill">
                <span className="online-dot" /> On-Call 24/7
              </span>
            </div>

            <p className="support-desc">
              Your host Owner and our dedicated StayEase coordinator are standing by.
            </p>

            <div className="support-actions-list">
              <Link to="/guest/messages" className="support-action-item">
                <MessageSquare size={16} />
                <span>Chat with Host & Concierge</span>
              </Link>
              <Link to="/guest/maintenance" className="support-action-item">
                <Wrench size={16} />
                <span>Report an In-Villa Maintenance Issue</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
