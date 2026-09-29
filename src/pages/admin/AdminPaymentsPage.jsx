import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CreditCard,
  DollarSign,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  Download,
  Building,
  ShieldCheck
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
  const { paymentTransactions, refundReservation } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = searchParams.get('tab') || 'all'; // all, pending, refunded, failed
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  const selectedTxnId = searchParams.get('id');
  const [drawerTxn, setDrawerTxn] = useState(() => {
    return paymentTransactions.find((t) => t.id === selectedTxnId) || null;
  });

  // Refund Modal State
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('Authorized customer refund');

  // Metrics
  const totalGross = paymentTransactions
    .filter((t) => t.status === 'paid')
    .reduce((sum, t) => sum + (t.amount || 0), 0) + 685000;
  const totalRefunded = paymentTransactions
    .filter((t) => t.status === 'refunded')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const pendingPayouts = paymentTransactions
    .filter((t) => t.payoutStatus === 'pending')
    .reduce((sum, t) => sum + (t.ownerPayout || 0), 0);

  const filteredTxns = useMemo(() => {
    return paymentTransactions.filter((t) => {
      if (activeTab === 'pending' && t.payoutStatus !== 'pending') return false;
      if (activeTab === 'refunded' && t.status !== 'refunded') return false;
      if (activeTab === 'failed' && t.status !== 'failed') return false;

      if (methodFilter !== 'all' && !t.paymentMethod.toLowerCase().includes(methodFilter.toLowerCase())) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.id.toLowerCase().includes(q) ||
          t.reservationRef.toLowerCase().includes(q) ||
          t.guestName.toLowerCase().includes(q) ||
          t.propertyName.toLowerCase().includes(q)
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

  const handleOpenRefund = (txn) => {
    setDrawerTxn(txn);
    setRefundAmount(String(txn.amount || 10000));
    setIsRefundModalOpen(true);
  };

  const handleRefundSubmit = (e) => {
    e.preventDefault();
    if (!drawerTxn) return;
    refundReservation(drawerTxn.reservationRef, refundAmount, refundReason);
    setIsRefundModalOpen(false);
    if (drawerTxn) {
      setDrawerTxn({ ...drawerTxn, status: 'refunded', refundReason });
    }
  };

  return (
    <AdminLayout>
      <div className="admin-payments-page">
        <PageHeader
          title="Financial Ledger & Merchant Settlements"
          subtitle="Audit gross booking revenues, platform commissions, guest refund disbursements, and host bank payouts"
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Payments' }
          ]}
          actions={
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={() => {
                const csvData = paymentTransactions.map((t) => `${t.id},${t.reservationRef},${t.amount},${t.status}`).join('\n');
                const blob = new Blob([csvData], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `stayease-transactions-${Date.now()}.csv`;
                a.click();
              }}
            >
              Export CSV Ledger
            </Button>
          }
        />

        {/* Financial KPI Cards */}
        <div className="payments-kpi-grid">
          <StatCard
            label="Total Gross Volume"
            value={`₹${(totalGross / 100000).toFixed(2)}L`}
            subtitle="Processed this month"
            trend="+15.8% YoY"
            trendDirection="up"
            icon={DollarSign}
            iconBg="#ECFDF5"
            iconColor="#10B981"
          />

          <StatCard
            label="Platform Commission (10%)"
            value={`₹${Math.round(totalGross * 0.1).toLocaleString('en-IN')}`}
            subtitle="StayEase net earnings"
            trend="+12.4%"
            trendDirection="up"
            icon={Building}
            iconBg="#FFF1E8"
            iconColor="#ED7014"
          />

          <StatCard
            label="Pending Host Payouts"
            value={`₹${pendingPayouts.toLocaleString('en-IN')}`}
            subtitle="Next scheduled batch: Friday"
            trend="1 Host settlement"
            trendDirection="neutral"
            icon={Clock}
            iconBg="#EFF6FF"
            iconColor="#2563EB"
          />

          <StatCard
            label="Processed Refunds"
            value={`₹${totalRefunded.toLocaleString('en-IN')}`}
            subtitle="100% Policy compliant"
            trend="1 Approved refund"
            trendDirection="neutral"
            icon={RotateCcw}
            iconBg="#FEF2F2"
            iconColor="#DC2626"
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
              All Transactions ({paymentTransactions.length})
            </button>
            <button
              type="button"
              className={`pay-tab-pill ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Payouts
            </button>
            <button
              type="button"
              className={`pay-tab-pill ${activeTab === 'refunded' ? 'active' : ''}`}
              onClick={() => setActiveTab('refunded')}
            >
              Refunds Disbursed
            </button>
            <button
              type="button"
              className={`pay-tab-pill ${activeTab === 'failed' ? 'active' : ''}`}
              onClick={() => setActiveTab('failed')}
            >
              Failed Checkouts
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="payments-filter-bar">
          <div className="filter-search-input">
            <Search size={16} className="filter-icon" />
            <input
              type="text"
              placeholder="Search TXN ID, reservation reference, guest..."
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
              <option value="all">All Payment Gateways</option>
              <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
              <option value="card">Credit Card (Visa / Mastercard)</option>
              <option value="netbanking">NetBanking</option>
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

        {/* Transactions Table */}
        {filteredTxns.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No transactions found"
            description="No payment ledgers match the selected filters."
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
                  <th>TRANSACTION ID</th>
                  <th>RESERVATION REF</th>
                  <th>GUEST</th>
                  <th>PROPERTY</th>
                  <th>AMOUNT</th>
                  <th>PAYMENT METHOD</th>
                  <th>PAYMENT STATUS</th>
                  <th>PAYOUT STATUS</th>
                  <th>TIMESTAMP</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxns.map((t) => (
                  <tr key={t.id} onClick={() => handleOpenDetail(t)} style={{ cursor: 'pointer' }}>
                    <td>
                      <span className="txn-id-badge">{t.id}</span>
                    </td>
                    <td>
                      <span className="ref-badge">{t.reservationRef}</span>
                    </td>
                    <td>
                      <span className="guest-name-text">{t.guestName}</span>
                    </td>
                    <td>
                      <span className="prop-name-text">{t.propertyName}</span>
                    </td>
                    <td>
                      <strong className="table-amount">₹{t.amount?.toLocaleString('en-IN')}</strong>
                    </td>
                    <td>
                      <span className="method-tag">{t.paymentMethod}</span>
                    </td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                    <td>
                      <StatusBadge status={t.payoutStatus} />
                    </td>
                    <td>
                      <span className="timestamp-text">{t.date}</span>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div className="table-row-actions">
                        {t.status === 'paid' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenRefund(t)}
                          >
                            Refund
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDetail(t)}
                        >
                          Receipt
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Transaction Detail Drawer */}
        {drawerTxn && (
          <DetailDrawer
            isOpen={Boolean(drawerTxn)}
            onClose={handleCloseDetail}
            title={`Transaction Receipt — ${drawerTxn.id}`}
            subtitle={`Ref: ${drawerTxn.reservationRef} • Settled via ${drawerTxn.paymentMethod}`}
            badges={<StatusBadge status={drawerTxn.status} />}
            width="560px"
            footer={
              <div className="drawer-footer-actions">
                {drawerTxn.status === 'paid' && (
                  <Button
                    variant="danger"
                    size="sm"
                    icon={RotateCcw}
                    onClick={() => handleOpenRefund(drawerTxn)}
                  >
                    Initiate Refund
                  </Button>
                )}
              </div>
            }
          >
            <div className="receipt-drawer-content">
              <div className="receipt-header-card">
                <span className="receipt-lbl">TOTAL SETTLED AMOUNT</span>
                <div className="receipt-big-amount">₹{drawerTxn.amount?.toLocaleString('en-IN')}</div>
                <span className="receipt-gateway-id">Gateway ID: {drawerTxn.gatewayId || 'pay_live_0912'}</span>
              </div>

              <div className="drawer-section">
                <h5 className="section-sub-title">Fee Breakdown & Splits</h5>
                <div className="fee-split-box">
                  <div className="fee-split-row">
                    <span>Gross Guest Charge</span>
                    <strong>₹{drawerTxn.amount?.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="fee-split-row">
                    <span>StayEase Platform Fee (10%)</span>
                    <strong style={{ color: 'var(--primary)' }}>
                      ₹{drawerTxn.platformFee ? drawerTxn.platformFee.toLocaleString('en-IN') : Math.round((drawerTxn.amount || 30000) * 0.1).toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="fee-split-row">
                    <span>Net Owner Payout</span>
                    <strong>
                      ₹{drawerTxn.ownerPayout ? drawerTxn.ownerPayout.toLocaleString('en-IN') : Math.round((drawerTxn.amount || 30000) * 0.9).toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="fee-split-row">
                    <span>Host Bank Payout Status</span>
                    <StatusBadge status={drawerTxn.payoutStatus || 'settled'} />
                  </div>
                </div>
              </div>

              {drawerTxn.refundReason && (
                <div className="refund-audit-callout">
                  <strong>Refund Audit Reason:</strong>
                  <p>{drawerTxn.refundReason}</p>
                </div>
              )}
            </div>
          </DetailDrawer>
        )}

        {/* Refund Authorization Modal */}
        <Modal
          isOpen={isRefundModalOpen}
          onClose={() => setIsRefundModalOpen(false)}
          title="Authorize Merchant Refund"
          subtitle={`Disburse payment reversal for ${drawerTxn?.id}`}
          maxWidth="460px"
        >
          <form onSubmit={handleRefundSubmit} className="refund-form">
            <div className="form-group">
              <label>Reversal Amount (₹) *</label>
              <input
                type="number"
                required
                max={drawerTxn?.amount || 100000}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Reason for Authorization *</label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
              >
                <option value="Guest cancellation within policy window">Guest cancellation within policy window</option>
                <option value="Monsoon / severe coastal weather cancellation">Monsoon / severe coastal weather cancellation</option>
                <option value="Operational villa maintenance failure">Operational villa maintenance failure</option>
                <option value="Duplicate payment refund">Duplicate payment refund</option>
              </select>
            </div>

            <div className="form-actions-row">
              <Button variant="outline" size="md" onClick={() => setIsRefundModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="md" type="submit">
                Execute Refund
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
