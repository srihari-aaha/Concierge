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
    assignedRegions: ['All India (Goa, Pondicherry, Kerala, Ooty, Coorg, Jaipur)'],
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
    assignedRegions: ['Goa', 'Pondicherry'],
    currentTasks: 6,
    availability: 'busy',
    status: 'active',
    rating: 4.92,
    joinedDate: 'Mar 2023',
    permissions: ['concierge.all', 'guests.view', 'messages.send']
  },
  {
    id: 'staff-3',
    name: 'Sunita Pillai',
    role: 'Housekeeping',
    email: 'sunita.pillai@stayease.in',
    phone: '+91 98450 11920',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    assignedRegions: ['Goa Coastal Belt'],
    currentTasks: 3,
    availability: 'available',
    status: 'active',
    rating: 4.88,
    joinedDate: 'Aug 2023',
    permissions: ['operations.housekeeping']
  },
  {
    id: 'staff-4',
    name: 'Amit Sharma',
    role: 'Maintenance',
    email: 'amit.sharma@stayease.in',
    phone: '+91 98230 77112',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    assignedRegions: ['Goa', 'Karnataka'],
    currentTasks: 5,
    availability: 'busy',
    status: 'active',
    rating: 4.85,
    joinedDate: 'Feb 2023',
    permissions: ['operations.maintenance']
  },
  {
    id: 'staff-5',
    name: 'Priya D\'Souza',
    role: 'Property Manager',
    email: 'priya.dsouza@stayease.in',
    phone: '+91 98901 33201',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    assignedRegions: ['North Goa (Ashwem, Morjim, Anjuna)'],
    currentTasks: 2,
    availability: 'available',
    status: 'active',
    rating: 4.95,
    joinedDate: 'May 2023',
    permissions: ['properties.manage', 'reservations.view', 'concierge.view']
  },
  {
    id: 'staff-6',
    name: 'Manoj Gowda',
    role: 'Housekeeping',
    email: 'manoj.gowda@stayease.in',
    phone: '+91 98801 66230',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    assignedRegions: ['Coorg', 'Ooty Hills'],
    currentTasks: 2,
    availability: 'available',
    status: 'active',
    rating: 4.80,
    joinedDate: 'Nov 2023',
    permissions: ['operations.housekeeping']
  },
  {
    id: 'staff-7',
    name: 'Kavita Menon',
    role: 'Finance',
    email: 'kavita.menon@stayease.in',
    phone: '+91 98210 99441',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    assignedRegions: ['Corporate HQ'],
    currentTasks: 1,
    availability: 'available',
    status: 'active',
    rating: 4.97,
    joinedDate: 'Jan 2024',
    permissions: ['payments.all', 'reports.view']
  },
  {
    id: 'staff-8',
    name: 'Rohan Mehra',
    role: 'Support',
    email: 'rohan.mehra@stayease.in',
    phone: '+91 98111 22345',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    assignedRegions: ['24/7 Guest Helpline Desk'],
    currentTasks: 0,
    availability: 'on_leave',
    status: 'active',
    rating: 4.79,
    joinedDate: 'Dec 2023',
    permissions: ['support.all', 'messages.send']
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
    status: 'vip', // active, vip, flagged
    notes: 'Prefers quiet garden-facing villas. Enjoys curated culinary and yoga experiences.',
    memberSince: 'Mar 2023'
  },
  {
    id: 'guest-2',
    name: 'Rohan & Alisha Kapoor',
    email: 'rohan.kapoor@example.com',
    phone: '+91 98204 99120',
    city: 'Mumbai',
    state: 'Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    reservationsCount: 2,
    totalSpent: 82800,
    lastStay: 'Aug 2024',
    status: 'active',
    notes: 'Anniversary travelers. Always books airport chauffeur and private candlelit dinners.',
    memberSince: 'Jul 2023'
  },
  {
    id: 'guest-3',
    name: 'Dr. Siddharth Rao',
    email: 'siddharth.rao@apollo.org',
    phone: '+91 98450 77312',
    city: 'Hyderabad',
    state: 'Telangana',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    reservationsCount: 3,
    totalSpent: 112000,
    lastStay: 'Jun 2024',
    status: 'vip',
    notes: 'Doctor on sabbatical. Requires ultra-stable 300+ Mbps Wi-Fi for remote consults.',
    memberSince: 'May 2023'
  },
  {
    id: 'guest-4',
    name: 'Natasha Bose',
    email: 'natasha.bose@designstudio.in',
    phone: '+91 98300 44512',
    city: 'Kolkata',
    state: 'West Bengal',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    reservationsCount: 1,
    totalSpent: 41400,
    lastStay: 'Sep 2024',
    status: 'active',
    notes: 'Architectural photographer. Rented French Quarter heritage stay in Pondicherry.',
    memberSince: 'Jan 2024'
  },
  {
    id: 'guest-5',
    name: 'Kabir & Tarun Varma',
    email: 'kabir.varma@fintech.io',
    phone: '+91 98101 22890',
    city: 'New Delhi',
    state: 'Delhi NCR',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    reservationsCount: 5,
    totalSpent: 215000,
    lastStay: 'Jul 2024',
    status: 'vip',
    notes: 'Tech founders. Regular retreat hosts in Coorg and Goa.',
    memberSince: 'Feb 2023'
  }
];

