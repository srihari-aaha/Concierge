import React, { useState } from 'react';
import { Wrench, CheckCircle, ShieldCheck, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export default function OwnerMaintenancePage() {
  const { maintenanceTickets, assignMaintenanceTechnician, resolveMaintenanceTicket, serviceProviders } = useApp();

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedProvId, setSelectedProvId] = useState(serviceProviders[0]?.id || 'prov-1');

  const handleOpenAssign = (t) => {
    setSelectedTicket(t);
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = () => {
    if (selectedTicket) {
      assignMaintenanceTechnician(selectedTicket.id, selectedProvId);
    }
    setAssignModalOpen(false);
  };

  return (
    <DashboardLayout
      title="Property Maintenance & Repairs"
      subtitle="Triage in-stay maintenance tickets, dispatch licensed technicians, and inspect resolution logs"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {maintenanceTickets.map((t) => (
            <div
              key={t.id}
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-card)',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>
                      {t.category}
                    </span>
                    <Badge variant={t.urgency === 'High' ? 'urgent' : 'sage'} size="sm">
                      {t.urgency} Urgency
                    </Badge>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--text)' }}>
                    {t.title}
                  </h3>

                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    {t.propertyName} • Guest: {t.guestName}
                  </p>
                </div>

                <Badge variant={t.status === 'resolved' ? 'completed' : 'progress'} size="md" dot>
                  {t.status.toUpperCase()}
                </Badge>
              </div>

              <div style={{ backgroundColor: 'var(--surface-warm)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {t.description}
                </p>
                {t.assignedToName && (
                  <p style={{ fontSize: '0.825rem', color: 'var(--primary-dark)', marginTop: '0.4rem' }}>
                    <strong>Assigned Technician:</strong> {t.assignedToName}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                {t.status !== 'resolved' && (
                  <>
                    <Button variant="secondary" size="sm" icon={User} onClick={() => handleOpenAssign(t)}>
                      {t.assignedToName ? 'Reassign Technician' : 'Assign Technician'}
                    </Button>
                    <Button variant="primary" size="sm" icon={CheckCircle} onClick={() => resolveMaintenanceTicket(t.id)}>
                      Mark Resolved
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Technician Modal */}
        <Modal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          title="Dispatch Maintenance Specialist"
          subtitle={selectedTicket ? selectedTicket.title : ''}
          maxWidth="500px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {serviceProviders.map((prov) => {
                const isSelected = selectedProvId === prov.id;
                return (
                  <div
                    key={prov.id}
                    onClick={() => setSelectedProvId(prov.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: isSelected ? 'var(--primary-tint)' : 'var(--surface-warm)',
                      cursor: 'pointer'
                    }}
                  >
                    <img src={prov.avatar} alt={prov.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <strong>{prov.name}</strong>
                      <span style={{ display: 'block', fontSize: '0.775rem', color: 'var(--text-muted)' }}>{prov.company}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="ghost" size="md" onClick={() => setAssignModalOpen(false)}>Cancel</Button>
              <Button variant="primary" size="md" onClick={handleConfirmAssign}>Dispatch</Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
