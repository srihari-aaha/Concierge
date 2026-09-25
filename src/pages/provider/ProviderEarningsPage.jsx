import React from 'react';
import { DollarSign, Download, ArrowUpRight, ShieldCheck, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';

export default function ProviderEarningsPage() {
  const payouts = [
    { id: 'PAY-1082', date: 'Sep 20, 2024', desc: '4x Airport Transfers & Villa Maintenance', amount: 9600, status: 'Settled to HDFC Bank' },
    { id: 'PAY-1075', date: 'Sep 13, 2024', desc: 'Chauffeur Fleet & AC Servicing (Goa)', amount: 14200, status: 'Settled to HDFC Bank' },
    { id: 'PAY-1068', date: 'Sep 06, 2024', desc: 'Emergency Plumbing & Transfers', amount: 8400, status: 'Settled to HDFC Bank' }
  ];

  return (
    <DashboardLayout
      title="Specialist Earnings & Payouts"
      subtitle="Direct bank settlements for completed concierge and maintenance fulfillments"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.25rem',
            backgroundColor: 'var(--surface)',
            padding: '1.75rem',
            borderRadius: 'var(--radius-card)',
            border: '1px solid var(--border-light)'
          }}
        >
          <div>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-light)' }}>THIS MONTH EARNINGS</span>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)', margin: '0.35rem 0' }}>
              ₹38,400
            </div>
            <span style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>+22% from prior period</span>
          </div>

          <div>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-light)' }}>PENDING CLEARANCE</span>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--accent)', margin: '0.35rem 0' }}>
              ₹6,900
            </div>
            <span style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>Scheduled for Friday settlement</span>
          </div>

          <div>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-light)' }}>LIFETIME PAYOUTS</span>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--text)', margin: '0.35rem 0' }}>
              ₹2,84,500
            </div>
            <span style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>142 verified jobs</span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-card)',
            border: '1px solid var(--border-light)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text)' }}>
            Recent Bank Transfer Ledger
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {payouts.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  backgroundColor: 'var(--surface-warm)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{p.desc}</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {p.id} • {p.date} • {p.status}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                    ₹{p.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