export const INITIAL_PAYMENT_TRANSACTIONS = [
  {
    id: 'TXN-88210',
    reservationRef: 'STY-2024-001',
    propertyName: 'Palm Grove Retreat',
    guestName: 'Priya Sharma',
    guestEmail: 'guest@stayease.in',
    amount: 49500,
    platformFee: 4950,
    ownerPayout: 44550,
    paymentMethod: 'UPI (Google Pay)',
    status: 'paid', // paid, pending, failed, refunded, partially_refunded
    payoutStatus: 'settled', // pending, settled, on_hold
    date: 'Sep 24, 2024, 10:14 AM',
    gatewayId: 'pay_NzJk89104hL'
  },
  {
    id: 'TXN-88211',
    reservationRef: 'STY-2024-002',
    propertyName: 'Ocean Breeze Villa',
    guestName: 'Rohan & Alisha Kapoor',
    guestEmail: 'rohan.kapoor@example.com',
    amount: 41400,
    platformFee: 4140,
    ownerPayout: 37260,
    paymentMethod: 'Credit Card (HDFC Infinia Visa)',
    status: 'paid',
    payoutStatus: 'pending',
    date: 'Sep 25, 2024, 02:40 PM',
    gatewayId: 'pay_Klx9024419p'
  },
  {
    id: 'TXN-88212',
    reservationRef: 'STY-2024-003',
    propertyName: 'Mist Valley Estate Chalet',
    guestName: 'Dr. Siddharth Rao',
    guestEmail: 'siddharth.rao@apollo.org',
    amount: 57000,
    platformFee: 5700,
    ownerPayout: 51300,
    paymentMethod: 'NetBanking (ICICI Corporate)',
    status: 'paid',
    payoutStatus: 'settled',
    date: 'Sep 22, 2024, 11:05 AM',
    gatewayId: 'pay_Pqw1149921b'
  },
  {
    id: 'TXN-88213',
    reservationRef: 'STY-2024-004',
    propertyName: 'Heritage Plantation Bungalow',
    guestName: 'Natasha Bose',
    guestEmail: 'natasha.bose@designstudio.in',
    amount: 32000,
    platformFee: 3200,
    ownerPayout: 28800,
    paymentMethod: 'UPI (PhonePe)',
    status: 'paid',
    payoutStatus: 'settled',
    date: 'Sep 20, 2024, 08:32 PM',
    gatewayId: 'pay_Ztt8812300w'
  },
  {
    id: 'TXN-88214',
    reservationRef: 'STY-2024-005',
    propertyName: 'Sunset Cliff Villa',
    guestName: 'Kabir & Tarun Varma',
    guestEmail: 'kabir.varma@fintech.io',
    amount: 28500,
    platformFee: 2850,
    ownerPayout: 0,
    paymentMethod: 'Credit Card (Axis Magnus)',
    status: 'refunded',
    payoutStatus: 'on_hold',
    date: 'Sep 18, 2024, 04:15 PM',
    gatewayId: 'pay_Ref9021481c',
    refundReason: 'Guest flight cancelled due to coastal weather alert; 100% refund approved per policy.'
  },
  {
    id: 'TXN-88215',
    reservationRef: 'STY-2024-006',
    propertyName: 'Palm Grove Retreat',
    guestName: 'Arjun Singhal',
    guestEmail: 'arjun.singhal@yahoo.com',
    amount: 33000,
    platformFee: 3300,
    ownerPayout: 0,
    paymentMethod: 'UPI (Paytm)',
    status: 'failed',
    payoutStatus: 'on_hold',
    date: 'Sep 27, 2024, 07:11 PM',
    gatewayId: 'pay_Fail99201a',
    refundReason: 'Bank 3D secure authorization timeout. Automated SMS retry link sent.'
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
    description: 'Unrestricted full access across all platform data, finances, infrastructure, and settings.',
    permissions: [
      'properties.view', 'properties.create', 'properties.edit', 'properties.delete', 'properties.approve',
      'reservations.view', 'reservations.edit', 'reservations.cancel', 'reservations.refund',
      'concierge.view', 'concierge.assign', 'concierge.escalate',
      'operations.manage', 'payments.view', 'payments.refund', 'payments.payouts',
      'reviews.moderate', 'staff.manage', 'settings.manage', 'rbac.manage'
    ]
  },
  {
    roleKey: 'admin',
    name: 'Platform Administrator',
    description: 'Full day-to-day administrative operational management of stays, bookings, and concierge dispatches.',
    permissions: [
      'properties.view', 'properties.create', 'properties.edit', 'properties.approve',
      'reservations.view', 'reservations.edit', 'reservations.cancel',
      'concierge.view', 'concierge.assign', 'concierge.escalate',
      'operations.manage', 'payments.view',
      'reviews.moderate', 'staff.manage'
    ]
  },
  {
    roleKey: 'property_manager',
    name: 'Property Manager',
    description: 'Focused oversight on property quality, inventory compliance, inspections, and host liaison.',
    permissions: [
      'properties.view', 'properties.create', 'properties.edit',
      'reservations.view',
      'concierge.view',
      'operations.manage',
      'reviews.moderate'
    ]
  },
  {
    roleKey: 'concierge_manager',
    name: 'Concierge Operations Manager',
    description: 'Direct dispatch of local service partners, guest special requests, transport, and in-villa experiences.',
    permissions: [
      'properties.view',
      'reservations.view',
      'concierge.view', 'concierge.assign', 'concierge.escalate',
      'operations.manage'
    ]
  },
  {
    roleKey: 'operations_manager',
    name: 'Operations & Maintenance Manager',
    description: 'Manages housekeeping teams, deep turnover schedules, repair technicians, and property upkeep.',
    permissions: [
      'properties.view',
      'reservations.view',
      'operations.manage'
    ]
  },
  {
    roleKey: 'finance',
    name: 'Finance & Accounts',
    description: 'Auditing booking revenues, merchant fees, GST invoices, guest refunds, and owner bank payouts.',
    permissions: [
      'reservations.view',
      'payments.view', 'payments.refund', 'payments.payouts',
      'reports.view'
    ]
  },
  {
    roleKey: 'support',
    name: 'Guest Support & Helpline',
    description: '24/7 guest communication, reservation lookup, ticket routing, and messaging assistance.',
    permissions: [
      'properties.view',
      'reservations.view',
      'concierge.view',
      'reviews.moderate'
    ]
  }
];
