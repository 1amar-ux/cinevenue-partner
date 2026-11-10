import 'package:flutter/material.dart';
import '../models/user_session.dart';
import '../models/partner_business.dart';
import '../services/partner_repository.dart';
import '../core/theme/app_theme.dart';

class AuthProvider extends ChangeNotifier {
  final PartnerRepository _repo = PartnerRepository();

  UserSession? _currentSession;
  PartnerBusiness? _currentPartner;
  bool _isLoading = false;
  String? _errorMessage;

  AuthProvider() {
    _initDefaultSession();
  }

  UserSession? get currentSession => _currentSession;
  PartnerBusiness? get currentPartner => _currentPartner;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _currentSession != null;

  void _initDefaultSession() {
    // Default to the flagship Approved Theatre Partner for seamless initial experience
    final partner = _repo.getPartnerById('biz_theatre_001');
    if (partner != null) {
      _currentPartner = partner;
      _currentSession = UserSession(
        id: 'usr_owner_001',
        name: partner.ownerName,
        email: partner.email,
        mobile: partner.mobile,
        role: UserRole.owner,
        type: SessionType.partner,
        partnerBusinessId: partner.id,
        assignedLocationId: partner.activeLocationId,
        permissions: const [
          'QR_SCANNING',
          'TICKET_VERIFICATION',
          'POS_BOOKING',
          'SHOW_TIMINGS',
          'VIEW_SCREENS',
          'CUSTOMER_ASSIST',
          'REVENUE_VIEW',
          'EMPLOYEE_ADMIN',
          'BANK_SETTINGS',
          'BUSINESS_SETTINGS',
        ],
      );
    }
  }

  void loginAs({
    required String partnerId,
    required UserRole role,
    required SessionType type,
    String? employeeId,
    List<String>? permissions,
    String? assignedLocationId,
  }) {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    final partner = _repo.getPartnerById(partnerId);
    _currentPartner = partner;

    if (type == SessionType.founder || type == SessionType.admin) {
      _currentPartner = null;
      _currentSession = const UserSession(
        id: 'usr_founder_001',
        name: 'Amarnath Gattem (Founder)',
        email: 'amarnathgattem@gmail.com',
        mobile: '+91 99000 00001',
        role: UserRole.founder,
        type: SessionType.founder,
        permissions: ['FOUNDER_FULL_ACCESS', '*'],
      );
    } else if (type == SessionType.registration) {
      _currentPartner = null;
      _currentSession = const UserSession(
        id: 'usr_reg_new',
        name: 'Prospective Partner',
        email: 'applicant@gmail.com',
        mobile: '+91 98765 00000',
        role: UserRole.owner,
        type: SessionType.registration,
      );
    } else if (role == UserRole.employee) {
      final emp = employeeId != null
          ? _repo
                .getEmployeesByBusiness(partnerId)
                .firstWhere(
                  (e) => e.id == employeeId,
                  orElse: () => _repo.getEmployeesByBusiness(partnerId).first,
                )
          : _repo.getEmployeesByBusiness(partnerId).first;

      _currentSession = UserSession(
        id: emp.id,
        name: emp.name,
        email:
            '${emp.name.toLowerCase().replaceAll(' ', '.')}@theatre.cinevenue.com',
        mobile: emp.mobile,
        role: UserRole.employee,
        type: SessionType.employee,
        partnerBusinessId: partnerId,
        assignedLocationId: emp.locationId,
        permissions: emp.permissions,
      );
    } else if (role == UserRole.manager) {
      final manager = _repo
          .getEmployeesByBusiness(partnerId)
          .firstWhere(
            (e) => e.role == 'MANAGER',
            orElse: () => _repo.getEmployeesByBusiness(partnerId).first,
          );

      _currentSession = UserSession(
        id: manager.id,
        name: manager.name,
        email:
            '${manager.name.toLowerCase().replaceAll(' ', '.')}@amb.cinevenue.com',
        mobile: manager.mobile,
        role: UserRole.manager,
        type: SessionType.employee,
        partnerBusinessId: partnerId,
        assignedLocationId: manager.locationId,
        permissions: manager.permissions,
      );
    } else {
      // Owner
      if (partner != null) {
        _currentSession = UserSession(
          id: 'usr_${partner.id}',
          name: partner.ownerName,
          email: partner.email,
          mobile: partner.mobile,
          role: UserRole.owner,
          type: SessionType.partner,
          partnerBusinessId: partner.id,
          assignedLocationId: partner.activeLocationId,
          permissions: const [
            'QR_SCANNING',
            'TICKET_VERIFICATION',
            'POS_BOOKING',
            'SHOW_TIMINGS',
            'VIEW_SCREENS',
            'CUSTOMER_ASSIST',
            'REVENUE_VIEW',
            'EMPLOYEE_ADMIN',
            'BANK_SETTINGS',
            'BUSINESS_SETTINGS',
          ],
        );
      }
    }

    _isLoading = false;
    notifyListeners();
  }

