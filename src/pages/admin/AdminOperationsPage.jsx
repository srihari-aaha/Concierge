import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Wrench,
  Sparkles,
  CheckCircle,
  Clock,
  Key,
  UserCheck,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  Home,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import PriorityBadge from '../../components/admin/PriorityBadge';
import DetailDrawer from '../../components/admin/DetailDrawer';
import EmptyState from '../../components/admin/EmptyState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import './AdminOperationsPage.css';

export default function AdminOperationsPage() {
  const { maintenanceTickets, properties, currentUser, resolveMaintenanceTicket } = useApp();
  const {
    housekeepingTasks,
    updateHousekeepingStatus,
    addHousekeepingTask,
    staffMembers
  } = useAdmin();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'housekeeping'; // housekeeping, maintenance, keys, staff
  const [activeTab, setActiveTab] = useState(initialTab);

  // Filters
  const [hkStatusFilter, setHkStatusFilter] = useState('all');
  const [maintStatusFilter, setMaintStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isNewHkModalOpen, setIsNewHkModalOpen] = useState(false);
  const [newHkData, setNewHkData] = useState({
    propertyName: 'Palm Grove Retreat',
    room: 'Entire Villa (3 BHK)',
    cleaningType: 'Turnover Clean',
    assignedStaffId: 'staff-3',
    assignedStaffName: 'Sunita Pillai',
    checkOutTime: '11:00 AM Today',
    cleaningDeadline: '02:30 PM Today',
    notes: 'Change all linens, plunge pool skim, restock fresh coconut water.'
  });

  // Selected Detail Drawers
  const [selectedHkTask, setSelectedHkTask] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Housekeeping staff
  const hkStaff = staffMembers.filter((s) => s.role === 'Housekeeping' || s.role === 'Operations');
  const maintStaff = staffMembers.filter((s) => s.role === 'Maintenance');

  // Filtered Housekeeping
  const filteredHk = useMemo(() => {
    return housekeepingTasks.filter((t) => {
      if (hkStatusFilter !== 'all' && t.status !== hkStatusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.propertyName.toLowerCase().includes(q) ||
          t.room.toLowerCase().includes(q) ||
          t.assignedStaffName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [housekeepingTasks, hkStatusFilter, searchQuery]);

  // Filtered Maintenance
  const filteredMaint = useMemo(() => {
    return maintenanceTickets.filter((m) => {
      if (maintStatusFilter !== 'all' && m.status !== maintStatusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          (m.title || '').toLowerCase().includes(q) ||
          (m.propertyName || '').toLowerCase().includes(q) ||
          (m.assignedToName || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [maintenanceTickets, maintStatusFilter, searchQuery]);

  const handleCreateHkSubmit = (e) => {
    e.preventDefault();
    const staff = staffMembers.find((s) => s.id === newHkData.assignedStaffId);
    addHousekeepingTask({
      ...newHkData,
      assignedStaffName: staff ? staff.name : 'Sunita Pillai'
    });
    setIsNewHkModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="admin-operations-page">
        <PageHeader
          title="On-Ground Operations & Facility Management"
          subtitle="Real-time villa turnover schedules, maintenance triage, digital door access, and staff dispatch"
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Operations' }
          ]}
          actions={
            activeTab === 'housekeeping' ? (
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => setIsNewHkModalOpen(true)}
              >
                Schedule Turnover Clean
              </Button>
            ) : null
          }
        />

        {/* Tab Strip */}
        <div className="operations-tab-bar">
          <button
            type="button"
            className={`op-tab-pill ${activeTab === 'housekeeping' ? 'active' : ''}`}
            onClick={() => setActiveTab('housekeeping')}
          >
            <Sparkles size={15} /> Housekeeping & Turnovers ({housekeepingTasks.length})
          </button>
          <button
            type="button"
            className={`op-tab-pill ${activeTab === 'maintenance' ? 'active' : ''}`}
            onClick={() => setActiveTab('maintenance')}
          >
            <Wrench size={15} /> Maintenance & Repairs ({maintenanceTickets.length})
          </button>
          <button
            type="button"
            className={`op-tab-pill ${activeTab === 'keys' ? 'active' : ''}`}
            onClick={() => setActiveTab('keys')}
          >
            <Key size={15} /> Key Management & Check-in / Out
          </button>
          <button
            type="button"
            className={`op-tab-pill ${activeTab === 'staff' ? 'active' : ''}`}
            onClick={() => setActiveTab('staff')}
          >
            <UserCheck size={15} /> Daily Staff Assignments
          </button>
        </div>

        {/* TAB 1: Housekeeping */}
        {activeTab === 'housekeeping' && (
          <div className="op-tab-pane">
            <div className="op-filter-strip">
              <div className="filter-search-input">
                <Search size={16} className="filter-icon" />
                <input
                  type="text"
                  placeholder="Search property, room or assigned staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-selects-row">
                <select
                  className="admin-select"
                  value={hkStatusFilter}
                  onChange={(e) => setHkStatusFilter(e.target.value)}
                >
                  <option value="all">All Turnover Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="cleaning">In Cleaning</option>
                  <option value="inspection">Needs Inspection</option>
                  <option value="completed">Completed & Verified</option>
                </select>
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>ROOM / PROPERTY</th>
                    <th>CLEANING TYPE</th>
                    <th>ASSIGNED ATTENDANT</th>
                    <th>CHECK-OUT TIME</th>
                    <th>DEADLINE</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHk.map((task) => (
                    <tr key={task.id} onClick={() => setSelectedHkTask(task)} style={{ cursor: 'pointer' }}>
                      <td>
                        <div className="table-prop-cell">
                          <strong className="prop-name">{task.propertyName}</strong>
                          <span className="prop-loc">{task.room}</span>
                        </div>
                      </td>
                      <td>
                        <span className="cleaning-type-chip">{task.cleaningType}</span>
                      </td>
                      <td>
                        <span className="staff-assigned-tag">{task.assignedStaffName}</span>
                      </td>
                      <td>
                        <span className="time-sub-tag">{task.checkOutTime}</span>
                      </td>
                      <td>
                        <strong className="deadline-tag">{task.cleaningDeadline}</strong>
                      </td>
                      <td>
                        <StatusBadge status={task.status} />
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div className="table-row-actions">
                          {task.status === 'cleaning' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateHousekeepingStatus(task.id, 'inspection')}
                            >
                              Ready for Inspect
                            </Button>
                          )}
                          {task.status === 'inspection' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => updateHousekeepingStatus(task.id, 'completed')}
                            >
                              Certify Ready
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedHkTask(task)}
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
          </div>
        )}

        {/* TAB 2: Maintenance */}
        {activeTab === 'maintenance' && (
          <div className="op-tab-pane">
            <div className="op-filter-strip">
              <div className="filter-search-input">
                <Search size={16} className="filter-icon" />
                <input
                  type="text"
                  placeholder="Search maintenance issue or villa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-selects-row">
                <select
                  className="admin-select"
                  value={maintStatusFilter}
                  onChange={(e) => setMaintStatusFilter(e.target.value)}
                >
                  <option value="all">All Ticket Statuses</option>
                  <option value="reported">Reported</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="waiting_parts">Waiting Parts</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>ISSUE / TITLE</th>
                    <th>PROPERTY</th>
                    <th>LOCATION / CATEGORY</th>
                    <th>PRIORITY</th>
                    <th>REPORTED BY</th>
                    <th>ASSIGNED TECH</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaint.map((t) => (
                    <tr key={t.id} onClick={() => setSelectedTicket(t)} style={{ cursor: 'pointer' }}>
                      <td>
                        <div className="table-prop-cell">
                          <strong className="prop-name">{t.title}</strong>
                          <span className="prop-loc">{t.description || 'Reported via guest app'}</span>
                        </div>
                      </td>
                      <td>
                        <span className="prop-name-text">{t.propertyName}</span>
                      </td>
                      <td>
                        <span className="category-pill">{t.category || 'Electrical'}</span>
                      </td>
                      <td>
                        <PriorityBadge priority={t.priority || 'normal'} />
                      </td>
                      <td>
                        <span className="reporter-tag">{t.guestName || 'Guest'}</span>
                      </td>
                      <td>
                        <span className="staff-assigned-tag">
                          {t.assignedToName || 'Unassigned'}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={t.status} />
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div className="table-row-actions">
                          {t.status !== 'resolved' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => resolveMaintenanceTicket(t.id)}
                            >
                              Resolve
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTicket(t)}
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
          </div>
        )}

        {/* TAB 3: Key Management & Check-in / Out */}
        {activeTab === 'keys' && (
          <div className="keys-management-grid">
            {properties.slice(0, 6).map((prop) => (
              <div key={prop.id} className="key-card-item">
                <div className="key-card-top">
                  <Key size={18} color="var(--primary)" />
                  <span className="key-code-pill">PIN: <strong>{4100 + Math.floor(prop.id.charCodeAt(5) * 12)}</strong></span>
                </div>
                <h4 className="key-prop-name">{prop.name}</h4>
                <p className="key-prop-loc">{prop.location}</p>

                <div className="key-details-list">
                  <div className="key-row">
                    <span>Lock Type:</span>
                    <strong>Yale Smart Digital Lock (Wi-Fi)</strong>
                  </div>
                  <div className="key-row">
                    <span>Battery Status:</span>
                    <strong style={{ color: '#16A34A' }}>92% Healthy</strong>
                  </div>
                  <div className="key-row">
                    <span>Physical Master Key:</span>
                    <strong>Keybox Safe #04 (Manager Desk)</strong>
                  </div>
                  <div className="key-row">
                    <span>Late Checkout Protocol:</span>
                    <strong>Allowed until 1:30 PM upon request</strong>
                  </div>
                </div>

                <div className="key-card-footer">
                  <Button variant="outline" size="sm" fullWidth>
                    Regenerate Digital PIN
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: Daily Staff Assignments */}
        {activeTab === 'staff' && (
          <div className="staff-duty-grid">
            {staffMembers.map((staff) => (
              <div key={staff.id} className="staff-duty-card">
                <div className="staff-duty-header">
                  <img src={staff.avatar} alt={staff.name} className="staff-duty-avatar" />
                  <div>
                    <h4 className="staff-duty-name">{staff.name}</h4>
                    <span className="staff-duty-role">{staff.role}</span>
                  </div>
                  <StatusBadge status={staff.availability} />
                </div>

                <div className="staff-duty-body">
                  <div className="duty-row">
                    <span>Assigned Coverage:</span>
                    <strong>{staff.assignedRegions?.join(', ')}</strong>
                  </div>
                  <div className="duty-row">
                    <span>Active Workload:</span>
                    <strong>{staff.currentTasks} Tasks in progress</strong>
                  </div>
                  <div className="duty-row">
                    <span>Performance Rating:</span>
                    <strong style={{ color: '#B45309' }}>★ {staff.rating} / 5.0</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Housekeeping Detail Drawer */}
        {selectedHkTask && (
          <DetailDrawer
            isOpen={Boolean(selectedHkTask)}
            onClose={() => setSelectedHkTask(null)}
            title={`Turnover Clean — ${selectedHkTask.propertyName}`}
            subtitle={selectedHkTask.room}
            badges={<StatusBadge status={selectedHkTask.status} />}
            width="560px"
            footer={
              <div className="drawer-footer-actions">
                {selectedHkTask.status !== 'completed' && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={CheckCircle}
                    onClick={() => {
                      updateHousekeepingStatus(selectedHkTask.id, 'completed');
                      setSelectedHkTask(null);
                    }}
                  >
                    Certify Room Ready
                  </Button>
                )}
              </div>
            }
          >
            <div className="hk-drawer-details">
              <div className="hk-info-box">
                <div className="hk-row">
                  <span>Assigned Housekeeping Lead:</span>
                  <strong>{selectedHkTask.assignedStaffName}</strong>
                </div>
                <div className="hk-row">
                  <span>Checkout / Turnaround:</span>
                  <strong>{selectedHkTask.checkOutTime}</strong>
                </div>
                <div className="hk-row">
                  <span>Turnover Deadline:</span>
                  <strong>{selectedHkTask.cleaningDeadline}</strong>
                </div>
              </div>

              <div className="hk-notes-box">
                <h5>Supervisor Operational Notes:</h5>
                <p>{selectedHkTask.notes || 'Ensure full steam sterilization of mattresses and restock organic toiletries.'}</p>
              </div>

              <div className="hk-checklist-box">
                <h5>Sanitization Quality Checklist</h5>
                <div className="hk-checklist">
                  {(selectedHkTask.checklist || [
                    { task: 'Bed linen & towels replacement', done: true },
                    { task: 'Kitchen sanitization & restock', done: true },
                    { task: 'Plunge pool pH & leaf skim', done: false },
                    { task: 'Master Suite aroma diffuser activation', done: false }
                  ]).map((chk, i) => (
                    <div key={i} className="chk-row">
                      <input type="checkbox" defaultChecked={chk.done} />
                      <span className={chk.done ? 'chk-done' : ''}>{chk.task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DetailDrawer>
        )}

        {/* Modal: Schedule Turnover Clean */}
        <Modal
          isOpen={isNewHkModalOpen}
          onClose={() => setIsNewHkModalOpen(false)}
          title="Schedule Villa Turnover Cleaning"
          subtitle="Dispatch housekeeping team for turnover or deep sanitization"
          maxWidth="560px"
        >
          <form onSubmit={handleCreateHkSubmit} className="add-hk-form">
            <div className="form-group">
              <label>Select Property *</label>
              <select
                value={newHkData.propertyName}
                onChange={(e) => setNewHkData({ ...newHkData, propertyName: e.target.value })}
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Room / Section</label>
                <input
                  type="text"
                  required
                  value={newHkData.room}
                  onChange={(e) => setNewHkData({ ...newHkData, room: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Cleaning Type</label>
                <select
                  value={newHkData.cleaningType}
                  onChange={(e) => setNewHkData({ ...newHkData, cleaningType: e.target.value })}
                >
                  <option value="Turnover Clean">Turnover Clean (Checkout Turn)</option>
                  <option value="Deep Clean">Deep Clean & Steam Buffing</option>
                  <option value="Touch-up Clean">Touch-up Clean</option>
                  <option value="Post-Monsoon Clean">Post-Monsoon Clean</option>
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Assign Attendant *</label>
                <select
                  value={newHkData.assignedStaffId}
                  onChange={(e) => setNewHkData({ ...newHkData, assignedStaffId: e.target.value })}
                >
                  {hkStaff.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Completion Deadline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 02:00 PM Today"
                  value={newHkData.cleaningDeadline}
                  onChange={(e) => setNewHkData({ ...newHkData, cleaningDeadline: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Special Instructions / Checklist Items</label>
              <textarea
                rows="3"
                value={newHkData.notes}
                onChange={(e) => setNewHkData({ ...newHkData, notes: e.target.value })}
              />
            </div>

            <div className="form-actions-row">
              <Button variant="outline" size="md" onClick={() => setIsNewHkModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                Schedule Cleaning
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
