import 'package:flutter/material.dart';
import '../models/theatre.dart';
import '../models/screen.dart';
import '../models/show.dart';
import '../models/seat.dart';
import '../models/booking.dart';
import '../models/payment_settlement.dart';
import '../services/partner_repository.dart';

class TheatreProvider extends ChangeNotifier {
  final PartnerRepository _repo = PartnerRepository();

  String _partnerId = 'biz_theatre_001';
  Theatre? _selectedTheatre;
  Screen? _selectedScreen;
  Show? _selectedShow;
  List<Seat> _liveSeats = [];
  final List<Seat> _posCartSeats = [];

  // Filter state for Bookings tab
  String _bookingFilter = 'ALL'; // ALL, ONLINE, POS

  TheatreProvider() {
    loadTheatreData(_partnerId);
  }

  String get partnerId => _partnerId;
  Theatre? get selectedTheatre => _selectedTheatre;
  Screen? get selectedScreen => _selectedScreen;
  Show? get selectedShow => _selectedShow;
  List<Seat> get liveSeats => _liveSeats;
  List<Seat> get posCartSeats => _posCartSeats;
  String get bookingFilter => _bookingFilter;

  List<Theatre> get theatres => _repo.getTheatresByPartner(_partnerId);

  List<Screen> get screens =>
      _selectedTheatre != null ? _repo.getScreensByTheatre(_selectedTheatre!.id) : [];

  List<Show> get shows =>
      _selectedTheatre != null ? _repo.getShowsByTheatre(_selectedTheatre!.id) : [];

  List<Booking> get bookings {
    if (_selectedTheatre == null) return [];
    final all = _repo.getBookingsByTheatre(_selectedTheatre!.id);
    if (_bookingFilter == 'ONLINE') {
      return all.where((b) => !b.isPosBooking).toList();
    } else if (_bookingFilter == 'POS') {
      return all.where((b) => b.isPosBooking).toList();
    }
    return all;
  }

  List<SettlementRecord> get settlements =>
      _repo.getSettlementsByBusiness(_partnerId);

  void setBookingFilter(String filter) {
    _bookingFilter = filter;
    notifyListeners();
  }

  void loadTheatreData(String partnerId) {
    _partnerId = partnerId;
    final thList = _repo.getTheatresByPartner(partnerId);
    if (thList.isNotEmpty) {
      _selectedTheatre = thList.first;
      final scrList = _repo.getScreensByTheatre(_selectedTheatre!.id);
      if (scrList.isNotEmpty) {
        _selectedScreen = scrList.first;
      }
      final shList = _repo.getShowsByTheatre(_selectedTheatre!.id);
      if (shList.isNotEmpty) {
        selectShow(shList.first);
      }
    }
    notifyListeners();
  }

  void selectTheatre(String theatreId) {
    _selectedTheatre = _repo.getTheatreById(theatreId);
    final scrList = _selectedTheatre != null
        ? _repo.getScreensByTheatre(_selectedTheatre!.id)
        : <Screen>[];
    _selectedScreen = scrList.isNotEmpty ? scrList.first : null;

    final shList = _selectedTheatre != null
        ? _repo.getShowsByTheatre(_selectedTheatre!.id)
        : <Show>[];
    if (shList.isNotEmpty) {
      selectShow(shList.first);
    } else {
      _selectedShow = null;
      _liveSeats = [];
    }
    _posCartSeats.clear();
    notifyListeners();
  }

  void selectScreen(Screen screen) {
    _selectedScreen = screen;
    notifyListeners();
  }

  void selectShow(Show show) {
    _selectedShow = show;
    _liveSeats = _repo.getSeatsForShow(show.id, screen: _selectedScreen);
    _posCartSeats.clear();
    notifyListeners();
  }

  // --- LIVE SEAT MANAGEMENT ---
  void toggleBlockSeat(Seat seat) {
    if (seat.status == SeatBookingStatus.booked) return; // Cannot block booked seat

    if (seat.status == SeatBookingStatus.blocked) {
      seat.status = SeatBookingStatus.available;
    } else {
      seat.status = SeatBookingStatus.blocked;
    }
    notifyListeners();
  }

