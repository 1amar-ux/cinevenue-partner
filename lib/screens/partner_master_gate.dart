import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../models/user_session.dart';
import '../models/partner_category.dart';
import '../models/partner_status.dart';
import '../core/widgets/brand_header.dart';
import '../core/theme/app_theme.dart';

// Screens
import 'registration/become_partner_screen.dart';
import 'status/application_tracking_screen.dart';
import 'status/more_info_required_screen.dart';
import 'status/rejected_screen.dart';
import 'status/suspended_screen.dart';
import 'dashboards/theatre/theatre_dashboard_screen.dart';
import 'dashboards/event_organizer/event_organizer_dashboard_screen.dart';
import 'dashboards/production_house/production_house_dashboard_screen.dart';
import 'dashboards/entertainment_partner/entertainment_partner_dashboard_screen.dart';
import 'dashboards/event_mgmt/event_mgmt_dashboard_screen.dart';
import 'dashboards/employee_portal/employee_portal_screen.dart';
import 'admin/founder_authpanel_webview_screen.dart';

class PartnerMasterGate extends StatelessWidget {
  const PartnerMasterGate({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final session = auth.currentSession;
    final partner = auth.currentPartner;

    Widget body;

    // 1. CineVenue Founder Admin Panel (/authpanel Integration)
    if (session?.type == SessionType.founder ||
        session?.type == SessionType.admin) {
      body = const FounderAuthpanelWebviewScreen();
    }
    // 2. New Partner Registration Wizard Flow
    else if (session?.type == SessionType.registration) {
      body = const BecomePartnerScreen();
    }
    // 3. Status Verification Gates (Pending, Under Review, More Info, Rejected, Suspended)
    else if (partner != null && partner.status != PartnerStatus.approved) {
      switch (partner.status) {
        case PartnerStatus.pending:
        case PartnerStatus.underReview:
          body = const ApplicationTrackingScreen();
          break;
        case PartnerStatus.moreInfoRequired:
          body = const MoreInfoRequiredScreen();
          break;
        case PartnerStatus.rejected:
          body = const RejectedScreen();
          break;
        case PartnerStatus.suspended:
          body = const SuspendedScreen();
          break;
        default:
          body = const ApplicationTrackingScreen();
      }
    }
    // 4. Employee Operational Account (Restricted to assigned staff tasks only)
    else if (session?.role == UserRole.employee) {
      body = const EmployeePortalScreen();
    }
    // 5. Approved Partner Category-Specific Dashboards (Strict RBAC Gating)
    else if (partner != null) {
      switch (partner.category) {
        case PartnerCategory.theatrePartner:
          body = const TheatreDashboardScreen();
          break;
        case PartnerCategory.eventOrganizer:
          body = const EventOrganizerDashboardScreen();
          break;
        case PartnerCategory.productionHouse:
          body = const ProductionHouseDashboardScreen();
          break;
        case PartnerCategory.entertainmentPartner:
          body = const EntertainmentDashboardScreen();
          break;
        case PartnerCategory.eventManagement:
          body = const EventMgmtDashboardScreen();
          break;
      }
    } else {
      body = const BecomePartnerScreen();
    }

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: const BrandHeader(),
      body: body,
    );
  }
}
