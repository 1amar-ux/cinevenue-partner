import 'package:flutter/material.dart';

enum SeatTier {
  vip,
  premium,
  executive,
  classic,
}

enum SeatBookingStatus {
  available,
  booked,
  blocked, // Temporarily blocked or maintenance
  selected,
}

class Seat {
  final String id;
  final String screenId;
  final String row;
  final int number;
  final SeatTier tier;
  SeatBookingStatus status;
  final double price;
  final String? bookedBy;
  final String? ticketId;

  Seat({
    required this.id,
    required this.screenId,
    required this.row,
    required this.number,
    required this.tier,
    this.status = SeatBookingStatus.available,
    required this.price,
    this.bookedBy,
    this.ticketId,
  });

  String get code => '$row$number';

  Color get color {
    switch (status) {
      case SeatBookingStatus.available:
        return const Color(0xFF27272A); // Zinc-800
      case SeatBookingStatus.booked:
        return const Color(0xFFDC2626); // Red
      case SeatBookingStatus.blocked:
        return const Color(0xFFF59E0B); // Amber / Blocked
      case SeatBookingStatus.selected:
        return const Color(0xFFD4AF37); // CineVenue Gold
    }
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'screenId': screenId,
        'row': row,
        'number': number,
        'tier': tier.name,
        'status': status.name,
        'price': price,
        'bookedBy': bookedBy,
        'ticketId': ticketId,
      };

  factory Seat.fromJson(Map<String, dynamic> json) => Seat(
        id: json['id'] ?? '',
        screenId: json['screenId'] ?? '',
        row: json['row'] ?? '',
        number: json['number'] ?? 0,
        tier: SeatTier.values.firstWhere(
          (e) => e.name == json['tier'],
          orElse: () => SeatTier.classic,
        ),
        status: SeatBookingStatus.values.firstWhere(
          (e) => e.name == json['status'],
          orElse: () => SeatBookingStatus.available,
        ),
        price: (json['price'] as num?)?.toDouble() ?? 150.0,
        bookedBy: json['bookedBy'],
        ticketId: json['ticketId'],
      );
}

