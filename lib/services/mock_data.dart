import '../models/partner_category.dart';
import '../models/partner_status.dart';
import '../models/partner_business.dart';
import '../models/theatre.dart';
import '../models/screen.dart';
import '../models/show.dart';
import '../models/booking.dart';
import '../models/employee.dart';
import '../models/event.dart';
import '../models/payment_settlement.dart';
import '../models/production_project.dart';

class DevMockData {
  // Pre-configured Partner Businesses across all statuses and categories
  static List<PartnerBusiness> getInitialPartners() {
    return [
      // 1. APPROVED THEATRE PARTNER (Primary Demo Owner)
      PartnerBusiness(
        id: 'biz_theatre_001',
        businessName: 'AMB Cinemas Gachibowli',
        ownerName: 'Amarnath Gattem',
        category: PartnerCategory.theatrePartner,
        status: PartnerStatus.approved,
        mobile: '+91 98765 43210',
        email: 'amar.amb@cinevenue.com',
        businessAddress: 'Plot 12, Financial District, Gachibowli',
        city: 'Hyderabad',
        state: 'Telangana',
        pinCode: '500032',
        gstNumber: '36AAAAA0000A1Z5',
        panNumber: 'ABCDE1234F',
        bankDetails: const BankDetails(
          accountHolderName: 'AMB Cinemas Pvt Ltd',
          bankName: 'HDFC Bank',
          accountNumber: '50200012345678',
          ifscCode: 'HDFC0001234',
          branchName: 'Gachibowli Branch',
        ),
        documents: const [
          PartnerDocument(
            id: 'doc_1',
            name: 'GST Registration Certificate',
            type: 'GST',
            fileUrl: 'https://cdn.cinevenue.com/docs/gst_amb.pdf',
            uploadedAt: '2026-10-15',
            status: 'VERIFIED',
          ),
          PartnerDocument(
            id: 'doc_2',
            name: 'Theatre Operating License',
            type: 'TRADE_LICENSE',
            fileUrl: 'https://cdn.cinevenue.com/docs/license_amb.pdf',
            uploadedAt: '2026-10-15',
            status: 'VERIFIED',
          ),
          PartnerDocument(
            id: 'doc_3',
            name: 'Cancelled Bank Cheque',
            type: 'BANK_CHEQUE',
            fileUrl: 'https://cdn.cinevenue.com/docs/cheque_amb.pdf',
            uploadedAt: '2026-10-15',
            status: 'VERIFIED',
          ),
        ],
        appliedAt: '2026-10-15 10:30 AM',
        approvedAt: '2026-10-16 02:15 PM',
        activeLocationId: 'th_001',
      ),

      // 2. APPROVED EVENT ORGANIZER
      PartnerBusiness(
        id: 'biz_event_002',
        businessName: 'Sunburn Arena Entertainment',
        ownerName: 'Vikramaditya Roy',
        category: PartnerCategory.eventOrganizer,
        status: PartnerStatus.approved,
        mobile: '+91 98765 43220',
        email: 'vikram@sunburnlive.in',
        businessAddress: 'Unit 401, Cyber Towers, Madhapur',
        city: 'Hyderabad',
        state: 'Telangana',
        pinCode: '500081',
        gstNumber: '36BBBBB1111B1Z2',
        panNumber: 'BCDEF2345G',
        bankDetails: const BankDetails(
          accountHolderName: 'Sunburn Arena Live LLP',
          bankName: 'ICICI Bank',
          accountNumber: '001105001234',
          ifscCode: 'ICIC0000011',
          branchName: 'Madhapur Branch',
        ),
        documents: const [
          PartnerDocument(
            id: 'doc_4',
            name: 'GST Certificate',
            type: 'GST',
            fileUrl: 'https://cdn.cinevenue.com/docs/gst_sunburn.pdf',
            uploadedAt: '2026-10-20',
            status: 'VERIFIED',
          ),
        ],
        appliedAt: '2026-10-20 11:00 AM',
        approvedAt: '2026-10-21 04:00 PM',
      ),

      // 3. PENDING APPLICATION
      PartnerBusiness(
        id: 'biz_pending_003',
        businessName: 'Royal Cinema Paradiso',
        ownerName: 'Rajesh Khanna',
        category: PartnerCategory.theatrePartner,
        status: PartnerStatus.pending,
        mobile: '+91 98765 43230',
        email: 'rajesh@royalparadiso.com',
        businessAddress: 'Station Road, Vijayawada',
        city: 'Vijayawada',
        state: 'Andhra Pradesh',
        pinCode: '520001',
        gstNumber: '37CCCCC2222C1Z8',
        panNumber: 'CDEFG3456H',
        bankDetails: const BankDetails(
          accountHolderName: 'Royal Cinema Paradiso',
          bankName: 'State Bank of India',
          accountNumber: '310987654321',
          ifscCode: 'SBIN0001234',
          branchName: 'Vijayawada Main',
        ),
        documents: const [
          PartnerDocument(
            id: 'doc_5',
            name: 'Trade License Copy',
            type: 'TRADE_LICENSE',
            fileUrl: 'https://cdn.cinevenue.com/docs/royal_trade.pdf',
            uploadedAt: '2026-11-08',
            status: 'PENDING',
          ),
        ],
        appliedAt: '2026-11-08 09:20 AM',
      ),

      // 4. MORE INFO REQUIRED
      PartnerBusiness(
        id: 'biz_moreinfo_004',
        businessName: 'Hyderabad Grand Arena',
        ownerName: 'Pooja Hegde',
        category: PartnerCategory.entertainmentPartner,
        status: PartnerStatus.moreInfoRequired,
        moreInfoRequiredText:
            'Please re-upload a clear copy of the Fire Safety NOC and updated GST certificate showing registered Telangana address.',
        mobile: '+91 98765 43240',
        email: 'pooja@hydgrandarena.com',
        businessAddress: 'Outer Ring Road, Shamshabad',
        city: 'Hyderabad',
        state: 'Telangana',
        pinCode: '501218',
        gstNumber: '36DDDDD3333D1Z9',
        panNumber: 'DEFGH4567J',
        bankDetails: const BankDetails(
          accountHolderName: 'Hyderabad Grand Arena',
          bankName: 'Axis Bank',
          accountNumber: '91202003456789',
          ifscCode: 'UTIB0000456',
          branchName: 'Shamshabad Branch',
        ),
        documents: const [
          PartnerDocument(
            id: 'doc_6',
            name: 'Fire Safety Certificate (Illegible)',
            type: 'VENUE_PERMIT',
            fileUrl: 'https://cdn.cinevenue.com/docs/fire_noc_blur.pdf',
            uploadedAt: '2026-11-05',
            status: 'REJECTED',
          ),
        ],
        appliedAt: '2026-11-05 03:45 PM',
      ),

      // 5. REJECTED APPLICATION
      PartnerBusiness(
        id: 'biz_rejected_005',
        businessName: 'South Cineplex Studios',
        ownerName: 'Dileep Kumar',
        category: PartnerCategory.productionHouse,
        status: PartnerStatus.rejected,
        rejectionReason:
            'Entity PAN details do not match the business registration certificate provided. Multiple mandatory fields unverified.',
        mobile: '+91 98765 43250',
        email: 'dileep@southcineplex.com',
        businessAddress: 'Film Nagar, Jubilee Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pinCode: '500033',
        gstNumber: '36EEEEE4444E1Z4',
        panNumber: 'EFGHI5678K',
        bankDetails: const BankDetails(
          accountHolderName: 'South Cineplex',
          bankName: 'Kotak Mahindra Bank',
          accountNumber: '281200004455',
          ifscCode: 'KKBK0000123',
          branchName: 'Jubilee Hills',
        ),
        documents: const [
          PartnerDocument(
            id: 'doc_7',
            name: 'PAN Certificate',
            type: 'PAN',
            fileUrl: 'https://cdn.cinevenue.com/docs/pan_mismatch.pdf',
            uploadedAt: '2026-11-02',
            status: 'REJECTED',
          ),
        ],
        appliedAt: '2026-11-02 11:15 AM',
      ),

      // 6. SUSPENDED PARTNER
      PartnerBusiness(
        id: 'biz_suspended_006',
        businessName: 'Galaxy Multiplex Kukatpally',
        ownerName: 'Venkatesh Rao',
        category: PartnerCategory.theatrePartner,
        status: PartnerStatus.suspended,
        rejectionReason:
            'Account suspended by CineVenue Regulatory Compliance following ticket pricing dispute and settlement audit non-compliance.',
        mobile: '+91 98765 43260',
        email: 'venkat@galaxymultiplex.com',
        businessAddress: 'KPHB Colony Main Road',
        city: 'Hyderabad',
        state: 'Telangana',
        pinCode: '500072',
        gstNumber: '36FFFFF5555F1Z3',
        panNumber: 'FGHIJ6789L',
        bankDetails: const BankDetails(
          accountHolderName: 'Galaxy Multiplex LLP',
          bankName: 'Union Bank of India',
          accountNumber: '05431010009876',
          ifscCode: 'UBIN0543101',
          branchName: 'Kukatpally',
        ),
        documents: const [],
        appliedAt: '2026-09-01 10:00 AM',
        approvedAt: '2026-09-05 12:00 PM',
      ),

      // 7. APPROVED PRODUCTION HOUSE
      PartnerBusiness(
        id: 'biz_production_007',
        businessName: 'Mythri Cinematic Creators',
        ownerName: 'Y. Ravi Shankar',
        category: PartnerCategory.productionHouse,
        status: PartnerStatus.approved,
        mobile: '+91 98765 43270',
        email: 'ravi@mythricine.com',
        businessAddress: 'Road No 45, Jubilee Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pinCode: '500033',
        gstNumber: '36GGGGG6666G1Z7',
        panNumber: 'GHIJK7890M',
        bankDetails: const BankDetails(
          accountHolderName: 'Mythri Cinematic Creators LLP',
          bankName: 'Canara Bank',
          accountNumber: '110022334455',
          ifscCode: 'CNRB0001122',
          branchName: 'Banjara Hills',
        ),
        documents: const [],
        appliedAt: '2026-10-01 10:00 AM',
        approvedAt: '2026-10-03 01:00 PM',
      ),

      // 8. APPROVED EVENT MANAGEMENT
      PartnerBusiness(
        id: 'biz_eventmgmt_008',
        businessName: 'Showtime Global Event Management',
        ownerName: 'Ananya Deshmukh',
        category: PartnerCategory.eventManagement,
        status: PartnerStatus.approved,
        mobile: '+91 98765 43280',
        email: 'ananya@showtimeglobal.in',
        businessAddress: 'Inorbit Mall Road, Hitec City',
        city: 'Hyderabad',
        state: 'Telangana',
        pinCode: '500081',
        gstNumber: '36HHHHH7777H1Z1',
        panNumber: 'HIJKL8901N',
        bankDetails: const BankDetails(
          accountHolderName: 'Showtime Global Events',
          bankName: 'HDFC Bank',
          accountNumber: '50200099887766',
          ifscCode: 'HDFC0001234',
          branchName: 'Hitec City',
        ),
        documents: const [],
        appliedAt: '2026-10-10 10:00 AM',
        approvedAt: '2026-10-12 11:30 AM',
      ),
    ];
  }

