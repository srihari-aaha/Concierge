import React, { useState } from 'react';
import { Wrench, ShieldCheck, Mail, Phone, MapPin, Truck, Award, Save, Clock, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function ProviderProfilePage() {
  const { currentUser, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Provider',
    company: currentUser?.company || 'Coastal Mobility & Express Maintenance',
    email: currentUser?.email || 'ramesh.kumar@coastalmobility.in',
    phone: currentUser?.phone || '+91 98221 44021',
    city: 'Goa (North & South Zones)',
    fleetSize: '6 Premium Innova Crysta / Hycross Vehicles',
    certifications: 'Goa RTA Commercial Fleet License • Verified Background Checked',
    upiId: 'ramesh.coastal@okhdfcbank',
    isAvailable: true,
    emergencyResponse: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Service provider business profile and availability updated.', 'success');
  };

  return (
    <DashboardLayout
      title="Provider Credentials & Fleet Profile"
      subtitle="Manage your commercial verification, fleet capacity, service dispatch availability, and payout settings"
    >
      <div style={{ maxWidth: '840px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Verification banner */}
        <div
          style={{
            background: 'var(--primary-tint)',
            border: '1px solid rgba(237, 112, 20, 0.2)',
            borderRadius: 'var(--radius-card)',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'var(--color-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 700
              }}
            >
              RK
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)' }}>
                  {formData.company}
                </h3>
                <Badge variant="sage" size="sm">
                  <ShieldCheck size={12} style={{ marginRight: '4px' }} />
                  Verified SLA Partner
                </Badge>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Lead Partner: {formData.name} • 140+ completed jobs • 99.4% on-time record
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
              SLA Score: 4.94 ★
            </span>
          </div>
        </div>

        {/* Profile Form */}
        <form
          onSubmit={handleSave}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-card)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text)' }}>
            Business & Dispatch Details
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Enterprise / Trade Name
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Operations Manager Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Official Dispatch Mobile
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Dispatch Center Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem'
                }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Operational Region / Coverage
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Fleet / Equipment Capacity
              </label>
              <input
                type="text"
                name="fleetSize"
                value={formData.fleetSize}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '0.5rem 0' }} />

          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text)' }}>
            Weekly Payout Settlement (UPI / IMPS)
          </h4>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Settlement UPI VPA
            </label>
            <input
              type="text"
              name="upiId"
              value={formData.upiId}
              onChange={handleChange}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem'
              }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Payouts are automatically settled every Tuesday for all jobs marked completed by guests.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
              />
              <span>Currently Online & Ready to Accept Immediate Dispatches</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="emergencyResponse"
                checked={formData.emergencyResponse}
                onChange={handleChange}
              />
              <span>Opt in for 24/7 Emergency Maintenance calls (higher premium rate)</span>
            </label>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <Button variant="primary" type="submit">
              <Save size={16} />
              Save Partner Profile
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
