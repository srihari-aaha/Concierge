import React from 'react';
import { DollarSign, Download, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';

export default function OwnerEarningsPage() {
  return (
    <DashboardLayout
      title="Host Earnings & Remittances"
      subtitle="Financial performance, net rental payouts, and concierge revenue sharing"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.25rem'
          }}
        >
          <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-light)' }}>THIS MONTH NET</span>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-dark)', margin: '0.35rem 0' }}>
              ₹1,10,760
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From 2 villa bookings</span>
          </div>

          <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-light)' }}>CONCIERGE REVENUE SHARE</span>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent)', margin: '0.35rem 0' }}>
              ₹8,450
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From dining & airport transfers</span>
          </div>

          <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-light)' }}>AVERAGE OCCUPANCY</span>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', margin: '0.35rem 0' }}>
              76%
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Peak Goan season ahead</span>
          </div>

          <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-light)' }}>AVERAGE DAILY RATE</span>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', margin: '0.35rem 0' }}>
              ₹15,400
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Premium holiday segment</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
