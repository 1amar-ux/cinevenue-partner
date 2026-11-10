import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:cinevenue_partner/providers/auth_provider.dart';
import 'package:cinevenue_partner/providers/theatre_provider.dart';
import 'package:cinevenue_partner/providers/employee_provider.dart';
import 'package:cinevenue_partner/providers/event_provider.dart';
import 'package:cinevenue_partner/providers/admin_provider.dart';
import 'package:cinevenue_partner/models/user_session.dart';
import 'package:cinevenue_partner/models/seat.dart';
import 'package:cinevenue_partner/models/booking.dart';
import 'package:cinevenue_partner/screens/partner_master_gate.dart';
import 'package:cinevenue_partner/screens/dashboards/theatre/theatre_dashboard_screen.dart';
import 'package:cinevenue_partner/screens/dashboards/event_organizer/event_organizer_dashboard_screen.dart';
import 'package:cinevenue_partner/screens/dashboards/production_house/production_house_dashboard_screen.dart';
import 'package:cinevenue_partner/screens/dashboards/employee_portal/employee_portal_screen.dart';
import 'package:cinevenue_partner/screens/admin/partner_admin_screen.dart';
import 'package:cinevenue_partner/screens/admin/founder_authpanel_webview_screen.dart';
import 'package:cinevenue_partner/screens/status/application_tracking_screen.dart';
import 'package:cinevenue_partner/screens/status/suspended_screen.dart';
import 'package:cinevenue_partner/screens/status/rejected_screen.dart';
import 'package:flutter/material.dart';

Widget createTestableWidget({required AuthProvider authProvider}) {
  return MultiProvider(
    providers: [
      ChangeNotifierProvider<AuthProvider>.value(value: authProvider),
      ChangeNotifierProvider(create: (_) => TheatreProvider()),
      ChangeNotifierProvider(create: (_) => EmployeeProvider()),
      ChangeNotifierProvider(create: (_) => EventProvider()),
      ChangeNotifierProvider(create: (_) => AdminProvider()),
    ],
    child: const MaterialApp(
      home: PartnerMasterGate(),
    ),
  );
}

