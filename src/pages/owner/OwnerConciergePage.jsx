import React, { useState } from 'react';
import { Sparkles, User, Calendar, Clock, Check, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export default function OwnerConciergePage() {
  const { conciergeRequests, acceptConciergeRequest, assignProviderToRequest, serviceProviders } = useApp();

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [selectedProvId, setSelectedProvId] = useState(serviceProviders[0]?.id || 'prov-1');

  const handleOpenAssign = (req) => {
    setSelectedReq(req);
    // Find provider fitting category
    const matchingProv = serviceProviders.find((p) => p.services.includes(req.category)) || serviceProviders[0];
    setSelectedProvId(matchingProv.id);
    setAssignModalOpen(true);
  };

  const handleConfirmAssignment = () => {
    if (selectedReq) {
      assignProviderToRequest(selectedReq.id, selectedProvId);
    }
    setAssignModalOpen(false);
  };

  return (
    <DashboardLayout
      title="Guest Concierge Management"
      subtitle="Fulfill incoming guest requests, accept bookings, and dispatch local verified service providers"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Total Requests: <strong>{conciergeRequests.length}</strong>
            </span>
          </div>
        </div>

        {/* Requests List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {conciergeRequests.map((req) => (
            <div
              key={req.id}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>
                      {req.category}
                    </span>
                    <Badge
                      variant={
                        req.status === 'requested'
                          ? 'pending'
                          : req.status === 'accepted' || req.status === 'assigned'
                            ? 'assigned'
                            : req.status === 'in_progress'
                              ? 'in_progress'
                              : req.status === 'completed'
                                ? 'completed'
                                : req.status === 'cancelled' || req.status === 'canceled'
                                  ? 'canceled'
                                  : 'unassigned'
                      }
                      size="sm"
                      dot
                    >
                      {req.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--text)' }}>
                    {req.serviceTitle}
                  </h3>

                  <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    <span><strong>Villa:</strong> {req.propertyName}</span>
                    <span><strong>Scheduled:</strong> {req.date} at {req.timeSlot}</span>
                    <span><strong>Guest:</strong> {req.guestName} ({req.guestPhone})</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-dark)', display: 'block' }}>
                    {req.cost > 0 ? `₹${req.cost.toLocaleString('en-IN')}` : 'Complimentary'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Ref: {req.bookingRef}
                  </span>
                </div>
              </div>

              {/* Special Instructions & Provider Assigned */}
              <div
                style={{
                  backgroundColor: 'var(--surface-warm)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '0.2rem' }}>
                    GUEST INSTRUCTIONS
                  </span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {req.specialInstructions || 'Standard concierge fulfillment.'}
                  </p>
                </div>

                {req.assignedProviderName && (
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)' }}>
                      ASSIGNED LOCAL PROVIDER
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--primary-dark)' }}>
                      {req.assignedProviderName}
                    </strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {req.assignedProviderPhone}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                {req.status === 'requested' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => acceptConciergeRequest(req.id)}
                  >
                    Accept Request
                  </Button>
                )}

                {(req.status === 'requested' || req.status === 'accepted') && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={User}
                    onClick={() => handleOpenAssign(req)}
                  >
                    Assign Provider
                  </Button>
                )}

                {req.status === 'assigned' && (
                  <Button
                    variant="subtle"
                    size="sm"
                    onClick={() => handleOpenAssign(req)}
                  >
                    Reassign Provider
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Provider Selection Modal */}
        <Modal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          title="Assign Local Service Specialist"
          subtitle={selectedReq ? `${selectedReq.serviceTitle} for ${selectedReq.propertyName}` : ''}
          maxWidth="520px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Select a verified regional vendor to fulfill this booking:
            </span>

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
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <img
                      src={prov.avatar}
                      alt={prov.name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <strong style={{ fontSize: '0.925rem', color: 'var(--text)' }}>{prov.name}</strong>
                        {prov.verified && <ShieldCheck size={14} color="var(--primary)" />}
                      </div>
                      <span style={{ fontSize: '0.785rem', color: 'var(--text-muted)', display: 'block' }}>
                        {prov.company} • {prov.city}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary-dark)', fontWeight: 600 }}>
                        {prov.rating} ★ ({prov.completedJobs} completed jobs)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button variant="ghost" size="md" onClick={() => setAssignModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={handleConfirmAssignment}>
                Confirm & Dispatch Provider
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
