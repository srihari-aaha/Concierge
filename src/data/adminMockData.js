// StayEase Admin Portal — Realistic Operations & Platform Mock Data

export const INITIAL_HOUSEKEEPING_TASKS = [
  {
    id: 'hk-101',
    propertyId: 'prop-1',
    propertyName: 'Palm Grove Retreat',
    room: 'Entire Villa (3 BHK + Plunge Pool)',
    cleaningType: 'Turnover Clean',
    assignedStaffId: 'staff-3',
    assignedStaffName: 'Sunita Pillai',
    checkOutTime: '11:00 AM Today',
    cleaningDeadline: '02:00 PM Today',
    status: 'cleaning', // pending, assigned, cleaning, inspection, completed
    priority: 'high',
    notes: 'Next guest Priya Sharma arrives at 3:00 PM. Change all linen, restock organic lemongrass toiletries, clean pool filter.',
    checklist: [
      { task: 'Master Suite linen replacement & steam ironing', done: true },
      { task: 'Plunge pool pH & leaf skim', done: true },
      { task: 'Kitchen sanitization & welcome basket setup', done: false },
      { task: 'Verandah teak louvers dusting', done: false }
    ]
  },
  {
    id: 'hk-102',
    propertyId: 'prop-2',
    propertyName: 'Ocean Breeze Villa',
    room: 'French Suite & Courtyard',
    cleaningType: 'Deep Clean',
    assignedStaffId: 'staff-3',
    assignedStaffName: 'Sunita Pillai',
    checkOutTime: '10:30 AM Today',
    cleaningDeadline: '01:30 PM Today',
    status: 'inspection',
    priority: 'urgent',
    notes: 'VIP guest arrival at 2:00 PM. High gloss lime-plaster buffing and fresh frangipani blossoms in the brass urli.',
    checklist: [
      { task: 'Courtyard terracotta urns polish', done: true },
      { task: 'Madras terrace ceiling cobweb clear', done: true },
      { task: 'Fresh frangipani blossoms arranged', done: true },
      { task: 'Quality supervisor sign-off', done: false }
    ]
  },
  {
    id: 'hk-103',
    propertyId: 'prop-3',
    propertyName: 'Mist Valley Estate Chalet',
    room: 'Chalet 1 & Attic Loft',
    cleaningType: 'Turnover Clean',
    assignedStaffId: 'staff-6',
    assignedStaffName: 'Manoj Gowda',
    checkOutTime: '11:00 AM Tomorrow',
    cleaningDeadline: '03:00 PM Tomorrow',
    status: 'assigned',
    priority: 'normal',
    notes: 'Standard checkout turnaround before weekend guests arrive.',
    checklist: [
      { task: 'Fireplace ash vacuum & wood restock', done: false },
      { task: 'Heated blanket electrical check', done: false },
      { task: 'Balcony mist wipe-down', done: false }
    ]
  },
  {
    id: 'hk-104',
    propertyId: 'prop-4',
    propertyName: 'Heritage Plantation Bungalow',
    room: 'Spice Garden Suite',
    cleaningType: 'Touch-up Clean',
    assignedStaffId: 'staff-6',
    assignedStaffName: 'Manoj Gowda',
    checkOutTime: 'Completed Yesterday',
    cleaningDeadline: '12:00 PM Today',
    status: 'completed',
    priority: 'low',
    notes: 'Inspected and certified ready for guest check-in.',
    checklist: [
      { task: 'Daily floor wipe with eucalyptus oil', done: true },
      { task: 'Herbal tea station restock', done: true },
      { task: 'Fresh garden orchids placed', done: true }
    ]
  },
  {
    id: 'hk-105',
    propertyId: 'prop-5',
    propertyName: 'Serene Backwater Haven',
    room: 'Lakefront Pavilion',
    cleaningType: 'Turnover Clean',
    assignedStaffId: 'staff-3',
    assignedStaffName: 'Sunita Pillai',
    checkOutTime: '11:00 AM Today',
    cleaningDeadline: '02:30 PM Today',
    status: 'pending',
    priority: 'high',
    notes: 'Houseboat day-cruise party checking in at 3 PM. Needs rapid sanitization.',
    checklist: [
      { task: 'Deck furniture washdown', done: false },
      { task: 'Mosquito vaporizers reload', done: false },
      { task: 'Towels and sun loungers prep', done: false }
    ]
  }
];

