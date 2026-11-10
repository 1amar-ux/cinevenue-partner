import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/gold_card.dart';
import '../../core/widgets/status_chip.dart';

class SuspendedScreen extends StatelessWidget {
  const SuspendedScreen({super.key});

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
            constraints: const BoxConstraints(maxWidth: 580),
            child: GoldCard(
              padding: const EdgeInsets.all(24),
              borderColor: AppTheme.statusSuspended,
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.statusSuspended.withOpacity(0.12),
                      shape: BoxShape.circle,
                      border: Border.all(color: AppTheme.statusSuspended, width: 2),
                    ),
                    child: const Icon(
                      Icons.block_rounded,
                      size: 44,
                      color: AppTheme.statusSuspended,
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
                  const SizedBox(height: 8),
                  StatusChip(status: partner.status),
                  const SizedBox(height: 20),

                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF201111),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppTheme.statusSuspended.withOpacity(0.5)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.security_rounded, size: 16, color: AppTheme.statusSuspended),
                            SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                'Access Restricted by CineVenue Administration',
                                style: TextStyle(
                                  color: AppTheme.statusSuspended,
                                  fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Text(
                          partner.rejectionReason ??
                              'This partner account has been temporarily suspended due to a compliance or settlement policy dispute.',
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
                    'All online ticket allocations, counter POS issuance, and settlement payouts are frozen until compliance clearance is completed.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: AppTheme.textMuted, fontSize: 12, height: 1.5),
                  ),
                  const SizedBox(height: 24),

                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.surfaceElevated,
                      foregroundColor: AppTheme.gold,
                      side: const BorderSide(color: AppTheme.surfaceBorder),
                    ),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          backgroundColor: AppTheme.surfaceElevated,
                          content: Text('Compliance ticket opened. A CineVenue representative will contact your registered phone.'),
                        ),
                      );
                    },
                    icon: const Icon(Icons.mail_outline_rounded, size: 18),
                    label: const Text('Contact Legal & Compliance Desk'),
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
