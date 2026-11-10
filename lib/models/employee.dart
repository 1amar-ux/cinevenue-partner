class EmployeePermissionDef {
  final String key;
  final String label;
  final String description;
  final bool isRestrictedFromRegularStaff;

  const EmployeePermissionDef({
    required this.key,
    required this.label,
    required this.description,
    this.isRestrictedFromRegularStaff = false,
  });
}

class AvailablePermissions {
  static const String qrScanning = 'QR_SCANNING';
  static const String ticketVerification = 'TICKET_VERIFICATION';
  static const String posBooking = 'POS_BOOKING';
  static const String showTimings = 'SHOW_TIMINGS';
  static const String viewScreens = 'VIEW_SCREENS';
  static const String customerAssist = 'CUSTOMER_ASSIST';
  static const String revenueView = 'REVENUE_VIEW';
  static const String employeeAdmin = 'EMPLOYEE_ADMIN';
  static const String bankSettings = 'BANK_SETTINGS';
  static const String businessSettings = 'BUSINESS_SETTINGS';

  static const List<EmployeePermissionDef> all = [
    EmployeePermissionDef(
      key: qrScanning,
      label: 'QR Ticket Scanning',
      description: 'Scan digital and printed ticket QR codes at gate entrance.',
    ),
    EmployeePermissionDef(
      key: ticketVerification,
      label: 'Ticket Verification',
      description: 'Look up booking codes and verify seat allocation manually.',
    ),
    EmployeePermissionDef(
      key: posBooking,
      label: 'POS Counter Booking',
      description: 'Issue tickets at box-office counter and take payments.',
    ),
    EmployeePermissionDef(
      key: showTimings,
      label: 'Check Show Timings',
      description: 'View current and upcoming scheduled movie shows.',
    ),
    EmployeePermissionDef(
      key: viewScreens,
      label: 'View Assigned Screens',
      description: 'Inspect live seating occupancies and screen formats.',
    ),
    EmployeePermissionDef(
      key: customerAssist,
      label: 'Customer Assistance',
      description: 'Help customers with seat location and lost tickets.',
    ),
    // Restricted sensitive permissions (Owner only / high tier manager)
    EmployeePermissionDef(
      key: revenueView,
      label: 'Financial & Revenue Reports',
      description: 'Access daily settlement sheets and financial summaries.',
      isRestrictedFromRegularStaff: true,
    ),
    EmployeePermissionDef(
      key: employeeAdmin,
      label: 'Employee Management',
      description: 'Invite new staff and manage operational permissions.',
      isRestrictedFromRegularStaff: true,
    ),
    EmployeePermissionDef(
      key: bankSettings,
      label: 'Bank & Settlement Settings',
      description: 'View or modify bank accounts and payout destinations.',
      isRestrictedFromRegularStaff: true,
    ),
    EmployeePermissionDef(
      key: businessSettings,
      label: 'Business Ownership Settings',
      description: 'Manage legal entities, tax details, and contracts.',
      isRestrictedFromRegularStaff: true,
    ),
  ];

  static const List<String> defaultEmployeePermissions = [
    qrScanning,
    ticketVerification,
    posBooking,
    showTimings,
    viewScreens,
    customerAssist,
  ];
}

class Employee {
  final String id;
  final String businessId;
  final String locationId;
  final String locationName;
  final String name;
  final String mobile;
  final String designation; // "Gate Usher", "Box Office Clerk", "Screen Supervisor"
  final String role; // OWNER, MANAGER, EMPLOYEE
  List<String> permissions;
  bool isActive;
  final String invitedAt;
  final String? lastLoginAt;

  Employee({
    required this.id,
    required this.businessId,
    required this.locationId,
    required this.locationName,
    required this.name,
    required this.mobile,
    required this.designation,
    required this.role,
    required this.permissions,
    this.isActive = true,
    required this.invitedAt,
    this.lastLoginAt,
  });

  bool hasPermission(String perm) => permissions.contains(perm);

  Map<String, dynamic> toJson() => {
        'id': id,
        'businessId': businessId,
        'locationId': locationId,
        'locationName': locationName,
        'name': name,
        'mobile': mobile,
        'designation': designation,
        'role': role,
        'permissions': permissions,
        'isActive': isActive,
        'invitedAt': invitedAt,
        'lastLoginAt': lastLoginAt,
      };

  factory Employee.fromJson(Map<String, dynamic> json) => Employee(
        id: json['id'] ?? '',
        businessId: json['businessId'] ?? '',
        locationId: json['locationId'] ?? '',
        locationName: json['locationName'] ?? '',
        name: json['name'] ?? '',
        mobile: json['mobile'] ?? '',
        designation: json['designation'] ?? 'Theatre Staff',
        role: json['role'] ?? 'EMPLOYEE',
        permissions: List<String>.from(json['permissions'] ?? []),
        isActive: json['isActive'] ?? true,
        invitedAt: json['invitedAt'] ?? '',
        lastLoginAt: json['lastLoginAt'],
      );
}

