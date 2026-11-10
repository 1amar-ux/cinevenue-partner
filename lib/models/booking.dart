enum PaymentMode {
  online,
  posCounter,
  upi,
  cash,
}

enum BookingState {
  confirmed,
  cancelled,
  refunded,
}

class Booking {
  final String id;
  final String bookingCode;
  final String theatreId;
  final String theatreName;
  final String screenId;
  final String screenName;
  final String showId;
  final String movieTitle;
  final String showTime;
  final String customerName;
  final String customerPhone;
  final List<String> seats;
  final double totalAmount;
  final PaymentMode paymentMode;
  BookingState status;
  final String createdAt;
  final String? bookedByEmployeeId;
  final String? paymentRef;

  Booking({
    required this.id,
    required this.bookingCode,
    required this.theatreId,
    required this.theatreName,
    required this.screenId,
    required this.screenName,
    required this.showId,
    required this.movieTitle,
    required this.showTime,
    required this.customerName,
    required this.customerPhone,
    required this.seats,
    required this.totalAmount,
    required this.paymentMode,
    this.status = BookingState.confirmed,
    required this.createdAt,
    this.bookedByEmployeeId,
    this.paymentRef,
  });

  bool get isPosBooking => paymentMode == PaymentMode.posCounter || paymentMode == PaymentMode.cash;

  Map<String, dynamic> toJson() => {
        'id': id,
        'bookingCode': bookingCode,
        'theatreId': theatreId,
        'theatreName': theatreName,
        'screenId': screenId,
        'screenName': screenName,
        'showId': showId,
        'movieTitle': movieTitle,
        'showTime': showTime,
        'customerName': customerName,
        'customerPhone': customerPhone,
        'seats': seats,
        'totalAmount': totalAmount,
        'paymentMode': paymentMode.name,
        'status': status.name,
        'createdAt': createdAt,
        'bookedByEmployeeId': bookedByEmployeeId,
        'paymentRef': paymentRef,
      };

  factory Booking.fromJson(Map<String, dynamic> json) => Booking(
        id: json['id'] ?? '',
        bookingCode: json['bookingCode'] ?? '',
        theatreId: json['theatreId'] ?? '',
        theatreName: json['theatreName'] ?? '',
        screenId: json['screenId'] ?? '',
        screenName: json['screenName'] ?? '',
        showId: json['showId'] ?? '',
        movieTitle: json['movieTitle'] ?? '',
        showTime: json['showTime'] ?? '',
        customerName: json['customerName'] ?? '',
        customerPhone: json['customerPhone'] ?? '',
        seats: List<String>.from(json['seats'] ?? []),
        totalAmount: (json['totalAmount'] as num?)?.toDouble() ?? 0.0,
        paymentMode: PaymentMode.values.firstWhere(
          (e) => e.name == json['paymentMode'],
          orElse: () => PaymentMode.online,
        ),
        status: BookingState.values.firstWhere(
          (e) => e.name == json['status'],
          orElse: () => BookingState.confirmed,
        ),
        createdAt: json['createdAt'] ?? '',
        bookedByEmployeeId: json['bookedByEmployeeId'],
        paymentRef: json['paymentRef'],
      );
}

