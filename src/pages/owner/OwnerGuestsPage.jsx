import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Calendar, MapPin, ShieldCheck, MessageSquare, Key, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function OwnerGuestsPage() {
  const navigate = useNavigate();
  const { bookings, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Sample guest registry based on bookings
  const guests = [
    {
      id: 'gst-1',
      name: 'Guest',
      email: 'priya.sharma@example.com',
      phone: '+91 98201 55678',
      city: 'Bengaluru',
      property: 'Palm Grove Retreat, Goa',
      dates: 'Oct 12 – Oct 15, 2026',
      status: 'Upcoming Check-in',
      partySize: '4 Adults',
      verified: true,
      notes: 'Requested Goa MOPA airport transfer & baby cot. Strict vegetarian preference.',
      doorCode: '8492'
    },
    {
      id: 'gst-2',
      name: 'Rohan & Ananya Mehta',
      email: 'rohan.mehta@example.com',
      phone: '+91 98110 33492',
      city: 'Mumbai',
      property: 'Ocean Breeze Villa, Pondicherry',
      dates: 'Nov 04 – Nov 08, 2026',
      status: 'Confirmed',
      partySize: '2 Adults',
      verified: true,
      notes: 'Celebrating 5th anniversary. Ordered sunset champagne & beachside barbecue.',
      doorCode: '1093'
    },
    {
      id: 'gst-3',
      name: 'Dr. Kabir Sen',
      email: 'kabir.sen@example.com',
      phone: '+91 97400 12890',
      city: 'Kolkata',
      property: 'Palm Grove Retreat, Goa',
      dates: 'Sep 02 – Sep 06, 2026',
      status: 'Past Stay',
      partySize: '3 Adults',
      verified: true,
      notes: 'Quiet work retreat. Highly praised the high-speed fiber Wi-Fi and garden serenity.',
      doorCode: 'Expired'
    }
  ];

  const filteredGuests = guests.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendDoorCode = (guest) => {
    showToast(`Access code ${guest.doorCode} re-sent to ${guest.name} via WhatsApp and SMS.`, 'success');
  };

  return (
    <DashboardLayout
      title="Guest Directory & Hospitality Log"
      subtitle="View verified profiles, special requests, and direct communication with guests across your properties"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Search bar */}
        <div style={{ maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Search guests by name, city, or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.7rem 1rem',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              background: '#ffffff'
            }}
          />
        </div>

        {/* Guests Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredGuests.map((g) => (
            <div
              key={g.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-card)',
                padding: '1.75rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr auto',
                gap: '1.75rem',
                alignItems: 'center',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              {/* Col 1: Identity */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)' }}>
                    {g.name}
                  </h3>
                  {g.verified && (
                    <Badge variant="sage" size="sm">
                      <ShieldCheck size={11} style={{ marginRight: '3px' }} />
                      Verified
                    </Badge>
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    • {g.partySize}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={13} color="var(--accent)" />
                    <span>{g.property} ({g.city})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={13} />
                    <span>{g.dates}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={13} />
                    <span>{g.phone}</span>
                  </div>
                </div>
              </div>

              {/* Col 2: Notes & Concierge preferences */}
              <div
                style={{
                  background: 'var(--color-bg-sand)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={13} color="var(--color-primary)" />
                  <span>Host Notes & Guest Preferences:</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {g.notes}
                </p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-primary-dark)' }}>
                  Door Code: <strong>{g.doorCode}</strong>
                </div>
              </div>

              {/* Col 3: Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/messages')}
                >
                  <MessageSquare size={14} />
                  Message
                </Button>
                {g.doorCode !== 'Expired' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendDoorCode(g)}
                  >
                    <Key size={14} />
                    Send Code
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
