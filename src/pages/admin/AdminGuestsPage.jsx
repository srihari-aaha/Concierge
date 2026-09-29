import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Star,
  CalendarCheck,
  CreditCard,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle,
  Flag,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import DetailDrawer from '../../components/admin/DetailDrawer';
import EmptyState from '../../components/admin/EmptyState';
import Button from '../../components/common/Button';
import './AdminGuestsPage.css';

export default function AdminGuestsPage() {
  const { bookings, conciergeRequests, reviews, showToast } = useApp();
  const { guests, setGuests, addAuditLog } = useAdmin();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const selectedGuestId = searchParams.get('id');
  const [drawerGuest, setDrawerGuest] = useState(() => {
    return guests.find((g) => g.id === selectedGuestId) || null;
  });

  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      if (statusFilter !== 'all' && g.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          g.name.toLowerCase().includes(q) ||
          g.email.toLowerCase().includes(q) ||
          g.phone.includes(q) ||
          (g.city && g.city.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [guests, statusFilter, searchQuery]);

  const handleOpenDetail = (g) => {
    setDrawerGuest(g);
    setSearchParams({ id: g.id });
  };

  const handleCloseDetail = () => {
    setDrawerGuest(null);
    setSearchParams({});
  };

  const handleToggleVip = (guest) => {
    const newStatus = guest.status === 'vip' ? 'active' : 'vip';
    setGuests((prev) =>
      prev.map((g) => (g.id === guest.id ? { ...g, status: newStatus } : g))
    );
    if (drawerGuest?.id === guest.id) {
      setDrawerGuest({ ...drawerGuest, status: newStatus });
    }
    addAuditLog('Updated Guest Tier', 'Guest', guest.id, guest.status, newStatus, guest.name);
    showToast(`Guest ${guest.name} marked as ${newStatus.toUpperCase()}`, 'info');
  };

  // Drawer guest data associations
  const guestBookings = drawerGuest
    ? bookings.filter((b) => b.guestEmail === drawerGuest.email || b.guestName === drawerGuest.name)
    : [];
  const guestRequests = drawerGuest
    ? conciergeRequests.filter((c) => c.guestName === drawerGuest.name)
    : [];
  const guestReviews = drawerGuest
    ? reviews.filter((r) => r.guestName === drawerGuest.name)
    : [];

  return (
    <AdminLayout>
      <div className="admin-guests-page">
        <PageHeader
          title="Guest Directory & Relationship Ledger"
          subtitle="Directory of verified Indian and global holiday guests, lifetime spend, booking cadence, and loyalty tier"
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Guests' }
          ]}
        />

        {/* Filter Controls */}
        <div className="guests-filter-bar">
          <div className="filter-search-input">
            <Search size={16} className="filter-icon" />
            <input
              type="text"
              placeholder="Search by guest name, email, phone or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-selects-row">
            <select
              className="admin-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Guest Tiers</option>
              <option value="vip">VIP Guests Only</option>
              <option value="active">Active Travelers</option>
              <option value="flagged">Flagged</option>
            </select>

            {(searchQuery || statusFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Directory Table */}
        {filteredGuests.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No guests found"
            description="No traveler accounts match your search filter."
            actionText="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
          />
        ) : (
          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>GUEST</th>
                  <th>CONTACT DETAILS</th>
                  <th>ORIGIN / CITY</th>
                  <th>RESERVATIONS</th>
                  <th>TOTAL SPENT</th>
                  <th>LAST STAY</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((g) => (
                  <tr key={g.id} onClick={() => handleOpenDetail(g)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div className="guest-col-cell">
                        <img src={g.avatar} alt={g.name} className="guest-table-avatar" />
                        <div>
                          <strong className="guest-row-name">{g.name}</strong>
                          <span className="member-since">Member since {g.memberSince || '2023'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="guest-contact-cell">
                        <span><Mail size={12} /> {g.email}</span>
                        <span><Phone size={12} /> {g.phone}</span>
                      </div>
                    </td>
                    <td>
                      <span className="guest-city-text">
                        <MapPin size={12} /> {g.city}, {g.state}
                      </span>
                    </td>
                    <td>
                      <strong className="stay-count-val">{g.reservationsCount} Stays</strong>
                    </td>
                    <td>
                      <strong className="table-amount">₹{g.totalSpent?.toLocaleString('en-IN')}</strong>
                    </td>
                    <td>
                      <span className="last-stay-tag">{g.lastStay}</span>
                    </td>
                    <td>
                      <StatusBadge status={g.status} />
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div className="table-row-actions">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleVip(g)}
                        >
                          {g.status === 'vip' ? 'Demote Tier' : 'Make VIP'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDetail(g)}
                        >
                          Profile
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detailed Guest Drawer */}
        {drawerGuest && (
          <DetailDrawer
            isOpen={Boolean(drawerGuest)}
            onClose={handleCloseDetail}
            title={drawerGuest.name}
            subtitle={`${drawerGuest.city}, ${drawerGuest.state} • Total Spent: ₹${drawerGuest.totalSpent?.toLocaleString('en-IN')}`}
            badges={<StatusBadge status={drawerGuest.status} />}
            width="580px"
            footer={
              <div className="drawer-footer-actions">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleVip(drawerGuest)}
                >
                  {drawerGuest.status === 'vip' ? 'Remove VIP Status' : 'Upgrade to VIP Guest'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => showToast(`Direct communication link sent to ${drawerGuest.email}`, 'info')}
                >
                  Message Guest
                </Button>
              </div>
            }
          >
            {/* Guest Profile Card */}
            <div className="drawer-guest-profile-box">
              <img src={drawerGuest.avatar} alt={drawerGuest.name} className="guest-drawer-avatar" />
              <div className="guest-drawer-meta">
                <h4 className="guest-profile-name">{drawerGuest.name}</h4>
                <p className="guest-profile-sub">{drawerGuest.email} • {drawerGuest.phone}</p>
                <span className="guest-pref-note">
                  <strong>Traveler Notes:</strong> {drawerGuest.notes || 'Prefers peaceful coastal villas with plunge pool and private chef.'}
                </span>
              </div>
            </div>

            {/* Lifetime Stats Strip */}
            <div className="guest-kpi-strip">
              <div className="g-stat-box">
                <span className="g-stat-lbl">Lifetime Stays</span>
                <strong className="g-stat-val">{drawerGuest.reservationsCount}</strong>
              </div>
              <div className="g-stat-box">
                <span className="g-stat-lbl">Gross Spend</span>
                <strong className="g-stat-val">₹{drawerGuest.totalSpent?.toLocaleString('en-IN')}</strong>
              </div>
              <div className="g-stat-box">
                <span className="g-stat-lbl">Concierge Orders</span>
                <strong className="g-stat-val">{guestRequests.length || 2}</strong>
              </div>
            </div>

            {/* Past Bookings */}
            <div className="drawer-section">
              <h5 className="section-sub-title">Stay & Reservation History</h5>
              {guestBookings.length === 0 ? (
                <div className="guest-sub-empty">No prior bookings in live history.</div>
              ) : (
                guestBookings.map((b) => (
                  <div key={b.id} className="drawer-sub-entry">
                    <div>
                      <strong>{b.reference} — {b.propertyName}</strong>
                      <p>{b.checkIn} to {b.checkOut} ({b.nights || 2} nights)</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong>₹{b.totalAmount?.toLocaleString('en-IN')}</strong>
                      <div><StatusBadge status={b.status} /></div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Concierge History */}
            <div className="drawer-section">
              <h5 className="section-sub-title">Concierge Service Inquiries</h5>
              {guestRequests.length === 0 ? (
                <div className="guest-sub-empty">No concierge requests on file.</div>
              ) : (
                guestRequests.map((c) => (
                  <div key={c.id} className="drawer-sub-entry">
                    <div>
                      <strong>{c.serviceTitle}</strong>
                      <p>{c.propertyName} • {c.date || 'Past stay'}</p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                ))
              )}
            </div>
          </DetailDrawer>
        )}
      </div>
    </AdminLayout>
  );
}
