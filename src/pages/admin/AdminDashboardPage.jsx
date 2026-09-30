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
  ExternalLink,
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
import PieChart from '../../components/admin/PieChart';
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

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) + 792500;
  const activeStaysCount = bookings.filter((b) => b.status === 'confirmed').length + 82;

  // Revenue Streams Breakdown for Interactive Pie Chart
  const revenueStreamData = [
    {
      label: 'Villa Stays',
      value: 5240000,
      formattedVal: '₹52.4L',
      color: '#ED7014',
      desc: 'Nightly luxury villa rental yield'
    },
    {
      label: 'In-Stay Concierge & Dining',
      value: 1680000,
      formattedVal: '₹16.8L',
      color: '#D97706',
      desc: 'Private chefs, seafood & fresh groceries'
    },
    {
      label: 'Airport Fleet Transfers',
      value: 950000,
      formattedVal: '₹9.5L',
      color: '#2563EB',
      desc: 'Chauffeur transit & vehicle hire'
    },
    {
      label: 'Platform Commissions (10%)',
      value: 570000,
      formattedVal: '₹5.7L',
      color: '#10B981',
      desc: 'StayEase platform fee retained'
    }
  ];

  // Regional Performance Breakdown for Interactive Pie Chart
  const regionalPerformanceData = [
    {
      label: 'Goa Coastal Villas',
      value: 128,
      formattedVal: '128 stays',
      color: '#ED7014',
      desc: 'Candolim, Ashwem & Vagator'
    },
    {
      label: 'Pondicherry Courtyards',
      value: 70,
      formattedVal: '70 stays',
      color: '#8B5CF6',
      desc: 'White Town heritage mansions'
    },
    {
      label: 'Kerala Backwaters',
      value: 52,
      formattedVal: '52 stays',
      color: '#06B6D4',
      desc: 'Kumarakom & Alleppey lagoons'
    },
    {
      label: 'Coorg & Nilgiris',
      value: 41,
      formattedVal: '41 stays',
      color: '#10B981',
      desc: 'Coffee plantation bungalows'
    }
  ];

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
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => navigate('/admin/properties?action=new')}
            >
              Add Property
            </Button>
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

        {/* Section: Interactive Revenue & Performance Pie Charts */}
        <div className="dashboard-charts-grid">
          {/* Revenue Distribution Card */}
          <div className="dashboard-analytics-card">
            <div className="analytics-card-header">
              <div>
                <div className="analytics-badge-tag">FINANCIAL REVENUE STREAMS</div>
                <h3 className="analytics-card-title">Revenue by Stream</h3>
                <p className="analytics-card-desc">Gross booking yields, concierge add-ons, and platform commissions</p>
              </div>
              <span className="analytics-growth-chip">
                <TrendingUp size={13} /> +14.2% MoM
              </span>
            </div>
            <PieChart
              data={revenueStreamData}
              centerValue={`₹${(totalRevenue / 100000).toFixed(1)}L`}
              centerLabel="Total Volume"
            />
          </div>

          {/* Regional Booking Performance Card */}
          <div className="dashboard-analytics-card">
            <div className="analytics-card-header">
              <div>
                <div className="analytics-badge-tag">REGIONAL OCCUPANCY & YIELD</div>
                <h3 className="analytics-card-title">Destination Performance</h3>
                <p className="analytics-card-desc">Active reservation density and guest bookings across top corridors</p>
              </div>
              <span className="analytics-growth-chip positive">
                <CheckCircle2 size={13} /> 94% Occupancy
              </span>
            </div>
            <PieChart
              data={regionalPerformanceData}
              centerValue={`${activeStaysCount + 209}`}
              centerLabel="Active Stays"
            />
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