  // Pre-configured Theatres (Multiple locations support)
  static List<Theatre> getInitialTheatres() {
    return [
      const Theatre(
        id: 'th_001',
        partnerBusinessId: 'biz_theatre_001',
        name: 'AMB Cinemas (Flagship Gachibowli)',
        address: 'Sarath City Capital Mall, Gachibowli',
        city: 'Hyderabad',
        state: 'Telangana',
        phone: '+91 40 6812 3456',
        status: 'ACTIVE',
        totalScreens: 7,
        totalCapacity: 1450,
        verificationStatus: 'VERIFIED',
      ),
      const Theatre(
        id: 'th_002',
        partnerBusinessId: 'biz_theatre_001',
        name: 'AMB Premiere Screen (Banjara Hills)',
        address: 'Road No 12, Banjara Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        phone: '+91 40 6812 9999',
        status: 'ACTIVE',
        totalScreens: 4,
        totalCapacity: 820,
        verificationStatus: 'VERIFIED',
      ),
      const Theatre(
        id: 'th_003',
        partnerBusinessId: 'biz_theatre_001',
        name: 'AMB Express Cineplex (Kondapur)',
        address: 'Near Botanical Garden, Kondapur',
        city: 'Hyderabad',
        state: 'Telangana',
        phone: '+91 40 6812 7777',
        status: 'ACTIVE',
        totalScreens: 3,
        totalCapacity: 540,
        verificationStatus: 'VERIFIED',
      ),
    ];
  }

