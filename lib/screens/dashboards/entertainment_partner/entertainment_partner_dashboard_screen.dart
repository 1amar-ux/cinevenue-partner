import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/gold_card.dart';

class EntertainmentDashboardScreen extends StatelessWidget {
  const EntertainmentDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Entertainment & Attractions Hub',
              style: TextStyle(color: AppTheme.textPrimary, fontSize: 18, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 4),
            const Text(
              'Theme parks, amusement zones, bowling alleys, and luxury entertainment lounges',
              style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
            ),
            const SizedBox(height: 18),

            Row(
              children: [
                Expanded(
                  child: GoldCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('Active Passes Issued Today', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                        SizedBox(height: 6),
                        Text('1,840 Passes', style: TextStyle(color: AppTheme.gold, fontSize: 20, fontWeight: FontWeight.w900)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: GoldCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('Live Park Capacity Occupancy', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                        SizedBox(height: 6),
                        Text('74% Capacity', style: TextStyle(color: AppTheme.statusApproved, fontSize: 20, fontWeight: FontWeight.w900)),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),

            GoldCard(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Active Attractions & Day Pass Tiers', style: TextStyle(color: AppTheme.textPrimary, fontSize: 15, fontWeight: FontWeight.w700)),
                  const Divider(height: 20),
                  _buildAttractionRow('All-Day Unlimited Rollercoaster & Waterpark Pass', '₹1,499', '1,120 Sold Today'),
                  const SizedBox(height: 12),
                  _buildAttractionRow('FastTrack Priority Lane VIP Wristband', '₹2,499', '430 Sold Today'),
                  const SizedBox(height: 12),
                  _buildAttractionRow('Evening Sunset Carnival Entry Only', '₹699', '290 Sold Today'),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAttractionRow(String title, String price, String sold) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(color: AppTheme.textPrimary, fontSize: 13, fontWeight: FontWeight.w600)),
              Text(sold, style: const TextStyle(color: AppTheme.textMuted, fontSize: 11)),
            ],
          ),
        ),
        Text(price, style: const TextStyle(color: AppTheme.gold, fontSize: 14, fontWeight: FontWeight.bold)),
      ],
    );
  }
}