export const INITIAL_STAFF_MEMBERS = [
  {
    id: 'staff-1',
    name: 'Ananya Deshmukh',
    role: 'Super Admin',
    email: 'ananya@stayease.in',
    phone: '+91 98190 00122',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    assignedRegions: ['All India (Platform HQ & Operations)'],
    currentTasks: 4,
    availability: 'available', // available, busy, on_leave
    status: 'active',
    rating: 4.98,
    joinedDate: 'Jan 2023',
    permissions: ['all']
  },
  {
    id: 'staff-2',
    name: 'Rajesh Nair',
    role: 'Concierge Manager',
    email: 'rajesh.nair@stayease.in',
    phone: '+91 98221 44100',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    assignedRegions: ['Goa & Pondicherry Regional Hubs'],
    currentTasks: 5,
    availability: 'busy',
    status: 'active',
    rating: 4.92,
    joinedDate: 'Mar 2023',
    permissions: ['concierge.all', 'owners.view', 'messages.send']
  },
  {
    id: 'staff-3',
    name: 'Kavita Menon',
    role: 'Finance Adviser',
    email: 'kavita.menon@stayease.in',
    phone: '+91 98210 99441',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    assignedRegions: ['Central Treasury & Host Escrow Desk'],
    currentTasks: 2,
    availability: 'available',
    status: 'active',
    rating: 4.97,
    joinedDate: 'Jan 2024',
    permissions: ['payments.all', 'reports.view', 'payouts.approve']
  },
  {
    id: 'staff-4',
    name: 'Rohan Mehra',
    role: 'Support',
    email: 'rohan.mehra@stayease.in',
    phone: '+91 98111 22345',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    assignedRegions: ['24/7 Platform & Owner Support Desk'],
    currentTasks: 1,
    availability: 'available',
    status: 'active',
    rating: 4.88,
    joinedDate: 'Dec 2023',
    permissions: ['support.all', 'messages.send']
  },
  {
    id: 'staff-5',
    name: 'Meera Joshi',
    role: 'Support',
    email: 'meera.joshi@stayease.in',
    phone: '+91 98330 11223',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    assignedRegions: ['Direct Escalations & Priority Support'],
    currentTasks: 3,
    availability: 'busy',
    status: 'active',
    rating: 4.91,
    joinedDate: 'Feb 2024',
    permissions: ['support.all', 'messages.send']
  }
];

