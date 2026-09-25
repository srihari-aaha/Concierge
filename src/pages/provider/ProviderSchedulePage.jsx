import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';

export default function ProviderSchedulePage() {
  const { conciergeRequests } = useApp();

  const scheduleSlots = [
    { day: 'Thursday, Oct 12', time: '11:30 AM', title: 'Airport Chauffeur Transfer (MOPA)', loc: 'Palm Grove Villa, Ashwem', guest: '`Guest`' },
    { day: 'Friday, Oct 13', time: '02:00 PM', title: 'Master AC Inspection & Servicing', loc: 'Palm Grove Villa', guest: 'Guest' },
    { day: 'Sunday, Oct 15', time: '11:00 AM', title: 'Airport Departure Transfer', loc: 'Palm Grove Villa', guest: 'Guest' }
  ];

  return (
    <DashboardLayout
      title="Field Service Schedule"
      subtitle="Upcoming itinerary and assigned on-ground appointments"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {scheduleSlots.map((slot, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-card)',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div
                style={{
                  backgroundColor: 'var(--primary-tint)',
                  color: 'var(--primary-dark)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  minWidth: '100px'
                }}
              >
                <Clock size={18} style={{ margin: '0 auto 0.25rem' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block' }}>{slot.time}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                  {slot.day}
                </span>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text)' }}>
                  {slot.title}
                </h4>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  <span><MapPin size={12} style={{ display: 'inline', marginRight: '3px' }} />{slot.loc}</span>
                  <span>Guest: {slot.guest}</span>
                </div>
              </div>
            </div>

            <Badge variant="sage" size="sm">
              SCHEDULED & CONFIRMED
            </Badge>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
