class Screen {
  final String id;
  final String theatreId;
  final String name;
  final String format; // IMAX 3D, Dolby Atmos 4K, VIP Lounge, Standard 2D
  final int rows;
  final int seatsPerRow;
  final int totalSeats;
  final Map<String, double> pricing; // VIP, PREMIUM, EXECUTIVE, CLASSIC

  const Screen({
    required this.id,
    required this.theatreId,
    required this.name,
    required this.format,
    required this.rows,
    required this.seatsPerRow,
    required this.totalSeats,
    required this.pricing,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'theatreId': theatreId,
        'name': name,
        'format': format,
        'rows': rows,
        'seatsPerRow': seatsPerRow,
        'totalSeats': totalSeats,
        'pricing': pricing,
      };

  factory Screen.fromJson(Map<String, dynamic> json) => Screen(
        id: json['id'] ?? '',
        theatreId: json['theatreId'] ?? '',
        name: json['name'] ?? '',
        format: json['format'] ?? 'Standard 2D',
        rows: json['rows'] ?? 10,
        seatsPerRow: json['seatsPerRow'] ?? 15,
        totalSeats: json['totalSeats'] ?? 150,
        pricing: (json['pricing'] as Map<String, dynamic>? ?? {
          'VIP': 350.0,
          'PREMIUM': 250.0,
          'EXECUTIVE': 180.0,
          'CLASSIC': 120.0,
        }).map((k, v) => MapEntry(k, (v as num).toDouble())),
      );
}

