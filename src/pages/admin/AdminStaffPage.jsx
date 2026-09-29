import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  UserCheck,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  MapPin,
  Star,
  CheckCircle,
  Clock,
  Briefcase,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import DetailDrawer from '../../components/admin/DetailDrawer';
import EmptyState from '../../components/admin/EmptyState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import './AdminStaffPage.css';

export default function AdminStaffPage() {
  const { staffMembers, updateStaffMember, addStaffMember } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const [roleFilter, setRoleFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedStaffId = searchParams.get('id');
  const [drawerStaff, setDrawerStaff] = useState(() => {
    return staffMembers.find((s) => s.id === selectedStaffId) || null;
  });

  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [newStaffData, setNewStaffData] = useState({
    name: '',
    role: 'Concierge',
    email: '',
    phone: '',
    assignedRegions: 'Goa Coastal Belt'
  });

  const filteredStaff = useMemo(() => {
    return staffMembers.filter((s) => {
      if (roleFilter !== 'all' && s.role !== roleFilter) return false;
      if (availabilityFilter !== 'all' && s.availability !== availabilityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.phone.includes(q) ||
          s.role.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [staffMembers, roleFilter, availabilityFilter, searchQuery]);

  const handleOpenDetail = (s) => {
    setDrawerStaff(s);
    setSearchParams({ id: s.id });
  };

  const handleCloseDetail = () => {
    setDrawerStaff(null);
    setSearchParams({});
  };

  const handleToggleAvailability = (staff, newAvail) => {
    updateStaffMember(staff.id, { availability: newAvail });
    if (drawerStaff?.id === staff.id) {
      setDrawerStaff({ ...drawerStaff, availability: newAvail });
    }
  };

  const handleCreateStaffSubmit = (e) => {
    e.preventDefault();
    addStaffMember({
      ...newStaffData,
      assignedRegions: [newStaffData.assignedRegions]
    });
    setIsAddStaffModalOpen(false);
    setNewStaffData({
      name: '',
      role: 'Concierge',
      email: '',
      phone: '',
      assignedRegions: 'Goa Coastal Belt'
    });
  };

  return (
    <AdminLayout>
      <div className="admin-staff-page">
        <PageHeader
          title="Staff & Service Fleet Roster"
          subtitle="Manage operations managers, verified concierge attendants, housekeeping crews, and maintenance teams"
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Staff' }
          ]}
          actions={
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => setIsAddStaffModalOpen(true)}
            >
              Add Staff Member
            </Button>
          }
        />

        {/* Filter Controls */}
        <div className="staff-filter-bar">
          <div className="filter-search-input">
            <Search size={16} className="filter-icon" />
            <input
              type="text"
              placeholder="Search by staff name, role, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-selects-row">
            <select
              className="admin-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Operational Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Property Manager">Property Manager</option>
              <option value="Concierge Manager">Concierge Manager</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Finance">Finance</option>
              <option value="Support">Support</option>
            </select>

            <select
              className="admin-select"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="all">All Availabilities</option>
              <option value="available">Available</option>
              <option value="busy">On Task / Busy</option>
              <option value="on_leave">On Leave</option>
            </select>

            {(searchQuery || roleFilter !== 'all' || availabilityFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('all');
                  setAvailabilityFilter('all');
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Staff Table */}
        {filteredStaff.length === 0 ? (
          <EmptyState
            icon={UserCheck}
            title="No staff members found"
            description="No crew members match the selected filters."
            actionText="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setRoleFilter('all');
              setAvailabilityFilter('all');
            }}
          />
        ) : (
          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>STAFF MEMBER</th>
                  <th>ROLE</th>
                  <th>CONTACT</th>
                  <th>ASSIGNED REGIONS</th>
                  <th>CURRENT TASKS</th>
                  <th>AVAILABILITY</th>
                  <th>PERFORMANCE</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((s) => (
                  <tr key={s.id} onClick={() => handleOpenDetail(s)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div className="staff-cell-flex">
                        <img src={s.avatar} alt={s.name} className="staff-table-thumb" />
                        <div>
                          <strong className="staff-name-bold">{s.name}</strong>
                          <span className="staff-join-sub">Joined {s.joinedDate || '2023'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="staff-role-badge">{s.role}</span>
                    </td>
                    <td>
                      <div className="staff-contact-cell">
                        <span><Mail size={12} /> {s.email}</span>
                        <span><Phone size={12} /> {s.phone}</span>
                      </div>
                    </td>
                    <td>
                      <span className="regions-text">
                        <MapPin size={12} /> {s.assignedRegions?.join(', ') || 'Goa'}
                      </span>
                    </td>
                    <td>
                      <span className="task-count-pill">{s.currentTasks} Active</span>
                    </td>
                    <td>
                      <StatusBadge status={s.availability} />
                    </td>
                    <td>
                      <span className="rating-pill">
                        <Star size={13} className="star-icon" /> {s.rating || '4.9'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div className="table-row-actions">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDetail(s)}
                        >
                          Profile & Roster
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Staff Detail Drawer */}
        {drawerStaff && (
          <DetailDrawer
            isOpen={Boolean(drawerStaff)}
            onClose={handleCloseDetail}
            title={drawerStaff.name}
            subtitle={`${drawerStaff.role} • ${drawerStaff.email}`}
            badges={<StatusBadge status={drawerStaff.availability} />}
            width="560px"
            footer={
              <div className="drawer-footer-actions">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleToggleAvailability(
                      drawerStaff,
                      drawerStaff.availability === 'available' ? 'busy' : 'available'
                    )
                  }
                >
                  Toggle Availability (Currently {drawerStaff.availability.toUpperCase()})
                </Button>
              </div>
            }
          >
            <div className="staff-drawer-box">
              <div className="staff-header-banner">
                <img src={drawerStaff.avatar} alt={drawerStaff.name} className="staff-big-avatar" />
                <div>
                  <h4 className="staff-hero-name">{drawerStaff.name}</h4>
                  <span className="staff-hero-role">{drawerStaff.role}</span>
                  <p className="staff-hero-phone">{drawerStaff.phone} • {drawerStaff.email}</p>
                </div>
              </div>

              <div className="staff-stat-row">
                <div className="staff-box">
                  <span className="s-lbl">Current Active Tasks</span>
                  <strong className="s-val">{drawerStaff.currentTasks} Tasks</strong>
                </div>
                <div className="staff-box">
                  <span className="s-lbl">Performance Score</span>
                  <strong className="s-val" style={{ color: '#B45309' }}>★ {drawerStaff.rating} / 5.0</strong>
                </div>
                <div className="staff-box">
                  <span className="s-lbl">On-Ground Regions</span>
                  <strong className="s-val" style={{ fontSize: '0.8rem' }}>{drawerStaff.assignedRegions?.join(', ')}</strong>
                </div>
              </div>

              <div className="drawer-section">
                <h5 className="section-sub-title">Assigned RBAC Permissions</h5>
                <div className="permissions-chip-list">
                  {(drawerStaff.permissions || ['operations.manage', 'concierge.view']).map((p, i) => (
                    <span key={i} className="perm-chip">✓ {p}</span>
                  ))}
                </div>
              </div>
            </div>
          </DetailDrawer>
        )}

        {/* Modal: Add Staff Member */}
        <Modal
          isOpen={isAddStaffModalOpen}
          onClose={() => setIsAddStaffModalOpen(false)}
          title="Onboard New Operational Staff Member"
          subtitle="Add an admin, manager, concierge specialist, or housekeeping technician"
          maxWidth="520px"
        >
          <form onSubmit={handleCreateStaffSubmit} className="add-staff-form">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sen"
                value={newStaffData.name}
                onChange={(e) => setNewStaffData({ ...newStaffData, name: e.target.value })}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Operational Role *</label>
                <select
                  value={newStaffData.role}
                  onChange={(e) => setNewStaffData({ ...newStaffData, role: e.target.value })}
                >
                  <option value="Concierge">Concierge Specialist</option>
                  <option value="Concierge Manager">Concierge Manager</option>
                  <option value="Property Manager">Property Manager</option>
                  <option value="Housekeeping">Housekeeping Lead</option>
                  <option value="Maintenance">Maintenance Technician</option>
                  <option value="Support">Guest Support</option>
                  <option value="Finance">Finance & Accounts</option>
                </select>
              </div>

              <div className="form-group">
                <label>Assigned Region *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Goa (Ashwem)"
                  value={newStaffData.assignedRegions}
                  onChange={(e) => setNewStaffData({ ...newStaffData, assignedRegions: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="rahul.sen@stayease.in"
                  value={newStaffData.email}
                  onChange={(e) => setNewStaffData({ ...newStaffData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Contact Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98221 00000"
                  value={newStaffData.phone}
                  onChange={(e) => setNewStaffData({ ...newStaffData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-actions-row">
              <Button variant="outline" size="md" onClick={() => setIsAddStaffModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                Register Staff
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
