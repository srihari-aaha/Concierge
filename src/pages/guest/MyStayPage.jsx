import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Key,
  Wifi,
  Copy,
  Check,
  Phone,
  MessageSquare,
  Wrench,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Timeline from '../../components/common/Timeline';
import ConciergeRequestModal from '../../components/concierge/ConciergeRequestModal';
import Modal from '../../components/common/Modal';
import './MyStayPage.css';

export default function MyStayPage() {
  const { bookings, properties, conciergeCategories, createMaintenanceTicket, showToast } = useApp();

  // Find active or upcoming booking
  const activeBooking = bookings.find((b) => b.status === 'confirmed') || bookings[0];
  const property = properties.find((p) => p.id === activeBooking?.propertyId) || properties[0];

  const [copiedWifi, setCopiedWifi] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [conciergeModalOpen, setConciergeModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // In-Stay Maintenance report modal
  const [maintModalOpen, setMaintModalOpen] = useState(false);
  const [maintCategory, setMaintCategory] = useState('Air Conditioning');
  const [maintTitle, setMaintTitle] = useState('');
  const [maintDesc, setMaintDesc] = useState('');
  const [maintUrgency, setMaintUrgency] = useState('Medium');

  const copyToClipboard = (text, type) => {
    navigator.clipboard?.writeText(text);
    if (type === 'wifi') {
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
      showToast('Wi-Fi password copied to clipboard', 'info');
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      showToast('Keypad access code copied to clipboard', 'info');
    }
  };

  const handleMaintenanceSubmit = (e) => {
    e.preventDefault();
    createMaintenanceTicket({
      bookingId: activeBooking.id,
      propertyId: property.id,
      propertyName: property.name,
      category: maintCategory,
      title: maintTitle || `${maintCategory} maintenance required`,
      description: maintDesc || 'Guest reported an issue during their stay.',
      urgency: maintUrgency
    });
    setMaintModalOpen(false);
    setMaintTitle('');
    setMaintDesc('');
  };

  const stayTimelineSteps = [
    { label: 'Booking Confirmed', time: activeBooking?.paymentDate || 'Sep 20', description: 'Stay & Concierge secured' },
    { label: 'Pre-Arrival Planning', time: 'Active Now', description: 'Pre-order groceries & chauffeur' },
    { label: 'Check-In at Villa', time: `${activeBooking?.checkIn} (2:00 PM)`, description: 'Digital lock code active' },
    { label: 'Relax & In-Stay Care', time: 'During Stay', description: 'Dedicated on-call concierge' },
    { label: 'Check-Out & Review', time: `${activeBooking?.checkOut} (11:00 AM)`, description: 'Luggage assistance' }
  ];

  return (
    <DashboardLayout
      title="My Current Stay Experience"
      subtitle={`${property.name} • Reference: ${activeBooking?.reference}`}
    >
      <div className="my-stay-container">
        {/* Stay Progress Timeline */}
        <div className="stay-timeline-card">
          <div className="stay-timeline-header">
            <span className="timeline-tag">STAY LIFECYCLE</span>
            <h3 className="timeline-title">Your Journey Timeline</h3>
          </div>
          <Timeline steps={stayTimelineSteps} currentStepIndex={1} orientation="horizontal" />
        </div>

        {/* Access & Essentials Grid (Wi-Fi, Digital Key, House Rules) */}
        <div className="stay-essentials-grid">
          {/* Keyless Entry */}
          <div className="essential-card key-card">
            <div className="essential-icon-wrap">
              <Key size={22} />
            </div>
            <div className="essential-body">
              <span className="essential-label">VILLA KEYLESS ACCESS</span>
              <div className="code-display-row">
                <span className="access-code">{activeBooking?.doorCode || '4821'}</span>
                <button
                  type="button"
                  className="copy-btn"
                  onClick={() => copyToClipboard(activeBooking?.doorCode || '4821', 'code')}
                >
                  {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="essential-hint">
                Enter code followed by # on the front door keypad.
              </p>
            </div>
          </div>

          {/* Wi-Fi Details */}
          <div className="essential-card wifi-card">
            <div className="essential-icon-wrap">
              <Wifi size={22} />
            </div>
            <div className="essential-body">
              <span className="essential-label">FIBER WI-FI (300 MBPS)</span>
              <div className="wifi-network-name">{activeBooking?.wifiName || 'PalmGrove_HighSpeed_5G'}</div>
              <div className="code-display-row">
                <span className="access-code wifi-pass">{activeBooking?.wifiPass || 'ashwem2026'}</span>
                <button
                  type="button"
                  className="copy-btn"
                  onClick={() => copyToClipboard(activeBooking?.wifiPass || 'ashwem2026', 'wifi')}
                >
                  {copiedWifi ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedWifi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Rapid Support Contacts */}
          <div className="essential-card support-card">
            <div className="essential-icon-wrap support-icon">
              <Phone size={22} />
            </div>
            <div className="essential-body">
              <span className="essential-label">ON-CALL HOST & CONCIERGE</span>
              <div className="support-host-name">Host: {property.ownerName}</div>
              <div className="support-phone">{property.ownerPhone || '+91 98221 88390'}</div>
              <div className="support-actions-row">
                <Link to="/guest/messages" className="contact-link">
                  <MessageSquare size={14} />
                  <span>Send Message</span>
                </Link>
                <button
                  type="button"
                  className="contact-link maint-trigger"
                  onClick={() => setMaintModalOpen(true)}
                >
                  <Wrench size={14} />
                  <span>Report Issue</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Property Guide & Details Row */}
        <div className="stay-guide-grid">
          <div className="guide-main-card">
            <div className="guide-header">
              <img src={property.coverImage} alt={property.name} className="guide-thumb" />
              <div>
                <span className="guide-pre">{property.type}</span>
                <h3 className="guide-prop-title">{property.name}</h3>
                <div className="guide-loc">
                  <MapPin size={14} className="pin-icon" />
                  <span>{property.location}</span>
                </div>
              </div>
            </div>

            <div className="guide-details-section">
              <h4 className="guide-sub-heading">Check-In & Departure Guidelines</h4>
              <p className="guide-text">
                Check-in begins at 2:00 PM. Early check-in or late luggage drop can be coordinated through your StayEase concierge. Check-out is strictly at 11:00 AM so our housekeeping guild can deep-sanitize for the next guests.
              </p>

              <h4 className="guide-sub-heading">Serenity & House Rules</h4>
              <ul className="guide-rules-list">
                {property.houseRules.map((rule, idx) => (
                  <li key={idx} className="guide-rule-item">
                    <span className="rule-bullet">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* In-Stay Concierge Services */}
          <div className="guide-concierge-sidebar">
            <div className="concierge-sidebar-header">
              <Sparkles size={18} className="sparkle-icon" />
              <div>
                <h4 className="concierge-sidebar-title">Order for this Stay</h4>
                <p className="concierge-sidebar-desc">Dispatched directly to your villa</p>
              </div>
            </div>

            <div className="concierge-quick-links-list">
              {conciergeCategories.slice(0, 4).map((c) => (
                <div key={c.id} className="concierge-sidebar-item">
                  <div>
                    <span className="cat-title">{c.title}</span>
                    <span className="cat-desc">{c.badge}</span>
                  </div>
                  <Button
                    variant="subtle"
                    size="sm"
                    onClick={() => {
                      setSelectedService(c.services[0]);
                      setConciergeModalOpen(true);
                    }}
                  >
                    Request
                  </Button>
                </div>
              ))}
            </div>

            <Link to="/concierge" className="view-full-concierge-btn">
              Explore All Concierge Comforts →
            </Link>
          </div>
        </div>

        {/* Maintenance Issue Modal */}
        <Modal
          isOpen={maintModalOpen}
          onClose={() => setMaintModalOpen(false)}
          title="Report In-Stay Issue"
          subtitle={`Dispatches StayEase maintenance technician for ${property.name}`}
          maxWidth="500px"
        >
          <form onSubmit={handleMaintenanceSubmit} className="maint-modal-form">
            <div className="form-group">
              <label className="field-label">Issue Category</label>
              <select
                className="modal-select"
                value={maintCategory}
                onChange={(e) => setMaintCategory(e.target.value)}
              >
                <option value="Air Conditioning">Air Conditioning / Cooling</option>
                <option value="Plumbing">Plumbing & Hot Water</option>
                <option value="Electrical">Electrical & Lighting</option>
                <option value="Wi-Fi">High-Speed Wi-Fi / TV</option>
                <option value="Pool">Swimming Pool / Filtration</option>
                <option value="General">Other Villa Requirement</option>
              </select>
            </div>

            <div className="form-group">
              <label className="field-label">Brief Description of the Issue</label>
              <input
                type="text"
                className="modal-input"
                placeholder="e.g. Master Bedroom AC is blowing warm air"
                value={maintTitle}
                onChange={(e) => setMaintTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="field-label">Detailed Notes / Location in Villa</label>
              <textarea
                className="modal-textarea"
                rows={3}
                placeholder="Describe what happened and if you're inside the villa..."
                value={maintDesc}
                onChange={(e) => setMaintDesc(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="field-label">Urgency Level</label>
              <div className="urgency-chips">
                {['Low', 'Medium', 'High / Urgent'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    className={`urgency-chip ${maintUrgency === lvl ? 'active' : ''}`}
                    onClick={() => setMaintUrgency(lvl)}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="maint-guarantee-note">
              <Clock size={16} />
              <span>Complimentary resolution guarantee. Technician dispatched within 45 mins.</span>
            </div>

            <div className="modal-actions">
              <Button variant="ghost" size="md" onClick={() => setMaintModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button variant="danger" size="md" type="submit" icon={Wrench}>
                Dispatch Technician
              </Button>
            </div>
          </form>
        </Modal>

        {/* Concierge Service Modal */}
        {selectedService && (
          <ConciergeRequestModal
            isOpen={conciergeModalOpen}
            onClose={() => setConciergeModalOpen(false)}
            service={selectedService}
            property={property}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
