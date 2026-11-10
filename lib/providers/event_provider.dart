import 'package:flutter/material.dart';
import '../models/event.dart';
import '../services/partner_repository.dart';

class EventProvider extends ChangeNotifier {
  final PartnerRepository _repo = PartnerRepository();
  String _organizerId = 'biz_event_002';

  EventProvider() {
    loadEvents(_organizerId);
  }

  String get organizerId => _organizerId;

  List<EventItem> get events => _repo.getEventsByOrganizer(_organizerId);

  void loadEvents(String organizerId) {
    _organizerId = organizerId;
    notifyListeners();
  }

  EventItem createEvent({
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
    final ev = _repo.createEvent(
      organizerId: _organizerId,
      title: title,
      category: category,
      description: description,
      bannerUrl: bannerUrl,
      date: date,
      time: time,
      city: city,
      venue: venue,
      ticketTiers: ticketTiers,
    );
    notifyListeners();
    return ev;
  }

  bool checkInAttendee(String eventId, String ticketCode) {
    final success = _repo.checkInAttendee(eventId, ticketCode);
    if (success) {
      notifyListeners();
    }
    return success;
  }

  double get totalRevenue =>
      events.fold(0.0, (sum, ev) => sum + ev.totalRevenue);

  int get totalAttendees =>
      events.fold(0, (sum, ev) => sum + ev.totalAttendees);

  int get totalCheckedIn =>
      events.fold(0, (sum, ev) => sum + ev.checkedInAttendees);
}