export const INITIAL_OWNERS = [
  {
    id: 'owner-1',
    name: 'Vikram Singhania',
    email: 'owner@stayease.in',
    phone: '+91 98221 88390',
    city: 'Goa',
    state: 'Goa',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    propertiesCount: 4,
    properties: ['Palm Grove Retreat', 'Ocean Breeze Villa', 'Mist Valley Estate Chalet', 'Sunset Cliff Villa'],
    totalPayouts: 445500,
    commissionPaid: 49500,
    bankDetails: {
      bankName: 'HDFC Bank',
      accountEnding: '4892',
      ifsc: 'HDFC0001024',
      accountHolder: 'Vikram Singhania'
    },
    status: 'superhost', // superhost, verified, active, flagged
    memberSince: 'Jan 2023',
    rating: 4.95,
    notes: 'Premium host with 4 beachfront and estate villas. Impeccable guest maintenance record.'
  },
  {
    id: 'owner-2',
    name: 'Sunita & Naren Rao',
    email: 'sunita.rao@example.com',
    phone: '+91 98450 33120',
    city: 'Bengaluru',
    state: 'Karnataka',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    propertiesCount: 1,
    properties: ['Heritage Plantation Bungalow'],
    totalPayouts: 218500,
    commissionPaid: 24200,
    bankDetails: {
      bankName: 'ICICI Bank',
      accountEnding: '9120',
      ifsc: 'ICIC0000451',
      accountHolder: 'Sunita Rao'
    },
    status: 'superhost',
    memberSince: 'Mar 2023',
    rating: 4.92,
    notes: 'Heritage plantation bungalow host in Coorg. Direct weekly NEFT settlements.'
  },
  {
    id: 'owner-3',
    name: 'Deepa Menon',
    email: 'deepa.menon@example.com',
    phone: '+91 98210 66450',
    city: 'Kochi',
    state: 'Kerala',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    propertiesCount: 1,
    properties: ['Serene Backwater Haven'],
    totalPayouts: 189000,
    commissionPaid: 21000,
    bankDetails: {
      bankName: 'Axis Bank',
      accountEnding: '3045',
      ifsc: 'UTIB0001890',
      accountHolder: 'Deepa Menon'
    },
    status: 'verified',
    memberSince: 'May 2023',
    rating: 4.88,
    notes: 'Kerala backwater luxury villa with dedicated boat jetty.'
  },
  {
    id: 'owner-4',
    name: 'Raghavendra Rathore',
    email: 'raghavendra.rathore@heritagevillas.in',
    phone: '+91 98290 77102',
    city: 'Jaipur',
    state: 'Rajasthan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    propertiesCount: 1,
    properties: ['The Royal Haveli'],
    totalPayouts: 378000,
    commissionPaid: 42000,
    bankDetails: {
      bankName: 'Kotak Mahindra Bank',
      accountEnding: '7819',
      ifsc: 'KKBK0000210',
      accountHolder: 'Raghavendra Rathore'
    },
    status: 'superhost',
    memberSince: 'Feb 2023',
    rating: 4.96,
    notes: 'Historic haveli host. Corporate RTGS disbursements on 1st & 15th of each month.'
  },
  {
    id: 'owner-5',
    name: 'Tenzing & Dolma Norbu',
    email: 'tenzing.norbu@himalayanstays.com',
    phone: '+91 98160 55431',
    city: 'Manali',
    state: 'Himachal Pradesh',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    propertiesCount: 1,
    properties: ['Himalayan Pine Chalet'],
    totalPayouts: 135000,
    commissionPaid: 15000,
    bankDetails: {
      bankName: 'State Bank of India',
      accountEnding: '5561',
      ifsc: 'SBIN0004012',
      accountHolder: 'Tenzing Norbu'
    },
    status: 'active',
    memberSince: 'Jul 2023',
    rating: 4.85,
    notes: 'Pine cedar timber chalet in Old Manali. Fast turnaround settlements.'
  }
];

export const INITIAL_GUESTS = [
  {
    id: 'guest-1',
    name: 'Priya Sharma',
    email: 'guest@stayease.in',
    phone: '+91 98201 55678',
    city: 'Bengaluru',
    state: 'Karnataka',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    reservationsCount: 4,
    totalSpent: 148500,
    lastStay: 'Sep 2024',
    status: 'vip',
    notes: 'Prefers quiet garden-facing villas. Enjoys curated culinary and yoga experiences.',
    memberSince: 'Mar 2023'
  }
];

