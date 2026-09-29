import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  CalendarCheck,
  Sparkles,
  DollarSign,
  Users,
  Wrench,
  Clock,
  ArrowRight,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  LogOut,
  ShieldAlert,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import PriorityBadge from '../../components/admin/PriorityBadge';
import Button from '../../components/common/Button';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  const { properties, bookings, conciergeRequests, maintenanceTickets, currentUser } = useApp();
  const {
    housekeepingTasks,
    paymentTransactions,
    auditLogs,
    approveProperty
  } = useAdmin();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('reservations'); // reservations, concierge, approvals, audit

  // Metrics computation
  const pendingApprovals = properties.filter((p) => p.status === 'pending_approval');
  const activeProperties = properties.filter((p) => p.status === 'active');
  const urgentRequests = conciergeRequests.filter(
    (r) => r.priority === 'urgent' || r.status === 'requested' || r.status === 'pending'
  );
  const openMaintenance = maintenanceTickets.filter(
    (m) => m.status !== 'resolved' && m.status !== 'closed'
  );
  const failedPayments = paymentTransactions.filter((t) => t.status === 'failed');

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) + 792500;
  const activeStaysCount = bookings.filter((b) => b.status === 'confirmed').length + 82;

  // Format today's date
  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <AdminLayout>
      <div className="admin-dashboard-page">
        {/* Top Welcome / Overview Section */}
        <div className="dashboard-welcome-banner">
          <div className="welcome-banner-text">
            <span className="welcome-date-chip">
              <Calendar size={13} /> {todayFormatted}
            </span>
            <h1 className="welcome-greeting">
              Good morning, {currentUser.name.split(' ')[0]}
            </h1>
            <p className="welcome-subtext">
              Here is what is happening across StayEase holiday properties and concierge fleets today.
            </p>
          </div>

          <div className="welcome-banner-actions">
            <Button
              variant="outline"
              size="sm"
              icon={Search}
              onClick={() => {
                const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
                window.dispatchEvent(event);
              }}
            >
              Quick Search (Ctrl+K)
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => navigate('/admin/properties?action=new')}
            >
              Add Property
            </Button>
          </div>
        </div>

        {/* Attention Priority Urgency Strip */}
        <div className="admin-attention-strip">
          <div className="attention-header">
            <div className="attention-title-wrap">
              <span className="attention-pulse-dot" />
              <span className="attention-title">What needs your attention right now</span>
            </div>
            <span className="attention-count">
              {pendingApprovals.length + urgentRequests.length + openMaintenance.length + failedPayments.length} pending items
            </span>
          </div>

          <div className="attention-cards-grid">
            {pendingApprovals.length > 0 && (
              <div
                className="attention-item-card urgent-border"
                onClick={() => navigate('/admin/properties?tab=pending')}
              >
                <div className="attention-item-icon warning">
                  <Home size={18} />
                </div>
                <div className="attention-item-body">
                  <div className="attention-item-title">
                    {pendingApprovals.length} Property Approvals
                  </div>
                  <div className="attention-item-desc">
                    New luxury listings submitted by hosts awaiting quality vetting
                  </div>
                </div>
                <ArrowRight size={16} className="attention-arrow" />
              </div>
            )}

            {urgentRequests.length > 0 && (
              <div
                className="attention-item-card urgent-border"
                onClick={() => navigate('/admin/concierge?tab=pending')}
              >
                <div className="attention-item-icon danger">
                  <Sparkles size={18} />
                </div>
                <div className="attention-item-body">
                  <div className="attention-item-title">
                    {urgentRequests.length} Concierge Requests
                  </div>
                  <div className="attention-item-desc">
                    Airport transfers and chef bookings requiring staff dispatch
                  </div>
                </div>
                <ArrowRight size={16} className="attention-arrow" />
              </div>
            )}

            {openMaintenance.length > 0 && (
              <div
                className="attention-item-card"
                onClick={() => navigate('/admin/operations?tab=maintenance')}
              >
                <div className="attention-item-icon info">
                  <Wrench size={18} />
                </div>
                <div className="attention-item-body">
                  <div className="attention-item-title">
                    {openMaintenance.length} Open Maintenance Issues
                  </div>
                  <div className="attention-item-desc">
                    Villa AC and pool pump issues awaiting technician resolution
                  </div>
                </div>
                <ArrowRight size={16} className="attention-arrow" />
              </div>
            )}

            {failedPayments.length > 0 && (
              <div
                className="attention-item-card"
                onClick={() => navigate('/admin/payments?tab=failed')}
              >
                <div className="attention-item-icon danger">
                  <ShieldAlert size={18} />
                </div>
                <div className="attention-item-body">
                  <div className="attention-item-title">
                    {failedPayments.length} Payment Authorization Alert
                  </div>
                  <div className="attention-item-desc">
                    Failed UPI/Card gateway checkout needing retry link
                  </div>
                </div>
                <ArrowRight size={16} className="attention-arrow" />
              </div>
            )}
          </div>
        </div>

        {/* High-Level SaaS Operational KPI Cards */}
        <div className="admin-kpi-grid">
          <StatCard
            label="Total Properties"
            value={properties.length + 242}
            subtitle={`${activeProperties.length + 235} active, ${pendingApprovals.length} pending approval`}
            trend="+12 this month"
            trendDirection="up"
            icon={Home}
            iconBg="#FFF1E8"
            iconColor="#ED7014"
            onClick={() => navigate('/admin/properties')}
          />

          <StatCard
            label="Active Reservations"
            value={activeStaysCount}
            subtitle="Currently staying across all destinations"
            trend="+18% vs last week"
            trendDirection="up"
            icon={CalendarCheck}
            iconBg="#EFF6FF"
            iconColor="#2563EB"
            onClick={() => navigate('/admin/reservations')}
          />

          <StatCard
            label="Today's Check-ins"
            value="24"
            subtitle="18 verified digital keys generated"
            contextText="Peak arrival: 2 PM - 5 PM"
            icon={Users}
            iconBg="#ECFDF5"
            iconColor="#10B981"
            onClick={() => navigate('/admin/operations?tab=checkins')}
          />

          <StatCard
            label="Today's Check-outs"
            value="18"
            subtitle="15 room turnovers scheduled"
            contextText="3 late checkout requests"
            icon={Clock}
            iconBg="#F5F3FF"
            iconColor="#8B5CF6"
            onClick={() => navigate('/admin/operations?tab=housekeeping')}
          />

          <StatCard
            label="Concierge Requests"
            value="37"
            subtitle={`${urgentRequests.length} pending dispatch`}
            trend="Avg response 11m"
            trendDirection="up"
            icon={Sparkles}
            iconBg="#FFFBEB"
            iconColor="#D97706"
            onClick={() => navigate('/admin/concierge')}
          />

          <StatCard
            label="Platform Revenue"
            value={`₹${(totalRevenue / 100000).toFixed(2)}L`}
            subtitle="This month • 10% commission ₹84,200"
            trend="+14.2%"
            trendDirection="up"
            icon={DollarSign}
            iconBg="#ECFDF5"
            iconColor="#16A34A"
            onClick={() => navigate('/admin/payments')}
          />
        </div>

        {/* Section 8: Today's Operations Visual Summary */}
        <div className="todays-ops-section">
          <div className="section-head-bar">
            <div>
              <h2 className="section-title-sm">Today's Operations</h2>
              <p className="section-desc-sm">Live dispatch ledger and housekeeping turnaround metrics</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={ChevronRight}
              iconPosition="right"
              onClick={() => navigate('/admin/operations')}
            >
              Full Operations Console
            </Button>
          </div>

          <div className="ops-pills-row">
            <div className="ops-stat-pill" onClick={() => navigate('/admin/operations?tab=checkins')}>
              <span className="pill-metric">24</span>
              <span className="pill-name">Check-ins</span>
              <span className="pill-tag good">On Schedule</span>
            </div>

            <div className="ops-stat-pill" onClick={() => navigate('/admin/operations?tab=checkins')}>
              <span className="pill-metric">18</span>
              <span className="pill-name">Check-outs</span>
              <span className="pill-tag good">12 Completed</span>
            </div>

            <div className="ops-stat-pill" onClick={() => navigate('/admin/operations?tab=housekeeping')}>
              <span className="pill-metric">12</span>
              <span className="pill-name">Housekeeping Pending</span>
              <span className="pill-tag warning">Turnovers Active</span>
            </div>

            <div className="ops-stat-pill" onClick={() => navigate('/admin/operations?tab=maintenance')}>
              <span className="pill-metric">{openMaintenance.length || 5}</span>
              <span className="pill-name">Maintenance Open</span>
              <span className="pill-tag alert">Technicians Dispatched</span>
            </div>

            <div className="ops-stat-pill" onClick={() => navigate('/admin/concierge')}>
              <span className="pill-metric">37</span>
              <span className="pill-name">Concierge Requests</span>
              <span className="pill-tag info">Fleet Engaged</span>
            </div>

            <div className="ops-stat-pill" onClick={() => navigate('/admin/operations?tab=checkins')}>
              <span className="pill-metric">3</span>
              <span className="pill-name">Late Check-outs</span>
              <span className="pill-tag neutral">Approved Until 2 PM</span>
            </div>
          </div>
        </div>

        {/* Dual Operational Panels: Activity vs Live Ledger */}
        <div className="dashboard-ledger-grid">
          {/* Main Operational Ledger */}
          <div className="dashboard-ledger-card">
            <div className="ledger-card-tabs">
              <button
                type="button"
                className={`ledger-tab ${activeTab === 'reservations' ? 'active' : ''}`}
                onClick={() => setActiveTab('reservations')}
              >
                Recent Reservations ({bookings.length})
              </button>
              <button
                type="button"
                className={`ledger-tab ${activeTab === 'concierge' ? 'active' : ''}`}
                onClick={() => setActiveTab('concierge')}
              >
                Concierge Dispatch ({conciergeRequests.length})
              </button>
              <button
                type="button"
                className={`ledger-tab ${activeTab === 'approvals' ? 'active' : ''}`}
                onClick={() => setActiveTab('approvals')}
              >
                Pending Properties ({pendingApprovals.length})
              </button>
            </div>

            {/* TAB: Reservations */}
            {activeTab === 'reservations' && (
              <div className="ledger-table-wrap">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>REFERENCE</th>
                      <th>GUEST</th>
                      <th>PROPERTY</th>
                      <th>DATES</th>
                      <th>AMOUNT</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 6).map((b) => (
                      <tr key={b.id}>
                        <td>
                          <span className="ref-code">{b.reference}</span>
                        </td>
                        <td>
                          <div className="table-guest-cell">
                            <span className="guest-name">{b.guestName}</span>
                            <span className="guest-sub">{b.guestEmail}</span>
                          </div>
                        </td>
                        <td>
                          <div className="table-prop-cell">
                            <span className="prop-name">{b.propertyName}</span>
                            <span className="prop-loc">{b.location || 'Goa, India'}</span>
                          </div>
                        </td>
                        <td>
                          <span className="table-date-text">
                            {b.checkIn} → {b.checkOut}
                          </span>
                        </td>
                        <td>
                          <strong className="table-amount">
                            ₹{b.totalAmount ? b.totalAmount.toLocaleString('en-IN') : '24,500'}
                          </strong>
                        </td>
                        <td>
                          <StatusBadge status={b.status} />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="table-action-link"
                            onClick={() => navigate(`/admin/reservations?ref=${b.reference}`)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="ledger-table-footer">
                  <span className="footer-count">Showing {Math.min(bookings.length, 6)} of {bookings.length + 80} bookings</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={ArrowRight}
                    iconPosition="right"
                    onClick={() => navigate('/admin/reservations')}
                  >
                    View All Reservations
                  </Button>
                </div>
              </div>
            )}

            {/* TAB: Concierge Requests */}
            {activeTab === 'concierge' && (
              <div className="ledger-table-wrap">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>SERVICE</th>
                      <th>GUEST & PROPERTY</th>
                      <th>PRIORITY</th>
                      <th>STATUS</th>
                      <th>ASSIGNED TO</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conciergeRequests.slice(0, 6).map((req) => (
                      <tr key={req.id}>
                        <td>
                          <div className="table-service-cell">
                            <span className="service-title">{req.serviceTitle}</span>
                            <span className="service-time">{req.date || 'Today'}</span>
                          </div>
                        </td>
                        <td>
                          <span className="guest-name">{req.guestName}</span>
                          <span className="prop-loc">{req.propertyName}</span>
                        </td>
                        <td>
                          <PriorityBadge priority={req.priority || 'normal'} />
                        </td>
                        <td>
                          <StatusBadge status={req.status} />
                        </td>
                        <td>
                          <span className="assigned-staff-name">
                            {req.assignedProviderName || 'Awaiting Dispatch'}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="table-action-link"
                            onClick={() => navigate(`/admin/concierge?id=${req.id}`)}
                          >
                            Dispatch
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="ledger-table-footer">
                  <span className="footer-count">Showing {Math.min(conciergeRequests.length, 6)} active requests</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={ArrowRight}
                    iconPosition="right"
                    onClick={() => navigate('/admin/concierge')}
                  >
                    Manage Full Concierge Desk
                  </Button>
                </div>
              </div>
            )}

            {/* TAB: Property Approvals */}
            {activeTab === 'approvals' && (
              <div className="approvals-cards-list">
                {pendingApprovals.length === 0 ? (
                  <div className="no-pending-box">
                    <CheckCircle2 size={32} color="#16A34A" />
                    <h4>All property listings reviewed!</h4>
                    <p>No villas or chalets currently awaiting admin approval.</p>
                  </div>
                ) : (
                  pendingApprovals.map((prop) => (
                    <div key={prop.id} className="approval-card-item">
                      <img
                        src={prop.coverImage || prop.images?.[0]}
                        alt={prop.name}
                        className="approval-thumb"
                      />
                      <div className="approval-info">
                        <div className="approval-top">
                          <span className="prop-type-badge">{prop.type}</span>
                          <span className="prop-price">₹{prop.pricePerNight?.toLocaleString('en-IN')}/night</span>
                        </div>
                        <h4 className="approval-name">{prop.name}</h4>
                        <p className="approval-loc">{prop.location} • Submitted by {prop.ownerName || 'Host'}</p>
                      </div>
                      <div className="approval-actions">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/properties?id=${prop.id}`)}
                        >
                          Inspect
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => approveProperty(prop.id)}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Section 41: What Happened Recently — Live Activity Timeline */}
          <div className="dashboard-activity-panel">
            <div className="activity-panel-header">
              <div>
                <h3 className="activity-panel-title">Audit & Activity Log</h3>
                <p className="activity-panel-subtitle">Live immutable operational trail</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/reports?tab=audit')}
              >
                All Logs
              </Button>
            </div>

            <div className="activity-timeline-scroll">
              {auditLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="audit-timeline-item">
                  <div className="audit-dot" />
                  <div className="audit-content">
                    <div className="audit-top">
                      <span className="audit-action">{log.action}</span>
                      <span className="audit-time">{log.timestamp}</span>
                    </div>
                    <span className="audit-entity">
                      <strong>{log.entity}:</strong> {log.entityName}
                    </span>
                    <div className="audit-diff">
                      <span className="diff-old">{log.previousValue}</span>
                      <span className="diff-arrow">→</span>
                      <span className="diff-new">{log.newValue}</span>
                    </div>
                    <span className="audit-admin-tag">By {log.adminName} ({log.adminRole})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
