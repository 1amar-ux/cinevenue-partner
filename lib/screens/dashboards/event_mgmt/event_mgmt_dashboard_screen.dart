import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/gold_card.dart';

class EventMgmtDashboardScreen extends StatelessWidget {
  const EventMgmtDashboardScreen({super.key});

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
              'Event Management Operations Desk',
              style: TextStyle(color: AppTheme.textPrimary, fontSize: 18, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 4),
            const Text(
              'Corporate galas, expos, stage production, and brand activations',
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
                        Text('Active Corporate Contracts', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                        SizedBox(height: 6),
                        Text('8 Engagements', style: TextStyle(color: AppTheme.gold, fontSize: 20, fontWeight: FontWeight.w900)),
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
                        Text('Crew Members Deployed', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                        SizedBox(height: 6),
                        Text('145 Crew Staff', style: TextStyle(color: Colors.blueAccent, fontSize: 20, fontWeight: FontWeight.w900)),
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
                  const Text('Production Deliverables & Milestones', style: TextStyle(color: AppTheme.textPrimary, fontSize: 15, fontWeight: FontWeight.w700)),
                  const Divider(height: 20),
                  _buildMilestoneRow('CineVenue Annual Cinema Honours 2026', 'Stage Truss & LED Rigging', 'IN PROGRESS', Colors.amber),
                  const SizedBox(height: 12),
                  _buildMilestoneRow('T-Hub Global Tech Summit Gala', 'Venue Permissions & Sound NOC', 'COMPLETED', AppTheme.statusApproved),
                  const SizedBox(height: 12),
                  _buildMilestoneRow('Auto Expo Hyderabad 2026', 'Floor Plan & Security Perimeter', 'PENDING CLIENT REVIEW', Colors.blue),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMilestoneRow(String title, String milestone, String status, Color badgeColor) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(color: AppTheme.textPrimary, fontSize: 13, fontWeight: FontWeight.w600)),
              Text(milestone, style: const TextStyle(color: AppTheme.textMuted, fontSize: 11)),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
          decoration: BoxDecoration(
            color: badgeColor.withOpacity(0.15),
            borderRadius: BorderRadius.circular(4),
          ),
          child: Text(
            status,
            style: TextStyle(color: badgeColor, fontSize: 10, fontWeight: FontWeight.w800),
          ),
        ),
      ],
    );
  }
}

