import React from 'react';
import { ShieldCheck, Star, Phone, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';

export default function OwnerProvidersPage() {
  const { serviceProviders } = useApp();

  return (
    <DashboardLayout
      title="Verified Service Provider Network"
      subtitle="Regional chauffeurs, chefs, and maintenance guilds verified by StayEase quality control"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {serviceProviders.map((prov) => (
          <div
            key={prov.id}
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-card)',
              padding: '1.75rem',
              display: 'flex',
              gap: '1.25rem',
              alignItems: 'center',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <img
              src={prov.avatar}
              alt={prov.name}
              style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text)' }}>
                  {prov.name}
                </h4>
                <ShieldCheck size={16} color="var(--primary)" />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {prov.company}
              </span>
              <span style={{ fontSize: '0.785rem', color: 'var(--accent)', fontWeight: 600 }}>
                {prov.city} • {prov.services.join(', ').toUpperCase()}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--primary-dark)', fontWeight: 600, marginTop: '0.25rem' }}>
                <span>{prov.rating} ★ Rating</span>
                <span>•</span>
                <span>{prov.completedJobs} Jobs Completed</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
