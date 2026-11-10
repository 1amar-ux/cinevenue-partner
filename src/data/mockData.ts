import {
  PartnerBusiness,
  TheatreLocation,
  Screen,
  Movie,
  Show,
  Booking,
  Employee,
  CineEvent,
  AuditLog,
  Settlement
} from '../types';

export const INITIAL_PARTNERS: PartnerBusiness[] = [
  {
    id: 'PARTNER-THEATRE-001',
    businessName: 'CineVenue Gold Multiplexes Pvt Ltd',
    ownerName: 'Vikramaditya Rao',
    category: 'THEATRE_PARTNER',
    status: 'APPROVED',
    mobile: '+91 98765 43210',
    email: 'vikram.rao@cinevenuegold.com',
    businessAddress: 'Plot 42, Cinema District, Horizon Towers',
    city: 'Pune',
    state: 'Maharashtra',
    pinCode: '411045',
    gstNumber: '27AABCC1234H1Z5',
    panNumber: 'AABCC1234H',
    bankDetails: {
      accountNumber: '918020048192834',
      accountHolderName: 'CineVenue Gold Multiplexes Pvt Ltd',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      branchName: 'Baner Main Branch, Pune'
    },
    documents: [
      {
        id: 'DOC-1',
        name: 'GST Registration Certificate',
        type: 'GST',
        fileUrl: '#gst-cert.pdf',
        uploadedAt: '2026-01-15',
        status: 'VERIFIED'
      },
      {
        id: 'DOC-2',
        name: 'Company PAN Card',
        type: 'PAN',
        fileUrl: '#pan-card.pdf',
        uploadedAt: '2026-01-15',
        status: 'VERIFIED'
      },
      {
        id: 'DOC-3',
        name: 'Cancelled Cheque',
        type: 'BANK_CHEQUE',
        fileUrl: '#cheque.pdf',
        uploadedAt: '2026-01-15',
        status: 'VERIFIED'
      }
    ],
    appliedAt: '2026-01-15 10:30 AM',
    approvedAt: '2026-01-16 02:15 PM',
    activeLocationId: 'LOC-PUNE-01'
  },
  {
    id: 'PARTNER-EVENT-002',
    businessName: 'Sunburst Arena Concerts & Festivals',
    ownerName: 'Ananya Deshmukh',
    category: 'EVENT_ORGANIZER',
    status: 'APPROVED',
    mobile: '+91 98112 34567',
    email: 'ananya@sunburstevents.in',
    businessAddress: 'Suite 802, Creative Hub, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560038',
    gstNumber: '29AAECS9876F1Z2',
    panNumber: 'AAECS9876F',
    bankDetails: {
      accountNumber: '50100234918231',
      accountHolderName: 'Sunburst Arena Concerts',
      ifscCode: 'ICIC0000987',
      bankName: 'ICICI Bank',
      branchName: 'Indiranagar Branch'
    },
    documents: [
      {
        id: 'DOC-10',
        name: 'GST Registration Certificate',
        type: 'GST',
        fileUrl: '#gst-cert.pdf',
        uploadedAt: '2026-02-01',
        status: 'VERIFIED'
      }
    ],
    appliedAt: '2026-02-01 11:00 AM',
    approvedAt: '2026-02-02 04:00 PM',
    activeLocationId: 'LOC-BLR-EVENT-01'
  },
  {
    id: 'PARTNER-PROD-003',
    businessName: 'Apex Cine Studios & Distribution',
    ownerName: 'Rajesh Sharma',
    category: 'PRODUCTION_HOUSE',
    status: 'APPROVED',
    mobile: '+91 99000 88776',
    email: 'rajesh@apexstudios.com',
    businessAddress: 'Film City Road, Goregaon East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400063',
    gstNumber: '27AAAPA1122K1Z9',
    panNumber: 'AAAPA1122K',
    bankDetails: {
      accountNumber: '001105001298',
      accountHolderName: 'Apex Cine Studios',
      ifscCode: 'UTIB0000123',
      bankName: 'Axis Bank',
      branchName: 'Goregaon East'
    },
    documents: [],
    appliedAt: '2026-02-10 09:30 AM',
    approvedAt: '2026-02-11 11:45 AM'
  },
  {
    id: 'PARTNER-ENT-004',
    businessName: 'CineVerse VR & Gaming Arena',
    ownerName: 'Karan Mehra',
    category: 'ENTERTAINMENT_PARTNER',
    status: 'APPROVED',
    mobile: '+91 97654 32109',
    email: 'karan@cineversevr.com',
    businessAddress: 'Nexus Mall, Floor 4, Kukatpally',
    city: 'Hyderabad',
    state: 'Telangana',
    pinCode: '500072',
    gstNumber: '36AACCV4433P1Z1',
    panNumber: 'AACCV4433P',
    bankDetails: {
      accountNumber: '334455667788',
      accountHolderName: 'CineVerse VR Arena',
      ifscCode: 'SBIN0004321',
      bankName: 'State Bank of India',
      branchName: 'Kukatpally Branch'
    },
    documents: [],
    appliedAt: '2026-02-20 02:00 PM',
    approvedAt: '2026-02-21 05:30 PM'
  },
  {
    id: 'PARTNER-MGMT-005',
    businessName: 'Royal Luxe Weddings & Corporate Galas',
    ownerName: 'Priya Nambiar',
    category: 'EVENT_MANAGEMENT',
    status: 'APPROVED',
    mobile: '+91 98450 11223',
    email: 'priya@royalluxeevents.in',
    businessAddress: 'MG Road, Commercial Complex',
    city: 'Kochi',
    state: 'Kerala',
    pinCode: '682016',
    gstNumber: '32AABCR9988M1Z7',
    panNumber: 'AABCR9988M',
    bankDetails: {
      accountNumber: '112233445566',
      accountHolderName: 'Royal Luxe Management',
      ifscCode: 'KKBK0008899',
      bankName: 'Kotak Mahindra Bank',
      branchName: 'MG Road Kochi'
    },
    documents: [],
    appliedAt: '2026-03-01 10:00 AM',
    approvedAt: '2026-03-02 03:00 PM'
  },
  {
    id: 'PARTNER-PENDING-006',
    businessName: 'Starline Talkies & Screen Multiplex',
    ownerName: 'Sanjay Dutt Gupta',
    category: 'THEATRE_PARTNER',
    status: 'PENDING',
    mobile: '+91 98220 77112',
    email: 'sanjay@starlinetalkies.com',
    businessAddress: 'Main Market Road, Civil Lines',
    city: 'Nagpur',
    state: 'Maharashtra',
    pinCode: '440001',
    gstNumber: '27AABCS5544N1Z3',
    panNumber: 'AABCS5544N',
    bankDetails: {
      accountNumber: '778899001122',
      accountHolderName: 'Starline Talkies',
      ifscCode: 'BARB0NAGPUR',
      bankName: 'Bank of Baroda',
      branchName: 'Civil Lines'
    },
    documents: [
      {
        id: 'DOC-99',
        name: 'GST Certificate Document',
        type: 'GST',
        fileUrl: '#gst-starline.pdf',
        uploadedAt: '2026-11-08',
        status: 'PENDING'
      }
    ],
    appliedAt: '2026-11-08 04:30 PM'
  },
  {
    id: 'PARTNER-REJECTED-007',
    businessName: 'Velocity Cinema Hub',
    ownerName: 'Rohan Joshi',
    category: 'THEATRE_PARTNER',
    status: 'REJECTED',
    rejectionReason: 'The uploaded GST Certificate has expired and PAN details do not match business registration name. Please re-upload verified documents.',
    mobile: '+91 98333 44555',
    email: 'rohan@velocitycinemas.com',
    businessAddress: 'Link Road, Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400053',
    gstNumber: '27AABCV8877P1Z0',
    panNumber: 'AABCV8877P',
    bankDetails: {
      accountNumber: '445566778899',
      accountHolderName: 'Velocity Cinema Hub',
      ifscCode: 'IDIB000M001',
      bankName: 'Indian Bank',
      branchName: 'Andheri West'
    },
    documents: [],
    appliedAt: '2026-11-01 01:15 PM'
  }
];