// Financial Ledger & Settlements — STRICTLY between Owner & Super Admin (No Guest involvement)
export const INITIAL_PAYMENT_TRANSACTIONS = [
  {
    id: 'TXN-88210',
    ownerId: 'owner-1',
    ownerName: 'Vikram Singhania',
    ownerEmail: 'owner@stayease.in',
    propertyName: 'Palm Grove Retreat',
    flow: 'Super Admin → Owner',
    flowType: 'payout',
    amount: 44550,
    grossRental: 49500,
    commissionFee: 4950,
    paymentMethod: 'NEFT Bank Transfer',
    bankAccount: 'HDFC Bank (A/C •••• 4892)',
    utrNumber: 'UTR-HDFC-9921448',
    status: 'settled', // settled, pending, processing, disputed
    date: 'Sep 24, 2024, 10:14 AM',
    gatewayId: 'stl_Hdfc_89104hL',
    notes: 'Net rental settlement disbursed by Super Admin Treasury for Palm Grove Retreat.'
  },
  {
    id: 'TXN-88211',
    ownerId: 'owner-1',
    ownerName: 'Vikram Singhania',
    ownerEmail: 'owner@stayease.in',
    propertyName: 'Ocean Breeze Villa',
    flow: 'Owner → Super Admin',
    flowType: 'commission',
    amount: 4140,
    grossRental: 41400,
    commissionFee: 4140,
    paymentMethod: 'Corporate Direct Debit (ACH)',
    bankAccount: 'HDFC Bank (A/C •••• 4892)',
    utrNumber: 'ACH-20240925-0182',
    status: 'settled',
    date: 'Sep 25, 2024, 02:40 PM',
    gatewayId: 'stl_Ach_9024419p',
    notes: '10% Platform listing commission collected by Super Admin for Ocean Breeze Villa.'
  },
  {
    id: 'TXN-88212',
    ownerId: 'owner-1',
    ownerName: 'Vikram Singhania',
    ownerEmail: 'owner@stayease.in',
    propertyName: 'Mist Valley Estate Chalet',
    flow: 'Super Admin → Owner',
    flowType: 'payout',
    amount: 51300,
    grossRental: 57000,
    commissionFee: 5700,
    paymentMethod: 'RTGS Immediate Transfer',
    bankAccount: 'HDFC Bank (A/C •••• 4892)',
    utrNumber: 'RTGS-20240922-5501',
    status: 'settled',
    date: 'Sep 22, 2024, 11:05 AM',
    gatewayId: 'stl_Rtgs_1149921b',
    notes: 'Bi-weekly payout approved and transferred by Super Admin to Owner account.'
  },
  {
    id: 'TXN-88213',
    ownerId: 'owner-2',
    ownerName: 'Sunita & Naren Rao',
    ownerEmail: 'sunita.rao@example.com',
    propertyName: 'Heritage Plantation Bungalow',
    flow: 'Super Admin → Owner',
    flowType: 'payout',
    amount: 28800,
    grossRental: 32000,
    commissionFee: 3200,
    paymentMethod: 'NEFT Bank Transfer',
    bankAccount: 'ICICI Bank (A/C •••• 9120)',
    utrNumber: 'UTR-ICIC-8812300',
    status: 'settled',
    date: 'Sep 20, 2024, 08:32 PM',
    gatewayId: 'stl_Icici_8812300w',
    notes: 'Full settlement payout released from Super Admin Escrow.'
  },
  {
    id: 'TXN-88214',
    ownerId: 'owner-4',
    ownerName: 'Raghavendra Rathore',
    ownerEmail: 'raghavendra.rathore@heritagevillas.in',
    propertyName: 'The Royal Haveli',
    flow: 'Super Admin → Owner',
    flowType: 'payout',
    amount: 37800,
    grossRental: 42000,
    commissionFee: 4200,
    paymentMethod: 'RTGS Immediate Transfer',
    bankAccount: 'Kotak Mahindra (A/C •••• 7819)',
    utrNumber: 'RTGS-20240918-4412',
    status: 'pending',
    date: 'Sep 26, 2024, 04:15 PM',
    gatewayId: 'stl_Pending_9021481c',
    notes: 'Scheduled Friday settlement batch awaiting final Super Admin authorization.'
  },
  {
    id: 'TXN-88215',
    ownerId: 'owner-3',
    ownerName: 'Deepa Menon',
    ownerEmail: 'deepa.menon@example.com',
    propertyName: 'Serene Backwater Haven',
    flow: 'Owner → Super Admin',
    flowType: 'commission',
    amount: 3300,
    grossRental: 33000,
    commissionFee: 3300,
    paymentMethod: 'Direct Escrow Retention',
    bankAccount: 'Axis Bank (A/C •••• 3045)',
    utrNumber: 'ESC-20240927-1092',
    status: 'settled',
    date: 'Sep 27, 2024, 07:11 PM',
    gatewayId: 'stl_Escrow_99201a',
    notes: '10% Platform fee retained by Super Admin from backwater estate booking cycle.'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'audit-1',
    adminName: 'Ananya Deshmukh',
    adminRole: 'Super Admin',
    action: 'Approved Property Listing',
    entity: 'Property',
    entityId: 'prop-1',
    entityName: 'Palm Grove Retreat',
    previousValue: 'Status: Pending Approval',
    newValue: 'Status: Active',
    timestamp: 'Today, 10:42 AM',
    ipAddress: '103.21.244.18 (Mumbai)'
  },
  {
    id: 'audit-2',
    adminName: 'Rajesh Nair',
    adminRole: 'Concierge Manager',
    action: 'Dispatched Chauffeur Service',
    entity: 'Concierge Request',
    entityId: 'req-1',
    entityName: 'MOPA Airport VIP Pickup',
    previousValue: 'Status: Pending Assignment',
    newValue: 'Assigned: Coastal Mobility Fleet (Toyota Innova Hycross)',
    timestamp: 'Today, 09:15 AM',
    ipAddress: '103.22.180.12 (Goa)'
  },
  {
    id: 'audit-3',
    adminName: 'Ananya Deshmukh',
    adminRole: 'Super Admin',
    action: 'Authorized Booking Refund',
    entity: 'Transaction',
    entityId: 'TXN-88214',
    entityName: 'Sunset Cliff Villa Booking',
    previousValue: 'Status: Paid (₹28,500)',
    newValue: 'Status: 100% Refunded (₹28,500)',
    timestamp: 'Yesterday, 04:30 PM',
    ipAddress: '103.21.244.18 (Mumbai)'
  },
  {
    id: 'audit-4',
    adminName: 'Priya D\'Souza',
    adminRole: 'Property Manager',
    action: 'Updated Seasonal Pricing',
    entity: 'Property',
    entityId: 'prop-2',
    entityName: 'Ocean Breeze Villa',
    previousValue: 'Weekend Rate: ₹13,800/night',
    newValue: 'Weekend Rate: ₹16,200/night (October Festive Surcharge)',
    timestamp: 'Sep 26, 03:12 PM',
    ipAddress: '14.139.122.9 (Pondicherry)'
  },
  {
    id: 'audit-5',
    adminName: 'Amit Sharma',
    adminRole: 'Maintenance Lead',
    action: 'Resolved Emergency Electrical Ticket',
    entity: 'Maintenance',
    entityId: 'maint-1',
    entityName: 'Plunge Pool Inverter Tripping',
    previousValue: 'Status: In Progress',
    newValue: 'Status: Resolved (New 40A Schneider MCB Installed)',
    timestamp: 'Sep 25, 05:40 PM',
    ipAddress: '103.22.180.12 (Goa)'
  }
];

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Monsoon Wind Down & Festive Season Preparedness (Q4 2024)',
    targetAudience: 'All Property Owners & Concierge Staff',
    date: 'Sep 25, 2024',
    status: 'published',
    content: 'All villa hosts in Goa and Kerala are requested to complete pool servicing, exterior whitewashing, and high-speed Wi-Fi back-up tests before October 15 in preparation for peak holiday rush.'
  },
  {
    id: 'ann-2',
    title: 'New Concierge Standard: 15-Minute Rapid Response Guarantee',
    targetAudience: 'Concierge & Service Staff',
    date: 'Sep 20, 2024',
    status: 'published',
    content: 'StayEase Concierge Dispatch is now monitoring first-response times on all airport transfers and emergency requests. Target is under 15 minutes.'
  }
];

