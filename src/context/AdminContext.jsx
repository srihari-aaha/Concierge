import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApp } from './AppContext';
import {
  INITIAL_HOUSEKEEPING_TASKS,
  INITIAL_STAFF_MEMBERS,
  INITIAL_OWNERS,
  INITIAL_GUESTS,
  INITIAL_PAYMENT_TRANSACTIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_LOCATIONS,
  INITIAL_CONCIERGE_CATALOGUE,
  INITIAL_PLATFORM_SETTINGS,
  RBAC_ROLES
} from '../data/adminMockData';

const AdminContext = createContext(null);

const STORAGE_ADMIN_KEY = 'stayease_admin_state_v2';

export function AdminProvider({ children }) {
  const {
    properties,
    setProperties,
    bookings,
    createBooking,
    conciergeRequests,
    maintenanceTickets,
    reviews,
    showToast,
    currentUser,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useApp();

  // Active Admin RBAC Role simulation
  const [currentAdminRoleKey, setCurrentAdminRoleKey] = useState(() => {
    return localStorage.getItem(`${STORAGE_ADMIN_KEY}_role`) || 'super_admin';
  });

  // Housekeeping Tasks
  const [housekeepingTasks, setHousekeepingTasks] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_ADMIN_KEY}_housekeeping`);
    return saved ? JSON.parse(saved) : INITIAL_HOUSEKEEPING_TASKS;
  });

  // Staff Directory
  const [staffMembers, setStaffMembers] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_ADMIN_KEY}_staff`);
    return saved ? JSON.parse(saved) : INITIAL_STAFF_MEMBERS;
  });

  // Owners Directory
  const [owners, setOwners] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_ADMIN_KEY}_owners`);
    return saved ? JSON.parse(saved) : INITIAL_OWNERS;
  });

  // Guests Directory
  const [guests, setGuests] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_ADMIN_KEY}_guests`);
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  // Financial Transactions (Between Owner & Super Admin)
  const [paymentTransactions, setPaymentTransactions] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_ADMIN_KEY}_payments`);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_TRANSACTIONS;
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_ADMIN_KEY}_audit`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Platform Locations
  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_ADMIN_KEY}_locations`);
    return saved ? JSON.parse(saved) : INITIAL_LOCATIONS;
  });

  // Concierge Services Catalogue
  const [conciergeCatalogue, setConciergeCatalogue] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_ADMIN_KEY}_catalogue`);
    return saved ? JSON.parse(saved) : INITIAL_CONCIERGE_CATALOGUE;
  });

  // Platform Settings
  const [platformSettings, setPlatformSettings] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_ADMIN_KEY}_settings`);
    return saved ? JSON.parse(saved) : INITIAL_PLATFORM_SETTINGS;
  });

  // Announcements
  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_ADMIN_KEY}_announcements`);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  // Local Storage Sync
  useEffect(() => {
    localStorage.setItem(`${STORAGE_ADMIN_KEY}_role`, currentAdminRoleKey);
  }, [currentAdminRoleKey]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_ADMIN_KEY}_housekeeping`, JSON.stringify(housekeepingTasks));
  }, [housekeepingTasks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_ADMIN_KEY}_staff`, JSON.stringify(staffMembers));
  }, [staffMembers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_ADMIN_KEY}_owners`, JSON.stringify(owners));
  }, [owners]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_ADMIN_KEY}_guests`, JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_ADMIN_KEY}_payments`, JSON.stringify(paymentTransactions));
  }, [paymentTransactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_ADMIN_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_ADMIN_KEY}_locations`, JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_ADMIN_KEY}_catalogue`, JSON.stringify(conciergeCatalogue));
  }, [conciergeCatalogue]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_ADMIN_KEY}_settings`, JSON.stringify(platformSettings));
  }, [platformSettings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_ADMIN_KEY}_announcements`, JSON.stringify(announcements));
  }, [announcements]);

  // Current Active Role Details & Permission check
  const activeRoleConfig = RBAC_ROLES.find((r) => r.roleKey === currentAdminRoleKey) || RBAC_ROLES[0];

  const hasPermission = (permissionKey) => {
    if (currentAdminRoleKey === 'super_admin') return true;
    if (activeRoleConfig.permissions.includes('all')) return true;
    return activeRoleConfig.permissions.includes(permissionKey);
  };

  // Audit Logging
  const addAuditLog = (action, entity, entityId, previousValue, newValue, entityName = '') => {
    const newLog = {
      id: `audit-${Date.now()}`,
      adminName: currentUser.name || 'Admin',
      adminRole: activeRoleConfig.name,
      action,
      entity,
      entityId,
      entityName: entityName || entityId,
      previousValue,
      newValue,
      timestamp: 'Just now',
      ipAddress: '103.21.244.18 (Mumbai)'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Property Actions
  const approveProperty = (propertyId) => {
    const prop = properties.find((p) => p.id === propertyId);
    if (!prop) return;

    localStorage.setItem(
      'stayease_prototype_state_v2_properties',
      JSON.stringify(properties.map((p) => (p.id === propertyId ? { ...p, status: 'active' } : p)))
    );

    // Refresh context if setter exists
    if (window.dispatchEvent) {
      window.dispatchEvent(new Event('storage'));
    }

    addAuditLog('Approved Property', 'Property', propertyId, 'Status: Pending Approval', 'Status: Active', prop.name);
    showToast(`Property "${prop.name}" approved and activated!`, 'success');
  };

  const suspendProperty = (propertyId, reason = 'Quality standard compliance check') => {
    const prop = properties.find((p) => p.id === propertyId);
    if (!prop) return;

    addAuditLog('Suspended Property', 'Property', propertyId, `Status: ${prop.status}`, `Status: Suspended (${reason})`, prop.name);
    showToast(`Property "${prop.name}" has been suspended.`, 'info');
  };

  const activateProperty = (propertyId) => {
    const prop = properties.find((p) => p.id === propertyId);
    if (!prop) return;

    addAuditLog('Activated Property', 'Property', propertyId, `Status: ${prop.status}`, 'Status: Active', prop.name);
    showToast(`Property "${prop.name}" is now active and bookable.`, 'success');
  };

  const deleteProperty = (propertyId) => {
    const prop = properties.find((p) => p.id === propertyId);
    const propName = prop ? prop.name : propertyId;
    addAuditLog('Deleted Property', 'Property', propertyId, 'Active in catalog', 'Deleted', propName);
    showToast(`Property "${propName}" has been removed.`, 'danger');
  };

  // Reservation Actions
  const updateReservationStatus = (bookingId, newStatus) => {
    const booking = bookings.find((b) => b.id === bookingId);
    const prevStatus = booking ? booking.status : 'Unknown';
    addAuditLog('Updated Reservation Status', 'Reservation', bookingId, `Status: ${prevStatus}`, `Status: ${newStatus}`, booking?.propertyName);
    showToast(`Reservation ${booking?.reference || bookingId} status changed to ${newStatus.toUpperCase()}`, 'success');
  };

  const refundReservation = (bookingId, amount, reason) => {
    const booking = bookings.find((b) => b.id === bookingId);
    const newTxn = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      reservationRef: booking?.reference || 'STY-REFUND',
      propertyName: booking?.propertyName || 'StayEase Homestay',
      guestName: booking?.guestName || 'Guest',
      guestEmail: booking?.guestEmail || 'guest@stayease.in',
      amount: Number(amount),
      platformFee: 0,
      ownerPayout: 0,
      paymentMethod: booking?.paymentMethod || 'Original Source (UPI/Card)',
      status: 'refunded',
      payoutStatus: 'on_hold',
      date: 'Just now',
      gatewayId: `pay_ref_${Date.now()}`,
      refundReason: reason
    };

    setPaymentTransactions((prev) => [newTxn, ...prev]);
    addAuditLog('Processed Refund', 'Transaction', newTxn.id, `Original: ₹${booking?.totalAmount || amount}`, `Refunded: ₹${amount}`, booking?.propertyName);
    showToast(`Refund of ₹${Number(amount).toLocaleString('en-IN')} initiated successfully.`, 'success');
  };

  // Concierge Actions
  const updateConciergeRequest = (requestId, patch) => {
    const req = conciergeRequests.find((r) => r.id === requestId);
    addAuditLog('Modified Concierge Request', 'Concierge', requestId, `Status: ${req?.status}`, `Updated ${Object.keys(patch).join(', ')}`, req?.serviceTitle);
    showToast('Concierge request updated.', 'success');
  };

  const assignConciergeStaff = (requestId, staffId) => {
    const staff = staffMembers.find((s) => s.id === staffId);
    const req = conciergeRequests.find((r) => r.id === requestId);
    addAuditLog('Assigned Concierge Task', 'Concierge', requestId, req?.assignedProviderName || 'Unassigned', staff ? staff.name : staffId, req?.serviceTitle);
    showToast(`Assigned ${staff ? staff.name : 'Staff'} to request.`, 'success');
  };

  const escalateConciergeRequest = (requestId, reason = 'Urgent VIP / SLA escalation') => {
    const req = conciergeRequests.find((r) => r.id === requestId);
    addAuditLog('Escalated Concierge Request', 'Concierge', requestId, `Priority: ${req?.priority || 'Normal'}`, `ESCALATED: ${reason}`, req?.serviceTitle);
    showToast(`Request ${requestId} escalated to Management.`, 'urgent');
  };

  const completeConciergeRequest = (requestId) => {
    const req = conciergeRequests.find((r) => r.id === requestId);
    addAuditLog('Completed Concierge Request', 'Concierge', requestId, 'In Progress', 'Completed', req?.serviceTitle);
    showToast(`Request "${req?.serviceTitle || requestId}" marked as completed.`, 'success');
  };

  // Housekeeping Actions
  const updateHousekeepingStatus = (taskId, status, staffId) => {
    setHousekeepingTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const staff = staffMembers.find((s) => s.id === (staffId || t.assignedStaffId));
          return {
            ...t,
            status,
            assignedStaffId: staff ? staff.id : t.assignedStaffId,
            assignedStaffName: staff ? staff.name : t.assignedStaffName
          };
        }
        return t;
      })
    );
    showToast(`Housekeeping status updated to ${status.toUpperCase()}`, 'success');
  };

  const addHousekeepingTask = (taskData) => {
    const newTask = {
      id: `hk-${Date.now()}`,
      status: 'pending',
      priority: 'normal',
      checklist: [
        { task: 'Bed linen & towels replacement', done: false },
        { task: 'Kitchen & living area vacuum/mopping', done: false },
        { task: 'Restroom sanitization & toiletries restock', done: false }
      ],
      ...taskData
    };
    setHousekeepingTasks((prev) => [newTask, ...prev]);
    showToast('New housekeeping task scheduled.', 'success');
    return newTask;
  };

  // Staff Actions
  const updateStaffMember = (staffId, patch) => {
    setStaffMembers((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, ...patch } : s))
    );
    showToast('Staff member details saved.', 'success');
  };

  const addStaffMember = (staffData) => {
    const newStaff = {
      id: `staff-${Date.now()}`,
      currentTasks: 0,
      availability: 'available',
      status: 'active',
      rating: 5.0,
      joinedDate: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      permissions: ['operations.manage'],
      ...staffData
    };
    setStaffMembers((prev) => [newStaff, ...prev]);
    showToast(`Staff member ${newStaff.name} added to roster.`, 'success');
    return newStaff;
  };

  // Review Moderation
  const moderateReview = (reviewId, action) => {
    // action: 'approve', 'hide', 'flag'
    addAuditLog('Moderated Review', 'Review', reviewId, 'Pending / Published', `Action: ${action.toUpperCase()}`);
    showToast(`Review ${reviewId} marked as ${action.toUpperCase()}`, 'info');
  };

  // Global Search across all entities
  const searchAll = (query) => {
    if (!query || !query.trim()) {
      return {
        properties: [],
        guests: [],
        reservations: [],
        concierge: [],
        staff: [],
        payments: []
      };
    }
    const q = query.toLowerCase().trim();

    return {
      properties: properties.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          (p.ownerName && p.ownerName.toLowerCase().includes(q))
      ),
      owners: owners.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          (o.city && o.city.toLowerCase().includes(q))
      ),
      guests: guests.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.email.toLowerCase().includes(q) ||
          g.phone.toLowerCase().includes(q) ||
          g.city.toLowerCase().includes(q)
      ),
      reservations: bookings.filter(
        (b) =>
          b.reference.toLowerCase().includes(q) ||
          b.guestName.toLowerCase().includes(q) ||
          b.propertyName.toLowerCase().includes(q)
      ),
      concierge: conciergeRequests.filter(
        (c) =>
          (c.serviceTitle && c.serviceTitle.toLowerCase().includes(q)) ||
          (c.guestName && c.guestName.toLowerCase().includes(q)) ||
          (c.propertyName && c.propertyName.toLowerCase().includes(q))
      ),
      staff: staffMembers.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.role.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      ),
      payments: paymentTransactions.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          (t.ownerName && t.ownerName.toLowerCase().includes(q)) ||
          (t.propertyName && t.propertyName.toLowerCase().includes(q)) ||
          (t.utrNumber && t.utrNumber.toLowerCase().includes(q))
      )
    };
  };

  const updateOwner = (ownerId, patch) => {
    setOwners((prev) =>
      prev.map((o) => (o.id === ownerId ? { ...o, ...patch } : o))
    );
    const owner = owners.find((o) => o.id === ownerId);
    addAuditLog('Updated Owner Details', 'Owner', ownerId, '', JSON.stringify(patch), owner?.name);
    showToast('Owner profile updated.', 'success');
  };

  const processSettlement = (txnId, newStatus = 'settled') => {
    setPaymentTransactions((prev) =>
      prev.map((t) => (t.id === txnId ? { ...t, status: newStatus, payoutStatus: newStatus } : t))
    );
    const txn = paymentTransactions.find((t) => t.id === txnId);
    addAuditLog('Processed Settlement', 'Payment', txnId, txn?.status || 'pending', newStatus, txn?.propertyName);
    showToast(`Settlement ${txnId} marked as ${newStatus.toUpperCase()}`, 'success');
  };

  return (
    <AdminContext.Provider
      value={{
        currentAdminRoleKey,
        setCurrentAdminRoleKey,
        activeRoleConfig,
        hasPermission,
        rbacRoles: RBAC_ROLES,
        housekeepingTasks,
        updateHousekeepingStatus,
        addHousekeepingTask,
        staffMembers,
        updateStaffMember,
        addStaffMember,
        owners,
        setOwners,
        updateOwner,
        guests,
        setGuests,
        paymentTransactions,
        refundReservation,
        processSettlement,
        auditLogs,
        addAuditLog,
        locations,
        setLocations,
        conciergeCatalogue,
        setConciergeCatalogue,
        platformSettings,
        setPlatformSettings,
        announcements,
        setAnnouncements,
        approveProperty,
        suspendProperty,
        activateProperty,
        deleteProperty,
        updateReservationStatus,
        updateConciergeRequest,
        assignConciergeStaff,
        escalateConciergeRequest,
        completeConciergeRequest,
        moderateReview,
        searchAll
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
