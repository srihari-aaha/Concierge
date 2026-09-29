import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Users,
  Home,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/PageHeader';
import StatCard from '../../components/admin/StatCard';
import Button from '../../components/common/Button';
import './AdminReportsPage.css';

export default function AdminReportsPage() {
  const { properties, bookings, conciergeRequests } = useApp();
  const { auditLogs } = useAdmin();

  const [dateRange, setDateRange] = useState('30d'); // 7d, 30d, q3, ytd
  const [reportSection, setReportSection] = useState('revenue'); // revenue, occupancy, property_rankings, concierge, audit

  // Regional Occupancy Metrics
  const regionalOccupancy = [
    { destination: 'North Goa (Ashwem, Morjim)', rate: 88, activeProps: 48, avgRate: 16500 },
    { destination: 'South Goa (Cavelossim, Palolem)', rate: 76, activeProps: 32, avgRate: 14200 },
    { destination: 'White Town, Pondicherry', rate: 92, activeProps: 24, avgRate: 13800 },
    { destination: 'Munnar & Alleppey, Kerala', rate: 84, activeProps: 36, avgRate: 15500 },
    { destination: 'Coorg & Chikmagalur, Karnataka', rate: 79, activeProps: 28, avgRate: 12500 },
    { destination: 'Ooty & Nilgiris, Tamil Nadu', rate: 71, activeProps: 18, avgRate: 11800 },
    { destination: 'Jaipur & Udaipur, Rajasthan', rate: 85, activeProps: 22, avgRate: 21000 }
  ];

  // Concierge Service Distribution
  const conciergeStats = [
    { service: 'Airport VIP Chauffeur Transfer', count: 18, share: '36%', rev: '₹50,400' },
    { service: 'Private In-Villa Chef & Barbecue', count: 12, share: '24%', rev: '₹54,000' },
    { service: 'Mid-Stay Deep Linen Turnover', count: 9, share: '18%', rev: '₹13,500' },
    { service: 'Artisanal Pantry Pre-Stocking', count: 6, share: '12%', rev: '₹7,200' },
    { service: 'Sunset Catamaran River Cruise', count: 5, share: '10%', rev: '₹42,500' }
  ];

  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      dateRange,
      totalProperties: properties.length + 242,
      totalReservations: bookings.length + 80,
      regionalOccupancy,
      conciergeStats
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stayease-report-${dateRange}-${Date.now()}.json`;
    a.click();
  };

  return (
    <AdminLayout>
      <div className="admin-reports-page">
        <PageHeader
          title="Platform Intelligence & Hospitality Reports"
          subtitle="Holistic performance reports across occupancy yields, regional booking volume, and concierge partner SLAs"
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Reports' }
          ]}
          actions={
            <div className="reports-top-controls">
              <select
                className="admin-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days (Current Month)</option>
                <option value="q3">Q3 2024 (Festive Quarter)</option>
                <option value="ytd">Year to Date (2024)</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                icon={Download}
                onClick={handleExportReport}
              >
                Export Briefing
              </Button>
            </div>
          }
        />

        {/* Section Navigation Tabs */}
        <div className="reports-tab-bar">
          <button
            type="button"
            className={`rep-tab-pill ${reportSection === 'revenue' ? 'active' : ''}`}
            onClick={() => setReportSection('revenue')}
          >
            Revenue & Yield
          </button>
          <button
            type="button"
            className={`rep-tab-pill ${reportSection === 'occupancy' ? 'active' : ''}`}
            onClick={() => setReportSection('occupancy')}
          >
            Regional Occupancy Yields
          </button>
          <button
            type="button"
            className={`rep-tab-pill ${reportSection === 'concierge' ? 'active' : ''}`}
            onClick={() => setReportSection('concierge')}
          >
            Concierge Volume & SLAs
          </button>
          <button
            type="button"
            className={`rep-tab-pill ${reportSection === 'audit' ? 'active' : ''}`}
            onClick={() => setReportSection('audit')}
          >
            Audit Log Ledger ({auditLogs.length})
          </button>
        </div>

        {/* TAB 1: Revenue & Yield */}
        {reportSection === 'revenue' && (
          <div className="report-content-pane">
            <div className="reports-kpi-row">
              <StatCard
                label="Gross Booking Value"
                value="₹8.42 Lakh"
                subtitle="Average booking value ₹41,200"
                trend="+18.4% vs last period"
                trendDirection="up"
                icon={DollarSign}
                iconBg="#ECFDF5"
                iconColor="#10B981"
              />

              <StatCard
                label="Platform Net Take"
                value="₹84,200"
                subtitle="10% Commission take rate"
                trend="Healthy 100% margin"
                trendDirection="up"
                icon={TrendingUp}
                iconBg="#FFF1E8"
                iconColor="#ED7014"
              />

              <StatCard
                label="Average Daily Rate (ADR)"
                value="₹15,400"
                subtitle="Across 3 & 4 BHK villas"
                trend="+8.2% peak season uplift"
                trendDirection="up"
                icon={Home}
                iconBg="#EFF6FF"
                iconColor="#2563EB"
              />

              <StatCard
                label="Revenue Per Room (RevPAR)"
                value="₹12,628"
                subtitle="Based on 82% platform occupancy"
                trend="+14.0%"
                trendDirection="up"
                icon={BarChart3}
                iconBg="#F5F3FF"
                iconColor="#8B5CF6"
              />
            </div>

            {/* Monthly Trend Visual Bars */}
            <div className="report-card-panel">
              <h3 className="report-panel-title">Monthly Gross Booking Yield (2024)</h3>
              <p className="report-panel-subtitle">Figures in ₹ Lakhs across Indian holiday corridors</p>

              <div className="yield-bars-chart">
                {[
                  { month: 'Apr', val: 5.2, height: '52%' },
                  { month: 'May', val: 6.8, height: '68%' },
                  { month: 'Jun', val: 4.8, height: '48%' },
                  { month: 'Jul', val: 5.5, height: '55%' },
                  { month: 'Aug', val: 7.1, height: '71%' },
                  { month: 'Sep (Current)', val: 8.42, height: '84%', active: true },
                  { month: 'Oct (Proj)', val: 9.6, height: '96%', projected: true }
                ].map((b) => (
                  <div key={b.month} className="bar-col">
                    <span className="bar-val">₹{b.val}L</span>
                    <div className="bar-track">
                      <div
                        className={`bar-fill ${b.active ? 'active' : ''} ${b.projected ? 'projected' : ''}`}
                        style={{ height: b.height }}
                      />
                    </div>
                    <span className="bar-lbl">{b.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Regional Occupancy */}
        {reportSection === 'occupancy' && (
          <div className="report-content-pane">
            <div className="report-card-panel">
              <h3 className="report-panel-title">Destination Occupancy & Rate Comparison</h3>
              <p className="report-panel-subtitle">Weighted average stay yields across Indian leisure markets</p>

              <div className="admin-table-container" style={{ marginTop: '1rem' }}>
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>DESTINATION / REGION</th>
                      <th>ACTIVE PROPERTIES</th>
                      <th>OCCUPANCY YIELD</th>
                      <th>AVERAGE DAILY RATE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionalOccupancy.map((reg) => (
                      <tr key={reg.destination}>
                        <td>
                          <div className="dest-name-cell">
                            <MapPin size={14} color="var(--primary)" />
                            <strong>{reg.destination}</strong>
                          </div>
                        </td>
                        <td>
                          <span className="props-count-text">{reg.activeProps} Listings</span>
                        </td>
                        <td>
                          <div className="occupancy-progress-cell">
                            <span className="occ-percent">{reg.rate}%</span>
                            <div className="occ-bar-track">
                              <div
                                className="occ-bar-fill"
                                style={{
                                  width: `${reg.rate}%`,
                                  backgroundColor: reg.rate > 85 ? '#16A34A' : reg.rate > 75 ? '#2563EB' : '#D97706'
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong className="table-amount">₹{reg.avgRate.toLocaleString('en-IN')}/night</strong>
                        </td>
                        <td>
                          <span className="high-demand-tag">
                            {reg.rate > 85 ? 'Peak Demand' : 'Steady Corridor'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Concierge Volume */}
        {reportSection === 'concierge' && (
          <div className="report-content-pane">
            <div className="report-card-panel">
              <h3 className="report-panel-title">Concierge Service Volume & Marketplace Share</h3>
              <p className="report-panel-subtitle">Distribution of in-villa experiences and chauffeur bookings</p>

              <div className="admin-table-container" style={{ marginTop: '1rem' }}>
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>CONCIERGE SERVICE</th>
                      <th>FULFILLMENT COUNT</th>
                      <th>CATEGORY SHARE</th>
                      <th>GROSS VOLUME</th>
                      <th>AVERAGE SLA DISPATCH</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conciergeStats.map((srv) => (
                      <tr key={srv.service}>
                        <td>
                          <div className="service-name-cell">
                            <Sparkles size={14} color="var(--primary)" />
                            <strong>{srv.service}</strong>
                          </div>
                        </td>
                        <td>
                          <span className="fulfill-count">{srv.count} Orders</span>
                        </td>
                        <td>
                          <span className="share-pill">{srv.share}</span>
                        </td>
                        <td>
                          <strong className="table-amount">{srv.rev}</strong>
                        </td>
                        <td>
                          <span className="sla-good-tag">✓ 9.8 mins (Guaranteed under 15m)</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Audit Log (Section 38) */}
        {reportSection === 'audit' && (
          <div className="report-content-pane">
            <div className="report-card-panel">
              <h3 className="report-panel-title">System Audit Trail & Security Ledger</h3>
              <p className="report-panel-subtitle">Chronological record of admin actions, status changes, and rate updates</p>

              <div className="admin-table-container" style={{ marginTop: '1rem' }}>
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>TIMESTAMP</th>
                      <th>ADMIN USER</th>
                      <th>ACTION</th>
                      <th>ENTITY TARGET</th>
                      <th>PREVIOUS STATE</th>
                      <th>NEW STATE</th>
                      <th>IP ADDRESS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <span className="audit-time-text">{log.timestamp}</span>
                        </td>
                        <td>
                          <div className="audit-user-cell">
                            <strong>{log.adminName}</strong>
                            <span className="audit-role-sub">{log.adminRole}</span>
                          </div>
                        </td>
                        <td>
                          <span className="audit-action-chip">{log.action}</span>
                        </td>
                        <td>
                          <span className="audit-entity-text">
                            {log.entity}: <strong>{log.entityName}</strong>
                          </span>
                        </td>
                        <td>
                          <span className="audit-old-text">{log.previousValue}</span>
                        </td>
                        <td>
                          <strong className="audit-new-text">{log.newValue}</strong>
                        </td>
                        <td>
                          <span className="ip-text">{log.ipAddress}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