export const INITIAL_LOCATIONS = [
  { id: 'loc-1', city: 'North Goa', state: 'Goa', country: 'India', activeProperties: 48, code: 'GOA-N', status: 'active' },
  { id: 'loc-2', city: 'South Goa', state: 'Goa', country: 'India', activeProperties: 32, code: 'GOA-S', status: 'active' },
  { id: 'loc-3', city: 'White Town', state: 'Pondicherry', country: 'India', activeProperties: 24, code: 'PDY', status: 'active' },
  { id: 'loc-4', city: 'Munnar & Alleppey', state: 'Kerala', country: 'India', activeProperties: 36, code: 'KER', status: 'active' },
  { id: 'loc-5', city: 'Coorg & Chikmagalur', state: 'Karnataka', country: 'India', activeProperties: 28, code: 'KTK', status: 'active' },
  { id: 'loc-6', city: 'Ooty & Nilgiris', state: 'Tamil Nadu', country: 'India', activeProperties: 18, code: 'TND', status: 'active' },
  { id: 'loc-7', city: 'Jaipur & Udaipur', state: 'Rajasthan', country: 'India', activeProperties: 22, code: 'RAJ', status: 'active' }
];

export const INITIAL_CONCIERGE_CATALOGUE = [
  { id: 'srv-1', title: 'Airport VIP Chauffeur Transfer', category: 'Transport', basePrice: 2800, slaHours: 2, active: true, desc: 'Luxury AC sedan or Innova Hycross with bottled water, wet wipes, and trained chauffeur.' },
  { id: 'srv-2', title: 'Private In-Villa Chef & Barbecue', category: 'Dining', basePrice: 4500, slaHours: 6, active: true, desc: 'Master chef curating customized coastal Goan or multi-cuisine 4-course dinner.' },
  { id: 'srv-3', title: 'Housekeeping & Mid-Stay Turnover', category: 'Housekeeping', basePrice: 1500, slaHours: 4, active: true, desc: 'Complete linen overhaul, sanitization, floor buffing, and pool skim.' },
  { id: 'srv-4', title: 'Artisanal Pantry Pre-Stocking', category: 'Groceries', basePrice: 1200, slaHours: 8, active: true, desc: 'Fresh local sourdough, artisanal cheeses, organic eggs, tender coconuts, and cold-pressed juices.' },
  { id: 'srv-5', title: 'Sunset Catamaran Sailing Charter', category: 'Activities', basePrice: 8500, slaHours: 12, active: true, desc: '2-hour private coastal cruise with champagne and canapés along Mandovi/Chapora rivers.' },
  { id: 'srv-6', title: 'Ayurvedic Marma Wellness Massage', category: 'Wellness', basePrice: 3200, slaHours: 4, active: true, desc: 'Certified Kerala therapist delivering herbal warm oil relaxation treatments in-villa.' }
];