  void logout() {
    _currentSession = null;
    _currentPartner = null;
    notifyListeners();
  }

  void refreshPartnerData() {
    if (_currentPartner != null) {
      _currentPartner = _repo.getPartnerById(_currentPartner!.id);
      notifyListeners();
    }
  }

  void showRoleSwitcherDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppTheme.surfaceBorder),
        ),
        title: const Row(
          children: [
            Icon(Icons.supervised_user_circle_rounded, color: AppTheme.gold),
            SizedBox(width: 10),
            Text(
              'Switch Account / Role',
              style: TextStyle(
                color: AppTheme.textPrimary,
                fontSize: 17,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        content: SizedBox(
          width: 480,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Select any role below to test the strict role-based dashboard filtering:',
                  style: TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                ),
                const SizedBox(height: 16),
                _buildRoleOption(
                  ctx,
                  title: 'Theatre Partner (Owner)',
                  subtitle: 'AMB Cinemas Gachibowli • Full Owner Dashboard',
                  badge: 'APPROVED',
                  badgeColor: AppTheme.statusApproved,
                  onSelect: () => loginAs(
                    partnerId: 'biz_theatre_001',
                    role: UserRole.owner,
                    type: SessionType.partner,
                  ),
                ),
                _buildRoleOption(
                  ctx,
                  title: 'Theatre Staff (Gate Scanner)',
                  subtitle: 'Ramesh Babu • Restricted Scanner UI Only',
                  badge: 'EMPLOYEE',
                  badgeColor: Colors.teal,
                  onSelect: () => loginAs(
                    partnerId: 'biz_theatre_001',
                    role: UserRole.employee,
                    type: SessionType.employee,
                    employeeId: 'emp_002',
                  ),
                ),
                _buildRoleOption(
                  ctx,
                  title: 'Theatre Cashier (POS Desk)',
                  subtitle: 'Sneha Reddy • Counter Ticketing Only',
                  badge: 'EMPLOYEE',
                  badgeColor: Colors.teal,
                  onSelect: () => loginAs(
                    partnerId: 'biz_theatre_001',
                    role: UserRole.employee,
                    type: SessionType.employee,
                    employeeId: 'emp_003',
                  ),
                ),
                _buildRoleOption(
                  ctx,
                  title: 'Theatre Operations Manager',
                  subtitle: 'Kiran Varma • Operational Management',
                  badge: 'MANAGER',
                  badgeColor: Colors.blue,
                  onSelect: () => loginAs(
                    partnerId: 'biz_theatre_001',
                    role: UserRole.manager,
                    type: SessionType.employee,
                  ),
                ),
                const Divider(),
                _buildRoleOption(
                  ctx,
                  title: 'Event Organizer Partner',
                  subtitle: 'Sunburn Arena Entertainment • Event Dashboard',
                  badge: 'APPROVED',
                  badgeColor: AppTheme.statusApproved,
                  onSelect: () => loginAs(
                    partnerId: 'biz_event_002',
                    role: UserRole.owner,
                    type: SessionType.partner,
                  ),
                ),
                _buildRoleOption(
                  ctx,
                  title: 'Production House Partner',
                  subtitle: 'Mythri Cinematic Creators • Film Production',
                  badge: 'APPROVED',
                  badgeColor: AppTheme.statusApproved,
                  onSelect: () => loginAs(
                    partnerId: 'biz_production_007',
                    role: UserRole.owner,
                    type: SessionType.partner,
                  ),
                ),
                _buildRoleOption(
                  ctx,
                  title: 'Event Management Company',
                  subtitle: 'Showtime Global • Stage & Logistics',
                  badge: 'APPROVED',
                  badgeColor: AppTheme.statusApproved,
                  onSelect: () => loginAs(
                    partnerId: 'biz_eventmgmt_008',
                    role: UserRole.owner,
                    type: SessionType.partner,
                  ),
                ),
                const Divider(),
                _buildRoleOption(
                  ctx,
                  title: 'Pending Applicant',
                  subtitle: 'Royal Cinema Paradiso • Verification In Progress',
                  badge: 'PENDING',
                  badgeColor: AppTheme.statusPending,
                  onSelect: () => loginAs(
                    partnerId: 'biz_pending_003',
                    role: UserRole.owner,
                    type: SessionType.partner,
                  ),
                ),
                _buildRoleOption(
                  ctx,
                  title: 'More Info Required Partner',
                  subtitle: 'Hyderabad Grand Arena • Re-upload Action Needed',
                  badge: 'ACTION REQ',
                  badgeColor: AppTheme.statusMoreInfo,
                  onSelect: () => loginAs(
                    partnerId: 'biz_moreinfo_004',
                    role: UserRole.owner,
                    type: SessionType.partner,
                  ),
                ),
                _buildRoleOption(
                  ctx,
                  title: 'Rejected Applicant',
                  subtitle: 'South Cineplex Studios • Shows Reason & Resubmit',
                  badge: 'REJECTED',
                  badgeColor: AppTheme.statusRejected,
                  onSelect: () => loginAs(
                    partnerId: 'biz_rejected_005',
                    role: UserRole.owner,
                    type: SessionType.partner,
                  ),
                ),
                _buildRoleOption(
                  ctx,
                  title: 'Suspended Account',
                  subtitle: 'Galaxy Multiplex • Operations Blocked by Admin',
                  badge: 'SUSPENDED',
                  badgeColor: AppTheme.statusSuspended,
                  onSelect: () => loginAs(
                    partnerId: 'biz_suspended_006',
                    role: UserRole.owner,
                    type: SessionType.partner,
                  ),
                ),
                const Divider(),
                _buildRoleOption(
                  ctx,
                  title: 'CineVenue Founder Admin (/authpanel)',
                  subtitle:
                      'Exact Canonical Admin Deck • https://cinevenue.com/authpanel',
                  badge: 'FOUNDER ONLY',
                  badgeColor: AppTheme.gold,
                  onSelect: () => loginAs(
                    partnerId: '',
                    role: UserRole.founder,
                    type: SessionType.founder,
                  ),
                ),
                _buildRoleOption(
                  ctx,
                  title: 'New Partner Registration',
                  subtitle: 'Test 5-category onboarding wizard from scratch',
                  badge: 'WIZARD',
                  badgeColor: Colors.amber,
                  onSelect: () => loginAs(
                    partnerId: '',
                    role: UserRole.owner,
                    type: SessionType.registration,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRoleOption(
    BuildContext context, {
    required String title,
    required String subtitle,
    required String badge,
    required Color badgeColor,
    required VoidCallback onSelect,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: AppTheme.surfaceElevated,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFF27272A)),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
        title: Row(
          children: [
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: badgeColor.withOpacity(0.15),
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: badgeColor.withOpacity(0.5)),
              ),
              child: Text(
                badge,
                style: TextStyle(
                  color: badgeColor,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
        subtitle: Text(
          subtitle,
          style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
        ),
        trailing: const Icon(
          Icons.arrow_forward_ios,
          size: 14,
          color: AppTheme.gold,
        ),
        onTap: () {
          onSelect();
          Navigator.pop(context);
        },
      ),
    );
  }
}
