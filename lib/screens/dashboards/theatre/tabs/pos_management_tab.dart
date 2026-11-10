import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../providers/theatre_provider.dart';
import '../../../../providers/auth_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/gold_card.dart';
import '../../../../core/utils/currency_formatter.dart';
import '../../../../models/booking.dart';
import '../../../../models/seat.dart';

class POSManagementTab extends StatefulWidget {
  const POSManagementTab({super.key});

  @override
  State<POSManagementTab> createState() => _POSManagementTabState();
}

class _POSManagementTabState extends State<POSManagementTab> {
  final _customerNameCtrl = TextEditingController(text: 'Walk-in Guest');
  final _customerPhoneCtrl = TextEditingController(text: '+91 99887 76655');
  PaymentMode _selectedPaymentMode = PaymentMode.cash;

  @override
  void dispose() {
    _customerNameCtrl.dispose();
    _customerPhoneCtrl.dispose();
    super.dispose();
  }

  void _handleIssueTickets(BuildContext context, TheatreProvider theatreProv) {
    if (theatreProv.posCartSeats.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: AppTheme.statusRejected,
          content: Text('Please select at least one seat from the auditorium grid.'),
        ),
      );
      return;
    }

    final auth = context.read<AuthProvider>();
    final employeeId = auth.currentSession?.id;

    final booking = theatreProv.completePosBooking(
      customerName: _customerNameCtrl.text.trim(),
      customerPhone: _customerPhoneCtrl.text.trim(),
      paymentMode: _selectedPaymentMode,
      employeeId: employeeId,
    );

    if (booking != null) {
      _showPrintTicketReceiptDialog(context, booking);
    }
  }

  void _showPrintTicketReceiptDialog(BuildContext context, Booking booking) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF131316),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppTheme.gold, width: 1.5),
        ),
        title: const Row(
          children: [
            Icon(Icons.print_rounded, color: AppTheme.gold),
            SizedBox(width: 10),
            Text(
              'Box Office Ticket Issued',
              style: TextStyle(color: AppTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        content: SizedBox(
          width: 380,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.black,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF27272A)),
                ),
                child: Column(
                  children: [
                    const Text(
                      'CINEVENUE BOX OFFICE PASS',
                      style: TextStyle(
                        color: AppTheme.gold,
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.5,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      booking.theatreName,
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: AppTheme.textPrimary, fontSize: 13, fontWeight: FontWeight.w700),
                    ),
                    const Divider(height: 20, color: Colors.white24),
                    Text(
                      booking.movieTitle,
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: AppTheme.goldLight, fontSize: 16, fontWeight: FontWeight.w800),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${booking.screenName} • ${booking.showTime}',
                      style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                    ),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceElevated,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('SEATS:', style: TextStyle(color: AppTheme.textMuted, fontSize: 12, fontWeight: FontWeight.bold)),
                          Text(
                            booking.seats.join(', '),
                            style: const TextStyle(color: AppTheme.gold, fontSize: 15, fontWeight: FontWeight.w900),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Total Paid:', style: TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                        Text(
                          CurrencyFormatter.format(booking.totalAmount),
                          style: const TextStyle(color: AppTheme.statusApproved, fontSize: 14, fontWeight: FontWeight.w700),
                        ),
                      ],
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Booking ID:', style: TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                        Text(booking.bookingCode, style: const TextStyle(color: AppTheme.textPrimary, fontSize: 12, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Icon(Icons.qr_code_2_rounded, size: 70, color: Colors.white),
                  ],
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Close', style: TextStyle(color: AppTheme.textMuted)),
          ),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  backgroundColor: AppTheme.statusApproved,
                  content: Text('Ticket sent to thermal counter printer successfully.'),
                ),
              );
            },
            icon: const Icon(Icons.print, size: 16),
            label: const Text('Print Ticket'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theatreProv = context.watch<TheatreProvider>();
    final shows = theatreProv.shows;
    final selectedShow = theatreProv.selectedShow;
    final seats = theatreProv.liveSeats;
    final cartSeats = theatreProv.posCartSeats;

    if (shows.isEmpty) {
      return const Center(child: Text('No scheduled shows available for POS ticketing.'));
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Show Selection Dropdown
          DropdownButtonFormField<String>(
            value: selectedShow?.id,
            dropdownColor: AppTheme.surfaceElevated,
            decoration: const InputDecoration(
              labelText: 'Select Scheduled Show for Box Office Ticketing',
              prefixIcon: Icon(Icons.movie_creation_outlined, color: AppTheme.gold),
            ),
            items: shows.map((s) {
              return DropdownMenuItem(
                value: s.id,
                child: Text('${s.movieTitle} (${s.startTime}) • ${s.screenName}'),
              );
            }).toList(),
            onChanged: (val) {
              if (val != null) {
                final s = shows.firstWhere((element) => element.id == val);
                theatreProv.selectShow(s);
              }
            },
          ),
          const SizedBox(height: 16),

          // Auditorium Seat Matrix for Selection
          GoldCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Counter Seat Selection:',
                      style: TextStyle(color: AppTheme.textPrimary, fontSize: 14, fontWeight: FontWeight.w700),
                    ),
                    Text(
                      '${cartSeats.length} Selected (₹${theatreProv.posCartTotal.toInt()})',
                      style: const TextStyle(color: AppTheme.gold, fontSize: 13, fontWeight: FontWeight.w800),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Cinema screen line
                Container(
                  width: double.infinity,
                  height: 8,
                  decoration: BoxDecoration(
                    color: AppTheme.gold,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
                const SizedBox(height: 4),
                const Text('SCREEN AUDITORIUM', style: TextStyle(color: AppTheme.textMuted, fontSize: 9, letterSpacing: 2)),
                const SizedBox(height: 16),

                // Seat Matrix
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Column(
                    children: _buildPosSeatRows(theatreProv, seats),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Cart & Checkout Card
          GoldCard(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Guest Information & Counter Checkout',
                  style: TextStyle(color: AppTheme.textPrimary, fontSize: 15, fontWeight: FontWeight.w700),
                ),
                const Divider(height: 20),

                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _customerNameCtrl,
                        decoration: const InputDecoration(labelText: 'Guest Name', hintText: 'Walk-in Customer'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextField(
                        controller: _customerPhoneCtrl,
                        keyboardType: TextInputType.phone,
                        decoration: const InputDecoration(labelText: 'Guest Phone (for SMS)', hintText: '+91 99887 76655'),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                const Text('Payment Mode:', style: TextStyle(color: AppTheme.goldLight, fontSize: 13, fontWeight: FontWeight.w700)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    _buildPaymentOption(PaymentMode.cash, 'Cash Counter', Icons.payments_outlined),
                    const SizedBox(width: 10),
                    _buildPaymentOption(PaymentMode.upi, 'UPI QR Code', Icons.qr_code_2_rounded),
                    const SizedBox(width: 10),
                    _buildPaymentOption(PaymentMode.posCounter, 'Card EDC Swipe', Icons.credit_card_rounded),
                  ],
                ),
                const SizedBox(height: 20),

                // Price Summary
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.surfaceElevated,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Total Payable:', style: TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                          Text(
                            CurrencyFormatter.format(theatreProv.posCartTotal),
                            style: const TextStyle(
                              color: AppTheme.gold,
                              fontSize: 20,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ],
                      ),
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                        ),
                        onPressed: cartSeats.isEmpty ? null : () => _handleIssueTickets(context, theatreProv),
                        icon: const Icon(Icons.print_rounded, size: 18),
                        label: Text('Issue & Print (${cartSeats.length})'),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentOption(PaymentMode mode, String label, IconData icon) {
    final isSelected = _selectedPaymentMode == mode;
    return Expanded(
      child: InkWell(
        onTap: () => setState(() => _selectedPaymentMode = mode),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
          decoration: BoxDecoration(
            color: isSelected ? AppTheme.gold.withOpacity(0.15) : AppTheme.surfaceElevated,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: isSelected ? AppTheme.gold : const Color(0xFF27272A),
              width: isSelected ? 1.5 : 1,
            ),
          ),
          child: Column(
            children: [
              Icon(icon, size: 20, color: isSelected ? AppTheme.gold : AppTheme.textSecondary),
              const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  color: isSelected ? AppTheme.gold : AppTheme.textPrimary,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  List<Widget> _buildPosSeatRows(TheatreProvider theatreProv, List<Seat> seats) {
    final Map<String, List<Seat>> rows = {};
    for (var seat in seats) {
      rows.putIfAbsent(seat.row, () => []).add(seat);
    }

    final List<Widget> rowWidgets = [];

    rows.forEach((rowLetter, seatList) {
      rowWidgets.add(
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 3),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(
                width: 20,
                child: Text(
                  rowLetter,
                  style: const TextStyle(color: AppTheme.goldLight, fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(width: 6),
              ...seatList.map((s) {
                final isSelectedInCart = theatreProv.posCartSeats.any((cartS) => cartS.id == s.id);
                Color seatBg = s.color;
                if (isSelectedInCart) seatBg = AppTheme.gold;

                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 2.5),
                  child: InkWell(
                    onTap: () => theatreProv.togglePosSeatSelection(s),
                    borderRadius: BorderRadius.circular(4),
                    child: Container(
                      width: 26,
                      height: 26,
                      decoration: BoxDecoration(
                        color: seatBg,
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(
                          color: isSelectedInCart ? Colors.black : const Color(0xFF3F3F46),
                          width: isSelectedInCart ? 1.5 : 0.8,
                        ),
                      ),
                      child: Center(
                        child: Text(
                          '${s.number}',
                          style: TextStyle(
                            color: isSelectedInCart ? Colors.black : Colors.white,
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              }),
            ],
          ),
        ),
      );
    });

    return rowWidgets;
  }
}
