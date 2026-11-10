import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/gold_card.dart';
import '../../core/widgets/status_chip.dart';
import '../../models/partner_category.dart';

class ApplicationTrackingScreen extends StatelessWidget {
  const ApplicationTrackingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final partner = auth.currentPartner;

    if (partner == null) {
      return const Center(child: Text('No active application found.'));
    }

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 680),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Header Status Card
                GoldCard(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.statusPending.withOpacity(0.12),
                          shape: BoxShape.circle,
                          border: Border.all(color: AppTheme.statusPending, width: 1.5),
                        ),
                        child: const Icon(
                          Icons.hourglass_empty_rounded,
                          size: 40,
                          color: AppTheme.statusPending,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        partner.businessName,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: AppTheme.textPrimary,
                          fontSize: 22,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Category: ${partner.category.displayName}',
                        style: const TextStyle(color: AppTheme.goldLight, fontSize: 14),
                      ),
                      const SizedBox(height: 12),
                      StatusChip(status: partner.status),
                      const SizedBox(height: 16),
                      const Text(
                        'Your partner registration has been submitted and is currently queued for official verification by the CineVenue Compliance & Operations Team.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: AppTheme.textSecondary,
                          fontSize: 13,
                          height: 1.5,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Verification Timeline
                GoldCard(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Application Verification Progress',
                        style: TextStyle(
                          color: AppTheme.textPrimary,
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 20),
                      _buildTimelineStep(
                        step: '1',
                        title: 'Application Form Submitted',
                        subtitle: 'Received on ${partner.appliedAt}',
                        isDone: true,
                        isCurrent: false,
                      ),
                      _buildTimelineStep(
                        step: '2',
                        title: 'KYC & Legal Document Audit',
                        subtitle: 'Verification of GST (${partner.gstNumber ?? 'N/A'}), PAN (${partner.panNumber ?? 'N/A'}), and Bank Details',
                        isDone: partner.isUnderReview,
                        isCurrent: partner.isPending,
                      ),
                      _buildTimelineStep(
                        step: '3',
                        title: 'Technical & Commercial Alignment',
                        subtitle: 'Screen integration, convenience fee configuration, and settlement terms',
                        isDone: false,
                        isCurrent: partner.isUnderReview,
                      ),
                      _buildTimelineStep(
                        step: '4',
                        title: 'Platform Activation',
                        subtitle: 'Access granted to ${partner.category.displayName} Dashboard and ticket POS',
                        isDone: false,
                        isCurrent: false,
                        isLast: true,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Uploaded Documents Summary
                GoldCard(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Expanded(
                            child: Text(
                              'Uploaded Supporting Documents',
                              style: TextStyle(
                                color: AppTheme.textPrimary,
                                fontSize: 15,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            '${partner.documents.length} Files Attached',
                            style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      if (partner.documents.isEmpty)
                        const Text(
                          'No documents uploaded during registration.',
                          style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
                        )
                      else
                        ...partner.documents.map((doc) => Container(
                              margin: const EdgeInsets.only(bottom: 8),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AppTheme.surfaceElevated,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.description_outlined,
                                      color: AppTheme.gold, size: 20),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          doc.name,
                                          style: const TextStyle(
                                            color: AppTheme.textPrimary,
                                            fontSize: 13,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                        Text(
                                          'Type: ${doc.type} • Uploaded ${doc.uploadedAt}',
                                          style: const TextStyle(
                                              color: AppTheme.textMuted, fontSize: 11),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: Colors.amber.withOpacity(0.15),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: const Text(
                                      'VERIFYING',
                                      style: TextStyle(
                                        color: Colors.amber,
                                        fontSize: 10,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            )),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Help Desk / Support Footer
                Center(
                  child: Wrap(
                    alignment: WrapAlignment.center,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      const Icon(Icons.support_agent_rounded, size: 18, color: AppTheme.gold),
                      const SizedBox(width: 8),
                      const Text(
                        'Need urgent activation? Contact partner desk: ',
                        style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                      ),
                      Text(
                        'partners@cinevenue.com',
                        style: const TextStyle(
                          color: AppTheme.gold,
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          decoration: TextDecoration.underline,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTimelineStep({
    required String step,
    required String title,
    required String subtitle,
    required bool isDone,
    required bool isCurrent,
    bool isLast = false,
  }) {
    final color = isDone
        ? AppTheme.statusApproved
        : isCurrent
            ? AppTheme.gold
            : AppTheme.textMuted;

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: isDone
                    ? AppTheme.statusApproved.withOpacity(0.2)
                    : isCurrent
                        ? AppTheme.gold.withOpacity(0.2)
                        : AppTheme.surfaceElevated,
                shape: BoxShape.circle,
                border: Border.all(color: color, width: 1.5),
              ),
              child: Center(
                child: isDone
                    ? const Icon(Icons.check, size: 16, color: AppTheme.statusApproved)
                    : Text(
                        step,
                        style: TextStyle(
                          color: color,
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 36,
                color: isDone ? AppTheme.statusApproved : const Color(0xFF27272A),
              ),
          ],
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  color: isDone || isCurrent ? AppTheme.textPrimary : AppTheme.textMuted,
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 3),
              Text(
                subtitle,
                style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
              ),
              const SizedBox(height: 14),
            ],
          ),
        ),
      ],
    );
  }
}
