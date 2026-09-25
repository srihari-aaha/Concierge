import React, { useState } from 'react';
import { ShieldCheck, Mail, Phone, MapPin, Key, Bell, Save, Lock, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function AdminProfilePage() {
  const { currentUser, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Ananya Deshmukh',
    email: currentUser?.email || 'admin@stayease.in',
    phone: currentUser?.phone || '+91 98190 00122',
    city: currentUser?.city || 'Mumbai',
    department: 'Trust, Safety & Platform Integrity',
    roleTitle: 'Lead Operations Administrator',
    twoFactorEnabled: true,
    notifyOnNewProperty: true,
    notifyOnHighValueBooking: true,
    notifyOnEmergencyMaintenance: true,
    emergencyPhone: '+91 98190 99443'
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
    showToast('Platform Administrator profile and security settings updated.', 'success');
  };

  return (
    <DashboardLayout
      title="Admin Profile & Security"
      subtitle="Manage your administrative credentials, security clearance, and platform dispatch notifications"
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
            <img
              src={currentUser?.avatar}
              alt={formData.name}
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #ffffff',
                boxShadow: 'var(--shadow-xs)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)' }}>
                  {formData.name}
                </h3>
                <Badge variant="terracotta" size="sm">
                  <ShieldCheck size={12} style={{ marginRight: '4px' }} />
                  Super Administrator
                </Badge>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {formData.roleTitle} • {formData.department}
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
              Access Level: Tier-1
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
            Admin Identity & Contact
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Admin Full Name
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
                Official StayEase Email
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

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Direct Phone
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
                HQ Location / City
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
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '0.5rem 0' }} />

          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text)' }}>
            Security & Clearance Credentials
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              <input
                type="checkbox"
                name="twoFactorEnabled"
                checked={formData.twoFactorEnabled}
                onChange={handleChange}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              <span>
                <strong>Require Hardware 2-Factor Authentication (FIDO2 / U2F)</strong>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Enforce hardware security key verification for all moderation actions and ledger refunds
                </span>
              </span>
            </label>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '0.5rem 0' }} />

          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text)' }}>
            System Dispatch Alerts
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                name="notifyOnNewProperty"
                checked={formData.notifyOnNewProperty}
                onChange={handleChange}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              <span>Send push alert on new host property submission awaiting vetting</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                name="notifyOnHighValueBooking"
                checked={formData.notifyOnHighValueBooking}
                onChange={handleChange}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              <span>Alert when a booking transaction exceeds ₹50,000 INR</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                name="notifyOnEmergencyMaintenance"
                checked={formData.notifyOnEmergencyMaintenance}
                onChange={handleChange}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              <span>Immediate SMS alert on critical / emergency guest maintenance escalations</span>
            </label>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="primary" icon={<Save size={16} />}>
              Save Administrator Profile
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
