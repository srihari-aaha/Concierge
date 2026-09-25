import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, ShieldCheck, Heart, Bell, CreditCard, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function GuestProfilePage() {
  const { currentUser, showToast } = useApp();

  const [formData, setFormData] = useState({
    
    email: currentUser?.email || 'priya.sharma@example.com',
    phone: currentUser?.phone || '+91 98201 55678',
    city: currentUser?.city || 'Bengaluru, Karnataka',
    emergencyContact: 'Amit Sharma (+91 98201 99881)',
    dietary: 'Vegetarian (No eggs / Jain friendly)',
    pillowPreference: 'Feather soft / Lavender aromatherapy',
    smsNotifications: true,
    whatsappUpdates: true,
    upiId: 'priya.sharma@okaxis'
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
    showToast('Your traveler profile preferences have been updated.', 'success');
  };

  return (
    <DashboardLayout
      title="Guest Profile & Preferences"
      subtitle="Manage your personal information, concierge preferences, and verified verification credentials"
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
              PS
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)' }}>
                  {formData.name}
                </h3>
                <Badge variant="sage" size="sm">
                  <ShieldCheck size={12} style={{ marginRight: '4px' }} />
                  Aadhaar Verified
                </Badge>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                StayEase Verified Traveler • Member since October 2024
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
              Trust Score: 100%
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
            Personal Contact Information
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Full Name
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
                Email Address
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
                Primary Mobile (WhatsApp enabled)
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
                Home City & State
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

          <div style={{ marginTop: '0.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Emergency Contact Name & Number
            </label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
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

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '0.5rem 0' }} />

          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text)' }}>
            Hospitality & Concierge Preferences
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Dietary & Dining Needs
              </label>
              <input
                type="text"
                name="dietary"
                value={formData.dietary}
                onChange={handleChange}
                placeholder="e.g. Pure Vegetarian, Gluten-free, Jain"
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
                Default Payment UPI VPA
              </label>
              <input
                type="text"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                placeholder="name@okaxis"
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="whatsappUpdates"
                checked={formData.whatsappUpdates}
                onChange={handleChange}
              />
              <span>Send door codes, driver live tracking, and concierge updates to WhatsApp</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="smsNotifications"
                checked={formData.smsNotifications}
                onChange={handleChange}
              />
              <span>Receive instant SMS emergency alerts & check-in OTPs</span>
            </label>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <Button variant="primary" type="submit">
              <Save size={16} />
              Save Traveler Profile
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
