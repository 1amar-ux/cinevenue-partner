class SettlementRecord {
  final String id;
  final String businessId;
  final String cycle; // e.g. "01 Nov - 07 Nov 2026"
  final double grossRevenue;
  final double platformFee;
  final double gstDeduction;
  final double netPayout;
  final String status; // PENDING, PROCESSING, SETTLED, ON_HOLD
  final String bankRef;
  final String settledAt;

  const SettlementRecord({
    required this.id,
    required this.businessId,
    required this.cycle,
    required this.grossRevenue,
    required this.platformFee,
    required this.gstDeduction,
    required this.netPayout,
    required this.status,
    required this.bankRef,
    required this.settledAt,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'businessId': businessId,
        'cycle': cycle,
        'grossRevenue': grossRevenue,
        'platformFee': platformFee,
        'gstDeduction': gstDeduction,
        'netPayout': netPayout,
        'status': status,
        'bankRef': bankRef,
        'settledAt': settledAt,
      };

  factory SettlementRecord.fromJson(Map<String, dynamic> json) => SettlementRecord(
        id: json['id'] ?? '',
        businessId: json['businessId'] ?? '',
        cycle: json['cycle'] ?? '',
        grossRevenue: (json['grossRevenue'] as num?)?.toDouble() ?? 0.0,
        platformFee: (json['platformFee'] as num?)?.toDouble() ?? 0.0,
        gstDeduction: (json['gstDeduction'] as num?)?.toDouble() ?? 0.0,
        netPayout: (json['netPayout'] as num?)?.toDouble() ?? 0.0,
        status: json['status'] ?? 'PENDING',
        bankRef: json['bankRef'] ?? '',
        settledAt: json['settledAt'] ?? '',
      );
}