  // Pre-configured Screens
  static List<Screen> getInitialScreens() {
    return [
      const Screen(
        id: 'scr_001',
        theatreId: 'th_001',
        name: 'Screen 1 (Laser IMAX 3D)',
        format: 'IMAX 3D',
        rows: 8,
        seatsPerRow: 12,
        totalSeats: 96,
        pricing: {
          'VIP': 450.0,
          'PREMIUM': 350.0,
          'EXECUTIVE': 280.0,
          'CLASSIC': 200.0,
        },
      ),
      const Screen(
        id: 'scr_002',
        theatreId: 'th_001',
        name: 'Screen 2 (Dolby Atmos 4K)',
        format: 'Dolby Atmos 4K',
        rows: 7,
        seatsPerRow: 12,
        totalSeats: 84,
        pricing: {
          'VIP': 350.0,
          'PREMIUM': 250.0,
          'EXECUTIVE': 180.0,
          'CLASSIC': 150.0,
        },
      ),
      const Screen(
        id: 'scr_003',
        theatreId: 'th_001',
        name: 'Screen 3 (VIP Recliner Lounge)',
        format: 'VIP Lounge',
        rows: 4,
        seatsPerRow: 8,
        totalSeats: 32,
        pricing: {
          'VIP': 600.0,
          'PREMIUM': 500.0,
          'EXECUTIVE': 400.0,
          'CLASSIC': 350.0,
        },
      ),
    ];
  }

