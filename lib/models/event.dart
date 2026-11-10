class TicketTier {
  final String id;
  final String name; // VIP, Early Bird, General Admission, Backstage
  final double price;
  final int totalCapacity;
  int soldCount;

  TicketTier({
    required this.id,
    required this.name,
    required this.price,
    required this.totalCapacity,
    this.soldCount = 0,
  });

  int get available => totalCapacity - soldCount;

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'price': price,
        'totalCapacity': totalCapacity,
        'soldCount': soldCount,
      };

  factory TicketTier.fromJson(Map<String, dynamic> json) => TicketTier(
        id: json['id'] ?? '',
        name: json['name'] ?? '',
        price: (json['price'] as num?)?.toDouble() ?? 0.0,
        totalCapacity: json['totalCapacity'] ?? 100,
        soldCount: json['soldCount'] ?? 0,
      );
}

class EventItem {
  final String id;
  final String organizerId;
  final String title;
  final String category; // Music Concert, Standup Comedy, Tech Expo, Food Fest
  final String description;
  final String bannerUrl;
  final String date;
  final String time;
  final String city;
  final String venue;
  final List<TicketTier> ticketTiers;
  final String status; // DRAFT, PUBLISHED, COMPLETED, CANCELLED
  final int totalAttendees;
  final int checkedInAttendees;

  EventItem({
    required this.id,
    required this.organizerId,
    required this.title,
    required this.category,
    required this.description,
    required this.bannerUrl,
    required this.date,
    required this.time,
    required this.city,
    required this.venue,
    required this.ticketTiers,
    this.status = 'PUBLISHED',
    this.totalAttendees = 0,
    this.checkedInAttendees = 0,
  });

  double get totalRevenue {
    double rev = 0;
    for (var tier in ticketTiers) {
      rev += tier.soldCount * tier.price;
    }
    return rev;
  }

  int get totalSold {
    int sold = 0;
    for (var tier in ticketTiers) {
      sold += tier.soldCount;
    }
    return sold;
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'organizerId': organizerId,
        'title': title,
        'category': category,
        'description': description,
        'bannerUrl': bannerUrl,
        'date': date,
        'time': time,
        'city': city,
        'venue': venue,
        'ticketTiers': ticketTiers.map((t) => t.toJson()).toList(),
        'status': status,
        'totalAttendees': totalAttendees,
        'checkedInAttendees': checkedInAttendees,
      };

  factory EventItem.fromJson(Map<String, dynamic> json) => EventItem(
        id: json['id'] ?? '',
        organizerId: json['organizerId'] ?? '',
        title: json['title'] ?? '',
        category: json['category'] ?? 'Concert',
        description: json['description'] ?? '',
        bannerUrl: json['bannerUrl'] ?? '',
        date: json['date'] ?? '',
        time: json['time'] ?? '',
        city: json['city'] ?? '',
        venue: json['venue'] ?? '',
        ticketTiers: (json['ticketTiers'] as List? ?? [])
            .map((t) => TicketTier.fromJson(t))
            .toList(),
        status: json['status'] ?? 'PUBLISHED',
        totalAttendees: json['totalAttendees'] ?? 0,
        checkedInAttendees: json['checkedInAttendees'] ?? 0,
      );
}

