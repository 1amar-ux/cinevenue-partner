import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:uuid/uuid.dart';
import '../core/constants/app_constants.dart';
import '../models/partner_category.dart';
import '../models/partner_status.dart';
import '../models/partner_business.dart';
import '../models/theatre.dart';
import '../models/screen.dart';
import '../models/seat.dart';
import '../models/show.dart';
import '../models/booking.dart';
import '../models/employee.dart';
import '../models/event.dart';
import '../models/payment_settlement.dart';
import '../models/production_project.dart';
import 'mock_data.dart';

class PartnerRepository {
  static final PartnerRepository _instance = PartnerRepository._internal();
  factory PartnerRepository() => _instance;

  PartnerRepository._internal() {
    _initData();
  }

  final _uuid = const Uuid();

  // In-memory data store
  final List<PartnerBusiness> _partners = [];
  final List<Theatre> _theatres = [];
  final List<Screen> _screens = [];
  final List<Show> _shows = [];
  final Map<String, List<Seat>> _seatCache = {}; // showId -> seats
  final List<Booking> _bookings = [];
  final List<Employee> _employees = [];
  final List<EventItem> _events = [];
  final List<SettlementRecord> _settlements = [];
  final List<ProductionProject> _productionProjects = [];

  void _initData() {
    _partners.addAll(DevMockData.getInitialPartners());
    _theatres.addAll(DevMockData.getInitialTheatres());
    _screens.addAll(DevMockData.getInitialScreens());
    _shows.addAll(DevMockData.getInitialShows());
    _bookings.addAll(DevMockData.getInitialBookings());
    _employees.addAll(DevMockData.getInitialEmployees());
    _events.addAll(DevMockData.getInitialEvents());
    _settlements.addAll(DevMockData.getInitialSettlements());
    _productionProjects.addAll(DevMockData.getInitialProjects());

    fetchPartnersFromBackend();
  }

