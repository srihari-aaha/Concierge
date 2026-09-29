import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Filter,
  Users,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Phone,
  Mail,
  Home,
  MessageSquare,
  DollarSign,
  Plus,
  Send,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import PriorityBadge from '../../components/admin/PriorityBadge';
import DetailDrawer from '../../components/admin/DetailDrawer';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import EmptyState from '../../components/admin/EmptyState';
import Button from '../../components/common/Button';
import './AdminConciergePage.css';

export default function AdminConciergePage() {
  const { conciergeRequests, serviceProviders, currentUser, showToast } = useApp();
  const {
    staffMembers,
    updateConciergeRequest,
    assignConciergeStaff,
    escalateConciergeRequest,
    completeConciergeRequest,
    auditLogs
  } = useAdmin();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all'; // all, pending, assigned, in_progress, completed, escalated
  const [activeTab, setActiveTab] = useState(initialTab);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  // Selected Request Drawer
  const selectedReqId = searchParams.get('id');
  const [drawerRequest, setDrawerRequest] = useState(() => {
    return conciergeRequests.find((r) => r.id === selectedReqId) || null;
  });

  // Internal Note Input
  const [internalNoteText, setInternalNoteText] = useState('');
  const [internalNotesList, setInternalNotesList] = useState({});

  // Confirm Action Dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'primary',
    confirmText: 'Confirm',
    onConfirm: () => {}
  });

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return conciergeRequests.filter((r) => {
      // Tab filter
      if (activeTab === 'pending' && r.status !== 'requested' && r.status !== 'pending') return false;
      if (activeTab === 'assigned' && r.status !== 'assigned') return false;
      if (activeTab === 'in_progress' && r.status !== 'in_progress') return false;
      if (activeTab === 'completed' && r.status !== 'completed') return false;
      if (activeTab === 'escalated' && r.status !== 'escalated') return false;

      // Priority
      if (priorityFilter !== 'all' && (r.priority || 'normal') !== priorityFilter) return false;

      // Service
      if (serviceFilter !== 'all' && !(r.serviceTitle || '').toLowerCase().includes(serviceFilter.toLowerCase())) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (r.serviceTitle || '').toLowerCase().includes(q);
        const matchesGuest = (r.guestName || '').toLowerCase().includes(q);
        const matchesProp = (r.propertyName || '').toLowerCase().includes(q);
        const matchesId = (r.id || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesGuest && !matchesProp && !matchesId) return false;
      }

      return true;
    });
  }, [conciergeRequests, activeTab, priorityFilter, serviceFilter, searchQuery]);

  const counts = {
    all: conciergeRequests.length,
    pending: conciergeRequests.filter((r) => r.status === 'requested' || r.status === 'pending').length,
    assigned: conciergeRequests.filter((r) => r.status === 'assigned').length,
    in_progress: conciergeRequests.filter((r) => r.status === 'in_progress').length,
    completed: conciergeRequests.filter((r) => r.status === 'completed').length,
    escalated: conciergeRequests.filter((r) => r.status === 'escalated').length
  };

  const handleOpenDetail = (req) => {
    setDrawerRequest(req);
    setSearchParams({ id: req.id });
  };

  const handleCloseDetail = () => {
    setDrawerRequest(null);
    setSearchParams({});
  };

  const handleAssignStaff = (reqId, staffId) => {
    assignConciergeStaff(reqId, staffId);
    const staff = staffMembers.find((s) => s.id === staffId);
    if (drawerRequest?.id === reqId) {
      setDrawerRequest({
        ...drawerRequest,
        status: 'assigned',
        assignedProviderName: staff ? staff.name : 'Assigned Staff',
        statusTimeline: [
          ...(drawerRequest.statusTimeline || []),
          { step: 'Staff Assigned', time: 'Just now', label: `Assigned to ${staff?.name || 'Staff'}` }
        ]
      });
    }
  };

  const handleEscalate = (req) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Escalate Concierge Request',
      message: `Escalate request "${req.serviceTitle}" for VIP guest ${req.guestName}. Concierge Director and on-duty supervisor will receive priority SMS dispatch.`,
      variant: 'warning',
      confirmText: 'Escalate Now',
      onConfirm: () => {
        escalateConciergeRequest(req.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        if (drawerRequest?.id === req.id) {
          setDrawerRequest({ ...drawerRequest, status: 'escalated', priority: 'urgent' });
        }
      }
    });
  };

  const handleComplete = (req) => {
    completeConciergeRequest(req.id);
    if (drawerRequest?.id === req.id) {
      setDrawerRequest({
        ...drawerRequest,
        status: 'completed',
        statusTimeline: [
          ...(drawerRequest.statusTimeline || []),
          { step: 'Completed', time: 'Just now', label: 'Service successfully rendered' }
        ]
      });
    }
  };

  const handleAddInternalNote = (e) => {
    e.preventDefault();
    if (!internalNoteText.trim() || !drawerRequest) return;

    const newNote = {
      id: `note-${Date.now()}`,
      author: currentUser.name,
      text: internalNoteText.trim(),
      timestamp: 'Just now'
    };

    setInternalNotesList((prev) => ({
      ...prev,
      [drawerRequest.id]: [...(prev[drawerRequest.id] || []), newNote]
    }));

    setInternalNoteText('');
    showToast('Internal operational note saved.', 'success');
  };

  // Concierge team staff options
  const conciergeStaff = staffMembers.filter(
    (s) => s.role === 'Concierge' || s.role === 'Concierge Manager' || s.role === 'Super Admin'
  );

  return (
    <AdminLayout>
      <div className="admin-concierge-page">
        <PageHeader
          title="Concierge Operations Desk"
          subtitle="Real-time guest service dispatch, airport transfers, in-villa dining, and emergency requests"
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Concierge' }
          ]}
          actions={
            <div className="concierge-top-stats">
              <span className="sla-chip">
                <Clock size={13} /> Average SLA First Response: <strong>11 Mins</strong>
              </span>
            </div>
          }
        />

        {/* Tab Strip */}
        <div className="concierge-tab-bar">
          <div className="tab-pill-group">
            <button
              type="button"
              className={`concierge-tab-pill ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Requests ({counts.all})
            </button>
            <button
              type="button"
              className={`concierge-tab-pill ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Dispatch ({counts.pending})
            </button>
            <button
              type="button"
              className={`concierge-tab-pill ${activeTab === 'assigned' ? 'active' : ''}`}
              onClick={() => setActiveTab('assigned')}
            >
              Assigned ({counts.assigned})
            </button>
            <button
              type="button"
              className={`concierge-tab-pill ${activeTab === 'in_progress' ? 'active' : ''}`}
              onClick={() => setActiveTab('in_progress')}
            >
              In Progress ({counts.in_progress})
            </button>
            <button
              type="button"
              className={`concierge-tab-pill ${activeTab === 'escalated' ? 'active' : ''}`}
              onClick={() => setActiveTab('escalated')}
            >
              Escalated ({counts.escalated})
            </button>
            <button
              type="button"
              className={`concierge-tab-pill ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed ({counts.completed})
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="concierge-filter-bar">
          <div className="filter-search-input">
            <Search size={16} className="filter-icon" />
            <input
              type="text"
              placeholder="Search request ID, service, guest or property..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-selects-row">
            <select
              className="admin-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>

            <select
              className="admin-select"
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              <option value="all">All Services</option>
              <option value="airport">Airport VIP Transfer</option>
              <option value="chef">In-Villa Dining & Chef</option>
              <option value="housekeeping">Extra Housekeeping</option>
              <option value="transport">Local Mobility & Cab</option>
              <option value="catamaran">Catamaran Sailing</option>
              <option value="massage">Ayurvedic Wellness</option>
            </select>

            {(searchQuery || priorityFilter !== 'all' || serviceFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setPriorityFilter('all');
                  setServiceFilter('all');
                  setActiveTab('all');
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Operational Table */}
        {filteredRequests.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No concierge requests found"
            description="All guest service tickets have been resolved or match filters are clear."
            actionText="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setPriorityFilter('all');
              setServiceFilter('all');
              setActiveTab('all');
            }}
          />
        ) : (
          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>REQUEST ID</th>
                  <th>GUEST</th>
                  <th>PROPERTY</th>
                  <th>SERVICE REQUESTED</th>
                  <th>PRIORITY</th>
                  <th>DUE SCHEDULE</th>
                  <th>ASSIGNED STAFF</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.id} onClick={() => handleOpenDetail(req)} style={{ cursor: 'pointer' }}>
                    <td>
                      <span className="req-id-tag">{req.id}</span>
                    </td>
                    <td>
                      <div className="guest-title-wrap">
                        <span className="guest-name-text">{req.guestName}</span>
                        <span className="guest-phone-sub">{req.guestPhone || '+91 98201 55678'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="prop-name-text">{req.propertyName}</span>
                    </td>
                    <td>
                      <strong className="service-name-text">{req.serviceTitle}</strong>
                    </td>
                    <td>
                      <PriorityBadge priority={req.priority || 'normal'} />
                    </td>
                    <td>
                      <span className="due-time-text">
                        <Clock size={12} /> {req.date || 'Today, 03:00 PM'}
                      </span>
                    </td>
                    <td>
                      <span className="staff-assigned-tag">
                        {req.assignedProviderName || 'Awaiting Dispatch'}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={req.status} />
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div className="table-row-actions">
                        {req.status !== 'completed' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleComplete(req)}
                          >
                            Complete
                          </Button>
                        )}
                        {req.status !== 'escalated' && req.status !== 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEscalate(req)}
                          >
                            Escalate
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDetail(req)}
                        >
                          Dispatch
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Section 14: Concierge Request Detail Drawer */}
        {drawerRequest && (
          <DetailDrawer
            isOpen={Boolean(drawerRequest)}
            onClose={handleCloseDetail}
            title={drawerRequest.serviceTitle}
            subtitle={`Request ID: ${drawerRequest.id} • ${drawerRequest.propertyName}`}
            badges={
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <StatusBadge status={drawerRequest.status} />
                <PriorityBadge priority={drawerRequest.priority || 'normal'} />
              </div>
            }
            width="620px"
            footer={
              <div className="drawer-footer-actions">
                {drawerRequest.status !== 'completed' && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={CheckCircle}
                    onClick={() => handleComplete(drawerRequest)}
                  >
                    Mark as Completed
                  </Button>
                )}
                {drawerRequest.status !== 'escalated' && drawerRequest.status !== 'completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={AlertTriangle}
                    onClick={() => handleEscalate(drawerRequest)}
                  >
                    Escalate to Director
                  </Button>
                )}
              </div>
            }
          >
            {/* Guest & Property Contact Info */}
            <div className="drawer-contact-card">
              <div className="contact-col">
                <span className="contact-label">Guest Profile</span>
                <strong className="contact-val">{drawerRequest.guestName}</strong>
                <span className="contact-sub"><Phone size={12} /> {drawerRequest.guestPhone || '+91 98201 55678'}</span>
              </div>
              <div className="contact-col">
                <span className="contact-label">Property & Destination</span>
                <strong className="contact-val">{drawerRequest.propertyName}</strong>
                <span className="contact-sub">Villa Suite • North Goa Belt</span>
              </div>
            </div>

            {/* Staff Dispatch Assignment Selector */}
            <div className="drawer-dispatch-box">
              <label className="dispatch-label">
                <UserCheck size={16} /> Assign / Reassign Concierge Specialist:
              </label>
              <div className="dispatch-row">
                <select
                  className="admin-select full-width"
                  value={
                    conciergeStaff.find((s) => s.name === drawerRequest.assignedProviderName)?.id ||
                    'staff-2'
                  }
                  onChange={(e) => handleAssignStaff(drawerRequest.id, e.target.value)}
                >
                  {conciergeStaff.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} — {staff.role} ({staff.assignedRegions?.[0] || 'Goa'})
                    </option>
                  ))}
                  {serviceProviders.map((sp) => (
                    <option key={sp.id} value={sp.id}>
                      {sp.name} — Vetted Vendor ({sp.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service & Cost Breakdown */}
            <div className="service-cost-card">
              <div className="cost-row">
                <span>Requested Scheduled Time</span>
                <strong>{drawerRequest.date || 'Today, 03:00 PM'}</strong>
              </div>
              <div className="cost-row">
                <span>Service Estimation / Cost</span>
                <strong>₹{drawerRequest.cost ? Number(drawerRequest.cost).toLocaleString('en-IN') : '2,800'}</strong>
              </div>
              <div className="cost-row">
                <span>Settlement Status</span>
                <span className="paid-status-pill">Charged to Villa Folio (Paid)</span>
              </div>
            </div>

            {/* Chronological Activity Timeline (Section 14) */}
            <div className="drawer-timeline-sec">
              <h5 className="timeline-heading">Chronological Activity History</h5>
              <div className="chrono-timeline">
                <div className="chrono-step done">
                  <div className="step-circle" />
                  <div className="step-content">
                    <span className="step-time">10:15 AM</span>
                    <strong>Guest Created Request</strong>
                    <p>{drawerRequest.guestName} requested {drawerRequest.serviceTitle}</p>
                  </div>
                </div>

                <div className="chrono-step done">
                  <div className="step-circle" />
                  <div className="step-content">
                    <span className="step-time">10:18 AM</span>
                    <strong>Admin Concierge Dispatch</strong>
                    <p>Assigned to {drawerRequest.assignedProviderName || 'Rajesh Nair'}</p>
                  </div>
                </div>

                <div className={`chrono-step ${drawerRequest.status !== 'requested' ? 'done' : 'pending'}`}>
                  <div className="step-circle" />
                  <div className="step-content">
                    <span className="step-time">10:35 AM</span>
                    <strong>Service Partner Confirmed</strong>
                    <p>Driver / Specialist confirmed flight arrival & luxury vehicle ready</p>
                  </div>
                </div>

                {drawerRequest.status === 'completed' && (
                  <div className="chrono-step done">
                    <div className="step-circle green" />
                    <div className="step-content">
                      <span className="step-time">11:20 AM</span>
                      <strong>Request Completed Successfully</strong>
                      <p>Guest arrived at villa gates; concierge luggage assistance provided</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Internal Staff Notes & Add Note Form */}
            <div className="drawer-notes-section">
              <h5 className="timeline-heading">Internal Operational Notes</h5>

              <div className="internal-notes-stream">
                {/* Default note */}
                <div className="internal-note-bubble">
                  <div className="note-top">
                    <strong>Rajesh Nair (Concierge Manager)</strong>
                    <span>10:20 AM</span>
                  </div>
                  <p>Flight 6E-284 from Bengaluru tracking on time at MOPA terminal. Chauffeur waiting at Pillar 4 with StayEase welcome placard.</p>
                </div>

                {/* Additional user notes */}
                {(internalNotesList[drawerRequest.id] || []).map((n) => (
                  <div key={n.id} className="internal-note-bubble user-added">
                    <div className="note-top">
                      <strong>{n.author}</strong>
                      <span>{n.timestamp}</span>
                    </div>
                    <p>{n.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddInternalNote} className="add-note-form">
                <input
                  type="text"
                  placeholder="Add internal coordination note..."
                  value={internalNoteText}
                  onChange={(e) => setInternalNoteText(e.target.value)}
                />
                <Button variant="primary" size="sm" type="submit" icon={Send}>
                  Save Note
                </Button>
              </form>
            </div>
          </DetailDrawer>
        )}

        {/* Reusable Confirm Dialog */}
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
