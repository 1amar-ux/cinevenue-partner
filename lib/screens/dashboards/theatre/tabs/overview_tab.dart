import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../providers/theatre_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/gold_card.dart';
import '../../../../core/utils/currency_formatter.dart';

class TheatreOverviewTab extends StatelessWidget {
  final Function(int) onNavigateTab;

  const TheatreOverviewTab({super.key, required this.onNavigateTab});

  @override
  Widget build(BuildContext context) {
    final theatreProv = context.watch<TheatreProvider>();
    final selectedTheatre = theatreProv.selectedTheatre;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Banner greeting
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      selectedTheatre?.name ?? 'Theatre Overview',
                      style: const TextStyle(
                        color: AppTheme.textPrimary,
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${selectedTheatre?.city ?? 'Hyderabad'} • ${selectedTheatre?.totalScreens ?? 0} Active Screens • Real-time Box Office Telemetry',
                      style: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: AppTheme.statusApproved.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.statusApproved.withOpacity(0.4)),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.circle, size: 8, color: AppTheme.statusApproved),
                    SizedBox(width: 6),
                    Text(
                      'BOX OFFICE LIVE',
                      style: TextStyle(
                        color: AppTheme.statusApproved,
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // 4 Metric KPI Cards
          Row(
            children: [
              Expanded(
                child: _buildMetricCard(
                  title: "Today's Gross Revenue",
                  value: CurrencyFormatter.format(theatreProv.todayRevenue),
                  subtitle: '+18.4% vs last Tuesday',
                  icon: Icons.currency_rupee_rounded,
                  accentColor: AppTheme.gold,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildMetricCard(
                  title: "Tickets Booked Today",
                  value: '${theatreProv.todayBookedTickets}',
                  subtitle: 'Online & Box Office POS',
                  icon: Icons.confirmation_number_outlined,
                  accentColor: Colors.amber,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildMetricCard(
                  title: 'Average Occupancy',
                  value: '${theatreProv.averageOccupancyPercentage.toStringAsFixed(1)}%',
                  subtitle: 'Across all active screens',
                  icon: Icons.pie_chart_outline_rounded,
                  accentColor: Colors.tealAccent,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildMetricCard(
                  title: 'Active Shows Today',
                  value: '${theatreProv.shows.length}',
                  subtitle: '${theatreProv.screens.length} Screens Running',
                  icon: Icons.movie_outlined,
                  accentColor: Colors.blueAccent,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Quick Operational Shortcuts
          const Text(
            'Quick Operations',
            style: TextStyle(color: AppTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildActionShortcut(
                  icon: Icons.point_of_sale_rounded,
                  label: 'Box Office POS',
                  onTap: () => onNavigateTab(5), // POS Tab
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _buildActionShortcut(
                  icon: Icons.event_seat_rounded,
                  label: 'Live Seat Map',
                  onTap: () => onNavigateTab(4), // Live Seat Map
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _buildActionShortcut(
                  icon: Icons.add_chart_rounded,
                  label: 'Schedule Show',
                  onTap: () => onNavigateTab(3), // Movie Scheduler
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Upcoming Shows Table
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Today's Scheduled Shows",
                style: TextStyle(color: AppTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.w700),
              ),
              TextButton(
                onPressed: () => onNavigateTab(3),
                child: const Text('View All Shows', style: TextStyle(color: AppTheme.gold, fontSize: 12)),
              ),
            ],
          ),
          const SizedBox(height: 8),

          ...theatreProv.shows.map((show) => Container(
                margin: const EdgeInsets.only(bottom: 10),
                child: GoldCard(
                  padding: const EdgeInsets.all(14),
                  child: Row(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(6),
                        child: Image.network(
                          show.moviePoster,
                          width: 48,
                          height: 64,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(
                            width: 48,
                            height: 64,
                            color: AppTheme.surfaceElevated,
                            child: const Icon(Icons.movie, color: AppTheme.gold),
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              show.movieTitle,
                              style: const TextStyle(
                                color: AppTheme.textPrimary,
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            const SizedBox(height: 3),
                            Text(
                              '${show.screenName} • ${show.language} (${show.format})',
                              style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${show.startTime} • Base Price: ₹${show.ticketPrice.toInt()}',
                              style: const TextStyle(color: AppTheme.goldLight, fontSize: 12, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            '${show.occupancyPercentage.toStringAsFixed(0)}% Full',
                            style: TextStyle(
                              color: show.occupancyPercentage > 75 ? Colors.redAccent : AppTheme.statusApproved,
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            '${show.bookedSeats}/${show.totalSeats} seats',
                            style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
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

  Widget _buildMetricCard({
    required String title,
    required String value,
    required String subtitle,
    required IconData icon,
    required Color accentColor,
  }) {
    return GoldCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12, fontWeight: FontWeight.w500),
              ),
              Icon(icon, size: 18, color: accentColor),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            value,
            style: TextStyle(
              color: AppTheme.textPrimary,
              fontSize: 20,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.3,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: TextStyle(color: accentColor.withOpacity(0.8), fontSize: 11),
          ),
        ],
      ),
    );
  }

  Widget _buildActionShortcut({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GoldCard(
      onTap: onTap,
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
      child: Column(
        children: [
          Icon(icon, color: AppTheme.gold, size: 24),
          const SizedBox(height: 8),
          Text(
            label,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: AppTheme.textPrimary,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

