import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CalendarCheck,
  Search,
  Filter,
  Calendar,
  Users,
  CreditCard,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Home,
  MessageSquare,
  AlertTriangle,
  RotateCcw,
  List,
  CalendarDays
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import DetailDrawer from '../../components/admin/DetailDrawer';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import EmptyState from '../../components/admin/EmptyState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import './AdminReservationsPage.css';

export default function AdminReservationsPage() {
  const { bookings, properties, conciergeRequests, currentUser } = useApp();
  const {
    updateReservationStatus,
    refundReservation,
    auditLogs
  } = useAdmin();

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeStatusTab, setActiveStatusTab] = useState('all'); // all, upcoming, active_stays, completed, cancelled
  const [viewMode, setViewMode] = useState('list'); // list, calendar
  const [calendarViewType, setCalendarViewType] = useState('month'); // day, week, month

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('ref') || '');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');

  // Selected Booking Drawer
  const selectedRef = searchParams.get('ref') || searchParams.get('id');
  const [drawerBooking, setDrawerBooking] = useState(() => {
    return bookings.find((b) => b.reference === selectedRef || b.id === selectedRef) || null;
  });

  // Refund Modal State
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('Guest requested cancellation per policy');

  // Status Change Dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'primary',
    confirmText: 'Confirm',
    onConfirm: () => {}
  });

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Tab filter
      if (activeStatusTab === 'upcoming' && b.status !== 'confirmed') return false;
      if (activeStatusTab === 'active_stays' && b.status !== 'checked_in') return false;
      if (activeStatusTab === 'completed' && b.status !== 'checked_out') return false;
      if (activeStatusTab === 'cancelled' && b.status !== 'cancelled') return false;

      // Property filter
      if (propertyFilter !== 'all' && b.propertyName !== propertyFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRef = b.reference.toLowerCase().includes(q);
        const matchesGuest = b.guestName.toLowerCase().includes(q);
        const matchesProp = b.propertyName.toLowerCase().includes(q);
        if (!matchesRef && !matchesGuest && !matchesProp) return false;
      }

      return true;
    });
  }, [bookings, activeStatusTab, propertyFilter, searchQuery]);

  const counts = {
    all: bookings.length,
    upcoming: bookings.filter((b) => b.status === 'confirmed').length,
    active_stays: bookings.filter((b) => b.status === 'checked_in').length,
    completed: bookings.filter((b) => b.status === 'checked_out').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length
  };

  const handleOpenDetail = (booking) => {
    setDrawerBooking(booking);
    setSearchParams({ ref: booking.reference });
  };

  const handleCloseDetail = () => {
    setDrawerBooking(null);
    setSearchParams({});
  };

  const handleStatusChange = (booking, newStatus, title, message, variant = 'primary') => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      variant,
      confirmText: `Confirm ${newStatus.replace('_', ' ').toUpperCase()}`,
      onConfirm: () => {
        updateReservationStatus(booking.id, newStatus);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        if (drawerBooking?.id === booking.id) {
          setDrawerBooking({ ...drawerBooking, status: newStatus });
        }
      }
    });
  };

  const handleOpenRefund = (booking) => {
    setDrawerBooking(booking);
    setRefundAmount(String(booking.totalAmount || 25000));
    setIsRefundModalOpen(true);
  };

  const handleProcessRefundSubmit = (e) => {
    e.preventDefault();
    if (!drawerBooking) return;
    refundReservation(drawerBooking.id, refundAmount, refundReason);
    setIsRefundModalOpen(false);
    updateReservationStatus(drawerBooking.id, 'cancelled');
    if (drawerBooking) {
      setDrawerBooking({ ...drawerBooking, status: 'cancelled' });
    }
  };

  // Associated Concierge Requests for Drawer
  const attachedConcierge = drawerBooking
    ? conciergeRequests.filter(
        (c) => c.guestName === drawerBooking.guestName || c.propertyName === drawerBooking.propertyName
      )
    : [];

  return (
    <AdminLayout>
      <div className="admin-reservations-page">
        <PageHeader
          title="Reservation Management"
          subtitle="Real-time guest booking ledger, arrival verification, stay calendar, and payment settlements"
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Reservations' }
          ]}
          actions={
            <div className="res-header-actions">
              <Button
                variant="outline"
                size="sm"
                icon={CalendarDays}
                onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
              >
                {viewMode === 'list' ? 'Switch to Calendar View' : 'Switch to List View'}
              </Button>
            </div>
          }
        />

        {/* Status Tab Strip */}
        <div className="reservations-tab-bar">
          <div className="tab-pill-group">
            <button
              type="button"
              className={`res-tab-pill ${activeStatusTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveStatusTab('all')}
            >
              All Reservations ({counts.all})
            </button>
            <button
              type="button"
              className={`res-tab-pill ${activeStatusTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveStatusTab('upcoming')}
            >
              Upcoming ({counts.upcoming})
            </button>
            <button
              type="button"
              className={`res-tab-pill ${activeStatusTab === 'active_stays' ? 'active' : ''}`}
              onClick={() => setActiveStatusTab('active_stays')}
            >
              Active Stays ({counts.active_stays})
            </button>
            <button
              type="button"
              className={`res-tab-pill ${activeStatusTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveStatusTab('completed')}
            >
              Completed ({counts.completed})
            </button>
            <button
              type="button"
              className={`res-tab-pill ${activeStatusTab === 'cancelled' ? 'active' : ''}`}
              onClick={() => setActiveStatusTab('cancelled')}
            >
              Cancelled ({counts.cancelled})
            </button>
          </div>

          <div className="view-mode-indicator">
            <span className="mode-text">
              Viewing: <strong>{viewMode === 'list' ? 'Tabular Ledger' : 'Stay Calendar'}</strong>
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="reservations-filter-bar">
          <div className="filter-search-input">
            <Search size={16} className="filter-icon" />
            <input
              type="text"
              placeholder="Search reference (STY-...), guest name, or villa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-selects-row">
            <select
              className="admin-select"
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
            >
              <option value="all">All Properties</option>
              {properties.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>

            {(searchQuery || propertyFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setPropertyFilter('all');
                  setActiveStatusTab('all');
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Main View: List or Calendar */}
        {viewMode === 'list' ? (
          filteredBookings.length === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              title="No reservations found"
              description="No bookings match your current filter parameters or search reference."
              actionText="Reset Search"
              onAction={() => {
                setSearchQuery('');
                setPropertyFilter('all');
                setActiveStatusTab('all');
              }}
            />
          ) : (
            <div className="admin-table-container">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>REFERENCE</th>
                    <th>GUEST</th>
                    <th>PROPERTY</th>
                    <th>CHECK-IN</th>
                    <th>CHECK-OUT</th>
                    <th>GUESTS</th>
                    <th>TOTAL</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id} onClick={() => handleOpenDetail(b)} style={{ cursor: 'pointer' }}>
                      <td>
                        <span className="ref-badge">{b.reference}</span>
                      </td>
                      <td>
                        <div className="guest-info-cell">
                          <span className="guest-title">{b.guestName}</span>
                          <span className="guest-email">{b.guestEmail}</span>
                        </div>
                      </td>
                      <td>
                        <span className="prop-name-bold">{b.propertyName}</span>
                      </td>
                      <td>
                        <span className="date-pill in">{b.checkIn}</span>
                      </td>
                      <td>
                        <span className="date-pill out">{b.checkOut}</span>
                      </td>
                      <td>
                        <span className="party-count">{b.guestsCount || 4} Guests</span>
                      </td>
                      <td>
                        <strong className="table-amount">₹{b.totalAmount?.toLocaleString('en-IN')}</strong>
                      </td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div className="table-row-actions">
                          {b.status === 'confirmed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(
                                  b,
                                  'checked_in',
                                  'Verify Guest Arrival & Check In',
                                  `Confirm that ${b.guestName} has arrived at ${b.propertyName} and provided ID verification.`
                                )
                              }
                            >
                              Check In
                            </Button>
                          )}
                          {b.status === 'checked_in' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(
                                  b,
                                  'checked_out',
                                  'Complete Guest Check-out',
                                  `Confirm check-out for ${b.guestName}. Key returned and villa scheduled for turnover cleaning.`
                                )
                              }
                            >
                              Check Out
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDetail(b)}
                          >
                            Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* Calendar View */
          <div className="reservation-calendar-card">
            <div className="calendar-header-bar">
              <div className="cal-title-wrap">
                <Calendar size={18} color="var(--primary)" />
                <h3 className="cal-title">StayEase Booking Calendar — October 2024</h3>
              </div>

              <div className="cal-granularity-toggle">
                <button
                  type="button"
                  className={`cal-btn ${calendarViewType === 'day' ? 'active' : ''}`}
                  onClick={() => setCalendarViewType('day')}
                >
                  Day
                </button>
                <button
                  type="button"
                  className={`cal-btn ${calendarViewType === 'week' ? 'active' : ''}`}
                  onClick={() => setCalendarViewType('week')}
                >
                  Week
                </button>
                <button
                  type="button"
                  className={`cal-btn ${calendarViewType === 'month' ? 'active' : ''}`}
                  onClick={() => setCalendarViewType('month')}
                >
                  Month
                </button>
              </div>
            </div>

            {/* Visual Calendar Grid Simulation */}
            <div className="calendar-grid-month">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="cal-day-header">{d}</div>
              ))}

              {Array.from({ length: 31 }, (_, i) => i + 1).map((dayNum) => {
                const dayBookings = bookings.filter((_, idx) => (idx + dayNum) % 6 === 0);
                return (
                  <div key={dayNum} className={`cal-day-cell ${dayNum === 28 ? 'today' : ''}`}>
                    <span className="cal-date-number">{dayNum}</span>

                    <div className="cal-day-events">
                      {dayBookings.slice(0, 2).map((bk, bIdx) => (
                        <div
                          key={bIdx}
                          className="cal-booking-chip"
                          onClick={() => handleOpenDetail(bk)}
                          title={`${bk.reference} — ${bk.propertyName} (${bk.guestName})`}
                        >
                          <span className="chip-dot" />
                          <span className="chip-name">{bk.propertyName.split(' ')[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detailed Reservation Drawer */}
        {drawerBooking && (
          <DetailDrawer
            isOpen={Boolean(drawerBooking)}
            onClose={handleCloseDetail}
            title={`Reservation ${drawerBooking.reference}`}
            subtitle={`${drawerBooking.propertyName} • Booked for ${drawerBooking.guestName}`}
            badges={<StatusBadge status={drawerBooking.status} />}
            width="640px"
            footer={
              <div className="drawer-footer-actions">
                {drawerBooking.status === 'confirmed' && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={CheckCircle}
                    onClick={() =>
                      handleStatusChange(
                        drawerBooking,
                        'checked_in',
                        'Check In Guest',
                        `Verify arrival for ${drawerBooking.guestName} at ${drawerBooking.propertyName}.`
                      )
                    }
                  >
                    Check In Guest
                  </Button>
                )}
                {drawerBooking.status === 'checked_in' && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={CheckCircle}
                    onClick={() =>
                      handleStatusChange(
                        drawerBooking,
                        'checked_out',
                        'Check Out Guest',
                        `Complete check-out and initiate turnover cleaning for ${drawerBooking.propertyName}.`
                      )
                    }
                  >
                    Check Out Guest
                  </Button>
                )}
                {drawerBooking.status !== 'cancelled' && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={RotateCcw}
                    onClick={() => handleOpenRefund(drawerBooking)}
                  >
                    Process Refund
                  </Button>
                )}
                {drawerBooking.status !== 'cancelled' && (
                  <Button
                    variant="danger"
                    size="sm"
                    icon={XCircle}
                    onClick={() =>
                      handleStatusChange(
                        drawerBooking,
                        'cancelled',
                        'Cancel Reservation',
                        `Cancel booking ${drawerBooking.reference}. Dates will be released on the calendar.`,
                        'danger'
                      )
                    }
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            }
          >
            {/* Guest Summary Card */}
            <div className="drawer-guest-card">
              <div className="guest-card-left">
                <div className="guest-avatar-ph">
                  {drawerBooking.guestName.charAt(0)}
                </div>
                <div>
                  <h4 className="guest-lead-name">{drawerBooking.guestName}</h4>
                  <div className="guest-contact-row">
                    <span><Mail size={12} /> {drawerBooking.guestEmail}</span>
                    <span><Phone size={12} /> {drawerBooking.guestPhone || '+91 98201 55678'}</span>
                  </div>
                </div>
              </div>

              <span className="guest-vip-tag">VIP Traveler</span>
            </div>

            {/* Stay Dates & Capacity */}
            <div className="drawer-stay-grid">
              <div className="stay-spec-box">
                <span className="spec-label">Check-In Date</span>
                <strong className="spec-val">{drawerBooking.checkIn}</strong>
                <span className="spec-sub">Standard 2:00 PM</span>
              </div>
              <div className="stay-spec-box">
                <span className="spec-label">Check-Out Date</span>
                <strong className="spec-val">{drawerBooking.checkOut}</strong>
                <span className="spec-sub">Standard 11:00 AM</span>
              </div>
              <div className="stay-spec-box">
                <span className="spec-label">Total Duration</span>
                <strong className="spec-val">{drawerBooking.nights || 3} Nights</strong>
                <span className="spec-sub">{drawerBooking.guestsCount || 4} Guests Party</span>
              </div>
            </div>

            {/* Digital Key & Wi-Fi Details */}
            <div className="access-info-box">
              <h5 className="access-title">Villa Access & Access Credentials</h5>
              <div className="access-grid">
                <div>
                  <span className="acc-lbl">Digital Door Pin:</span>
                  <strong className="acc-val">{drawerBooking.doorCode || '4821'}</strong>
                </div>
                <div>
                  <span className="acc-lbl">High-Speed Wi-Fi:</span>
                  <strong className="acc-val">{drawerBooking.wifiName || 'StayEase_Villa_5G'}</strong>
                </div>
                <div>
                  <span className="acc-lbl">Wi-Fi Password:</span>
                  <strong className="acc-val">{drawerBooking.wifiPass || 'luxurygoa2024'}</strong>
                </div>
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="financial-ledger-box">
              <h5 className="access-title">Payment & Settlement Breakdown</h5>
              <div className="fin-row">
                <span>Accommodation Rate ({drawerBooking.nights || 3} Nights)</span>
                <strong>₹{((drawerBooking.totalAmount || 36000) * 0.85).toLocaleString('en-IN')}</strong>
              </div>
              <div className="fin-row">
                <span>StayEase Service Fee (8%)</span>
                <strong>₹{Math.round((drawerBooking.totalAmount || 36000) * 0.08).toLocaleString('en-IN')}</strong>
              </div>
              <div className="fin-row">
                <span>Turnover Sanitization & Linen Fee</span>
                <strong>₹1,500</strong>
              </div>
              <div className="fin-row">
                <span>GST (18% Applicable)</span>
                <strong>₹{Math.round((drawerBooking.totalAmount || 36000) * 0.07).toLocaleString('en-IN')}</strong>
              </div>
              <div className="fin-row total">
                <span>Total Amount Paid by Guest</span>
                <strong className="grand-total">₹{drawerBooking.totalAmount?.toLocaleString('en-IN')}</strong>
              </div>
              <div className="fin-sub-note">
                Payment Source: {drawerBooking.paymentMethod || 'UPI (Google Pay)'} • Verified Settlement
              </div>
            </div>

            {/* Attached Concierge Requests */}
            <div className="attached-concierge-sec">
              <h5 className="access-title">Attached Concierge Service Requests</h5>
              {attachedConcierge.length === 0 ? (
                <p className="no-attached-note">No concierge services requested for this reservation yet.</p>
              ) : (
                attachedConcierge.map((req) => (
                  <div key={req.id} className="attached-concierge-card">
                    <div>
                      <strong>{req.serviceTitle}</strong>
                      <p>Status: {req.status} • Scheduled: {req.date || 'During Stay'}</p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                ))
              )}
            </div>
          </DetailDrawer>
        )}

        {/* Modal: Refund Dialog */}
        <Modal
          isOpen={isRefundModalOpen}
          onClose={() => setIsRefundModalOpen(false)}
          title="Process Booking Refund"
          subtitle={`Initiate merchant refund for ${drawerBooking?.reference}`}
          maxWidth="480px"
        >
          <form onSubmit={handleProcessRefundSubmit} className="refund-form">
            <div className="form-group">
              <label>Refund Amount (₹) *</label>
              <input
                type="number"
                required
                max={drawerBooking?.totalAmount || 100000}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
              />
              <span className="field-hint">Max refundable amount: ₹{drawerBooking?.totalAmount?.toLocaleString('en-IN')}</span>
            </div>

            <div className="form-group">
              <label>Reason for Refund *</label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
              >
                <option value="Guest requested cancellation per policy">Guest requested cancellation per policy</option>
                <option value="Severe weather / Monsoon travel disruption">Severe weather / Monsoon travel disruption</option>
                <option value="Host unable to fulfill booking">Host unable to fulfill booking</option>
                <option value="Quality dispute settlement">Quality dispute settlement</option>
                <option value="Duplicate transaction">Duplicate transaction</option>
              </select>
            </div>

            <div className="form-actions-row">
              <Button variant="outline" size="md" onClick={() => setIsRefundModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="md" type="submit">
                Authorize & Disburse Refund
              </Button>
            </div>
          </form>
        </Modal>

        {/* Confirm Action Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          variant={confirmDialog.variant}
          confirmText={confirmDialog.confirmText}
        />
      </div>
    </AdminLayout>
  );
}
