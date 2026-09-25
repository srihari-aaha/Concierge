import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  CalendarCheck,
  Sparkles,
  DollarSign,
  Wrench,
  Users,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import './OwnerDashboardPage.css';

export default function OwnerDashboardPage() {
  const { properties, bookings, conciergeRequests, maintenanceTickets, currentUser, stats } = useApp();

  const myProperties = properties.filter((p) => p.ownerId === currentUser.id || p.ownerName === (currentUser?.name));
  const pendingRequests = conciergeRequests.filter((r) => r.status === 'requested');

  return (
    <DashboardLayout
      title={`Host Dashboard — ${currentUser?.name || 'Owner'}`}
      subtitle="Stewardship overview of your holiday villas, guest reservations, and concierge fulfillments"
    >
      <div className="owner-dash-container">
        {/* KPI Metrics Row */}
        <div className="owner-kpi-grid">
          <div className="kpi-card">
            <div className="kpi-top">
              <span className="kpi-label">TOTAL PROPERTIES</span>
              <div className="kpi-icon-wrap">
                <Home size={18} />
              </div>
            </div>
            <div className="kpi-value">{myProperties.length}</div>
            <div className="kpi-subtext">Active on StayEase Network</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-top">
              <span className="kpi-label">ACTIVE RESERVATIONS</span>
              <div className="kpi-icon-wrap highlight">
                <CalendarCheck size={18} />
              </div>
            </div>
            <div className="kpi-value">{bookings.length}</div>
            <div className="kpi-subtext">Next check-in: Oct 12</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-top">
              <span className="kpi-label">PENDING CONCIERGE</span>
              <div className="kpi-icon-wrap urgent">
                <Sparkles size={18} />
              </div>
            </div>
            <div className="kpi-value">{stats.ownerPendingRequests}</div>
            <div className="kpi-subtext">Awaiting provider assignment</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-top">
              <span className="kpi-label">ESTIMATED EARNINGS</span>
              <div className="kpi-icon-wrap">
                <DollarSign size={18} />
              </div>
            </div>
            <div className="kpi-value">₹1,10,760</div>
            <div className="kpi-subtext">+18% vs last month</div>
          </div>
        </div>

        {/* Action Alert Banner for Incoming Concierge Requests */}
        {pendingRequests.length > 0 && (
          <div className="owner-alert-banner">
            <div className="alert-content">
              <div className="alert-icon-wrap">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="alert-title">{pendingRequests.length} Incoming Concierge Requests</h4>
                <p className="alert-desc">
                  Guests have requested special services for upcoming stays. Accept and assign verified local providers now.
                </p>
              </div>
            </div>
            <Link to="/owner/concierge">
              <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                Review & Assign Providers
              </Button>
            </Link>
          </div>
        )}

        {/* Two Column Grid: Properties & Reservations */}
        <div className="owner-two-col-grid">
          {/* Managed Properties */}
          <div className="owner-dash-box">
            <div className="dash-box-header">
              <div>
                <h3 className="dash-box-title">My Properties</h3>
                <span className="dash-box-sub">Your registered holiday rentals</span>
              </div>
              <Link to="/owner/properties">
                <Button variant="subtle" size="sm" icon={Plus}>
                  Add Stay
                </Button>
              </Link>
            </div>

            <div className="owner-prop-list">
              {myProperties.map((p) => (
                <div key={p.id} className="owner-prop-row">
                  <img src={p.coverImage} alt={p.name} className="owner-prop-thumb" />
                  <div className="owner-prop-info">
                    <h4 className="owner-prop-name">{p.name}</h4>
                    <span className="owner-prop-loc">{p.location}</span>
                    <div className="owner-prop-meta">
                      <span>₹{p.pricePerNight.toLocaleString('en-IN')}/night</span>
                      <span>•</span>
                      <span>{p.rating.toFixed(2)} ★ ({p.reviewsCount} reviews)</span>
                    </div>
                  </div>
                  <Badge variant={p.status === 'active' ? 'sage' : 'pending'} size="sm">
                    {p.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Incoming Reservations */}
          <div className="owner-dash-box">
            <div className="dash-box-header">
              <div>
                <h3 className="dash-box-title">Recent Guest Reservations</h3>
                <span className="dash-box-sub">Upcoming arrivals</span>
              </div>
              <Link to="/owner/reservations" className="see-all-link">
                View All
              </Link>
            </div>

            <div className="owner-res-list">
              {bookings.map((b) => (
                <div key={b.id} className="owner-res-row">
                  <div className="res-avatar-wrap">
                    <Users size={16} />
                  </div>
                  <div className="res-info">
                    <span className="res-guest-name">{b.guestName}</span>
                    <span className="res-prop-name">{b.propertyName}</span>
                    <span className="res-dates">{b.checkIn} to {b.checkOut} ({b.nights} nights)</span>
                  </div>
                  <div className="res-payout-col">
                    <span className="res-amount">₹{b.totalAmount.toLocaleString('en-IN')}</span>
                    <Badge variant={b.status === 'confirmed' ? 'confirmed' : 'default'} size="sm">
                      {b.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
