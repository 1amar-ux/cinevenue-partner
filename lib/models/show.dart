class Show {
  final String id;
  final String theatreId;
  final String screenId;
  final String screenName;
  final String movieId;
  final String movieTitle;
  final String moviePoster;
  final String startTime;
  final String endTime;
  final String date;
  final String language;
  final String format;
  final double ticketPrice;
  final int totalSeats;
  int bookedSeats;
  final String status; // ACTIVE, CANCELLED, COMPLETED

  Show({
    required this.id,
    required this.theatreId,
    required this.screenId,
    required this.screenName,
    required this.movieId,
    required this.movieTitle,
    required this.moviePoster,
    required this.startTime,
    required this.endTime,
    required this.date,
    required this.language,
    required this.format,
    required this.ticketPrice,
    required this.totalSeats,
    this.bookedSeats = 0,
    this.status = 'ACTIVE',
  });

  int get availableSeats => totalSeats - bookedSeats;
  double get occupancyPercentage => totalSeats > 0 ? (bookedSeats / totalSeats) * 100 : 0;

  Map<String, dynamic> toJson() => {
        'id': id,
        'theatreId': theatreId,
        'screenId': screenId,
        'screenName': screenName,
        'movieId': movieId,
        'movieTitle': movieTitle,
        'moviePoster': moviePoster,
        'startTime': startTime,
        'endTime': endTime,
        'date': date,
        'language': language,
        'format': format,
        'ticketPrice': ticketPrice,
        'totalSeats': totalSeats,
        'bookedSeats': bookedSeats,
        'status': status,
      };

  factory Show.fromJson(Map<String, dynamic> json) => Show(
        id: json['id'] ?? '',
        theatreId: json['theatreId'] ?? '',
        screenId: json['screenId'] ?? '',
        screenName: json['screenName'] ?? '',
        movieId: json['movieId'] ?? '',
        movieTitle: json['movieTitle'] ?? '',
        moviePoster: json['moviePoster'] ?? '',
        startTime: json['startTime'] ?? '',
        endTime: json['endTime'] ?? '',
        date: json['date'] ?? '',
        language: json['language'] ?? 'Telugu',
        format: json['format'] ?? '2D',
        ticketPrice: (json['ticketPrice'] as num?)?.toDouble() ?? 200.0,
        totalSeats: json['totalSeats'] ?? 150,
        bookedSeats: json['bookedSeats'] ?? 0,
        status: json['status'] ?? 'ACTIVE',
      );
}

