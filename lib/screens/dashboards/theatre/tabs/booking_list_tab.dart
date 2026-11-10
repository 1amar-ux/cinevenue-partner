import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../providers/theatre_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/gold_card.dart';
import '../../../../models/booking.dart';
import '../../../../core/utils/currency_formatter.dart';

class BookingListTab extends StatefulWidget {
  const BookingListTab({super.key});

  @override
  State<BookingListTab> createState() => _BookingListTabState();
}

class _BookingListTabState extends State<BookingListTab> {
  final _searchCtrl = TextEditingController();

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theatreProv = context.watch<TheatreProvider>();
    final query = _searchCtrl.text.trim().toLowerCase();

    final filtered = theatreProv.bookings.where((b) {
      if (query.isEmpty) return true;
      return b.bookingCode.toLowerCase().contains(query) ||
          b.customerName.toLowerCase().contains(query) ||
          b.customerPhone.toLowerCase().contains(query) ||
          b.movieTitle.toLowerCase().contains(query);
    }).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Ticket Booking Ledger',
                    style: TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${filtered.length} Bookings Found • Real-time Box Office Sync',
                    style: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Search Bar & Filter Segment
          TextField(
            controller: _searchCtrl,
            onChanged: (_) => setState(() {}),
            decoration: InputDecoration(
              hintText: 'Search by Booking ID, Customer Name, or Phone...',
              prefixIcon: const Icon(Icons.search, color: AppTheme.gold),
              suffixIcon: query.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear, size: 18),
                      onPressed: () {
                        _searchCtrl.clear();
                        setState(() {});
                      },
                    )
                  : null,
            ),
          ),
          const SizedBox(height: 12),

          // Filter Segment (ALL, ONLINE, POS)
          Row(
            children: [
              _buildFilterChip('ALL', 'All Bookings', theatreProv),
              const SizedBox(width: 8),
              _buildFilterChip('ONLINE', 'Online App Orders', theatreProv),
              const SizedBox(width: 8),
              _buildFilterChip('POS', 'Box Office POS', theatreProv),
            ],
          ),
          const SizedBox(height: 16),

          if (filtered.isEmpty)
            const Padding(
              padding: EdgeInsets.all(40),
              child: Center(
                child: Text('No matching bookings found.', style: TextStyle(color: AppTheme.textMuted)),
              ),
            )
          else
            ...filtered.map((b) => Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: GoldCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: b.isPosBooking
                                    ? Colors.amber.withOpacity(0.15)
                                    : Colors.blue.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(4),
                                border: Border.all(
                                  color: b.isPosBooking ? Colors.amber : Colors.blue,
                                  width: 0.8,
                                ),
                              ),
                              child: Text(
                                b.isPosBooking ? 'POS COUNTER' : 'ONLINE APP',
                                style: TextStyle(
                                  color: b.isPosBooking ? Colors.amber : Colors.blue,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Text(
                              b.bookingCode,
                              style: const TextStyle(
                                color: AppTheme.textPrimary,
                                fontSize: 15,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            const Spacer(),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: b.status == BookingState.confirmed
                                    ? AppTheme.statusApproved.withOpacity(0.15)
                                    : AppTheme.statusRejected.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                b.status.name.toUpperCase(),
                                style: TextStyle(
                                  color: b.status == BookingState.confirmed
                                      ? AppTheme.statusApproved
                                      : AppTheme.statusRejected,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    b.movieTitle,
                                    style: const TextStyle(
                                      color: AppTheme.textPrimary,
                                      fontSize: 14,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '${b.screenName} • ${b.showTime}',
                                    style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    'Guest: ${b.customerName} (${b.customerPhone})',
                                    style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                                  ),
                                ],
                              ),
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text(
                                  CurrencyFormatter.format(b.totalAmount),
                                  style: const TextStyle(
                                    color: AppTheme.gold,
                                    fontSize: 16,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Seats: ${b.seats.join(', ')}',
                                  style: const TextStyle(
                                    color: AppTheme.goldLight,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const Divider(height: 20),

                        Row(
                          children: [
                            Text(
                              'Booked: ${b.createdAt}',
                              style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                            ),
                            const Spacer(),
                            if (b.status == BookingState.confirmed)
                              TextButton.icon(
                                onPressed: () {
                                  theatreProv.cancelBooking(b.id);
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      backgroundColor: AppTheme.statusRejected,
                                      content: Text('Booking ${b.bookingCode} cancelled. Seats released to inventory.'),
                                    ),
                                  );
                                },
                                icon: const Icon(Icons.cancel_outlined, size: 14, color: Colors.redAccent),
                                label: const Text('Cancel & Release Seats', style: TextStyle(color: Colors.redAccent, fontSize: 12)),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                )),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String filterKey, String label, TheatreProvider prov) {
    final isSelected = prov.bookingFilter == filterKey;
    return ChoiceChip(
      label: Text(
        label,
        style: TextStyle(
          color: isSelected ? Colors.black : AppTheme.textPrimary,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
      selected: isSelected,
      selectedColor: AppTheme.gold,
      backgroundColor: AppTheme.surfaceElevated,
      onSelected: (_) => prov.setBookingFilter(filterKey),
    );
  }
}