  // Pre-configured Shows
  static List<Show> getInitialShows() {
    return [
      Show(
        id: 'sh_001',
        theatreId: 'th_001',
        screenId: 'scr_001',
        screenName: 'Screen 1 (Laser IMAX 3D)',
        movieId: 'mov_001',
        movieTitle: 'Pushpa 2: The Rule',
        moviePoster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
        startTime: '10:30 AM',
        endTime: '01:45 PM',
        date: 'Today',
        language: 'Telugu',
        format: 'IMAX 3D',
        ticketPrice: 350.0,
        totalSeats: 96,
        bookedSeats: 82,
        status: 'ACTIVE',
      ),
      Show(
        id: 'sh_002',
        theatreId: 'th_001',
        screenId: 'scr_001',
        screenName: 'Screen 1 (Laser IMAX 3D)',
        movieId: 'mov_001',
        movieTitle: 'Pushpa 2: The Rule',
        moviePoster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
        startTime: '02:30 PM',
        endTime: '05:45 PM',
        date: 'Today',
        language: 'Telugu',
        format: 'IMAX 3D',
        ticketPrice: 350.0,
        totalSeats: 96,
        bookedSeats: 64,
        status: 'ACTIVE',
      ),
      Show(
        id: 'sh_003',
        theatreId: 'th_001',
        screenId: 'scr_002',
        screenName: 'Screen 2 (Dolby Atmos 4K)',
        movieId: 'mov_002',
        movieTitle: 'Kalki 2898 AD',
        moviePoster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
        startTime: '11:15 AM',
        endTime: '02:30 PM',
        date: 'Today',
        language: 'Telugu',
        format: 'Dolby Atmos 4K',
        ticketPrice: 250.0,
        totalSeats: 84,
        bookedSeats: 48,
        status: 'ACTIVE',
      ),
      Show(
        id: 'sh_004',
        theatreId: 'th_001',
        screenId: 'scr_003',
        screenName: 'Screen 3 (VIP Recliner Lounge)',
        movieId: 'mov_003',
        movieTitle: 'Devara: Part 1',
        moviePoster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400',
        startTime: '06:00 PM',
        endTime: '09:00 PM',
        date: 'Today',
        language: 'Telugu',
        format: 'VIP Lounge',
        ticketPrice: 600.0,
        totalSeats: 32,
        bookedSeats: 26,
        status: 'ACTIVE',
      ),
    ];
  }