export const INITIAL_PLATFORM_SETTINGS = {
  general: {
    platformName: 'StayEase India',
    tagline: 'Luxury Holiday Stays & Dedicated Concierge Platform',
    supportEmail: 'concierge@stayease.in',
    supportPhone: '+91 98221 00999',
    currency: 'INR (₹)',
    timezone: 'Asia/Kolkata (IST, UTC+5:30)',
    environment: 'Production Ready'
  },
  fees: {
    guestServiceFeePercent: 8,
    ownerCommissionPercent: 10,
    cleaningFeeDefault: 1500,
    gstPercent: 18,
    gstRegistration: '27AABCU9603R1ZM'
  },
  cancellation: {
    defaultPolicy: 'Moderate', // Flexible, Moderate, Strict
    flexibleRefundWindowDays: 1,
    moderateRefundWindowDays: 5,
    strictRefundWindowDays: 14,
    allowWeatherDisruptionRefund: true
  },
  notifications: {
    emailAlertsEnabled: true,
    smsAlertsEnabled: true,
    whatsappAlertsEnabled: true,
    adminEscalationTimeoutMinutes: 30
  }
};

export const RBAC_ROLES = [
  {
    roleKey: 'super_admin',
    name: 'Super Admin',
    description: 'Unrestricted full access across platform properties, owner accounts, settlements, infrastructure, and settings.',
    permissions: [
      'properties.view', 'properties.create', 'properties.edit', 'properties.delete', 'properties.approve',
      'reservations.view', 'reservations.edit', 'reservations.cancel',
      'concierge.view', 'concierge.assign', 'concierge.escalate',
      'operations.manage', 'payments.view', 'payments.refund', 'payments.payouts',
      'reviews.moderate', 'staff.manage', 'settings.manage', 'rbac.manage'
    ]
  },
  {
    roleKey: 'concierge_manager',
    name: 'Concierge Manager',
    description: 'Direct management of luxury hospitality services, vendor coordination, airport fleets, and in-villa experiences.',
    permissions: [
      'properties.view',
      'concierge.view', 'concierge.assign', 'concierge.escalate',
      'operations.manage',
      'reviews.moderate'
    ]
  },
  {
    roleKey: 'finance_adviser',
    name: 'Finance Adviser',
    description: 'Auditing platform commissions, host escrow accounts, GST reconciliations, and owner bank settlements.',
    permissions: [
      'payments.view', 'payments.refund', 'payments.payouts',
      'reports.view'
    ]
  },
  {
    roleKey: 'support',
    name: 'Support',
    description: '24/7 host and platform support desk, operational queries, ticket routing, and direct communication.',
    permissions: [
      'properties.view',
      'concierge.view',
      'reviews.moderate'
    ]
  }
];