export const INITIAL_LOCATIONS: TheatreLocation[] = [
  {
    id: 'LOC-PUNE-01',
    partnerId: 'PARTNER-THEATRE-001',
    name: 'CineVenue Gold Baner Multiplex',
    city: 'Pune',
    address: 'High Street Baner, Next to Westend Mall',
    contactNumber: '+91 20 6789 4321',
    totalScreens: 4,
    status: 'ACTIVE'
  },
  {
    id: 'LOC-DELHI-02',
    partnerId: 'PARTNER-THEATRE-001',
    name: 'CineVenue Gold IMAX Connaught Place',
    city: 'New Delhi',
    address: 'Inner Circle, E Block, Connaught Place',
    contactNumber: '+91 11 2341 9988',
    totalScreens: 3,
    status: 'ACTIVE'
  },
  {
    id: 'LOC-HYD-03',
    partnerId: 'PARTNER-THEATRE-001',
    name: 'CineVenue Gold Jubilee Hills',
    city: 'Hyderabad',
    address: 'Road No. 36, Jubilee Hills',
    contactNumber: '+91 40 4455 6677',
    totalScreens: 5,
    status: 'ACTIVE'
  }
];

export const INITIAL_SCREENS: Screen[] = [
  {
    id: 'SCR-PUNE-01',
    locationId: 'LOC-PUNE-01',
    name: 'Screen 1 - IMAX 3D Dual Laser',
    format: 'IMAX 3D',
    rows: 8,
    seatsPerRow: 12,
    totalSeats: 96,
    vipRows: 2,
    premiumRows: 3,
    executiveRows: 2,
    classicRows: 1,
    pricing: {
      VIP: 450,
      PREMIUM: 350,
      EXECUTIVE: 280,
      CLASSIC: 200
    }
  },
  {
    id: 'SCR-PUNE-02',
    locationId: 'LOC-PUNE-01',
    name: 'Screen 2 - Dolby Atmos 4K',
    format: 'Dolby Atmos 4K',
    rows: 7,
    seatsPerRow: 10,
    totalSeats: 70,
    vipRows: 2,
    premiumRows: 2,
    executiveRows: 2,
    classicRows: 1,
    pricing: {
      VIP: 400,
      PREMIUM: 300,
      EXECUTIVE: 240,
      CLASSIC: 180
    }
  },
  {
    id: 'SCR-PUNE-03',
    locationId: 'LOC-PUNE-01',
    name: 'Screen 3 - VIP Gold Recline Lounge',
    format: 'VIP Lounge',
    rows: 5,
    seatsPerRow: 8,
    totalSeats: 40,
    vipRows: 3,
    premiumRows: 2,
    executiveRows: 0,
    classicRows: 0,
    pricing: {
      VIP: 750,
      PREMIUM: 550,
      EXECUTIVE: 0,
      CLASSIC: 0
    }
  },
  {
    id: 'SCR-PUNE-04',
    locationId: 'LOC-PUNE-01',
    name: 'Screen 4 - Standard Cinema',
    format: 'Standard 2D',
    rows: 8,
    seatsPerRow: 10,
    totalSeats: 80,
    vipRows: 1,
    premiumRows: 3,
    executiveRows: 3,
    classicRows: 1,
    pricing: {
      VIP: 320,
      PREMIUM: 250,
      EXECUTIVE: 200,
      CLASSIC: 150
    }
  }
];

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'MOV-101',
    title: 'Kalki 2898 AD: Part 2',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&auto=format&fit=crop&q=80',
    duration: '2h 55m',
    genre: 'Sci-Fi / Action / Mythological',
    language: 'Telugu / Hindi / Tamil',
    certificate: 'UA 16+',
    rating: 4.8
  },
  {
    id: 'MOV-102',
    title: 'Pushpa 2: The Rule',
    poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format&fit=crop&q=80',
    duration: '3h 10m',
    genre: 'Action Thriller',
    language: 'Hindi / Telugu',
    certificate: 'UA',
    rating: 4.7
  },
  {
    id: 'MOV-103',
    title: 'Devara: Part 1',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&auto=format&fit=crop&q=80',
    duration: '2h 48m',
    genre: 'Action Drama',
    language: 'Telugu / Hindi',
    certificate: 'UA',
    rating: 4.5
  },
  {
    id: 'MOV-104',
    title: 'Stree 2: Sarkate Ka Aatank',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    duration: '2h 25m',
    genre: 'Comedy / Horror',
    language: 'Hindi',
    certificate: 'UA',
    rating: 4.6
  }
];