  // Pre-configured Employees (with role-based access levels)
  static List<Employee> getInitialEmployees() {
    return [
      // 1. Operational Manager
      Employee(
        id: 'emp_001',
        businessId: 'biz_theatre_001',
        locationId: 'th_001',
        locationName: 'AMB Cinemas (Flagship Gachibowli)',
        name: 'Kiran Varma',
        mobile: '+91 98765 43211',
        designation: 'Operations General Manager',
        role: 'MANAGER',
        permissions: [
          AvailablePermissions.qrScanning,
          AvailablePermissions.ticketVerification,
          AvailablePermissions.posBooking,
          AvailablePermissions.showTimings,
          AvailablePermissions.viewScreens,
          AvailablePermissions.customerAssist,
          AvailablePermissions.employeeAdmin, // Managers can manage floor staff
        ],
        isActive: true,
        invitedAt: '2026-10-18',
        lastLoginAt: 'Today at 09:12 AM',
      ),

      // 2. Gate Usher & Scanner (Strictly restricted)
      Employee(
        id: 'emp_002',
        businessId: 'biz_theatre_001',
        locationId: 'th_001',
        locationName: 'AMB Cinemas (Flagship Gachibowli)',
        name: 'Ramesh Babu',
        mobile: '+91 98765 43212',
        designation: 'Gate Entry Usher',
        role: 'EMPLOYEE',
        permissions: [
          AvailablePermissions.qrScanning,
          AvailablePermissions.ticketVerification,
          AvailablePermissions.showTimings,
          AvailablePermissions.customerAssist,
        ],
        isActive: true,
        invitedAt: '2026-10-22',
        lastLoginAt: 'Today at 10:00 AM',
      ),

      // 3. Box Office Cashier
      Employee(
        id: 'emp_003',
        businessId: 'biz_theatre_001',
        locationId: 'th_001',
        locationName: 'AMB Cinemas (Flagship Gachibowli)',
        name: 'Sneha Reddy',
        mobile: '+91 98765 43213',
        designation: 'Box Office Cashier',
        role: 'EMPLOYEE',
        permissions: [
          AvailablePermissions.posBooking,
          AvailablePermissions.ticketVerification,
          AvailablePermissions.showTimings,
          AvailablePermissions.viewScreens,
        ],
        isActive: true,
        invitedAt: '2026-10-25',
        lastLoginAt: 'Today at 08:30 AM',
      ),

      // 4. Floor Supervisor (Banjara Hills location)
      Employee(
        id: 'emp_004',
        businessId: 'biz_theatre_001',
        locationId: 'th_002',
        locationName: 'AMB Premiere Screen (Banjara Hills)',
        name: 'Manish Kumar',
        mobile: '+91 98765 43214',
        designation: 'Floor Supervisor',
        role: 'EMPLOYEE',
        permissions: [
          AvailablePermissions.qrScanning,
          AvailablePermissions.ticketVerification,
          AvailablePermissions.showTimings,
          AvailablePermissions.viewScreens,
          AvailablePermissions.customerAssist,
        ],
        isActive: true,
        invitedAt: '2026-10-28',
        lastLoginAt: 'Yesterday at 07:45 PM',
      ),
    ];
  }

