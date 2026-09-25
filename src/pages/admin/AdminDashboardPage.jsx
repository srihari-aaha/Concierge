import React, { useState } from 'react';
import {
  ShieldCheck,
  Home,
  Users,
  CalendarCheck,
  DollarSign,
  Sparkles,
  Wrench,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  const {
    properties,
    bookings,
    conciergeRequests,
    maintenanceTickets,
    serviceProviders,
    updatePropertyStatus,
    currentUser,
    stats
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // overview, approvals, providers, concierge, maintenance

  const pendingApprovals = properties.filter((p) => p.status === 'pending_approval');
  const activeProperties = properties.filter((p) => p.status === 'active');

  const totalGrossBookingValue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const platformCommission = Math.round(totalGrossBookingValue * 0.1);

  return (
    <DashboardLayout
      title="Platform Operations & Audit"
      subtitle="StayEase centralized administration, property quality vetting, and service dispatch ledger"
    >
      <div className="admin-container">
        {/* Calm High-Level KPI Cards */}
        <div className="admin-kpi-row">
          <div className="admin-kpi-card">
            <span className="admin-kpi-label">TOTAL LISTINGS</span>
            <div className="admin-kpi-val">{properties.length}</div>
            <span className="admin-kpi-sub">{activeProperties.length} active, {pendingApprovals.length} pending</span>
          </div>

          <div className="admin-kpi-card">
            <span className="admin-kpi-label">TOTAL BOOKINGS</span>
            <div className="admin-kpi-val">{bookings.length + 18}</div>
            <span className="admin-kpi-sub">Across 8 Indian holiday destinations</span>
          </div>

          <div className="admin-kpi-card">
            <span className="admin-kpi-label">GROSS BOOKING VALUE</span>
            <div className="admin-kpi-val">₹{totalGrossBookingValue.toLocaleString('en-IN')}</div>
            <span className="admin-kpi-sub">100% verified prototype settlements</span>
          </div>

          <div className="admin-kpi-card">
            <span className="admin-kpi-label">VERIFIED PROVIDERS</span>
            <div className="admin-kpi-val">{serviceProviders.length}</div>
            <span className="admin-kpi-sub">Goa, Pondicherry, Kerala, Ooty</span>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="admin-tabs-bar">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Operations Overview
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'approvals' ? 'active' : ''}`}
            onClick={() => setActiveTab('approvals')}
          >
            Pending Approvals ({pendingApprovals.length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'concierge' ? 'active' : ''}`}
            onClick={() => setActiveTab('concierge')}
          >
            Concierge Dispatch ({conciergeRequests.length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'providers' ? 'active' : ''}`}
            onClick={() => setActiveTab('providers')}
          >
            Vetted Providers ({serviceProviders.length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
            onClick={() => setActiveTab('maintenance')}
          >
            Maintenance Queue ({maintenanceTickets.length})
          </button>
        </div>

        {/* Content by Tab */}
        {activeTab === 'overview' && (
          <div className="admin-overview-grid">
            {/* Recent Bookings Ledger */}
            <div className="admin-table-card">
              <div className="card-header-bar">
                <h3 className="card-heading">Recent Booking Transactions</h3>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>REFERENCE</th>
                      <th>GUEST</th>
                      <th>PROPERTY</th>
                      <th>DATES</th>
                      <th>AMOUNT</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id}>
                        <td><strong>{b.reference}</strong></td>
                        <td>{b.guestName}</td>
                        <td>{b.propertyName}</td>
                        <td>{b.checkIn} to {b.checkOut}</td>
                        <td><strong>₹{b.totalAmount.toLocaleString('en-IN')}</strong></td>
                        <td>
                          <Badge variant={b.status === 'confirmed' ? 'confirmed' : 'default'} size="sm">
                            {b.status.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Property Approvals Widget */}
            <div className="admin-table-card">
              <div className="card-header-bar">
                <h3 className="card-heading">Listing Approval Queue</h3>
                {pendingApprovals.length > 0 && (
                  <Badge variant="urgent" size="sm">{pendingApprovals.length} Action Needed</Badge>
                )}
              </div>
              <div className="approvals-mini-list">
                {pendingApprovals.length > 0 ? (
                  pendingApprovals.map((p) => (
                    <div key={p.id} className="approval-mini-item">
                      <div>
                        <strong>{p.name}</strong>
                        <span className="prop-loc">{p.location} • Host: {p.ownerName}</span>
                      </div>
                      <div className="approval-action-btns">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={CheckCircle}
                          onClick={() => updatePropertyStatus(p.id, 'active')}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-notice">All listings have been reviewed and approved.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Approvals Full View */}
        {activeTab === 'approvals' && (
          <div className="admin-table-card">
            <div className="card-header-bar">
              <h3 className="card-heading">Pending Property Curation Queue</h3>
            </div>
            <div className="approvals-full-list">
              {pendingApprovals.length > 0 ? (
                pendingApprovals.map((p) => (
                  <div key={p.id} className="approval-full-card">
                    <img src={p.coverImage} alt={p.name} className="approval-full-img" />
                    <div className="approval-full-info">
                      <div className="approval-row-top">
                        <h4 className="prop-title">{p.name}</h4>
                        <Badge variant="pending" size="sm">PENDING QUALITY AUDIT</Badge>
                      </div>
                      <p className="prop-tagline">{p.tagline}</p>
                      <div className="prop-specs-line">
                        <span>{p.location}</span>
                        <span>•</span>
                        <span>₹{p.pricePerNight.toLocaleString('en-IN')}/night</span>
                        <span>•</span>
                        <span>{p.guests} Guests</span>
                        <span>•</span>
                        <span>Host: {p.ownerName}</span>
                      </div>
                    </div>
                    <div className="approval-full-actions">
                      <Button
                        variant="primary"
                        size="md"
                        icon={CheckCircle}
                        onClick={() => updatePropertyStatus(p.id, 'active')}
                      >
                        Approve & Publish
                      </Button>
                      <Button
                        variant="ghost"
                        size="md"
                        icon={XCircle}
                        onClick={() => updatePropertyStatus(p.id, 'inactive')}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-notice padded">
                  No properties currently awaiting approval. All active homestays have passed inspection.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Concierge Dispatch Full View */}
        {activeTab === 'concierge' && (
          <div className="admin-table-card">
            <div className="card-header-bar">
              <h3 className="card-heading">Active Concierge Dispatches</h3>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>SERVICE</th>
                    <th>CATEGORY</th>
                    <th>STAY</th>
                    <th>GUEST</th>
                    <th>ASSIGNED SPECIALIST</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {conciergeRequests.map((r) => (
                    <tr key={r.id}>
                      <td><strong>{r.serviceTitle}</strong></td>
                      <td>{r.category.toUpperCase()}</td>
                      <td>{r.propertyName}</td>
                      <td>{r.guestName}</td>
                      <td>{r.assignedProviderName || 'Unassigned'}</td>
                      <td>
                        <Badge
                          variant={
                            r.status === 'completed'
                              ? 'completed'
                              : r.status === 'in_progress'
                                ? 'in_progress'
                                : r.status === 'assigned'
                                  ? 'assigned'
                                  : r.status === 'requested' || r.status === 'pending'
                                    ? 'pending'
                                    : 'unassigned'
                          }
                          size="sm"
                          dot
                        >
                          {r.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vetted Providers View */}
        {activeTab === 'providers' && (
          <div className="admin-table-card">
            <div className="card-header-bar">
              <h3 className="card-heading">Registered Local Service Guild</h3>
            </div>
            <div className="providers-grid-view">
              {serviceProviders.map((prov) => (
                <div key={prov.id} className="prov-card">
                  <img src={prov.avatar} alt={prov.name} className="prov-avatar" />
                  <div className="prov-info">
                    <div className="prov-name-row">
                      <strong className="prov-name">{prov.name}</strong>
                      <ShieldCheck size={16} color="var(--primary)" />
                    </div>
                    <span className="prov-company">{prov.company}</span>
                    <span className="prov-city">{prov.city}</span>
                    <div className="prov-meta-line">
                      <span>{prov.rating} ★ Rating</span>
                      <span>•</span>
                      <span>{prov.completedJobs} Jobs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Maintenance Queue */}
        {activeTab === 'maintenance' && (
          <div className="admin-table-card">
            <div className="card-header-bar">
              <h3 className="card-heading">Platform Maintenance Tickets</h3>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>CATEGORY</th>
                    <th>ISSUE TITLE</th>
                    <th>PROPERTY</th>
                    <th>GUEST</th>
                    <th>ASSIGNED TECHNICIAN</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceTickets.map((t) => (
                    <tr key={t.id}>
                      <td><strong>{t.category}</strong></td>
                      <td>{t.title}</td>
                      <td>{t.propertyName}</td>
                      <td>{t.guestName}</td>
                      <td>{t.assignedToName || 'Pending'}</td>
                      <td>
                        <Badge variant={t.status === 'resolved' ? 'completed' : 'progress'} size="sm" dot>
                          {t.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
