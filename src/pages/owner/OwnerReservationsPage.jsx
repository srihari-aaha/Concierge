import React from 'react';
import { Calendar, Users, MapPin, Download, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function OwnerReservationsPage() {
  const { bookings } = useApp();

  return (
    <DashboardLayout
      title="Guest Reservations"
      subtitle="Upcoming and completed guest bookings across your listed holiday homes"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {bookings.map((b) => (
          <div
            key={b.id}
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-card)',
              padding: '1.75rem',
              display: 'grid',
              gridTemplateColumns: '180px 1fr auto',
              gap: '2rem',
              alignItems: 'center',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <img
              src={b.propertyImage}
              alt={b.propertyName}
              style={{ width: '100%', height: '130px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Badge variant={b.status === 'confirmed' ? 'sage' : 'default'} size="sm">
                  {b.status.toUpperCase()}
                </Badge>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Ref: <strong>{b.reference}</strong>
                </span>
              </div>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--text)' }}>
                {b.propertyName}
              </h3>

              <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                <strong>Guest:</strong> {b.guestName} • {b.guestEmail} • {b.guestPhone}
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                <span><strong>Dates:</strong> {b.checkIn} to {b.checkOut} ({b.nights} nights)</span>
                <span><strong>Party:</strong> {b.guestsCount} Guests</span>
                <span><strong>Paid:</strong> {b.paymentMethod}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                ₹{b.totalAmount.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Net Host Settlement</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