  // Pre-configured Bookings (Online vs Counter POS)
  static List<Booking> getInitialBookings() {
    return [
      Booking(
        id: 'bk_001',
        bookingCode: 'CV-AMB-89421',
        theatreId: 'th_001',
        theatreName: 'AMB Cinemas (Gachibowli)',
        screenId: 'scr_001',
        screenName: 'Screen 1',
        showId: 'sh_001',
        movieTitle: 'Pushpa 2: The Rule',
        showTime: 'Today 10:30 AM',
        customerName: 'Rohit Sharma',
        customerPhone: '+91 98480 11223',
        seats: ['D5', 'D6'],
        totalAmount: 700.0,
        paymentMode: PaymentMode.online,
        status: BookingState.confirmed,
        createdAt: 'Today, 09:15 AM',
        paymentRef: 'pay_online_78912',
      ),
      Booking(
        id: 'bk_002',
        bookingCode: 'CV-POS-10492',
        theatreId: 'th_001',
        theatreName: 'AMB Cinemas (Gachibowli)',
        screenId: 'scr_001',
        screenName: 'Screen 1',
        showId: 'sh_001',
        movieTitle: 'Pushpa 2: The Rule',
        showTime: 'Today 10:30 AM',
        customerName: 'Counter Customer (Walk-in)',
        customerPhone: '+91 99887 76655',
        seats: ['F7', 'F8', 'F9'],
        totalAmount: 1050.0,
        paymentMode: PaymentMode.posCounter,
        status: BookingState.confirmed,
        createdAt: 'Today, 10:10 AM',
        bookedByEmployeeId: 'emp_003',
        paymentRef: 'POS_CASH_RECEIPT_001',
      ),
      Booking(
        id: 'bk_003',
        bookingCode: 'CV-AMB-91024',
        theatreId: 'th_001',
        theatreName: 'AMB Cinemas (Gachibowli)',
        screenId: 'scr_002',
        screenName: 'Screen 2',
        showId: 'sh_003',
        movieTitle: 'Kalki 2898 AD',
        showTime: 'Today 11:15 AM',
        customerName: 'Priyanka Chopra',
        customerPhone: '+91 98111 22334',
        seats: ['C3', 'C4'],
        totalAmount: 500.0,
        paymentMode: PaymentMode.online,
        status: BookingState.confirmed,
        createdAt: 'Today, 08:45 AM',
        paymentRef: 'pay_upi_65412',
      ),
    ];
  }

  // Pre-configured Settlements
  static List<SettlementRecord> getInitialSettlements() {
    return [
      const SettlementRecord(
        id: 'stl_001',
        businessId: 'biz_theatre_001',
        cycle: '01 Nov - 07 Nov 2026',
        grossRevenue: 485000.0,
        platformFee: 24250.0,
        gstDeduction: 4365.0,
        netPayout: 456385.0,
        status: 'SETTLED',
        bankRef: 'UTR-HDFC-991823746',
        settledAt: '08 Nov 2026, 06:30 PM',
      ),
      const SettlementRecord(
        id: 'stl_002',
        businessId: 'biz_theatre_001',
        cycle: '25 Oct - 31 Oct 2026',
        grossRevenue: 520000.0,
        platformFee: 26000.0,
        gstDeduction: 4680.0,
        netPayout: 489320.0,
        status: 'SETTLED',
        bankRef: 'UTR-HDFC-882736412',
        settledAt: '01 Nov 2026, 05:15 PM',
      ),
      const SettlementRecord(
        id: 'stl_003',
        businessId: 'biz_theatre_001',
        cycle: 'Current Cycle (08 Nov - 14 Nov)',
        grossRevenue: 284500.0,
        platformFee: 14225.0,
        gstDeduction: 2560.5,
        netPayout: 267714.5,
        status: 'PROCESSING',
        bankRef: 'Scheduled for 15 Nov',
        settledAt: 'Pending next cycle cutoff',
      ),
    ];
  }