  // --- POS CART TICKETING ---
  void togglePosSeatSelection(Seat seat) {
    if (seat.status == SeatBookingStatus.booked || seat.status == SeatBookingStatus.blocked) {
      return;
    }

    if (_posCartSeats.any((s) => s.id == seat.id)) {
      _posCartSeats.removeWhere((s) => s.id == seat.id);
      seat.status = SeatBookingStatus.available;
    } else {
      _posCartSeats.add(seat);
      seat.status = SeatBookingStatus.selected;
    }
    notifyListeners();
  }

  double get posCartTotal {
    return _posCartSeats.fold(0.0, (sum, seat) => sum + seat.price);
  }

  Booking? completePosBooking({
    required String customerName,
    required String customerPhone,
    required PaymentMode paymentMode,
    String? employeeId,
  }) {
    if (_selectedTheatre == null || _selectedShow == null || _posCartSeats.isEmpty) {
      return null;
    }

    final booking = _repo.createPosBooking(
      theatreId: _selectedTheatre!.id,
      theatreName: _selectedTheatre!.name,
      screenId: _selectedShow!.screenId,
      screenName: _selectedShow!.screenName,
      showId: _selectedShow!.id,
      movieTitle: _selectedShow!.movieTitle,
      showTime: _selectedShow!.startTime,
      customerName: customerName,
      customerPhone: customerPhone,
      seatCodes: _posCartSeats.map((s) => s.code).toList(),
      totalAmount: posCartTotal,
      paymentMode: paymentMode,
      employeeId: employeeId,
    );

    _posCartSeats.clear();
    _liveSeats = _repo.getSeatsForShow(_selectedShow!.id);
    notifyListeners();
    return booking;
  }

  void cancelBooking(String bookingId) {
    _repo.cancelBooking(bookingId);
    if (_selectedShow != null) {
      _liveSeats = _repo.getSeatsForShow(_selectedShow!.id);
    }
    notifyListeners();
  }

  // --- REVENUE & ANALYTICS OVERVIEW ---
  double get todayRevenue {
    final bks = bookings.where((b) => b.status == BookingState.confirmed);
    return bks.fold(0.0, (sum, b) => sum + b.totalAmount) + 48250.0; // Seed base today
  }

  int get todayBookedTickets {
    final bks = bookings.where((b) => b.status == BookingState.confirmed);
    int count = bks.fold(0, (sum, b) => sum + b.seats.length);
    return count + 142;
  }

  double get averageOccupancyPercentage {
    if (shows.isEmpty) return 0;
    double total = shows.fold(0.0, (sum, s) => sum + s.occupancyPercentage);
    return total / shows.length;
  }

  // --- SCREEN CREATION ---
  void createScreen({
    required String name,
    required String format,
    required int rows,
    required int seatsPerRow,
    required Map<String, double> pricing,
  }) {
    if (_selectedTheatre == null) return;
    final newScreen = Screen(
      id: 'scr_${DateTime.now().millisecondsSinceEpoch}',
      theatreId: _selectedTheatre!.id,
      name: name,
      format: format,
      rows: rows,
      seatsPerRow: seatsPerRow,
      totalSeats: rows * seatsPerRow,
      pricing: pricing,
    );
    _repo.addScreen(newScreen);
    notifyListeners();
  }

  // --- SHOW SCHEDULER ---
  void scheduleShow({
    required String screenId,
    required String screenName,
    required String movieTitle,
    required String moviePoster,
    required String startTime,
    required String endTime,
    required String date,
    required String language,
    required String format,
    required double ticketPrice,
    required int totalSeats,
  }) {
    if (_selectedTheatre == null) return;
    final newShow = Show(
      id: 'sh_${DateTime.now().millisecondsSinceEpoch}',
      theatreId: _selectedTheatre!.id,
      screenId: screenId,
      screenName: screenName,
      movieId: 'mov_${DateTime.now().millisecondsSinceEpoch}',
      movieTitle: movieTitle,
      moviePoster: moviePoster,
      startTime: startTime,
      endTime: endTime,
      date: date,
      language: language,
      format: format,
      ticketPrice: ticketPrice,
      totalSeats: totalSeats,
      bookedSeats: 0,
      status: 'ACTIVE',
    );
    _repo.addShow(newShow);
    notifyListeners();
  }
}

