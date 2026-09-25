import React, { useState } from 'react';
import { Wrench, Plus, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Timeline from '../../components/common/Timeline';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

export default function GuestMaintenancePage() {
  const { maintenanceTickets, createMaintenanceTicket, properties, bookings } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [category, setCategory] = useState('Air Conditioning');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [urgency, setUrgency] = useState('Medium');

  const currentBooking = bookings[0];

  const handleCreate = (e) => {
    e.preventDefault();
    createMaintenanceTicket({
      bookingId: currentBooking?.id || 'booking-1',
      propertyId: currentBooking?.propertyId || 'prop-1',
      propertyName: currentBooking?.propertyName || 'Palm Grove Villa',
      category,
      title: title || `${category} issue`,
      description: desc || 'Guest reported an in-villa concern.',
      urgency
    });
    setModalOpen(false);
    setTitle('');
    setDesc('');
  };

  const getMaintenanceStepIndex = (status) => {
    switch (status) {
      case 'reported':
        return 0;
      case 'assigned':
        return 1;
      case 'in_progress':
        return 2;
      case 'resolved':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <DashboardLayout
      title="Villa Maintenance & Care"
      subtitle="Report any in-stay issues for immediate complimentary resolution by certified technicians"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              StayEase complimentary stay guarantee: rapid technician response within 45 mins.
            </span>
          </div>
          <Button
            variant="danger"
            size="md"
            icon={Plus}
            onClick={() => setModalOpen(true)}
          >
            Report In-Stay Issue
          </Button>
        </div>

        {/* Tickets List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {maintenanceTickets.map((t) => {
            const stepIdx = getMaintenanceStepIndex(t.status);
            const timelineSteps = [
              { label: 'Reported', time: 'Logged' },
              { label: 'Assigned', time: t.assignedToName || 'Pending' },
              { label: 'In Progress', time: t.status === 'in_progress' ? 'Active' : t.status === 'resolved' ? 'Done' : 'Pending' },
              { label: 'Resolved', time: t.status === 'resolved' ? 'Fixed' : 'Pending' }
            ];

            return (
              <div
                key={t.id}
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-card)',
                  padding: '1.75rem',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>
                        {t.category}
                      </span>
                      <Badge variant={t.urgency === 'High' ? 'urgent' : 'sage'} size="sm">
                        {t.urgency} Urgency
                      </Badge>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--text)' }}>
                      {t.title}
                    </h3>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {t.propertyName} • Reported by {t.guestName}
                    </p>
                  </div>

                  <Badge variant={t.status === 'resolved' ? 'completed' : 'progress'} size="md" dot>
                    {t.status.toUpperCase()}
                  </Badge>
                </div>

                <div style={{ backgroundColor: 'var(--surface-warm)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                  <Timeline steps={timelineSteps} currentStepIndex={stepIdx} orientation="horizontal" />
                </div>

                <div style={{ backgroundColor: 'var(--surface-warm)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <strong>Details:</strong> {t.description}
                  </p>
                  {t.assignedToName && (
                    <p style={{ fontSize: '0.825rem', color: 'var(--primary-dark)', marginTop: '0.35rem' }}>
                      <strong>Assigned Specialist:</strong> {t.assignedToName}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Report Villa Maintenance Concern"
          subtitle="A local technician will be dispatched promptly"
          maxWidth="500px"
        >
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Category
              </label>
              <select
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-input)', border: '1px solid var(--border)', background: 'var(--surface-warm)', outline: 'none' }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Air Conditioning">Air Conditioning / Cooling</option>
                <option value="Plumbing">Plumbing & Water Pressure</option>
                <option value="Electrical">Electrical & Lighting</option>
                <option value="Wi-Fi">Wi-Fi & Entertainment</option>
                <option value="Appliances">Kitchen Appliances</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Brief Title
              </label>
              <input
                type="text"
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-input)', border: '1px solid var(--border)', background: 'var(--surface-warm)', outline: 'none' }}
                placeholder="e.g. Master Bedroom AC is not blowing cold air"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Description
              </label>
              <textarea
                rows={3}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-input)', border: '1px solid var(--border)', background: 'var(--surface-warm)', outline: 'none' }}
                placeholder="Provide location details or specific observations..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button variant="ghost" size="md" onClick={() => setModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button variant="danger" size="md" type="submit" icon={Wrench}>
                Submit Maintenance Ticket
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