  // Pre-configured Events (Event Organizer)
  static List<EventItem> getInitialEvents() {
    return [
      EventItem(
        id: 'ev_001',
        organizerId: 'biz_event_002',
        title: 'Sunburn Arena ft. Alan Walker Live',
        category: 'EDM Music Concert',
        description: 'World-renowned DJ and music producer Alan Walker brings his WalkerWorld Tour to Hyderabad!',
        bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500',
        date: '28 Nov 2026',
        time: '05:00 PM',
        city: 'Hyderabad',
        venue: 'GMR Arena, Shamshabad',
        status: 'PUBLISHED',
        totalAttendees: 5000,
        checkedInAttendees: 1420,
        ticketTiers: [
          TicketTier(id: 'tt_1', name: 'Early Bird GA', price: 1499.0, totalCapacity: 2000, soldCount: 2000),
          TicketTier(id: 'tt_2', name: 'VIP Lounge Experience', price: 3499.0, totalCapacity: 1500, soldCount: 1100),
          TicketTier(id: 'tt_3', name: 'Backstage Fan Pit', price: 7999.0, totalCapacity: 500, soldCount: 420),
        ],
      ),
      EventItem(
        id: 'ev_002',
        organizerId: 'biz_event_002',
        title: 'Arijit Singh Symphony Soul Night',
        category: 'Live Acoustic Concert',
        description: 'An enchanting evening of soulful melodies with a 50-piece international grand orchestra.',
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500',
        date: '15 Dec 2026',
        time: '06:30 PM',
        city: 'Hyderabad',
        venue: 'Gachibowli Stadium, Hyderabad',
        status: 'PUBLISHED',
        totalAttendees: 12000,
        checkedInAttendees: 0,
        ticketTiers: [
          TicketTier(id: 'tt_4', name: 'Silver Gallery', price: 999.0, totalCapacity: 6000, soldCount: 4800),
          TicketTier(id: 'tt_5', name: 'Gold Arena', price: 2499.0, totalCapacity: 4000, soldCount: 3100),
          TicketTier(id: 'tt_6', name: 'Platinum Front Row', price: 6999.0, totalCapacity: 2000, soldCount: 1850),
        ],
      ),
    ];
  }

  // Pre-configured Production Projects
  static List<ProductionProject> getInitialProjects() {
    return [
      const ProductionProject(
        id: 'prj_001',
        title: 'Project Garuda (Pan-India Action Epic)',
        genre: 'Mythological Action Thriller',
        director: 'Prashanth Neel',
        stage: 'FILMING',
        budgetCr: 250.0,
        spentCr: 145.5,
        expectedRelease: 'Sankranti 2027',
        castingCalls: [
          CastingCallItem(
            id: 'cc_1',
            roleName: 'Warrior Chieftain Brother',
            category: 'Supporting Actor',
            ageRange: '28 - 38 years',
            gender: 'Male',
            submissionsCount: 142,
            status: 'OPEN',
          ),
          CastingCallItem(
            id: 'cc_2',
            roleName: 'Young Princess (Flashback)',
            category: 'Child Artist',
            ageRange: '8 - 12 years',
            gender: 'Female',
            submissionsCount: 89,
            status: 'SHORTLISTING',
          ),
        ],
      ),
    ];
  }
}

