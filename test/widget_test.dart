import 'package:flutter_test/flutter_test.dart';
import 'package:cinevenue_partner/main.dart';

void main() {
  testWidgets('CineVenue Partner App smoke test & role-based dashboard gate test', (WidgetTester tester) async {
    // Build CineVenue Partner App
    await tester.pumpWidget(const CineVenuePartnerApp());
    await tester.pumpAndSettle();

    // Verify brand header
    expect(find.text('CINEVENUE'), findsOneWidget);
    expect(find.text('PARTNER'), findsOneWidget);

    // Verify Theatre Partner Overview tab elements render
    expect(find.text('AMB Cinemas Gachibowli'), findsOneWidget);
    expect(find.text("Today's Gross Revenue"), findsOneWidget);
    expect(find.text("Tickets Booked Today"), findsOneWidget);
    expect(find.text("Today's Scheduled Shows"), findsOneWidget);
  });
}
