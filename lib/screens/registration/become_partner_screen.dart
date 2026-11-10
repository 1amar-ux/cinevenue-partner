import 'package:flutter/material.dart';
import '../../models/partner_category.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/gold_card.dart';
import 'partner_registration_wizard.dart';

class BecomePartnerScreen extends StatelessWidget {
  const BecomePartnerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 36),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 820),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Top Tag & Title
                Center(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppTheme.gold.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppTheme.gold.withOpacity(0.4)),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.workspace_premium_rounded, size: 16, color: AppTheme.gold),
                        SizedBox(width: 6),
                        Text(
                          'CINEVENUE ENTERTAINMENTS PVT LTD',
                          style: TextStyle(
                            color: AppTheme.gold,
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.2,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Become a CineVenue Partner',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 28,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 10),
                const Text(
                  'Select your business category below to start your digital partnership registration. Each enterprise category gets dedicated operational modules and direct ticketing integration.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: AppTheme.textSecondary,
                    fontSize: 14,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 32),

                // 5 Category Cards
                _buildCategoryCard(
                  context,
                  category: PartnerCategory.theatrePartner,
                  icon: Icons.theaters_rounded,
                  title: '1. Theatre Partner',
                  description:
                      'Multiplexes, single screen cinemas, and theatre chains. Manage screen layouts, movies, live seat map, counter POS, and automated box-office settlements.',
                  badge: 'Cinemas & Multiplexes',
                ),
                const SizedBox(height: 14),
                _buildCategoryCard(
                  context,
                  category: PartnerCategory.eventOrganizer,
                  icon: Icons.event_available_rounded,
                  title: '2. Event Organizer',
                  description:
                      'Live music concerts, standup comedy, DJ festivals, and sports summits. Publish events, tiered tickets, gate QR scanning, and attendee check-ins.',
                  badge: 'Concerts & Live Shows',
                ),
                const SizedBox(height: 14),
                _buildCategoryCard(
                  context,
                  category: PartnerCategory.eventManagement,
                  icon: Icons.groups_rounded,
                  title: '3. Event Management Company',
                  description:
                      'Corporate galas, expos, stage production, and brand activations. Coordinate logistics, venue approvals, vendor operations, and client invoicing.',
                  badge: 'Corporate & Experiential',
                ),
                const SizedBox(height: 14),
                _buildCategoryCard(
                  context,
                  category: PartnerCategory.productionHouse,
                  icon: Icons.video_camera_back_rounded,
                  title: '4. Production House',
                  description:
                      'Film studios, producers, and distribution banners. Manage casting calls, talent auditions, production milestones, OTT previews, and premiere screenings.',
                  badge: 'Studios & Producers',
                ),
                const SizedBox(height: 14),
                _buildCategoryCard(
                  context,
                  category: PartnerCategory.entertainmentPartner,
                  icon: Icons.attractions_rounded,
                  title: '5. Entertainment Partner',
                  description:
                      'Theme parks, gaming arenas, bowling alleys, and luxury entertainment lounges. Issue day passes, hourly slot bookings, and amusement vouchers.',
                  badge: 'Theme Parks & Lounges',
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryCard(
    BuildContext context, {
    required PartnerCategory category,
    required IconData icon,
    required String title,
    required String description,
    required String badge,
  }) {
    return GoldCard(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (ctx) => PartnerRegistrationWizard(category: category),
          ),
        );
      },
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppTheme.surfaceElevated,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppTheme.gold.withOpacity(0.3)),
            ),
            child: Icon(icon, size: 28, color: AppTheme.gold),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        title,
                        style: const TextStyle(
                          color: AppTheme.textPrimary,
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppTheme.gold.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        badge,
                        style: const TextStyle(
                          color: AppTheme.gold,
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  description,
                  style: const TextStyle(
                    color: AppTheme.textSecondary,
                    fontSize: 13,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Text(
                      'Apply as ${category.displayName}',
                      style: const TextStyle(
                        color: AppTheme.gold,
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(width: 4),
                    const Icon(Icons.arrow_forward_rounded, size: 14, color: AppTheme.gold),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