export const INITIAL_SHOWS: Show[] = [
  {
    id: 'SHOW-PUNE-001',
    locationId: 'LOC-PUNE-01',
    screenId: 'SCR-PUNE-01',
    screenName: 'Screen 1 - IMAX 3D',
    movieId: 'MOV-101',
    movieTitle: 'Kalki 2898 AD: Part 2',
    moviePoster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&auto=format&fit=crop&q=80',
    date: '2026-11-10',
    time: '14:30',
    prices: { VIP: 450, PREMIUM: 350, EXECUTIVE: 280, CLASSIC: 200 },
    totalSeats: 96,
    availableSeats: 38
  },
  {
    id: 'SHOW-PUNE-002',
    locationId: 'LOC-PUNE-01',
    screenId: 'SCR-PUNE-01',
    screenName: 'Screen 1 - IMAX 3D',
    movieId: 'MOV-101',
    movieTitle: 'Kalki 2898 AD: Part 2',
    moviePoster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&auto=format&fit=crop&q=80',
    date: '2026-11-10',
    time: '18:15',
    prices: { VIP: 450, PREMIUM: 350, EXECUTIVE: 280, CLASSIC: 200 },
    totalSeats: 96,
    availableSeats: 12
  },
  {
    id: 'SHOW-PUNE-003',
    locationId: 'LOC-PUNE-01',
    screenId: 'SCR-PUNE-02',
    screenName: 'Screen 2 - Dolby Atmos 4K',
    movieId: 'MOV-102',
    movieTitle: 'Pushpa 2: The Rule',
    moviePoster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format&fit=crop&q=80',
    date: '2026-11-10',
    time: '16:00',
    prices: { VIP: 400, PREMIUM: 300, EXECUTIVE: 240, CLASSIC: 180 },
    totalSeats: 70,
    availableSeats: 25
  },
  {
    id: 'SHOW-PUNE-004',
    locationId: 'LOC-PUNE-01',
    screenId: 'SCR-PUNE-03',
    screenName: 'Screen 3 - VIP Lounge',
    movieId: 'MOV-104',
    movieTitle: 'Stree 2: Sarkate Ka Aatank',
    moviePoster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    date: '2026-11-10',
    time: '20:30',
    prices: { VIP: 750, PREMIUM: 550, EXECUTIVE: 0, CLASSIC: 0 },
    totalSeats: 40,
    availableSeats: 8
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BKG-9901',
    ticketCode: 'CNV-2026-8819',
    showId: 'SHOW-PUNE-001',
    movieTitle: 'Kalki 2898 AD: Part 2',
    screenName: 'Screen 1 - IMAX 3D',
    locationName: 'CineVenue Gold Baner Multiplex',
    showDate: '2026-11-10',
    showTime: '14:30',
    seats: ['A-5', 'A-6'],
    categoryName: 'VIP Recline',
    totalAmount: 900,
    customerName: 'Aarav Mehta',
    customerPhone: '+91 98201 12345',
    paymentMethod: 'ONLINE',
    status: 'CONFIRMED',
    bookedAt: '2026-11-09 10:14 AM'
  },
  {
    id: 'BKG-9902',
    ticketCode: 'CNV-2026-4432',
    showId: 'SHOW-PUNE-001',
    movieTitle: 'Kalki 2898 AD: Part 2',
    screenName: 'Screen 1 - IMAX 3D',
    locationName: 'CineVenue Gold Baner Multiplex',
    showDate: '2026-11-10',
    showTime: '14:30',
    seats: ['C-3', 'C-4', 'C-5'],
    categoryName: 'Premium',
    totalAmount: 1050,
    customerName: 'Pooja Hegde',
    customerPhone: '+91 97110 99887',
    paymentMethod: 'POS_UPI',
    status: 'CONFIRMED',
    bookedAt: '2026-11-09 11:30 AM'
  },
  {
    id: 'BKG-9903',
    ticketCode: 'CNV-2026-7711',
    showId: 'SHOW-PUNE-001',
    movieTitle: 'Kalki 2898 AD: Part 2',
    screenName: 'Screen 1 - IMAX 3D',
    locationName: 'CineVenue Gold Baner Multiplex',
    showDate: '2026-11-10',
    showTime: '14:30',
    seats: ['D-7'],
    categoryName: 'Executive',
    totalAmount: 280,
    customerName: 'Rohan Verma',
    customerPhone: '+91 99887 66554',
    paymentMethod: 'POS_CASH',
    status: 'CHECKED_IN',
    bookedAt: '2026-11-09 01:45 PM',
    scannedAt: '2026-11-09 02:10 PM',
    scannedBy: 'Rahul Sharma (Staff ID: EMP-101)'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-101',
    partnerId: 'PARTNER-THEATRE-001',
    name: 'Rahul Sharma',
    phone: '+91 98989 89898',
    email: 'rahul.sharma@cinevenuegold.com',
    role: 'EMPLOYEE',
    designation: 'Senior Box Office & QR Gate Inspector',
    permissions: [
      'QR_SCANNING',
      'TICKET_VERIFICATION',
      'POS_BOOKING',
      'SHOW_TIMINGS',
      'VIEW_SCREENS',
      'CUSTOMER_ASSIST'
    ],
    status: 'ACTIVE',
    assignedLocationIds: ['LOC-PUNE-01'],
    invitedAt: '2026-01-20',
    acceptedAt: '2026-01-21'
  },
  {
    id: 'EMP-102',
    partnerId: 'PARTNER-THEATRE-001',
    name: 'Suresh Patil',
    phone: '+91 97676 54321',
    email: 'suresh.patil@cinevenuegold.com',
    role: 'MANAGER',
    designation: 'Theatre Operations Manager - Baner',
    permissions: [
      'QR_SCANNING',
      'TICKET_VERIFICATION',
      'POS_BOOKING',
      'SHOW_TIMINGS',
      'VIEW_SCREENS',
      'CUSTOMER_ASSIST',
      'REVENUE_VIEW'
    ],
    status: 'ACTIVE',
    assignedLocationIds: ['LOC-PUNE-01', 'LOC-DELHI-02'],
    invitedAt: '2026-01-18',
    acceptedAt: '2026-01-19'
  },
  {
    id: 'EMP-103',
    partnerId: 'PARTNER-THEATRE-001',
    name: 'Neha Kapoor',
    phone: '+91 95432 10987',
    email: 'neha.k@cinevenuegold.com',
    role: 'EMPLOYEE',
    designation: 'Gate Entry & Customer Assistance Lead',
    permissions: [
      'QR_SCANNING',
      'TICKET_VERIFICATION',
      'CUSTOMER_ASSIST'
    ],
    status: 'ACTIVE',
    assignedLocationIds: ['LOC-PUNE-01'],
    invitedAt: '2026-02-05',
    acceptedAt: '2026-02-06'
  }
];