  Future<void> fetchPartnersFromBackend() async {
    try {
      final response = await http.get(Uri.parse('${AppConstants.defaultApiUrl}/partners'));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['partners'] is List) {
          for (final item in data['partners']) {
            final id = item['id'] as String?;
            if (id == null) continue;
            final existingIdx = _partners.indexWhere((p) => p.id == id);
            final statusStr = (item['status'] as String? ?? 'pending').toLowerCase();
            final status = PartnerStatus.values.firstWhere(
              (s) => s.name.toLowerCase() == statusStr,
              orElse: () => PartnerStatus.pending,
            );
            final catStr = (item['category'] as String? ?? 'theatre').toLowerCase();
            final category = PartnerCategory.values.firstWhere(
              (c) => c.name.toLowerCase() == catStr ||
                     catStr.contains(c.name.toLowerCase()) ||
                     c.name.toLowerCase().contains(catStr.replaceAll('_partner', '')),
              orElse: () => PartnerCategory.theatrePartner,
            );
            final partner = PartnerBusiness(
              id: id,
              businessName: item['businessName'] ?? '',
              ownerName: item['ownerName'] ?? '',
              category: category,
              status: status,
              mobile: item['mobile'] ?? '',
              email: item['email'] ?? '',
              businessAddress: item['businessAddress'] ?? '${item['city'] ?? ''}, ${item['state'] ?? ''}',
              city: item['city'] ?? '',
              state: item['state'] ?? '',
              pinCode: item['pinCode'] ?? '',
              gstNumber: item['gstNumber'],
              panNumber: item['panNumber'],
              bankDetails: BankDetails(
                accountNumber: item['accountNumber'] ?? '',
                accountHolderName: item['ownerName'] ?? '',
                ifscCode: item['ifscCode'] ?? '',
                bankName: item['bankName'] ?? '',
                branchName: '',
              ),
              documents: [],
              appliedAt: item['appliedAt'] ?? '',
            );
            if (existingIdx != -1) {
              _partners[existingIdx] = partner;
            } else {
              _partners.add(partner);
            }
          }
        }
      }
    } catch (_) {}
  }

  // --- PARTNERS ---
  List<PartnerBusiness> getAllPartners() => List.unmodifiable(_partners);

  PartnerBusiness? getPartnerById(String id) {
    try {
      return _partners.firstWhere((p) => p.id == id);
    } catch (_) {
      return null;
    }
  }

  PartnerBusiness registerNewPartner({
    required String businessName,
    required String ownerName,
    required PartnerCategory category,
    required String mobile,
    required String email,
    required String businessAddress,
    required String city,
    required String state,
    required String pinCode,
    String? gstNumber,
    String? panNumber,
    required BankDetails bankDetails,
    required List<PartnerDocument> documents,
  }) {
    final newPartner = PartnerBusiness(
      id: 'biz_${_uuid.v4().substring(0, 8)}',
      businessName: businessName,
      ownerName: ownerName,
      category: category,
      status: PartnerStatus.pending, // Always starts as PENDING for admin review
      mobile: mobile,
      email: email,
      businessAddress: businessAddress,
      city: city,
      state: state,
      pinCode: pinCode,
      gstNumber: gstNumber,
      panNumber: panNumber,
      bankDetails: bankDetails,
      documents: documents,
      appliedAt: DateTime.now().toString().substring(0, 16),
    );

    _partners.insert(0, newPartner);

    // Asynchronously dispatch registration to CineVenue central backend
    try {
      final payload = jsonEncode({
        'id': newPartner.id,
        'businessName': businessName,
        'ownerName': ownerName,
        'category': category.name.toUpperCase(),
        'mobile': mobile,
        'email': email,
        'businessAddress': businessAddress,
        'city': city,
        'state': state,
        'pinCode': pinCode,
        'gstNumber': gstNumber ?? '',
        'panNumber': panNumber ?? '',
        'bankName': bankDetails.bankName,
        'accountNumber': bankDetails.accountNumber,
        'ifscCode': bankDetails.ifscCode,
        'documents': documents.map((d) => {
          'name': d.name,
          'type': d.type,
          'status': d.status,
          'url': d.fileUrl,
        }).toList(),
      });
      http.post(
        Uri.parse('${AppConstants.defaultApiUrl}/partners/register'),
        headers: {'Content-Type': 'application/json'},
        body: payload,
      ).catchError((_) => http.Response('{}', 500));
    } catch (_) {}

    return newPartner;
  }

  void updatePartnerStatus(
    String partnerId,
    PartnerStatus newStatus, {
    String? rejectionReason,
    String? moreInfoRequiredText,
  }) {
    final idx = _partners.indexWhere((p) => p.id == partnerId);
    if (idx != -1) {
      final current = _partners[idx];
      _partners[idx] = current.copyWith(
        status: newStatus,
        rejectionReason: rejectionReason,
        moreInfoRequiredText: moreInfoRequiredText,
        approvedAt: newStatus == PartnerStatus.approved
            ? DateTime.now().toString().substring(0, 16)
            : current.approvedAt,
      );

      // Asynchronously sync status transition to CineVenue central backend
      try {
        final payload = jsonEncode({
          'status': newStatus.name.toUpperCase(),
          'rejectionReason': rejectionReason,
          'moreInfoRequiredText': moreInfoRequiredText,
        });
        http.patch(
          Uri.parse('${AppConstants.defaultApiUrl}/partners/$partnerId/status'),
          headers: {'Content-Type': 'application/json'},
          body: payload,
        ).catchError((_) => http.Response('{}', 500));
      } catch (_) {}
    }
  }

  void resubmitPartnerApplication(String partnerId, List<PartnerDocument> newDocs) {
    final idx = _partners.indexWhere((p) => p.id == partnerId);
    if (idx != -1) {
      final current = _partners[idx];
      _partners[idx] = current.copyWith(
        status: PartnerStatus.underReview,
        documents: [...current.documents, ...newDocs],
        rejectionReason: null,
        moreInfoRequiredText: null,
      );
    }
  }

  // --- THEATRES ---
  List<Theatre> getTheatresByPartner(String partnerId) =>
      _theatres.where((t) => t.partnerBusinessId == partnerId).toList();

  Theatre? getTheatreById(String theatreId) {
    try {
      return _theatres.firstWhere((t) => t.id == theatreId);
    } catch (_) {
      return null;
    }
  }

  Theatre addTheatre(Theatre theatre) {
    _theatres.add(theatre);
    return theatre;
  }

  // --- SCREENS ---
  List<Screen> getScreensByTheatre(String theatreId) =>
      _screens.where((s) => s.theatreId == theatreId).toList();

  Screen? getScreenById(String screenId) {
    try {
      return _screens.firstWhere((s) => s.id == screenId);
    } catch (_) {
      return null;
    }
  }

  Screen addScreen(Screen screen) {
    _screens.add(screen);
    return screen;
  }

  // --- SHOWS ---
  List<Show> getShowsByTheatre(String theatreId) =>
      _shows.where((s) => s.theatreId == theatreId).toList();

  Show? getShowById(String showId) {
    try {
      return _shows.firstWhere((s) => s.id == showId);
    } catch (_) {
      return null;
    }
  }

  Show addShow(Show show) {
    _shows.add(show);
    return show;
  }

  // --- LIVE SEAT MATRIX ---
  List<Seat> getSeatsForShow(String showId, {Screen? screen}) {
    if (_seatCache.containsKey(showId)) {
      return _seatCache[showId]!;
    }

    final scr = screen ?? (_screens.isNotEmpty ? _screens.first : null);
    final rowsCount = scr?.rows ?? 8;
    final seatsPerRow = scr?.seatsPerRow ?? 12;

    final List<Seat> seats = [];
    final rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    for (int r = 0; r < rowsCount; r++) {
      final rowLetter = rowLetters[r % rowLetters.length];
      SeatTier tier;
      if (r < 2) {
        tier = SeatTier.vip;
      } else if (r < 5) {
        tier = SeatTier.premium;
      } else if (r < 7) {
        tier = SeatTier.executive;
      } else {
        tier = SeatTier.classic;
      }

      for (int num = 1; num <= seatsPerRow; num++) {
        // Deterministic initial status for demo realism
        SeatBookingStatus initialStatus = SeatBookingStatus.available;
        if ((r * 7 + num) % 4 == 0) {
          initialStatus = SeatBookingStatus.booked;
        } else if ((r * 5 + num) % 17 == 0) {
          initialStatus = SeatBookingStatus.blocked;
        }

        seats.add(Seat(
          id: '${showId}_${rowLetter}_$num',
          screenId: scr?.id ?? '',
          row: rowLetter,
          number: num,
          tier: tier,
          status: initialStatus,
          price: scr?.pricing[tier.name.toUpperCase()] ?? 250.0,
        ));
      }
    }

    _seatCache[showId] = seats;
    return seats;
  }

  void toggleSeatStatus(String showId, String seatCode, SeatBookingStatus newStatus) {
    final seats = getSeatsForShow(showId);
    final seat = seats.firstWhere((s) => s.code == seatCode);
    seat.status = newStatus;
  }

  // --- BOOKINGS & POS ---
  List<Booking> getBookingsByTheatre(String theatreId) =>
      _bookings.where((b) => b.theatreId == theatreId).toList();

  Booking createPosBooking({
    required String theatreId,
    required String theatreName,
    required String screenId,
    required String screenName,
    required String showId,
    required String movieTitle,
    required String showTime,
    required String customerName,
    required String customerPhone,
    required List<String> seatCodes,
    required double totalAmount,
    required PaymentMode paymentMode,
    String? employeeId,
  }) {
    // 1. Mark seats as BOOKED in live matrix
    final seats = getSeatsForShow(showId);
    for (final code in seatCodes) {
      final s = seats.firstWhere((seat) => seat.code == code);
      s.status = SeatBookingStatus.booked;
    }

    // 2. Update show booked count
    final show = getShowById(showId);
    if (show != null) {
      show.bookedSeats += seatCodes.length;
    }

    // 3. Create booking record
    final codeNum = 10000 + _bookings.length + 1;
    final newBooking = Booking(
      id: 'bk_pos_${_uuid.v4().substring(0, 8)}',
      bookingCode: 'CV-POS-$codeNum',
      theatreId: theatreId,
      theatreName: theatreName,
      screenId: screenId,
      screenName: screenName,
      showId: showId,
      movieTitle: movieTitle,
      showTime: showTime,
      customerName: customerName.trim().isEmpty ? 'Counter Guest' : customerName.trim(),
      customerPhone: customerPhone.trim().isEmpty ? 'Walk-in Counter' : customerPhone.trim(),
      seats: seatCodes,
      totalAmount: totalAmount,
      paymentMode: paymentMode,
      status: BookingState.confirmed,
      createdAt: 'Today, ${DateTime.now().hour.toString().padLeft(2, '0')}:${DateTime.now().minute.toString().padLeft(2, '0')}',
      bookedByEmployeeId: employeeId,
      paymentRef: 'POS-TXN-${_uuid.v4().substring(0, 6).toUpperCase()}',
    );

    _bookings.insert(0, newBooking);
    return newBooking;
  }

  void cancelBooking(String bookingId) {
    final idx = _bookings.indexWhere((b) => b.id == bookingId);
    if (idx != -1) {
      final b = _bookings[idx];
      b.status = BookingState.cancelled;
      // Free seats in live matrix
      final seats = getSeatsForShow(b.showId);
      for (final code in b.seats) {
        try {
          final s = seats.firstWhere((seat) => seat.code == code);
          s.status = SeatBookingStatus.available;
        } catch (_) {}
      }
      final show = getShowById(b.showId);
      if (show != null && show.bookedSeats >= b.seats.length) {
        show.bookedSeats -= b.seats.length;
      }
    }
  }

  // --- EMPLOYEES & INVITATIONS ---
  List<Employee> getEmployeesByBusiness(String businessId) =>
      _employees.where((e) => e.businessId == businessId).toList();

  Employee? getEmployeeByMobile(String mobile) {
    try {
      final clean = mobile.replaceAll(RegExp(r'[^0-9]'), '');
      return _employees.firstWhere((e) =>
          e.mobile.replaceAll(RegExp(r'[^0-9]'), '').endsWith(clean.length >= 10 ? clean.substring(clean.length - 10) : clean));
    } catch (_) {
      return null;
    }
  }

  Employee inviteEmployee({
    required String businessId,
    required String locationId,
    required String locationName,
    required String name,
    required String mobile,
    required String designation,
    required String role, // MANAGER or EMPLOYEE
    required List<String> permissions,
  }) {
    final emp = Employee(
      id: 'emp_${_uuid.v4().substring(0, 8)}',
      businessId: businessId,
      locationId: locationId,
      locationName: locationName,
      name: name,
      mobile: mobile,
      designation: designation,
      role: role,
      permissions: permissions,
      isActive: true,
      invitedAt: DateTime.now().toString().substring(0, 10),
    );
    _employees.add(emp);
    return emp;
  }

  void updateEmployeePermissions(String employeeId, List<String> permissions) {
    final idx = _employees.indexWhere((e) => e.id == employeeId);
    if (idx != -1) {
      _employees[idx].permissions = permissions;
    }
  }

  void toggleEmployeeStatus(String employeeId) {
    final idx = _employees.indexWhere((e) => e.id == employeeId);
    if (idx != -1) {
      _employees[idx].isActive = !_employees[idx].isActive;
    }
  }

  // --- EVENTS (EVENT ORGANIZER) ---
  List<EventItem> getEventsByOrganizer(String organizerId) =>
      _events.where((e) => e.organizerId == organizerId).toList();

  EventItem createEvent({
    required String organizerId,
    required String title,
    required String category,
    required String description,
    required String bannerUrl,
    required String date,
    required String time,
    required String city,
    required String venue,
    required List<TicketTier> ticketTiers,
  }) {
    final ev = EventItem(
      id: 'ev_${_uuid.v4().substring(0, 8)}',
      organizerId: organizerId,
      title: title,
      category: category,
      description: description,
      bannerUrl: bannerUrl.isEmpty
          ? 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500'
          : bannerUrl,
      date: date,
      time: time,
      city: city,
      venue: venue,
      ticketTiers: ticketTiers,
      status: 'PUBLISHED',
      totalAttendees: ticketTiers.fold(0, (sum, t) => sum + t.soldCount),
      checkedInAttendees: 0,
    );
    _events.insert(0, ev);
    return ev;
  }

  bool checkInAttendee(String eventId, String ticketCode) {
    final idx = _events.indexWhere((e) => e.id == eventId);
    if (idx != -1) {
      final ev = _events[idx];
      _events[idx] = EventItem(
        id: ev.id,
        organizerId: ev.organizerId,
        title: ev.title,
        category: ev.category,
        description: ev.description,
        bannerUrl: ev.bannerUrl,
        date: ev.date,
        time: ev.time,
        city: ev.city,
        venue: ev.venue,
        ticketTiers: ev.ticketTiers,
        status: ev.status,
        totalAttendees: ev.totalAttendees,
        checkedInAttendees: ev.checkedInAttendees + 1,
      );
      return true;
    }
    return false;
  }

  // --- SETTLEMENTS & FINANCIALS ---
  List<SettlementRecord> getSettlementsByBusiness(String businessId) =>
      _settlements.where((s) => s.businessId == businessId).toList();

  // --- PRODUCTION PROJECTS ---
  List<ProductionProject> getProductionProjects() =>
      List.unmodifiable(_productionProjects);
}

