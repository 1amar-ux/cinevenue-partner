import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../providers/theatre_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/gold_card.dart';
import '../../../../models/seat.dart';

class LiveSeatMapTab extends StatelessWidget {
  const LiveSeatMapTab({super.key});

  @override
  Widget build(BuildContext context) {
    final theatreProv = context.watch<TheatreProvider>();
    final shows = theatreProv.shows;
    final selectedShow = theatreProv.selectedShow;
    final seats = theatreProv.liveSeats;

    if (shows.isEmpty) {
      return const Center(child: Text('No shows scheduled currently.'));
    }

    final availableCount = seats.where((s) => s.status == SeatBookingStatus.available).length;
    final bookedCount = seats.where((s) => s.status == SeatBookingStatus.booked).length;
    final blockedCount = seats.where((s) => s.status == SeatBookingStatus.blocked).length;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Show selector row
          Row(
            children: [
              Expanded(
                child: DropdownButtonFormField<String>(
                  value: selectedShow?.id,
                  dropdownColor: AppTheme.surfaceElevated,
                  decoration: const InputDecoration(
                    labelText: 'Select Scheduled Show for Live Seat Telemetry',
                    contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    prefixIcon: Icon(Icons.movie_creation_outlined, color: AppTheme.gold),
                  ),
                  items: shows.map((s) {
                    return DropdownMenuItem(
                      value: s.id,
                      child: Text(
                        '${s.movieTitle} (${s.startTime}) • ${s.screenName}',
                        style: const TextStyle(fontSize: 13),
                        overflow: TextOverflow.ellipsis,
                      ),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) {
                      final s = shows.firstWhere((element) => element.id == val);
                      theatreProv.selectShow(s);
                    }
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Legend & Counts
          GoldCard(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildLegendItem(const Color(0xFF27272A), 'Available ($availableCount)'),
                _buildLegendItem(const Color(0xFFDC2626), 'Booked ($bookedCount)'),
                _buildLegendItem(const Color(0xFFF59E0B), 'Blocked ($blockedCount)'),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Interactive Seating Canvas
          GoldCard(
            padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
            child: Column(
              children: [
                // Cinema Curved Screen Graphic
                Container(
                  width: double.infinity,
                  height: 14,
                  margin: const EdgeInsets.symmetric(horizontal: 24),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppTheme.gold.withOpacity(0.1),
                        AppTheme.gold,
                        AppTheme.gold.withOpacity(0.1),
                      ],
                    ),
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.gold.withOpacity(0.4),
                        blurRadius: 10,
                        spreadRadius: 1,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  'SCREEN AUDITORIUM EYE LINE',
                  style: TextStyle(
                    color: AppTheme.goldLight,
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 2.5,
                  ),
                ),
                const SizedBox(height: 24),

                // Seat Matrix
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Column(
                    children: _buildSeatRows(context, theatreProv, seats),
                  ),
                ),

                const SizedBox(height: 16),
                const Text(
                  'Tap any available seat to temporarily block/reserve it from customer apps, or tap a blocked seat to release it back into real-time online inventory.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: AppTheme.textMuted, fontSize: 11),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLegendItem(Color color, String label) {
    return Row(
      children: [
        Container(
          width: 14,
          height: 14,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(3),
            border: Border.all(color: Colors.white24, width: 0.8),
          ),
        ),
        const SizedBox(width: 6),
        Text(
          label,
          style: const TextStyle(color: AppTheme.textPrimary, fontSize: 12, fontWeight: FontWeight.w600),
        ),
      ],
    );
  }

  List<Widget> _buildSeatRows(BuildContext context, TheatreProvider theatreProv, List<Seat> seats) {
    // Group seats by row letter
    final Map<String, List<Seat>> rows = {};
    for (var seat in seats) {
      rows.putIfAbsent(seat.row, () => []).add(seat);
    }

    final List<Widget> rowWidgets = [];

    rows.forEach((rowLetter, seatList) {
      rowWidgets.add(
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Row letter label
              SizedBox(
                width: 22,
                child: Text(
                  rowLetter,
                  style: const TextStyle(
                    color: AppTheme.goldLight,
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
              const SizedBox(width: 8),

              // Seats in this row
              ...seatList.map((s) {
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 3),
                  child: InkWell(
                    onTap: () {
                      theatreProv.toggleBlockSeat(s);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          duration: const Duration(milliseconds: 700),
                          backgroundColor: AppTheme.surfaceElevated,
                          content: Text('Seat ${s.code} is now ${s.status.name.toUpperCase()}'),
                        ),
                      );
                    },
                    borderRadius: BorderRadius.circular(4),
                    child: Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: s.color,
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(
                          color: s.status == SeatBookingStatus.blocked
                              ? AppTheme.gold
                              : const Color(0xFF3F3F46),
                          width: 1,
                        ),
                      ),
                      child: Center(
                        child: Text(
                          '${s.number}',
                          style: TextStyle(
                            color: s.status == SeatBookingStatus.selected ? Colors.black : Colors.white,
                            fontSize: 10,
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
