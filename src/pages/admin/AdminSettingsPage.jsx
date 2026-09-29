import React, { useState } from 'react';
import {
  Settings,
  Shield,
  MapPin,
  Sparkles,
  Percent,
  AlertCircle,
  Bell,
  Users,
  Save,
  Plus,
  Check,
  CheckCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/PageHeader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import './AdminSettingsPage.css';

export default function AdminSettingsPage() {
  const {
    locations,
    setLocations,
    conciergeCatalogue,
    setConciergeCatalogue,
    platformSettings,
    setPlatformSettings,
    rbacRoles,
    currentAdminRoleKey,
    setCurrentAdminRoleKey
  } = useAdmin();
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState('general'); // general, locations, services, fees, cancellation, notifications, rbac

  // General Settings Form
  const [generalForm, setGeneralForm] = useState(platformSettings.general);
  const [feesForm, setFeesForm] = useState(platformSettings.fees);
  const [cancellationForm, setCancellationForm] = useState(platformSettings.cancellation);

  // New Location Modal
  const [isNewLocModalOpen, setIsNewLocModalOpen] = useState(false);
  const [newLoc, setNewLoc] = useState({ city: '', state: '', code: '' });

  // Permissions list for matrix
  const permissionsList = [
    { key: 'properties.view', label: 'View Properties', group: 'Properties' },
    { key: 'properties.approve', label: 'Approve & Activate Listings', group: 'Properties' },
    { key: 'properties.edit', label: 'Modify Property Details & Rates', group: 'Properties' },
    { key: 'properties.delete', label: 'Delete Property Records', group: 'Properties' },

    { key: 'reservations.view', label: 'View Reservations Ledger', group: 'Reservations' },
    { key: 'reservations.edit', label: 'Modify Dates & Party Details', group: 'Reservations' },
    { key: 'reservations.cancel', label: 'Cancel Reservations', group: 'Reservations' },
    { key: 'reservations.refund', label: 'Authorize Refunds', group: 'Reservations' },

    { key: 'concierge.view', label: 'View Concierge Service Tickets', group: 'Concierge' },
    { key: 'concierge.assign', label: 'Assign & Reassign Providers', group: 'Concierge' },
    { key: 'concierge.escalate', label: 'Escalate to Management', group: 'Concierge' },

    { key: 'operations.manage', label: 'Dispatch Housekeeping & Repairs', group: 'Operations' },
    { key: 'payments.view', label: 'View Payment Ledgers & Fees', group: 'Finance' },
    { key: 'payments.payouts', label: 'Execute Host Bank Settlements', group: 'Finance' },
    { key: 'reviews.moderate', label: 'Moderate & Flag Guest Reviews', group: 'Quality' },
    { key: 'settings.manage', label: 'Modify Platform System Settings', group: 'Admin' }
  ];

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    setPlatformSettings((prev) => ({ ...prev, general: generalForm }));
    showToast('Platform general configuration saved.', 'success');
  };

  const handleSaveFees = (e) => {
    e.preventDefault();
    setPlatformSettings((prev) => ({ ...prev, fees: feesForm }));
    showToast('Fee structure & GST tax rates updated.', 'success');
  };

  const handleToggleServiceActive = (serviceId) => {
    setConciergeCatalogue((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, active: !s.active } : s))
    );
    showToast('Concierge service active status toggled.', 'info');
  };

  const handleAddLocationSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `loc-${Date.now()}`,
      city: newLoc.city,
      state: newLoc.state,
      country: 'India',
      code: newLoc.code || 'IND',
      activeProperties: 0,
      status: 'active'
    };
    setLocations((prev) => [...prev, created]);
    setIsNewLocModalOpen(false);
    setNewLoc({ city: '', state: '', code: '' });
    showToast(`New holiday destination "${created.city}" activated.`, 'success');
  };

  return (
    <AdminLayout>
      <div className="admin-settings-page">
        <PageHeader
          title="Platform Settings & Governance"
          subtitle="Configure regional destination markets, concierge catalogue SLAs, fee structures, and RBAC permission matrices"
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Settings' }
          ]}
        />

        {/* Tab Navigation */}
        <div className="settings-tab-bar">
          <button
            type="button"
            className={`set-tab-pill ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            type="button"
            className={`set-tab-pill ${activeTab === 'locations' ? 'active' : ''}`}
            onClick={() => setActiveTab('locations')}
          >
            Holiday Locations ({locations.length})
          </button>
          <button
            type="button"
            className={`set-tab-pill ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Concierge Services ({conciergeCatalogue.length})
          </button>
          <button
            type="button"
            className={`set-tab-pill ${activeTab === 'fees' ? 'active' : ''}`}
            onClick={() => setActiveTab('fees')}
          >
            Fees & Taxes
          </button>
          <button
            type="button"
            className={`set-tab-pill ${activeTab === 'cancellation' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancellation')}
          >
            Cancellation Policy
          </button>
          <button
            type="button"
            className={`set-tab-pill ${activeTab === 'rbac' ? 'active' : ''}`}
            onClick={() => setActiveTab('rbac')}
          >
            Roles & RBAC Matrix
          </button>
        </div>

        {/* TAB 1: General */}
        {activeTab === 'general' && (
          <div className="settings-card-panel">
            <h3 className="settings-panel-title">Platform Identity & Localization</h3>
            <p className="settings-panel-subtitle">Core operational parameters and contact handles</p>

            <form onSubmit={handleSaveGeneral} className="settings-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Platform Brand Name</label>
                  <input
                    type="text"
                    value={generalForm.platformName}
                    onChange={(e) => setGeneralForm({ ...generalForm, platformName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Default Currency</label>
                  <input
                    type="text"
                    value={generalForm.currency}
                    onChange={(e) => setGeneralForm({ ...generalForm, currency: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Support Helpline Email</label>
                  <input
                    type="email"
                    value={generalForm.supportEmail}
                    onChange={(e) => setGeneralForm({ ...generalForm, supportEmail: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>24/7 Rapid Response Concierge Phone</label>
                  <input
                    type="text"
                    value={generalForm.supportPhone}
                    onChange={(e) => setGeneralForm({ ...generalForm, supportPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Timezone</label>
                <input
                  type="text"
                  disabled
                  value={generalForm.timezone}
                />
              </div>

              <div className="form-actions-row">
                <Button variant="primary" size="md" type="submit" icon={Save}>
                  Save Platform Settings
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: Locations */}
        {activeTab === 'locations' && (
          <div className="settings-card-panel">
            <div className="panel-header-row">
              <div>
                <h3 className="settings-panel-title">Managed Indian Holiday Destinations</h3>
                <p className="settings-panel-subtitle">Regional clusters with active villa inventory and concierge fleets</p>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => setIsNewLocModalOpen(true)}
              >
                Add Destination
              </Button>
            </div>

            <div className="admin-table-container" style={{ marginTop: '1.25rem' }}>
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>DESTINATION CLUSTER</th>
                    <th>STATE</th>
                    <th>COUNTRY</th>
                    <th>REGION CODE</th>
                    <th>ACTIVE VILLAS</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((loc) => (
                    <tr key={loc.id}>
                      <td>
                        <div className="dest-name-cell">
                          <MapPin size={14} color="var(--primary)" />
                          <strong>{loc.city}</strong>
                        </div>
                      </td>
                      <td>{loc.state}</td>
                      <td>{loc.country}</td>
                      <td>
                        <span className="code-pill">{loc.code}</span>
                      </td>
                      <td>
                        <strong>{loc.activeProperties} Stays</strong>
                      </td>
                      <td>
                        <span className="active-dot-pill">Active Corridor</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Concierge Services Catalogue */}
        {activeTab === 'services' && (
          <div className="settings-card-panel">
            <h3 className="settings-panel-title">Concierge Service Marketplace Catalogue</h3>
            <p className="settings-panel-subtitle">Base rates, fulfillment SLAs, and active guest visibility toggles</p>

            <div className="services-catalogue-grid">
              {conciergeCatalogue.map((srv) => (
                <div key={srv.id} className={`service-item-card ${!srv.active ? 'disabled' : ''}`}>
                  <div className="srv-card-top">
                    <span className="srv-category-tag">{srv.category}</span>
                    <button
                      type="button"
                      className="toggle-active-btn"
                      onClick={() => handleToggleServiceActive(srv.id)}
                      title={srv.active ? 'Deactivate Service' : 'Activate Service'}
                    >
                      {srv.active ? (
                        <span className="active-text-green">Active</span>
                      ) : (
                        <span className="inactive-text-gray">Paused</span>
                      )}
                    </button>
                  </div>

                  <h4 className="srv-card-title">{srv.title}</h4>
                  <p className="srv-card-desc">{srv.desc}</p>

                  <div className="srv-card-footer">
                    <div>
                      <span className="srv-meta-lbl">Base Price</span>
                      <strong className="srv-meta-val">₹{srv.basePrice?.toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span className="srv-meta-lbl">Guaranteed SLA</span>
                      <strong className="srv-meta-val">{srv.slaHours} Hours</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Fees & Taxes */}
        {activeTab === 'fees' && (
          <div className="settings-card-panel">
            <h3 className="settings-panel-title">Platform Fees & Tax Configuration</h3>
            <p className="settings-panel-subtitle">Commission splits and Goods & Services Tax (GST) definitions</p>

            <form onSubmit={handleSaveFees} className="settings-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Guest Service Platform Fee (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={feesForm.guestServiceFeePercent}
                    onChange={(e) => setFeesForm({ ...feesForm, guestServiceFeePercent: Number(e.target.value) })}
                  />
                  <span className="field-hint">Applied to gross booking subtotal</span>
                </div>

                <div className="form-group">
                  <label>Host / Owner Commission Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={feesForm.ownerCommissionPercent}
                    onChange={(e) => setFeesForm({ ...feesForm, ownerCommissionPercent: Number(e.target.value) })}
                  />
                  <span className="field-hint">Deducted from owner settlement disbursement</span>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Default Cleaning & Turnover Fee (₹)</label>
                  <input
                    type="number"
                    value={feesForm.cleaningFeeDefault}
                    onChange={(e) => setFeesForm({ ...feesForm, cleaningFeeDefault: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Applicable GST Rate (%)</label>
                  <input
                    type="number"
                    value={feesForm.gstPercent}
                    onChange={(e) => setFeesForm({ ...feesForm, gstPercent: Number(e.target.value) })}
                  />
                  <span className="field-hint">Standard GST on hospitality services</span>
                </div>
              </div>

              <div className="form-group">
                <label>Corporate GST Registration Number</label>
                <input
                  type="text"
                  value={feesForm.gstRegistration}
                  onChange={(e) => setFeesForm({ ...feesForm, gstRegistration: e.target.value })}
                />
              </div>

              <div className="form-actions-row">
                <Button variant="primary" size="md" type="submit" icon={Save}>
                  Save Fee Schedule
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: Cancellation Policy */}
        {activeTab === 'cancellation' && (
          <div className="settings-card-panel">
            <h3 className="settings-panel-title">Cancellation Rules & Weather Disruption Protocols</h3>
            <p className="settings-panel-subtitle">Define refund eligibility windows and monsoon contingencies</p>

            <div className="cancellation-policy-cards">
              <div className="policy-box">
                <h4 className="policy-name">Flexible Policy</h4>
                <p className="policy-desc">Full 100% refund up to 24 hours prior to check-in. Platform fee waived for date reschedules.</p>
                <span className="policy-tag">Host Opt-in</span>
              </div>

              <div className="policy-box highlight">
                <h4 className="policy-name">Moderate Policy (StayEase Default)</h4>
                <p className="policy-desc">Full 100% refund up to 5 days before check-in. 50% refund thereafter until 24h prior.</p>
                <span className="policy-tag active">Platform Default</span>
              </div>

              <div className="policy-box">
                <h4 className="policy-name">Strict Peak Holiday Policy</h4>
                <p className="policy-desc">Full refund up to 14 days before check-in. Applied automatically to Christmas & New Year bookings.</p>
                <span className="policy-tag">Peak Season</span>
              </div>
            </div>

            <div className="monsoon-alert-box">
              <AlertCircle size={18} color="#0F766E" />
              <div>
                <strong>Monsoon Flight / Rail Travel Contingency Guarantee:</strong>
                <p>If commercial flights to Goa (GOI/GOX) or Cochin (COK) are grounded due to IMD weather red alerts, automated 100% credit vouchers are disbursed to guests without host penalty.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: RBAC Matrix (Section 24) */}
        {activeTab === 'rbac' && (
          <div className="settings-card-panel">
            <div className="panel-header-row">
              <div>
                <h3 className="settings-panel-title">Role-Based Access Control (RBAC) Permission Matrix</h3>
                <p className="settings-panel-subtitle">Granular security permissions assigned per organizational operational tier</p>
              </div>

              <div className="active-role-indicator">
                <span>Active Simulator Role:</span>
                <strong style={{ color: 'var(--primary)' }}>{currentAdminRoleKey.toUpperCase()}</strong>
              </div>
            </div>

            <div className="rbac-table-wrap">
              <table className="rbac-matrix-table">
                <thead>
                  <tr>
                    <th>PERMISSION CAPABILITY</th>
                    {rbacRoles.map((r) => (
                      <th
                        key={r.roleKey}
                        className={r.roleKey === currentAdminRoleKey ? 'active-col' : ''}
                      >
                        {r.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissionsList.map((perm) => (
                    <tr key={perm.key}>
                      <td>
                        <div className="perm-label-cell">
                          <strong>{perm.label}</strong>
                          <span className="perm-code">{perm.key}</span>
                        </div>
                      </td>
                      {rbacRoles.map((role) => {
                        const hasPerm =
                          role.roleKey === 'super_admin' ||
                          role.permissions.includes('all') ||
                          role.permissions.includes(perm.key) ||
                          (role.roleKey === 'admin' && !perm.key.includes('delete') && !perm.key.includes('refund'));

                        return (
                          <td
                            key={role.roleKey}
                            className={`perm-cell ${role.roleKey === currentAdminRoleKey ? 'active-col' : ''}`}
                          >
                            {hasPerm ? (
                              <CheckCircle size={16} className="perm-yes" />
                            ) : (
                              <span className="perm-no">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Add Destination */}
        <Modal
          isOpen={isNewLocModalOpen}
          onClose={() => setIsNewLocModalOpen(false)}
          title="Add New Indian Holiday Destination"
          subtitle="Activate a new geographical corridor for holiday homes"
          maxWidth="460px"
        >
          <form onSubmit={handleAddLocationSubmit} className="add-loc-form">
            <div className="form-group">
              <label>Destination / Cluster Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Chikmagalur Coffee Hills"
                value={newLoc.city}
                onChange={(e) => setNewLoc({ ...newLoc, city: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Indian State *</label>
              <input
                type="text"
                required
                placeholder="e.g. Karnataka"
                value={newLoc.state}
                onChange={(e) => setNewLoc({ ...newLoc, state: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Corridor Code</label>
              <input
                type="text"
                placeholder="e.g. CKM"
                value={newLoc.code}
                onChange={(e) => setNewLoc({ ...newLoc, code: e.target.value })}
              />
            </div>

            <div className="form-actions-row">
              <Button variant="outline" size="md" onClick={() => setIsNewLocModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                Activate Destination
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