export const INITIAL_EVENTS: CineEvent[] = [
  {
    id: 'EVT-501',
    partnerId: 'PARTNER-EVENT-002',
    title: 'Sunburn Arena Bangalore 2026 ft. Hardwell',
    category: 'Music Concert',
    poster: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    venue: 'Manpho Convention Center, Manyata Tech Park',
    city: 'Bengaluru',
    date: '2026-12-05',
    time: '17:00',
    ticketTiers: [
      { id: 'T1', name: 'Early Bird Fan Pit', price: 1999, capacity: 500, sold: 500 },
      { id: 'T2', name: 'Phase 1 GA Standing', price: 2499, capacity: 1500, sold: 1240 },
      { id: 'T3', name: 'VIP Lounge Deck', price: 4999, capacity: 300, sold: 285 }
    ],
    totalSeats: 2300,
    soldSeats: 2025,
    revenue: 5521475,
    status: 'PUBLISHED'
  },
  {
    id: 'EVT-502',
    partnerId: 'PARTNER-EVENT-002',
    title: 'Arijit Singh Symphony Live 2026',
    category: 'Live Music',
    poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    venue: 'Jio World Garden, BKC',
    city: 'Mumbai',
    date: '2026-12-20',
    time: '19:00',
    ticketTiers: [
      { id: 'T10', name: 'Gold Arena', price: 3500, capacity: 1000, sold: 850 },
      { id: 'T11', name: 'Royal Platinum VVIP', price: 12500, capacity: 200, sold: 190 }
    ],
    totalSeats: 1200,
    soldSeats: 1040,
    revenue: 5350000,
    status: 'PUBLISHED'
  }
];

