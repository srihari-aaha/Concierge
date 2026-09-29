import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CreditCard,
  DollarSign,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  Download,
  Building,
  ShieldCheck,
  Landmark,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/PageHeader';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import DetailDrawer from '../../components/admin/DetailDrawer';
import EmptyState from '../../components/admin/EmptyState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import './AdminPaymentsPage.css';

export default function AdminPaymentsPage() {
  const { paymentTransactions, processSettlement } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = searchParams.get('tab') || 'all'; // all, payouts, commissions, pending
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  const selectedTxnId = searchParams.get('id');
  const [drawerTxn, setDrawerTxn] = useState(() => {
    return (paymentTransactions && paymentTransactions.find((t) => t.id === selectedTxnId)) || null;
  });

  // Authorization modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Metrics computation (Strictly Owner <-> Super Admin)
  const totalVolume = paymentTransactions.reduce((sum, t) => sum + (t.grossRental || t.amount || 0), 0) + 650000;
  const totalCommission = paymentTransactions.reduce((sum, t) => sum + (t.commissionFee || Math.round((t.amount || 0) * 0.1)), 0) + 65000;
  const pendingDisbursements = paymentTransactions
    .filter((t) => t.status === 'pending' || t.payoutStatus === 'pending')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalDisbursed = paymentTransactions
    .filter((t) => (t.flowType === 'payout' || t.flow?.includes('Owner')) && t.status === 'settled')
    .reduce((sum, t) => sum + (t.amount || 0), 0) + 585000;

  const filteredTxns = useMemo(() => {
    if (!paymentTransactions) return [];
    return paymentTransactions.filter((t) => {
      if (activeTab === 'payouts' && t.flowType !== 'payout' && !t.flow?.includes('Owner')) return false;
      if (activeTab === 'commissions' && t.flowType !== 'commission' && !t.flow?.includes('Super Admin')) return false;
      if (activeTab === 'pending' && t.status !== 'pending' && t.payoutStatus !== 'pending') return false;

      if (methodFilter !== 'all' && !t.paymentMethod?.toLowerCase().includes(methodFilter.toLowerCase())) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.id?.toLowerCase().includes(q) ||
          t.ownerName?.toLowerCase().includes(q) ||
          t.ownerEmail?.toLowerCase().includes(q) ||
          t.propertyName?.toLowerCase().includes(q) ||
          t.utrNumber?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [paymentTransactions, activeTab, methodFilter, searchQuery]);

  const handleOpenDetail = (txn) => {
    setDrawerTxn(txn);
    setSearchParams({ id: txn.id });
  };

  const handleCloseDetail = () => {
    setDrawerTxn(null);
    setSearchParams({});
  };

  const handleAuthorizeRelease = (txn) => {
    processSettlement(txn.id, 'settled');
    if (drawerTxn?.id === txn.id) {
      setDrawerTxn({ ...drawerTxn, status: 'settled', payoutStatus: 'settled' });
    }
    setIsAuthModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="admin-payments-page">
        <PageHeader
          title="Financial Ledger & Host Settlements"
          subtitle="Audit platform disbursements, commissions, and bank settlements strictly between Property Owners and Super Admin"
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Payments & Ledger' }
          ]}
          actions={
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={() => {
                const csvHeader = 'Settlement_ID,Owner_Name,Property,Flow,Amount,Commission,Channel,Status,Date\n';
                const csvData = paymentTransactions
                  .map((t) => `${t.id},"${t.ownerName}","${t.propertyName}","${t.flow}",${t.amount},${t.commissionFee || ''},"${t.paymentMethod}","${t.status}","${t.date}"`)
                  .join('\n');
                const blob = new Blob([csvHeader + csvData], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `stayease-owner-ledger-${Date.now()}.csv`;
                a.click();
              }}
            >
              Export Host Ledger
            </Button>
          }
        />

        {/* Financial KPI Cards */}
        <div className="payments-kpi-grid">
          <StatCard
            label="Total Settled Volume"
            value={`₹${(totalVolume / 100000).toFixed(2)}L`}
            subtitle="Rental transactions reconciled"
            trend="+16.4% YoY"
            trendDirection="up"
            icon={DollarSign}
            iconBg="#ECFDF5"
            iconColor="#10B981"
          />

          <StatCard
            label="Super Admin Commission (10%)"
            value={`₹${totalCommission.toLocaleString('en-IN')}`}
            subtitle="Platform retained margin"
            trend="+12.4%"
            trendDirection="up"
            icon={Building}
            iconBg="#FFF1E8"
            iconColor="#ED7014"
          />

          <StatCard
            label="Pending Owner Disbursements"
            value={`₹${pendingDisbursements.toLocaleString('en-IN')}`}
            subtitle="Next scheduled batch: Friday"
            trend="1 Batch awaiting release"
            trendDirection="neutral"
            icon={Clock}
            iconBg="#EFF6FF"
            iconColor="#2563EB"
          />

          <StatCard
            label="Disbursed to Owners"
            value={`₹${(totalDisbursed / 100000).toFixed(2)}L`}
            subtitle="100% Escrow compliant payouts"
            trend="Settled via NEFT / RTGS"
            trendDirection="up"
            icon={Landmark}
            iconBg="#F0FDF4"
            iconColor="#059669"
          />
        </div>

        {/* Tab Bar */}
        <div className="payments-tab-bar">
          <div className="tab-pill-group">
            <button
              type="button"
              className={`pay-tab-pill ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Settlements ({paymentTransactions.length})
            </button>
            <button
              type="button"
              className={`pay-tab-pill ${activeTab === 'payouts' ? 'active' : ''}`}
              onClick={() => setActiveTab('payouts')}
            >
              Super Admin → Owner (Disbursements)
            </button>
            <button
              type="button"
              className={`pay-tab-pill ${activeTab === 'commissions' ? 'active' : ''}`}
              onClick={() => setActiveTab('commissions')}
            >
              Owner → Super Admin (Commissions)
            </button>
            <button
              type="button"
              className={`pay-tab-pill ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Authorization
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="payments-filter-bar">
          <div className="filter-search-input">
            <Search size={16} className="filter-icon" />
            <input
              type="text"
              placeholder="Search Settlement ID, Owner Name, Property, UTR reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-selects-row">
            <select
              className="admin-select"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              <option value="all">All Settlement Channels</option>
              <option value="neft">NEFT Bank Transfer</option>
              <option value="rtgs">RTGS Immediate Transfer</option>
              <option value="ach">Corporate Direct Debit (ACH)</option>
              <option value="escrow">Direct Escrow Retention</option>
            </select>

            {(searchQuery || methodFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setMethodFilter('all');
                  setActiveTab('all');
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Bilateral Transactions Table (Strictly Owner <-> Super Admin) */}
        {filteredTxns.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No settlement transactions found"
            description="No owner-to-superadmin ledger records match the selected filters."
            actionText="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setMethodFilter('all');
              setActiveTab('all');
            }}
          />
        ) : (
          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>SETTLEMENT ID</th>
                  <th>PROPERTY OWNER</th>
                  <th>PROPERTY</th>
                  <th>TRANSACTION FLOW</th>
                  <th>AMOUNT</th>
                  <th>COMMISSION</th>
                  <th>PAYMENT CHANNEL</th>
                  <th>STATUS</th>
                  <th>DATE & TIME</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxns.map((t) => {
                  const isPayout = t.flowType === 'payout' || t.flow?.includes('Owner');
                  return (
                    <tr key={t.id} onClick={() => handleOpenDetail(t)} style={{ cursor: 'pointer' }}>
                      <td>
                        <span className="txn-id-badge">{t.id}</span>
                      </td>
                      <td>
                        <div className="owner-cell-info">
                          <strong className="owner-name-bold">{t.ownerName}</strong>
                          <span className="owner-bank-sub">{t.bankAccount || t.ownerEmail}</span>
                        </div>
                      </td>
                      <td>
                        <span className="prop-name-text">{t.propertyName}</span>
                      </td>
                      <td>
                        <span className={`flow-badge ${isPayout ? 'payout' : 'commission'}`}>
                          {isPayout ? (
                            <>
                              <ArrowDownRight size={13} /> Super Admin → Owner
                            </>
                          ) : (
                            <>
                              <ArrowUpRight size={13} /> Owner → Super Admin
                            </>
                          )}
                        </span>
                      </td>
                      <td>
                        <strong className="table-amount">₹{t.amount?.toLocaleString('en-IN')}</strong>
                      </td>
                      <td>
                        <span className="method-tag">₹{(t.commissionFee || Math.round((t.amount || 0) * 0.1))?.toLocaleString('en-IN')}</span>
                      </td>
                      <td>
                        <span className="method-tag">{t.paymentMethod}</span>
                      </td>
                      <td>
                        <StatusBadge status={t.status} />
                      </td>
                      <td>
                        <span className="timestamp-text">{t.date}</span>
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div className="table-row-actions">
                          {t.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setDrawerTxn(t);
                                setIsAuthModalOpen(true);
                              }}
                            >
                              Release
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDetail(t)}
                          >
                            Voucher
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Bilateral Settlement Detail Drawer */}
        {drawerTxn && (
          <DetailDrawer
            isOpen={Boolean(drawerTxn)}
            onClose={handleCloseDetail}
            title={`Settlement Voucher — ${drawerTxn.id}`}
            subtitle={`Bilateral Settlement between Property Owner and Super Admin`}
            badges={<StatusBadge status={drawerTxn.status} />}
            width="580px"
            footer={
              <div className="drawer-footer-actions">
                {drawerTxn.status === 'pending' && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={CheckCircle}
                    onClick={() => handleAuthorizeRelease(drawerTxn)}
                  >
                    Authorize Settlement Release
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCloseDetail}
                >
                  Close Voucher
                </Button>
              </div>
            }
          >
            <div className="receipt-drawer-content">
              {/* Voucher Top Card */}
              <div className="receipt-header-card">
                <span className="receipt-lbl">TOTAL SETTLED AMOUNT</span>
                <div className="receipt-big-amount">₹{drawerTxn.amount?.toLocaleString('en-IN')}</div>
                <span className="receipt-gateway-id">Bank UTR / Ref: {drawerTxn.utrNumber || drawerTxn.gatewayId || 'UTR-20240924-9104'}</span>
              </div>

              {/* Bilateral Transacting Parties */}
              <div className="drawer-section">
                <h5 className="section-sub-title">Transacting Parties</h5>
                <div className="transacting-parties-box">
                  <div className="party-col">
                    <span className="party-lbl">Platform Authority</span>
                    <strong className="party-name">Super Admin Treasury</strong>
                    <span className="party-meta">StayEase Central Escrow</span>
                    <span className="party-meta">A/C: ICICI Corp •••• 9901</span>
                  </div>

                  <div className="party-arrow-divider">
                    {drawerTxn.flowType === 'payout' || drawerTxn.flow?.includes('Owner') ? (
                      <ArrowRight size={16} />
                    ) : (
                      <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
                    )}
                  </div>

                  <div className="party-col">
                    <span className="party-lbl">Property Owner</span>
                    <strong className="party-name">{drawerTxn.ownerName}</strong>
                    <span className="party-meta">{drawerTxn.ownerEmail}</span>
                    <span className="party-meta">{drawerTxn.bankAccount || 'HDFC Bank •••• 4892'}</span>
                  </div>
                </div>
              </div>

              {/* Fee & Split Breakdown */}
              <div className="drawer-section">
                <h5 className="section-sub-title">Settlement Reconciliation</h5>
                <div className="fee-split-box">
                  <div className="fee-split-row">
                    <span>Associated Property</span>
                    <strong>{drawerTxn.propertyName}</strong>
                  </div>
                  <div className="fee-split-row">
                    <span>Transaction Direction</span>
                    <strong style={{ color: 'var(--primary)' }}>{drawerTxn.flow}</strong>
                  </div>
                  <div className="fee-split-row">
                    <span>Gross Villa Booking Revenue</span>
                    <strong>₹{(drawerTxn.grossRental || drawerTxn.amount || 45000)?.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="fee-split-row">
                    <span>Super Admin Platform Commission (10%)</span>
                    <strong style={{ color: '#C2410C' }}>
                      ₹{(drawerTxn.commissionFee || Math.round((drawerTxn.amount || 40000) * 0.1))?.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="fee-split-row total-row">
                    <span>Net Transferred Settlement</span>
                    <strong style={{ color: '#047857' }}>
                      ₹{drawerTxn.amount?.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="fee-split-row">
                    <span>Settlement Mode & Bank Channel</span>
                    <span>{drawerTxn.paymentMethod}</span>
                  </div>
                  <div className="fee-split-row">
                    <span>Settlement Timestamp</span>
                    <span>{drawerTxn.date}</span>
                  </div>
                </div>
              </div>

              {drawerTxn.notes && (
                <div className="settlement-audit-callout">
                  <strong>Settlement Ledger Memo:</strong>
                  <p>{drawerTxn.notes}</p>
                </div>
              )}
            </div>
          </DetailDrawer>
        )}

        {/* Authorize Modal */}
        <Modal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          title="Authorize Host Settlement Release"
          subtitle={`Disburse payment to ${drawerTxn?.ownerName}`}
          maxWidth="460px"
        >
          <div className="auth-release-modal" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
              Are you sure you want to authorize the release of <strong>₹{drawerTxn?.amount?.toLocaleString('en-IN')}</strong> from Super Admin Escrow to <strong>{drawerTxn?.ownerName}</strong> ({drawerTxn?.bankAccount})?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="outline" size="md" onClick={() => setIsAuthModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleAuthorizeRelease(drawerTxn)}
              >
                Confirm & Disburse
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
