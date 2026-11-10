import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/auth_provider.dart';
import '../../../providers/theatre_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/gold_card.dart';
import '../../../models/employee.dart';
import '../theatre/tabs/pos_management_tab.dart';

class EmployeePortalScreen extends StatefulWidget {
  const EmployeePortalScreen({super.key});

  @override
  State<EmployeePortalScreen> createState() => _EmployeePortalScreenState();
}

class _EmployeePortalScreenState extends State<EmployeePortalScreen> {
  int _currentTabIndex = 0;

  // Scanner Simulator State
  final _bookingCodeCtrl = TextEditingController(text: 'CV-AMB-89421');
  Map<String, dynamic>? _scanResult;
  bool _isScanning = false;

  @override
  void dispose() {
    _bookingCodeCtrl.dispose();
    super.dispose();
  }

  void _simulateScan() {
    setState(() {
      _isScanning = true;
      _scanResult = null;
    });

    Future.delayed(const Duration(milliseconds: 600), () {
      final code = _bookingCodeCtrl.text.trim();
      final theatreProv = context.read<TheatreProvider>();
      final booking = theatreProv.bookings.firstWhere(
        (b) => b.bookingCode.toUpperCase() == code.toUpperCase(),
        orElse: () => theatreProv.bookings.first,
      );

      setState(() {
        _isScanning = false;
        _scanResult = {
          'isValid': true,
          'bookingCode': booking.bookingCode,
          'movie': booking.movieTitle,
          'theatre': booking.theatreName,
          'screen': booking.screenName,
          'seats': booking.seats.join(', '),
          'customer': booking.customerName,
          'time': booking.showTime,
          'status': 'VERIFIED & ADMITTED',
        };
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final session = auth.currentSession;
    final theatreProv = context.watch<TheatreProvider>();

    if (session == null) return const SizedBox.shrink();

    // Generate authorized operational tabs based on permissions
    final List<Map<String, dynamic>> tabs = [];

    if (session.hasPermission(AvailablePermissions.qrScanning)) {
      tabs.add({
        'title': 'QR Scanner',
        'icon': Icons.qr_code_scanner_rounded,
        'widget': _buildScannerTab(),
      });
    }

    if (session.hasPermission(AvailablePermissions.ticketVerification)) {
      tabs.add({
        'title': 'Verify Ticket',
        'icon': Icons.verified_user_outlined,
        'widget': _buildVerificationTab(theatreProv),
      });
    }

    if (session.hasPermission(AvailablePermissions.showTimings)) {
      tabs.add({
        'title': 'Show Timings',
        'icon': Icons.schedule_rounded,
        'widget': _buildShowTimingsTab(theatreProv),
      });
    }

    if (session.hasPermission(AvailablePermissions.posBooking)) {
      tabs.add({
        'title': 'POS Counter',
        'icon': Icons.point_of_sale_rounded,
        'widget': const POSManagementTab(),
      });
    }

    if (session.hasPermission(AvailablePermissions.customerAssist)) {
      tabs.add({
        'title': 'Assistance',
        'icon': Icons.live_help_outlined,
        'widget': _buildCustomerAssistTab(),
      });
    }

    if (tabs.isEmpty) {
      return const Center(
        child: Text(
          'No operational permissions assigned. Contact your theatre manager.',
          style: TextStyle(color: AppTheme.textMuted),
        ),
      );
    }

    final safeIndex = _currentTabIndex < tabs.length ? _currentTabIndex : 0;

    return Column(
      children: [
        // Employee Session Info Banner
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: const BoxDecoration(
            color: Color(0xFF131A1E),
            border: Border(bottom: BorderSide(color: Color(0xFF22353E))),
          ),
          child: Row(
            children: [
              const Icon(Icons.badge_outlined, size: 18, color: Colors.tealAccent),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Staff: ${session.name} • Assigned: ${theatreProv.selectedTheatre?.name ?? 'Assigned Location'}',
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Colors.tealAccent,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.teal.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Text(
                  'OPERATIONAL MODE',
                  style: TextStyle(
                    color: Colors.tealAccent,
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
            ],
          ),
        ),

        // Navigation Bar for Operational Functions
        Container(
          color: AppTheme.surface,
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Row(
              children: List.generate(tabs.length, (idx) {
                final isSelected = safeIndex == idx;
                final t = tabs[idx];
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 6),
                  child: ChoiceChip(
                    avatar: Icon(
                      t['icon'] as IconData,
                      size: 16,
                      color: isSelected ? Colors.black : AppTheme.gold,
                    ),
                    label: Text(
                      t['title'] as String,
                      style: TextStyle(
                        color: isSelected ? Colors.black : AppTheme.textPrimary,
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    selected: isSelected,
                    selectedColor: AppTheme.gold,
                    backgroundColor: AppTheme.surfaceElevated,
                    onSelected: (val) {
                      if (val) setState(() => _currentTabIndex = idx);
                    },
                  ),
                );
              }),
            ),
          ),
        ),

        // Active Tab Body
        Expanded(
          child: tabs[safeIndex]['widget'] as Widget,
        ),
      ],
    );
  }

  // 1. QR SCANNER TAB
  Widget _buildScannerTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 580),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              GoldCard(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    // Scanner Viewport Frame
                    Container(
                      width: 260,
                      height: 260,
                      decoration: BoxDecoration(
                        color: Colors.black,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.gold, width: 2),
                      ),
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          Icon(Icons.qr_code_2_rounded,
                              size: 180, color: AppTheme.gold.withOpacity(0.2)),
                          if (_isScanning)
                            const CircularProgressIndicator(color: AppTheme.gold)
                          else
                            Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.camera_alt_outlined,
                                    size: 40, color: AppTheme.gold),
                                const SizedBox(height: 8),
                                const Text(
                                  'Align Ticket QR in Viewport',
                                  style: TextStyle(color: AppTheme.textSecondary, fontSize: 11),
                                ),
                              ],
                            ),
                          // Corner brackets styling
                          Positioned(
                            top: 10,
                            left: 10,
                            child: Container(
                              width: 24,
                              height: 24,
                              decoration: const BoxDecoration(
                                border: Border(
                                  top: BorderSide(color: AppTheme.gold, width: 3),
                                  left: BorderSide(color: AppTheme.gold, width: 3),
                                ),
                              ),
                            ),
                          ),
                          Positioned(
                            bottom: 10,
                            right: 10,
                            child: Container(
                              width: 24,
                              height: 24,
                              decoration: const BoxDecoration(
                                border: Border(
                                  bottom: BorderSide(color: AppTheme.gold, width: 3),
                                  right: BorderSide(color: AppTheme.gold, width: 3),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _bookingCodeCtrl,
                            decoration: const InputDecoration(
                              labelText: 'Booking Code / Ticket ID',
                              hintText: 'CV-AMB-89421',
                              prefixIcon: Icon(Icons.confirmation_number_outlined, color: AppTheme.gold),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        ElevatedButton.icon(
                          onPressed: _simulateScan,
                          icon: const Icon(Icons.flash_on_rounded, size: 16),
                          label: const Text('Scan QR'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Scan Result Card
              if (_scanResult != null)
                GoldCard(
                  padding: const EdgeInsets.all(20),
                  borderColor: AppTheme.statusApproved,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.check_circle_rounded, color: AppTheme.statusApproved, size: 28),
                          const SizedBox(width: 10),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _scanResult!['status'],
                                style: const TextStyle(
                                  color: AppTheme.statusApproved,
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                              Text(
                                'Ticket Code: ${_scanResult!['bookingCode']}',
                                style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const Divider(height: 24),
                      _buildScanRow('Movie Title', _scanResult!['movie']),
                      _buildScanRow('Screen & Theatre', '${_scanResult!['screen']} • ${_scanResult!['theatre']}'),
                      _buildScanRow('Allocated Seats', _scanResult!['seats']),
                      _buildScanRow('Show Timing', _scanResult!['time']),
                      _buildScanRow('Customer Name', _scanResult!['customer']),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: OutlinedButton(
                          onPressed: () {
                            setState(() => _scanResult = null);
                          },
                          child: const Text('Scan Next Ticket'),
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildScanRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: AppTheme.textMuted, fontSize: 13)),
          Text(value, style: const TextStyle(color: AppTheme.textPrimary, fontSize: 13, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  // 2. VERIFICATION LOOKUP TAB
  Widget _buildVerificationTab(TheatreProvider theatreProv) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: theatreProv.bookings.length,
      itemBuilder: (ctx, idx) {
        final b = theatreProv.bookings[idx];
        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          child: GoldCard(
            padding: const EdgeInsets.all(14),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppTheme.surfaceElevated,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.confirmation_number_outlined, color: AppTheme.gold),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            b.bookingCode,
                            style: const TextStyle(
                              color: AppTheme.textPrimary,
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const Spacer(),
                          Text(
                            b.seats.join(', '),
                            style: const TextStyle(
                              color: AppTheme.goldLight,
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${b.movieTitle} • ${b.screenName} (${b.showTime})',
                        style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                      ),
                      Text(
                        'Customer: ${b.customerName} (${b.customerPhone})',
                        style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // 3. SHOW TIMINGS & ASSIGNED SCREENS
  Widget _buildShowTimingsTab(TheatreProvider theatreProv) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: theatreProv.shows.length,
      itemBuilder: (ctx, idx) {
        final show = theatreProv.shows[idx];
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          child: GoldCard(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    show.moviePoster,
                    width: 60,
                    height: 80,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      width: 60,
                      height: 80,
                      color: AppTheme.surfaceElevated,
                      child: const Icon(Icons.movie, color: AppTheme.gold),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        show.movieTitle,
                        style: const TextStyle(
                          color: AppTheme.textPrimary,
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${show.screenName} • ${show.language} (${show.format})',
                        style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppTheme.gold.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              '${show.startTime} - ${show.endTime}',
                              style: const TextStyle(
                                color: AppTheme.gold,
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                          const Spacer(),
                          Text(
                            'Occupancy: ${show.bookedSeats}/${show.totalSeats} Seats',
                            style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // 4. CUSTOMER ASSISTANCE TAB
  Widget _buildCustomerAssistTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Floor & Customer Assistance Quick Actions',
            style: TextStyle(color: AppTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 14),
          _buildAssistCard(
            Icons.directions_walk_rounded,
            'Seating Location Guidance',
            'Help guests locate Row & Seat numbers across Screen 1, 2, and 3.',
          ),
          const SizedBox(height: 10),
          _buildAssistCard(
            Icons.print_outlined,
            'Reprint Boarding Pass',
            'Look up confirmed booking by mobile number and reprint thermal ticket.',
          ),
          const SizedBox(height: 10),
          _buildAssistCard(
            Icons.wheelchair_pickup_rounded,
            'Wheelchair & Special Assistance',
            'Request escort for wheelchair accessible rows in Screen 1 & 2.',
          ),
        ],
      ),
    );
  }

  Widget _buildAssistCard(IconData icon, String title, String desc) {
    return GoldCard(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Icon(icon, color: AppTheme.gold, size: 28),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14, fontWeight: FontWeight.w700)),
                const SizedBox(height: 3),
                Text(desc, style: const TextStyle(color: AppTheme.textMuted, fontSize: 12)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

