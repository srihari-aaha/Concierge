import React from 'react';
import './StatusBadge.css';

export default function StatusBadge({ status, size = 'sm', className = '' }) {
  if (!status) return null;

  const normalized = String(status).toLowerCase().replace(/\s+/g, '_');

  const statusConfig = {
    // Properties
    active: { label: 'Active', class: 'status-active', dot: true },
    pending_approval: { label: 'Pending Approval', class: 'status-pending-approval', dot: true },
    suspended: { label: 'Suspended', class: 'status-suspended', dot: true },
    inactive: { label: 'Inactive', class: 'status-inactive', dot: false },

    // Reservations
    confirmed: { label: 'Confirmed', class: 'status-confirmed', dot: true },
    pending: { label: 'Pending', class: 'status-pending', dot: true },
    checked_in: { label: 'Checked In', class: 'status-checked-in', dot: true },
    checked_out: { label: 'Checked Out', class: 'status-checked-out', dot: false },
    cancelled: { label: 'Cancelled', class: 'status-cancelled', dot: false },

    // Concierge & Maintenance
    requested: { label: 'Requested', class: 'status-pending', dot: true },
    assigned: { label: 'Assigned', class: 'status-assigned', dot: true },
    in_progress: { label: 'In Progress', class: 'status-progress', dot: true },
    waiting: { label: 'Waiting Parts/Host', class: 'status-waiting', dot: true },
    waiting_parts: { label: 'Waiting Parts', class: 'status-waiting', dot: true },
    completed: { label: 'Completed', class: 'status-completed', dot: true },
    resolved: { label: 'Resolved', class: 'status-completed', dot: true },
    closed: { label: 'Closed', class: 'status-inactive', dot: false },
    escalated: { label: 'Escalated', class: 'status-escalated', dot: true },

    // Housekeeping
    cleaning: { label: 'In Cleaning', class: 'status-progress', dot: true },
    inspection: { label: 'Needs Inspection', class: 'status-waiting', dot: true },

    // Payments
    paid: { label: 'Paid', class: 'status-paid', dot: true },
    failed: { label: 'Failed', class: 'status-failed', dot: true },
    refunded: { label: 'Refunded', class: 'status-refunded', dot: false },
    partially_refunded: { label: 'Partially Refunded', class: 'status-waiting', dot: false },
    settled: { label: 'Settled', class: 'status-paid', dot: true },
    on_hold: { label: 'On Hold', class: 'status-suspended', dot: true },

    // Reviews & Moderation
    published: { label: 'Published', class: 'status-active', dot: true },
    approved: { label: 'Approved', class: 'status-active', dot: true },
    flagged: { label: 'Flagged', class: 'status-escalated', dot: true },
    hidden: { label: 'Hidden', class: 'status-inactive', dot: false },

    // Guests & Staff
    vip: { label: 'VIP Guest', class: 'status-vip', dot: true },
    available: { label: 'Available', class: 'status-active', dot: true },
    busy: { label: 'On Task', class: 'status-waiting', dot: true },
    on_leave: { label: 'On Leave', class: 'status-inactive', dot: false }
  };

  const config = statusConfig[normalized] || {
    label: status.replace(/_/g, ' ').toUpperCase(),
    class: 'status-default',
    dot: false
  };

  return (
    <span className={`admin-status-badge ${config.class} size-${size} ${className}`}>
      {config.dot && <span className="status-dot" />}
      <span className="status-text">{config.label}</span>
    </span>
  );
}
