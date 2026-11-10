import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../services/partner_repository.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/gold_card.dart';
import '../../core/widgets/status_chip.dart';
import '../../models/partner_category.dart';
import '../../models/partner_business.dart';
import '../../models/user_session.dart';

class RejectedScreen extends StatelessWidget {
  const RejectedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final partner = auth.currentPartner;

    if (partner == null) return const SizedBox.shrink();

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 600),
            child: GoldCard(
              padding: const EdgeInsets.all(24),
              borderColor: AppTheme.statusRejected,
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.statusRejected.withOpacity(0.12),
                      shape: BoxShape.circle,
                      border: Border.all(color: AppTheme.statusRejected, width: 1.5),
                    ),
                    child: const Icon(
                      Icons.cancel_outlined,
                      size: 40,
                      color: AppTheme.statusRejected,
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
                    style: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                  ),
                  const SizedBox(height: 10),
                  StatusChip(status: partner.status),
                  const SizedBox(height: 20),

                  // Rejection Reason Box
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceElevated,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppTheme.statusRejected.withOpacity(0.4)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            const Icon(Icons.gavel_rounded, size: 16, color: AppTheme.statusRejected),
                            const SizedBox(width: 8),
                            const Expanded(
                              child: Text(
                                'Official Rejection Statement:',
                                style: TextStyle(
                                  color: AppTheme.statusRejected,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          partner.rejectionReason ??
                              'Application does not meet CineVenue technical or compliance requirements.',
                          style: const TextStyle(
                            color: AppTheme.textPrimary,
                            fontSize: 13,
                            height: 1.45,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  const Text(
                    'You may review your business entity information, correct the highlighted inconsistencies, and submit a revised application for compliance re-evaluation.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: AppTheme.textSecondary, fontSize: 12, height: 1.5),
                  ),
                  const SizedBox(height: 24),

                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {
                            // Reset and initiate fresh registration flow
                            auth.loginAs(
                              partnerId: '',
                              role: UserRole.owner,
                              type: SessionType.registration,
                            );
                          },
                          child: const Text('Start Fresh Registration'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {
                            // Resubmit application
                            PartnerRepository().resubmitPartnerApplication(
                              partner.id,
                              [
                                PartnerDocument(
                                  id: 'doc_${DateTime.now().millisecondsSinceEpoch}',
                                  name: 'Corrected_Legal_Entity_Doc.pdf',
                                  type: 'PAN',
                                  fileUrl: 'https://cdn.cinevenue.com/docs/pan_corrected.pdf',
                                  uploadedAt: DateTime.now().toString().substring(0, 10),
                                  status: 'PENDING',
                                ),
                              ],
                            );
                            auth.refreshPartnerData();
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                backgroundColor: AppTheme.statusApproved,
                                content: Text('Corrected documentation submitted. Application is now UNDER REVIEW.'),
                              ),
                            );
                          },
                          child: const Text('Resubmit Application'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
