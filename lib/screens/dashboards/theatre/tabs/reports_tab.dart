import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../providers/theatre_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/gold_card.dart';

class ReportsTab extends StatefulWidget {
  const ReportsTab({super.key});

  @override
  State<ReportsTab> createState() => _ReportsTabState();
}

class _ReportsTabState extends State<ReportsTab> {
  String _timeframe = 'DAILY'; // DAILY, WEEKLY, MONTHLY

  @override
  Widget build(BuildContext context) {
    final theatreProv = context.watch<TheatreProvider>();

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Operational & Revenue Reports',
                    style: TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Audited sales, occupancy breakdown & movie yield',
                    style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
                  ),
                ],
              ),
              ElevatedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      backgroundColor: AppTheme.statusApproved,
                      content: Text('Financial GST Report exported as PDF & CSV!'),
                    ),
                  );
                },
                icon: const Icon(Icons.download_rounded, size: 16),
                label: const Text('Export PDF'),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Timeframe Filter (Daily, Weekly, Monthly)
          Row(
            children: [
              _buildTimeChip('DAILY', 'Daily Report'),
              const SizedBox(width: 8),
              _buildTimeChip('WEEKLY', 'Weekly Cycle'),
              const SizedBox(width: 8),
              _buildTimeChip('MONTHLY', 'Monthly Audit'),
            ],
          ),
          const SizedBox(height: 18),

          // Movie-wise Sales Yield Card
          GoldCard(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.movie_creation_outlined, color: AppTheme.gold, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Movie-wise Box Office Yield',
                      style: TextStyle(color: AppTheme.textPrimary, fontSize: 15, fontWeight: FontWeight.w700),
                    ),
                  ],
                ),
                const Divider(height: 22),
                _buildMovieYieldRow('Pushpa 2: The Rule', '₹3,42,000', '88% Occupancy', 0.88),
                const SizedBox(height: 12),
                _buildMovieYieldRow('Kalki 2898 AD', '₹1,95,000', '72% Occupancy', 0.72),
                const SizedBox(height: 12),
                _buildMovieYieldRow('Devara: Part 1', '₹1,14,500', '58% Occupancy', 0.58),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Screen-wise Occupancy Performance
          GoldCard(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.pie_chart_outline_rounded, color: AppTheme.gold, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Screen-wise Occupancy Performance',
                      style: TextStyle(color: AppTheme.textPrimary, fontSize: 15, fontWeight: FontWeight.w700),
                    ),
                  ],
                ),
                const Divider(height: 22),
                ...theatreProv.screens.map((scr) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              scr.name,
                              style: const TextStyle(color: AppTheme.textPrimary, fontSize: 13, fontWeight: FontWeight.w600),
                            ),
                            const Text(
                              '82% Peak Avg',
                              style: TextStyle(color: AppTheme.goldLight, fontSize: 12, fontWeight: FontWeight.w700),
                            ),
                          ],
                        ),
                        const SizedBox(height: 5),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: const LinearProgressIndicator(
                            value: 0.82,
                            backgroundColor: Color(0xFF27272A),
                            valueColor: AlwaysStoppedAnimation<Color>(AppTheme.gold),
                            minHeight: 6,
                          ),
                        ),
                      ],
                    ),
                  );
                }),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimeChip(String key, String label) {
    final isSelected = _timeframe == key;
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
      onSelected: (_) => setState(() => _timeframe = key),
    );
  }

  Widget _buildMovieYieldRow(String movie, String gross, String occupancy, double progress) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(movie, style: const TextStyle(color: AppTheme.textPrimary, fontSize: 13, fontWeight: FontWeight.w600)),
            Row(
              children: [
                Text(gross, style: const TextStyle(color: AppTheme.gold, fontSize: 13, fontWeight: FontWeight.w700)),
                const SizedBox(width: 8),
                Text('($occupancy)', style: const TextStyle(color: AppTheme.textMuted, fontSize: 11)),
              ],
            ),
          ],
        ),
        const SizedBox(height: 5),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: progress,
            backgroundColor: const Color(0xFF27272A),
            valueColor: AlwaysStoppedAnimation<Color>(progress > 0.8 ? AppTheme.statusApproved : AppTheme.gold),
            minHeight: 6,
          ),
        ),
      ],
    );
  }
}