export const INITIAL_SETTLEMENTS: Settlement[] = [
  {
    id: 'SETTL-8801',
    partnerId: 'PARTNER-THEATRE-001',
    period: 'Nov 01 - Nov 07, 2026',
    grossEarnings: 845200,
    platformFee: 42260,
    gstDeduction: 15213,
    netPayout: 787727,
    status: 'PAID',
    payoutDate: '2026-11-08',
    transactionRef: 'UTR998822110034'
  },
  {
    id: 'SETTL-8802',
    partnerId: 'PARTNER-THEATRE-001',
    period: 'Nov 08 - Nov 14, 2026',
    grossEarnings: 412500,
    platformFee: 20625,
    gstDeduction: 7425,
    netPayout: 384450,
    status: 'PROCESSING'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-1001',
    timestamp: '2026-11-09 19:40:12',
    actorName: 'Vikramaditya Rao',
    actorRole: 'OWNER',
    action: 'EMPLOYEE_INVITED',
    details: 'Invited Rahul Sharma (+91 98989 89898) with POS & QR Scanning permissions.',
    ipAddress: '49.36.18.90'
  },
  {
    id: 'LOG-1002',
    timestamp: '2026-11-09 18:22:05',
    actorName: 'CineVenue Admin',
    actorRole: 'ADMIN',
    action: 'PARTNER_APPROVED',
    details: 'Approved partner application PARTNER-THEATRE-001 after GST & Bank verification.',
    ipAddress: '10.0.4.12'
  },
  {
    id: 'LOG-1003',
    timestamp: '2026-11-09 16:10:44',
    actorName: 'Rahul Sharma',
    actorRole: 'EMPLOYEE',
    action: 'TICKET_CHECKED_IN',
    details: 'Scanned & checked in ticket CNV-2026-7711 for Kalki 2898 AD Part 2 at Screen 1.',
    ipAddress: '192.168.1.45'
  }
];
