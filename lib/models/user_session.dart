enum UserRole {
  owner,
  manager,
  employee,
  admin,
  founder,
}

enum SessionType {
  partner,
  employee,
  admin,
  founder,
  registration,
}

class UserSession {
  final String id;
  final String name;
  final String email;
  final String mobile;
  final UserRole role;
  final SessionType type;
  final String? partnerBusinessId;
  final String? assignedLocationId;
  final List<String> permissions;

  const UserSession({
    required this.id,
    required this.name,
    required this.email,
    required this.mobile,
    required this.role,
    required this.type,
    this.partnerBusinessId,
    this.assignedLocationId,
    this.permissions = const [],
  });

  bool get isOwner => role == UserRole.owner;
  bool get isManager => role == UserRole.manager;
  bool get isEmployee => role == UserRole.employee;
  bool get isAdmin => role == UserRole.admin;
  bool get isFounder => role == UserRole.founder || (role == UserRole.admin && permissions.contains('FOUNDER_FULL_ACCESS'));

  bool hasPermission(String permission) {
    if (isOwner || isAdmin) return true;
    return permissions.contains(permission);
  }

  // Strict operational restrictions
  bool get canViewRevenue => hasPermission('REVENUE_VIEW') && !isEmployee;
  bool get canManageBank => hasPermission('BANK_SETTINGS') && isOwner;
  bool get canManageEmployees => hasPermission('EMPLOYEE_ADMIN') && (isOwner || isManager);
  bool get canDoPosBooking => hasPermission('POS_BOOKING');
  bool get canScanTickets => hasPermission('QR_SCANNING');
  bool get canViewShows => hasPermission('SHOW_TIMINGS');
  bool get canViewScreens => hasPermission('VIEW_SCREENS');

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'mobile': mobile,
        'role': role.name,
        'type': type.name,
        'partnerBusinessId': partnerBusinessId,
        'assignedLocationId': assignedLocationId,
        'permissions': permissions,
      };

  factory UserSession.fromJson(Map<String, dynamic> json) {
    return UserSession(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      mobile: json['mobile'] ?? '',
      role: UserRole.values.firstWhere(
        (e) => e.name == json['role'],
        orElse: () => UserRole.owner,
      ),
      type: SessionType.values.firstWhere(
        (e) => e.name == json['type'],
        orElse: () => SessionType.partner,
      ),
      partnerBusinessId: json['partnerBusinessId'],
      assignedLocationId: json['assignedLocationId'],
      permissions: List<String>.from(json['permissions'] ?? []),
    );
  }

  UserSession copyWith({
    String? id,
    String? name,
    String? email,
    String? mobile,
    UserRole? role,
    SessionType? type,
    String? partnerBusinessId,
    String? assignedLocationId,
    List<String>? permissions,
  }) {
    return UserSession(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      mobile: mobile ?? this.mobile,
      role: role ?? this.role,
      type: type ?? this.type,
      partnerBusinessId: partnerBusinessId ?? this.partnerBusinessId,
      assignedLocationId: assignedLocationId ?? this.assignedLocationId,
      permissions: permissions ?? this.permissions,
    );
  }
}