void main() {
  group('CineVenue Partner RBAC & Strict Dashboard Isolation Tests', () {
    testWidgets('1. Approved Theatre Partner sees ONLY Theatre Dashboard', (tester) async {
      tester.view.physicalSize = const Size(1280, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final auth = AuthProvider();
      auth.loginAs(
        partnerId: 'biz_theatre_001',
        role: UserRole.owner,
        type: SessionType.partner,
      );

      await tester.pumpWidget(createTestableWidget(authProvider: auth));
      await tester.pumpAndSettle();

      expect(find.byType(TheatreDashboardScreen), findsOneWidget);
      expect(find.byType(EventOrganizerDashboardScreen), findsNothing);
      expect(find.byType(ProductionHouseDashboardScreen), findsNothing);
      expect(find.byType(EmployeePortalScreen), findsNothing);
      expect(find.byType(PartnerAdminScreen), findsNothing);
    });

    testWidgets('2. Approved Event Organizer sees ONLY Event Organizer Dashboard', (tester) async {
      tester.view.physicalSize = const Size(1280, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final auth = AuthProvider();
      auth.loginAs(
        partnerId: 'biz_event_002',
        role: UserRole.owner,
        type: SessionType.partner,
      );

      await tester.pumpWidget(createTestableWidget(authProvider: auth));
      await tester.pumpAndSettle();

      expect(find.byType(EventOrganizerDashboardScreen), findsOneWidget);
      expect(find.byType(TheatreDashboardScreen), findsNothing);
      expect(find.byType(ProductionHouseDashboardScreen), findsNothing);
      expect(find.byType(EmployeePortalScreen), findsNothing);
    });

    testWidgets('3. Approved Production House sees ONLY Production House Dashboard', (tester) async {
      tester.view.physicalSize = const Size(1280, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final auth = AuthProvider();
      auth.loginAs(
        partnerId: 'biz_production_007',
        role: UserRole.owner,
        type: SessionType.partner,
      );

      await tester.pumpWidget(createTestableWidget(authProvider: auth));
      await tester.pumpAndSettle();

      expect(find.byType(ProductionHouseDashboardScreen), findsOneWidget);
      expect(find.byType(TheatreDashboardScreen), findsNothing);
      expect(find.byType(EventOrganizerDashboardScreen), findsNothing);
      expect(find.byType(EmployeePortalScreen), findsNothing);
    });

    testWidgets('4. Employee logs in and sees ONLY Employee Portal (Zero Owner/Financial Access)', (tester) async {
      tester.view.physicalSize = const Size(1280, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final auth = AuthProvider();
      auth.loginAs(
        partnerId: 'biz_theatre_001',
        role: UserRole.employee,
        type: SessionType.employee,
        employeeId: 'emp_002',
      );

      await tester.pumpWidget(createTestableWidget(authProvider: auth));
      await tester.pumpAndSettle();

      expect(find.byType(EmployeePortalScreen), findsOneWidget);
      expect(find.byType(TheatreDashboardScreen), findsNothing);

      // Verify that owner sensitive screens are NOT accessible
      expect(find.text("Today's Gross Revenue"), findsNothing);
      expect(find.text("Settlements & Bank Payouts"), findsNothing);
      expect(find.text("Employee & Operational Staff"), findsNothing);
    });

    testWidgets('5. Pending Partner sees Application Tracking and cannot access dashboard', (tester) async {
      tester.view.physicalSize = const Size(1280, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final auth = AuthProvider();
      auth.loginAs(
        partnerId: 'biz_pending_003',
        role: UserRole.owner,
        type: SessionType.partner,
      );

      await tester.pumpWidget(createTestableWidget(authProvider: auth));
      await tester.pumpAndSettle();

      expect(find.byType(ApplicationTrackingScreen), findsOneWidget);
      expect(find.byType(TheatreDashboardScreen), findsNothing);
    });

    testWidgets('6. Suspended Partner is strictly blocked by Suspended Screen', (tester) async {
      tester.view.physicalSize = const Size(1280, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final auth = AuthProvider();
      auth.loginAs(
        partnerId: 'biz_suspended_006',
        role: UserRole.owner,
        type: SessionType.partner,
      );

      await tester.pumpWidget(createTestableWidget(authProvider: auth));
      await tester.pumpAndSettle();

      expect(find.byType(SuspendedScreen), findsOneWidget);
      expect(find.byType(TheatreDashboardScreen), findsNothing);
    });

    testWidgets('7. Rejected Partner sees Rejection Screen with reason and resubmit', (tester) async {
      tester.view.physicalSize = const Size(1280, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final auth = AuthProvider();
      auth.loginAs(
        partnerId: 'biz_rejected_005',
        role: UserRole.owner,
        type: SessionType.partner,
      );

      await tester.pumpWidget(createTestableWidget(authProvider: auth));
      await tester.pumpAndSettle();

      expect(find.byType(RejectedScreen), findsOneWidget);
      expect(find.byType(TheatreDashboardScreen), findsNothing);
    });

    testWidgets('8. Founder Admin Session loads Exact /authpanel WebView Screen', (tester) async {
      tester.view.physicalSize = const Size(1280, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final auth = AuthProvider();
      auth.loginAs(
        partnerId: '',
        role: UserRole.founder,
        type: SessionType.founder,
      );

      await tester.pumpWidget(createTestableWidget(authProvider: auth));
      await tester.pumpAndSettle();

      expect(find.byType(FounderAuthpanelWebviewScreen), findsOneWidget);
      expect(find.byType(TheatreDashboardScreen), findsNothing);
    });
  });

  group('Theatre Operations & POS State Tests', () {
    test('POS Booking marks seats as BOOKED and generates code', () {
      final theatreProv = TheatreProvider();
      theatreProv.loadTheatreData('biz_theatre_001');

      final seats = theatreProv.liveSeats;
      final availSeat = seats.firstWhere((s) => s.status == SeatBookingStatus.available);

      theatreProv.togglePosSeatSelection(availSeat);
      expect(theatreProv.posCartSeats.length, 1);
      expect(theatreProv.posCartTotal, availSeat.price);

      final booking = theatreProv.completePosBooking(
        customerName: 'Test Customer',
        customerPhone: '+91 98765 00000',
        paymentMode: PaymentMode.cash,
        employeeId: 'emp_003',
      );

      expect(booking, isNotNull);
      expect(booking!.seats.contains(availSeat.code), isTrue);
      expect(booking.customerName, 'Test Customer');
      expect(availSeat.status, SeatBookingStatus.booked);
    });
  });
}
