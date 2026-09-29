import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Home,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Edit3,
  MapPin,
  Star,
  Users,
  Bed,
  Bath,
  Calendar,
  DollarSign,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  LayoutGrid,
  List
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
import './AdminPropertiesPage.css';

export default function AdminPropertiesPage() {
  const { properties, bookings, conciergeRequests, reviews, currentUser, addProperty } = useApp();
  const {
    approveProperty,
    suspendProperty,
    activateProperty,
    deleteProperty,
    auditLogs
  } = useAdmin();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all'; // all, pending, active, inactive
  const [activeTab, setActiveTab] = useState(initialTab);
  const [viewMode, setViewMode] = useState('table'); // table, grid

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Selected Property Drawer
  const selectedPropId = searchParams.get('id');
  const [drawerProperty, setDrawerProperty] = useState(() => {
    return properties.find((p) => p.id === selectedPropId) || null;
  });
  const [drawerTab, setDrawerTab] = useState('overview'); // overview, photos, availability, pricing, reservations, concierge, reviews, audit

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(searchParams.get('action') === 'new');
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'danger',
    confirmText: 'Confirm',
    onConfirm: () => {}
  });

  // New Property Form State
  const [newProp, setNewProp] = useState({
    name: '',
    tagline: '',
    location: 'Ashwem, North Goa',
    state: 'Goa',
    type: 'Beachfront Villa',
    pricePerNight: 18000,
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    beds: 3,
    coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85',
    description: ''
  });

  // Filtered Properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Tab filter
      if (activeTab === 'pending' && p.status !== 'pending_approval') return false;
      if (activeTab === 'active' && p.status !== 'active') return false;
      if (activeTab === 'inactive' && p.status !== 'suspended' && p.status !== 'inactive') return false;

      // Location filter
      if (locationFilter !== 'all' && !p.location.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'all' && p.type !== typeFilter) {
        return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesLoc = p.location.toLowerCase().includes(q);
        const matchesOwner = p.ownerName && p.ownerName.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc && !matchesOwner) return false;
      }

      return true;
    });
  }, [properties, activeTab, locationFilter, typeFilter, searchQuery]);

  const counts = {
    all: properties.length,
    pending: properties.filter((p) => p.status === 'pending_approval').length,
    active: properties.filter((p) => p.status === 'active').length,
    inactive: properties.filter((p) => p.status === 'suspended' || p.status === 'inactive').length
  };

  const handleOpenDetail = (prop) => {
    setDrawerProperty(prop);
    setDrawerTab('overview');
    setSearchParams({ id: prop.id });
  };

  const handleCloseDetail = () => {
    setDrawerProperty(null);
    setSearchParams({});
  };

  const handleApprove = (prop) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Approve & Activate Property',
      message: `Are you sure you want to verify and publish "${prop.name}" on the StayEase marketplace? Guests will be able to book immediately.`,
      variant: 'primary',
      confirmText: 'Approve Listing',
      onConfirm: () => {
        approveProperty(prop.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        if (drawerProperty?.id === prop.id) {
          setDrawerProperty({ ...drawerProperty, status: 'active' });
        }
      }
    });
  };

  const handleSuspend = (prop) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Suspend Property Listing',
      message: `Temporarily deactivate "${prop.name}". The property will no longer appear in guest search results until reactivated.`,
      variant: 'warning',
      confirmText: 'Suspend Listing',
      onConfirm: () => {
        suspendProperty(prop.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        if (drawerProperty?.id === prop.id) {
          setDrawerProperty({ ...drawerProperty, status: 'suspended' });
        }
      }
    });
  };

  const handleDelete = (prop) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Property Permanently',
      message: `This will permanently remove "${prop.name}" and cancel any pending quality reviews. This action cannot be undone.`,
      variant: 'danger',
      confirmText: 'Delete Permanently',
      onConfirm: () => {
        deleteProperty(prop.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        if (drawerProperty?.id === prop.id) {
          handleCloseDetail();
        }
      }
    });
  };

  const handleCreatePropertySubmit = (e) => {
    e.preventDefault();
    addProperty({
      ...newProp,
      pricePerNight: Number(newProp.pricePerNight),
      guests: Number(newProp.guests),
      bedrooms: Number(newProp.bedrooms),
      bathrooms: Number(newProp.bathrooms),
      beds: Number(newProp.beds)
    });
    setIsAddModalOpen(false);
    setNewProp({
      name: '',
      tagline: '',
      location: 'Ashwem, North Goa',
      state: 'Goa',
      type: 'Beachfront Villa',
      pricePerNight: 18000,
      guests: 6,
      bedrooms: 3,
      bathrooms: 3,
      beds: 3,
      coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85',
      description: ''
    });
  };

  // Drawer property details
  const propBookings = drawerProperty
    ? bookings.filter((b) => b.propertyName === drawerProperty.name || b.propertyId === drawerProperty.id)
    : [];
  const propRequests = drawerProperty
    ? conciergeRequests.filter((r) => r.propertyName === drawerProperty.name || r.propertyId === drawerProperty.id)
    : [];
  const propReviews = drawerProperty
    ? reviews.filter((rev) => rev.propertyName === drawerProperty.name || rev.propertyId === drawerProperty.id)
    : [];
  const propAudits = drawerProperty
    ? auditLogs.filter((a) => a.entityId === drawerProperty.id || a.entityName === drawerProperty.name)
    : [];

  return (
    <AdminLayout>
      <div className="admin-properties-page">
        <PageHeader
          title="Property Management"
          subtitle="Audit holiday homes, approve new host listings, manage rate cards and operational availability"
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Properties' }
          ]}
          actions={
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add New Property
            </Button>
          }
        />

        {/* Tab Bar */}
        <div className="properties-tab-bar">
          <div className="tab-pill-group">
            <button
              type="button"
              className={`prop-tab-pill ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Properties ({counts.all})
            </button>
            <button
              type="button"
              className={`prop-tab-pill ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Approval ({counts.pending})
            </button>
            <button
              type="button"
              className={`prop-tab-pill ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active ({counts.active})
            </button>
            <button
              type="button"
              className={`prop-tab-pill ${activeTab === 'inactive' ? 'active' : ''}`}
              onClick={() => setActiveTab('inactive')}
            >
              Inactive / Suspended ({counts.inactive})
            </button>
          </div>

          <div className="view-toggle-wrap">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Dense Table View"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Card Grid View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="properties-filter-bar">
          <div className="filter-search-input">
            <Search size={16} className="filter-icon" />
            <input
              type="text"
              placeholder="Search by property name, host, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-selects-row">
            <select
              className="admin-select"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="all">All Locations</option>
              <option value="goa">Goa</option>
              <option value="pondicherry">Pondicherry</option>
              <option value="kerala">Kerala</option>
              <option value="ooty">Ooty</option>
              <option value="coorg">Coorg</option>
              <option value="jaipur">Jaipur</option>
            </select>

            <select
              className="admin-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Property Types</option>
              <option value="Beachfront Villa">Beachfront Villa</option>
              <option value="Heritage Villa">Heritage Villa</option>
              <option value="Luxury Chalet">Luxury Chalet</option>
              <option value="Plantation Bungalow">Plantation Bungalow</option>
            </select>

            {(searchQuery || locationFilter !== 'all' || typeFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setLocationFilter('all');
                  setTypeFilter('all');
                }}
              >
                Reset Filters
              </Button>
            )}
          </div>
        </div>

        {/* Content Views */}
        {filteredProperties.length === 0 ? (
          <EmptyState
            icon={Home}
            title="No properties found"
            description="No properties match your current search query or filter parameters."
            actionText="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setLocationFilter('all');
              setTypeFilter('all');
              setActiveTab('all');
            }}
          />
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>PROPERTY</th>
                  <th>LOCATION</th>
                  <th>HOST / OWNER</th>
                  <th>TYPE</th>
                  <th>NIGHTLY RATE</th>
                  <th>STATUS</th>
                  <th>OCCUPANCY</th>
                  <th>RATING</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((prop) => (
                  <tr key={prop.id} onClick={() => handleOpenDetail(prop)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div className="prop-table-cell">
                        <img
                          src={prop.coverImage || prop.images?.[0]}
                          alt={prop.name}
                          className="table-prop-thumb"
                        />
                        <div className="prop-name-block">
                          <span className="prop-title-link">{prop.name}</span>
                          <span className="prop-capacity">
                            {prop.guests} Guests • {prop.bedrooms} BHK
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="table-loc-text">
                        <MapPin size={13} className="loc-pin" /> {prop.location}
                      </span>
                    </td>
                    <td>
                      <div className="owner-cell">
                        <img
                          src={prop.ownerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                          alt={prop.ownerName}
                          className="owner-avatar"
                        />
                        <span className="owner-name">{prop.ownerName || 'Host'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="prop-type-tag">{prop.type}</span>
                    </td>
                    <td>
                      <strong className="table-price">₹{prop.pricePerNight?.toLocaleString('en-IN')}</strong>
                    </td>
                    <td>
                      <StatusBadge status={prop.status} />
                    </td>
                    <td>
                      <span className="occupancy-pill">
                        {prop.status === 'active' ? '82% Month' : '—'}
                      </span>
                    </td>
                    <td>
                      <span className="rating-pill">
                        <Star size={13} className="star-icon" /> {prop.rating || '5.0'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div className="table-row-actions">
                        {prop.status === 'pending_approval' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApprove(prop)}
                          >
                            Approve
                          </Button>
                        )}
                        {prop.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuspend(prop)}
                          >
                            Suspend
                          </Button>
                        )}
                        {prop.status === 'suspended' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => activateProperty(prop.id)}
                          >
                            Activate
                          </Button>
                        )}
                        <button
                          type="button"
                          className="row-icon-btn danger"
                          onClick={() => handleDelete(prop)}
                          title="Delete Listing"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Card Grid View */
          <div className="properties-card-grid">
            {filteredProperties.map((prop) => (
              <div key={prop.id} className="prop-grid-card" onClick={() => handleOpenDetail(prop)}>
                <div className="grid-card-media">
                  <img
                    src={prop.coverImage || prop.images?.[0]}
                    alt={prop.name}
                    className="grid-card-img"
                  />
                  <div className="grid-card-badge">
                    <StatusBadge status={prop.status} />
                  </div>
                </div>

                <div className="grid-card-content">
                  <div className="grid-card-top">
                    <span className="grid-card-type">{prop.type}</span>
                    <span className="grid-card-rate">₹{prop.pricePerNight?.toLocaleString('en-IN')}<small>/night</small></span>
                  </div>

                  <h3 className="grid-card-title">{prop.name}</h3>
                  <p className="grid-card-loc">
                    <MapPin size={13} /> {prop.location}
                  </p>

                  <div className="grid-card-meta">
                    <span>{prop.guests} Guests</span> •
                    <span>{prop.bedrooms} Bedrooms</span> •
                    <span>{prop.bathrooms} Baths</span>
                  </div>

                  <div className="grid-card-footer" onClick={(e) => e.stopPropagation()}>
                    <div className="owner-mini">
                      <img src={prop.ownerAvatar} alt={prop.ownerName} />
                      <span>{prop.ownerName}</span>
                    </div>

                    <div className="grid-footer-actions">
                      {prop.status === 'pending_approval' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(prop)}
                        >
                          Approve
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDetail(prop)}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section 11: Detailed Property Drawer */}
        {drawerProperty && (
          <DetailDrawer
            isOpen={Boolean(drawerProperty)}
            onClose={handleCloseDetail}
            title={drawerProperty.name}
            subtitle={`${drawerProperty.location} • Host: ${drawerProperty.ownerName || 'Host'}`}
            badges={<StatusBadge status={drawerProperty.status} />}
            width="680px"
            footer={
              <div className="drawer-footer-actions">
                <Button
                  variant="outline"
                  size="sm"
                  icon={ExternalLink}
                  onClick={() => window.open(`/#/property/${drawerProperty.id}`, '_blank')}
                >
                  View as Guest
                </Button>
                {drawerProperty.status === 'pending_approval' && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={CheckCircle}
                    onClick={() => handleApprove(drawerProperty)}
                  >
                    Approve Property
                  </Button>
                )}
                {drawerProperty.status === 'active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuspend(drawerProperty)}
                  >
                    Suspend Listing
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={() => handleDelete(drawerProperty)}
                >
                  Delete
                </Button>
              </div>
            }
          >
            {/* Drawer Tabs */}
            <div className="drawer-nav-tabs">
              <button
                type="button"
                className={`drawer-tab-btn ${drawerTab === 'overview' ? 'active' : ''}`}
                onClick={() => setDrawerTab('overview')}
              >
                Overview
              </button>
              <button
                type="button"
                className={`drawer-tab-btn ${drawerTab === 'photos' ? 'active' : ''}`}
                onClick={() => setDrawerTab('photos')}
              >
                Photos ({drawerProperty.images?.length || 1})
              </button>
              <button
                type="button"
                className={`drawer-tab-btn ${drawerTab === 'pricing' ? 'active' : ''}`}
                onClick={() => setDrawerTab('pricing')}
              >
                Pricing & Fees
              </button>
              <button
                type="button"
                className={`drawer-tab-btn ${drawerTab === 'reservations' ? 'active' : ''}`}
                onClick={() => setDrawerTab('reservations')}
              >
                Bookings ({propBookings.length})
              </button>
              <button
                type="button"
                className={`drawer-tab-btn ${drawerTab === 'concierge' ? 'active' : ''}`}
                onClick={() => setDrawerTab('concierge')}
              >
                Concierge ({propRequests.length})
              </button>
              <button
                type="button"
                className={`drawer-tab-btn ${drawerTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setDrawerTab('reviews')}
              >
                Reviews ({propReviews.length})
              </button>
              <button
                type="button"
                className={`drawer-tab-btn ${drawerTab === 'audit' ? 'active' : ''}`}
                onClick={() => setDrawerTab('audit')}
              >
                Audit Log
              </button>
            </div>

            {/* TAB: Overview */}
            {drawerTab === 'overview' && (
              <div className="drawer-tab-content">
                <div className="drawer-hero-img-wrap">
                  <img
                    src={drawerProperty.coverImage || drawerProperty.images?.[0]}
                    alt={drawerProperty.name}
                    className="drawer-hero-img"
                  />
                  <div className="drawer-hero-meta">
                    <span className="hero-price">₹{drawerProperty.pricePerNight?.toLocaleString('en-IN')}/night</span>
                    <span className="hero-rating">★ {drawerProperty.rating || '5.0'}</span>
                  </div>
                </div>

                <div className="drawer-section">
                  <h4 className="drawer-sec-title">Listing Description</h4>
                  <p className="drawer-sec-text">
                    {drawerProperty.description ||
                      'Nestled amidst lush coastal flora, this property delivers authentic serenity with bespoke concierge service, private swimming facilities, and artisanal amenities.'}
                  </p>
                </div>

                <div className="drawer-spec-grid">
                  <div className="drawer-spec-box">
                    <Users size={16} />
                    <span className="spec-val">{drawerProperty.guests} Guests</span>
                    <span className="spec-lbl">Max Capacity</span>
                  </div>
                  <div className="drawer-spec-box">
                    <Bed size={16} />
                    <span className="spec-val">{drawerProperty.bedrooms} Bedrooms</span>
                    <span className="spec-lbl">{drawerProperty.beds} Beds</span>
                  </div>
                  <div className="drawer-spec-box">
                    <Bath size={16} />
                    <span className="spec-val">{drawerProperty.bathrooms} Bathrooms</span>
                    <span className="spec-lbl">En-suite</span>
                  </div>
                </div>

                <div className="drawer-section">
                  <h4 className="drawer-sec-title">Included Amenities</h4>
                  <div className="drawer-amenities-pills">
                    {(drawerProperty.amenities || [
                      'Private Swimming Pool',
                      'Air Conditioning',
                      'High-Speed Wi-Fi',
                      'Daily Attendant',
                      'Modern Kitchen',
                      'Power Backup Inverter'
                    ]).map((am, i) => (
                      <span key={i} className="amenity-chip">✓ {am}</span>
                    ))}
                  </div>
                </div>

                <div className="drawer-section">
                  <h4 className="drawer-sec-title">Host & Management</h4>
                  <div className="drawer-host-card">
                    <img src={drawerProperty.ownerAvatar} alt={drawerProperty.ownerName} className="host-card-avatar" />
                    <div>
                      <strong className="host-card-name">{drawerProperty.ownerName || 'Verified Host'}</strong>
                      <p className="host-card-sub">Superhost • 100% Response Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Photos */}
            {drawerTab === 'photos' && (
              <div className="drawer-photos-grid">
                {(drawerProperty.images || [drawerProperty.coverImage]).map((imgUrl, idx) => (
                  <div key={idx} className="drawer-photo-item">
                    <img src={imgUrl} alt={`Property view ${idx + 1}`} />
                    <span className="photo-tag">{idx === 0 ? 'Cover Photo' : `Gallery #${idx + 1}`}</span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: Pricing */}
            {drawerTab === 'pricing' && (
              <div className="drawer-tab-content">
                <div className="pricing-breakdown-card">
                  <h4 className="pricing-title">Fee & Rate Card Structure</h4>
                  <div className="pricing-row">
                    <span>Base Weekday Rate</span>
                    <strong>₹{drawerProperty.pricePerNight?.toLocaleString('en-IN')} / night</strong>
                  </div>
                  <div className="pricing-row">
                    <span>Weekend Rate Surcharge</span>
                    <strong>+15% (₹{Math.round((drawerProperty.pricePerNight || 15000) * 1.15).toLocaleString('en-IN')})</strong>
                  </div>
                  <div className="pricing-row">
                    <span>Cleaning & Sanitization Fee</span>
                    <strong>₹1,500 per stay</strong>
                  </div>
                  <div className="pricing-row">
                    <span>Platform Commission (StayEase)</span>
                    <strong style={{ color: 'var(--primary)' }}>10% (₹{Math.round((drawerProperty.pricePerNight || 15000) * 0.1).toLocaleString('en-IN')})</strong>
                  </div>
                  <div className="pricing-row">
                    <span>Applicable GST</span>
                    <strong>18% On Net Stay Value</strong>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Reservations */}
            {drawerTab === 'reservations' && (
              <div className="drawer-tab-content">
                {propBookings.length === 0 ? (
                  <p className="drawer-empty-note">No recent reservations found for this listing.</p>
                ) : (
                  propBookings.map((b) => (
                    <div key={b.id} className="drawer-sub-entry">
                      <div>
                        <strong>{b.reference} — {b.guestName}</strong>
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
            )}

            {/* TAB: Concierge */}
            {drawerTab === 'concierge' && (
              <div className="drawer-tab-content">
                {propRequests.length === 0 ? (
                  <p className="drawer-empty-note">No active concierge service tickets for this property.</p>
                ) : (
                  propRequests.map((req) => (
                    <div key={req.id} className="drawer-sub-entry">
                      <div>
                        <strong>{req.serviceTitle}</strong>
                        <p>Guest: {req.guestName} • Due: {req.date || 'Today'}</p>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: Reviews */}
            {drawerTab === 'reviews' && (
              <div className="drawer-tab-content">
                {propReviews.length === 0 ? (
                  <p className="drawer-empty-note">No guest reviews submitted yet.</p>
                ) : (
                  propReviews.map((rev) => (
                    <div key={rev.id} className="drawer-sub-entry" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <strong>★ {rev.rating} — {rev.guestName || 'Verified Guest'}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{rev.date}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.35rem' }}>"{rev.comment}"</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: Audit */}
            {drawerTab === 'audit' && (
              <div className="drawer-tab-content">
                {propAudits.length === 0 ? (
                  <p className="drawer-empty-note">No recent audit log entries recorded for this property.</p>
                ) : (
                  propAudits.map((a) => (
                    <div key={a.id} className="drawer-sub-entry" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <strong>{a.action}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{a.timestamp}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#0F766E' }}>{a.newValue}</span>
                      <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>By {a.adminName}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </DetailDrawer>
        )}

        {/* Modal: Add New Property */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New StayEase Holiday Property"
          subtitle="Register an Indian luxury villa, homestay, or heritage estate on the platform"
          maxWidth="640px"
        >
          <form onSubmit={handleCreatePropertySubmit} className="add-prop-form">
            <div className="form-group">
              <label>Property Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Villa Solarium Portuguese Mansion"
                value={newProp.name}
                onChange={(e) => setNewProp({ ...newProp, name: e.target.value })}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Location & Area *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vagator, North Goa"
                  value={newProp.location}
                  onChange={(e) => setNewProp({ ...newProp, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Property Type *</label>
                <select
                  value={newProp.type}
                  onChange={(e) => setNewProp({ ...newProp, type: e.target.value })}
                >
                  <option value="Beachfront Villa">Beachfront Villa</option>
                  <option value="Heritage Villa">Heritage Villa</option>
                  <option value="Luxury Chalet">Luxury Chalet</option>
                  <option value="Plantation Bungalow">Plantation Bungalow</option>
                </select>
              </div>
            </div>

            <div className="form-grid-4">
              <div className="form-group">
                <label>Price / Night (₹) *</label>
                <input
                  type="number"
                  required
                  min="2000"
                  value={newProp.pricePerNight}
                  onChange={(e) => setNewProp({ ...newProp, pricePerNight: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Max Guests *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newProp.guests}
                  onChange={(e) => setNewProp({ ...newProp, guests: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Bedrooms</label>
                <input
                  type="number"
                  min="1"
                  value={newProp.bedrooms}
                  onChange={(e) => setNewProp({ ...newProp, bedrooms: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Bathrooms</label>
                <input
                  type="number"
                  min="1"
                  value={newProp.bathrooms}
                  onChange={(e) => setNewProp({ ...newProp, bathrooms: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Cover Photo URL</label>
              <input
                type="url"
                value={newProp.coverImage}
                onChange={(e) => setNewProp({ ...newProp, coverImage: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Editorial Description</label>
              <textarea
                rows="3"
                placeholder="Highlight Portuguese laterite arches, plunge pool, lush plantations, or heritage decor..."
                value={newProp.description}
                onChange={(e) => setNewProp({ ...newProp, description: e.target.value })}
              />
            </div>

            <div className="form-actions-row">
              <Button variant="outline" size="md" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                Submit for Quality Review
              </Button>
            </div>
          </form>
        </Modal>

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
