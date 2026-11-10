class Theatre {
  final String id;
  final String partnerBusinessId;
  final String name;
  final String address;
  final String city;
  final String state;
  final String phone;
  final String status; // ACTIVE, INACTIVE, SUSPENDED
  final int totalScreens;
  final int totalCapacity;
  final String verificationStatus; // VERIFIED, PENDING

  const Theatre({
    required this.id,
    required this.partnerBusinessId,
    required this.name,
    required this.address,
    required this.city,
    required this.state,
    required this.phone,
    this.status = 'ACTIVE',
    required this.totalScreens,
    required this.totalCapacity,
    this.verificationStatus = 'VERIFIED',
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'partnerBusinessId': partnerBusinessId,
        'name': name,
        'address': address,
        'city': city,
        'state': state,
        'phone': phone,
        'status': status,
        'totalScreens': totalScreens,
        'totalCapacity': totalCapacity,
        'verificationStatus': verificationStatus,
      };

  factory Theatre.fromJson(Map<String, dynamic> json) => Theatre(
        id: json['id'] ?? '',
        partnerBusinessId: json['partnerBusinessId'] ?? '',
        name: json['name'] ?? '',
        address: json['address'] ?? '',
        city: json['city'] ?? '',
        state: json['state'] ?? '',
        phone: json['phone'] ?? '',
        status: json['status'] ?? 'ACTIVE',
        totalScreens: json['totalScreens'] ?? 0,
        totalCapacity: json['totalCapacity'] ?? 0,
        verificationStatus: json['verificationStatus'] ?? 'VERIFIED',
      );
}

