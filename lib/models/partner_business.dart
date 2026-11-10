import 'partner_category.dart';
import 'partner_status.dart';

class PartnerDocument {
  final String id;
  final String name;
  final String type; // GST, PAN, BANK_CHEQUE, TRADE_LICENSE, VENUE_PERMIT
  final String fileUrl;
  final String uploadedAt;
  final String status; // VERIFIED, PENDING, REJECTED

  const PartnerDocument({
    required this.id,
    required this.name,
    required this.type,
    required this.fileUrl,
    required this.uploadedAt,
    this.status = 'PENDING',
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'type': type,
        'fileUrl': fileUrl,
        'uploadedAt': uploadedAt,
        'status': status,
      };

  factory PartnerDocument.fromJson(Map<String, dynamic> json) => PartnerDocument(
        id: json['id'] ?? '',
        name: json['name'] ?? '',
        type: json['type'] ?? '',
        fileUrl: json['fileUrl'] ?? '',
        uploadedAt: json['uploadedAt'] ?? '',
        status: json['status'] ?? 'PENDING',
      );
}

class BankDetails {
  final String accountHolderName;
  final String bankName;
  final String accountNumber;
  final String ifscCode;
  final String branchName;

  const BankDetails({
    required this.accountHolderName,
    required this.bankName,
    required this.accountNumber,
    required this.ifscCode,
    required this.branchName,
  });

  String get maskedAccount {
    if (accountNumber.length <= 4) return accountNumber;
    return '••••••••${accountNumber.substring(accountNumber.length - 4)}';
  }

  Map<String, dynamic> toJson() => {
        'accountHolderName': accountHolderName,
        'bankName': bankName,
        'accountNumber': accountNumber,
        'ifscCode': ifscCode,
        'branchName': branchName,
      };

  factory BankDetails.fromJson(Map<String, dynamic> json) => BankDetails(
        accountHolderName: json['accountHolderName'] ?? '',
        bankName: json['bankName'] ?? '',
        accountNumber: json['accountNumber'] ?? '',
        ifscCode: json['ifscCode'] ?? '',
        branchName: json['branchName'] ?? '',
      );
}

class PartnerBusiness {
  final String id;
  final String businessName;
  final String ownerName;
  final PartnerCategory category;
  final PartnerStatus status;
  final String? rejectionReason;
  final String? moreInfoRequiredText;
  final String mobile;
  final String email;
  final String businessAddress;
  final String city;
  final String state;
  final String pinCode;
  final String? gstNumber;
  final String? panNumber;
  final BankDetails bankDetails;
  final List<PartnerDocument> documents;
  final String appliedAt;
  final String? approvedAt;
  final String? activeLocationId;

  const PartnerBusiness({
    required this.id,
    required this.businessName,
    required this.ownerName,
    required this.category,
    required this.status,
    this.rejectionReason,
    this.moreInfoRequiredText,
    required this.mobile,
    required this.email,
    required this.businessAddress,
    required this.city,
    required this.state,
    required this.pinCode,
    this.gstNumber,
    this.panNumber,
    required this.bankDetails,
    required this.documents,
    required this.appliedAt,
    this.approvedAt,
    this.activeLocationId,
  });

  bool get isApproved => status == PartnerStatus.approved;
  bool get isPending => status == PartnerStatus.pending;
  bool get isUnderReview => status == PartnerStatus.underReview;
  bool get isMoreInfoRequired => status == PartnerStatus.moreInfoRequired;
  bool get isRejected => status == PartnerStatus.rejected;
  bool get isSuspended => status == PartnerStatus.suspended;

  Map<String, dynamic> toJson() => {
        'id': id,
        'businessName': businessName,
        'ownerName': ownerName,
        'category': category.code,
        'status': status.code,
        'rejectionReason': rejectionReason,
        'moreInfoRequiredText': moreInfoRequiredText,
        'mobile': mobile,
        'email': email,
        'businessAddress': businessAddress,
        'city': city,
        'state': state,
        'pinCode': pinCode,
        'gstNumber': gstNumber,
        'panNumber': panNumber,
        'bankDetails': bankDetails.toJson(),
        'documents': documents.map((d) => d.toJson()).toList(),
        'appliedAt': appliedAt,
        'approvedAt': approvedAt,
        'activeLocationId': activeLocationId,
      };

  factory PartnerBusiness.fromJson(Map<String, dynamic> json) => PartnerBusiness(
        id: json['id'] ?? '',
        businessName: json['businessName'] ?? '',
        ownerName: json['ownerName'] ?? '',
        category: PartnerCategoryExtension.fromCode(json['category']),
        status: PartnerStatusExtension.fromCode(json['status']),
        rejectionReason: json['rejectionReason'],
        moreInfoRequiredText: json['moreInfoRequiredText'],
        mobile: json['mobile'] ?? '',
        email: json['email'] ?? '',
        businessAddress: json['businessAddress'] ?? '',
        city: json['city'] ?? '',
        state: json['state'] ?? '',
        pinCode: json['pinCode'] ?? '',
        gstNumber: json['gstNumber'],
        panNumber: json['panNumber'],
        bankDetails: BankDetails.fromJson(json['bankDetails'] ?? {}),
        documents: (json['documents'] as List? ?? [])
            .map((d) => PartnerDocument.fromJson(d))
            .toList(),
        appliedAt: json['appliedAt'] ?? '',
        approvedAt: json['approvedAt'],
        activeLocationId: json['activeLocationId'],
      );

  PartnerBusiness copyWith({
    String? id,
    String? businessName,
    String? ownerName,
    PartnerCategory? category,
    PartnerStatus? status,
    String? rejectionReason,
    String? moreInfoRequiredText,
    String? mobile,
    String? email,
    String? businessAddress,
    String? city,
    String? state,
    String? pinCode,
    String? gstNumber,
    String? panNumber,
    BankDetails? bankDetails,
    List<PartnerDocument>? documents,
    String? appliedAt,
    String? approvedAt,
    String? activeLocationId,
  }) {
    return PartnerBusiness(
      id: id ?? this.id,
      businessName: businessName ?? this.businessName,
      ownerName: ownerName ?? this.ownerName,
      category: category ?? this.category,
      status: status ?? this.status,
      rejectionReason: rejectionReason ?? this.rejectionReason,
      moreInfoRequiredText: moreInfoRequiredText ?? this.moreInfoRequiredText,
      mobile: mobile ?? this.mobile,
      email: email ?? this.email,
      businessAddress: businessAddress ?? this.businessAddress,
      city: city ?? this.city,
      state: state ?? this.state,
      pinCode: pinCode ?? this.pinCode,
      gstNumber: gstNumber ?? this.gstNumber,
      panNumber: panNumber ?? this.panNumber,
      bankDetails: bankDetails ?? this.bankDetails,
      documents: documents ?? this.documents,
      appliedAt: appliedAt ?? this.appliedAt,
      approvedAt: approvedAt ?? this.approvedAt,
      activeLocationId: activeLocationId ?? this.activeLocationId,
    );
  }
}
