import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/admin_provider.dart';
import '../../providers/auth_provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/gold_card.dart';
import '../../core/widgets/status_chip.dart';
import '../../models/partner_business.dart';
import '../../models/partner_category.dart';

class PartnerAdminScreen extends StatelessWidget {
  const PartnerAdminScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final adminProv = context.watch<AdminProvider>();
    final partners = adminProv.allPartners;

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Admin Module Header
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppTheme.gold.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppTheme.gold),
                  ),
                  child: const Icon(Icons.verified_user_rounded, color: AppTheme.gold, size: 24),
                ),
                const SizedBox(width: 14),
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'CineVenue Admin • Partner Verification Management',
                      style: TextStyle(
                        color: AppTheme.textPrimary,
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    SizedBox(height: 2),
                    Text(
                      'Review registration dossiers, audit documents, approve, reject, or suspend accounts',
                      style: TextStyle(color: AppTheme.textMuted, fontSize: 12),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Metrics Summary
            Row(
              children: [
                Expanded(
                  child: _buildKpiCard(
                    'Pending Review',
                    '${adminProv.pendingCount}',
                    AppTheme.statusPending,
                    Icons.hourglass_top_rounded,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _buildKpiCard(
                    'Active Approved',
                    '${adminProv.approvedCount}',
                    AppTheme.statusApproved,
                    Icons.check_circle_rounded,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _buildKpiCard(
                    'Action Needed',
                    '${adminProv.actionReqCount}',
                    AppTheme.statusMoreInfo,
                    Icons.warning_amber_rounded,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _buildKpiCard(
                    'Suspended',
                    '${adminProv.suspendedCount}',
                    AppTheme.statusSuspended,
                    Icons.block_rounded,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // Status Filter Chips
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildFilterChip(context, 'ALL', 'All Partners (${adminProv.allPartners.length})', adminProv),
                  const SizedBox(width: 8),
                  _buildFilterChip(context, 'PENDING', 'Pending (${adminProv.pendingCount})', adminProv),
                  const SizedBox(width: 8),
                  _buildFilterChip(context, 'MORE_INFO_REQUIRED', 'More Info (${adminProv.actionReqCount})', adminProv),
                  const SizedBox(width: 8),
                  _buildFilterChip(context, 'APPROVED', 'Approved (${adminProv.approvedCount})', adminProv),
                  const SizedBox(width: 8),
                  _buildFilterChip(context, 'REJECTED', 'Rejected', adminProv),
                  const SizedBox(width: 8),
                  _buildFilterChip(context, 'SUSPENDED', 'Suspended (${adminProv.suspendedCount})', adminProv),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Partner Cards
            if (partners.isEmpty)
              const Padding(
                padding: EdgeInsets.all(40),
                child: Center(
                  child: Text('No partner applications found in this filter category.', style: TextStyle(color: AppTheme.textMuted)),
                ),
              )
            else
              ...partners.map((partner) => Container(
                    margin: const EdgeInsets.only(bottom: 14),
                    child: GoldCard(
                      padding: const EdgeInsets.all(18),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Text(
                                          partner.businessName,
                                          style: const TextStyle(
                                            color: AppTheme.textPrimary,
                                            fontSize: 16,
                                            fontWeight: FontWeight.w800,
                                          ),
                                        ),
                                        const SizedBox(width: 10),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: AppTheme.surfaceElevated,
                                            borderRadius: BorderRadius.circular(4),
                                          ),
                                          child: Text(
                                            partner.category.displayName,
                                            style: const TextStyle(
                                              color: AppTheme.goldLight,
                                              fontSize: 11,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      'Owner: ${partner.ownerName} • Phone: ${partner.mobile} • Email: ${partner.email}',
                                      style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      'Location: ${partner.city}, ${partner.state} (PIN: ${partner.pinCode})',
                                      style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                                    ),
                                  ],
                                ),
                              ),
                              StatusChip(status: partner.status),
                            ],
                          ),
                          const Divider(height: 22),

                          // Tax & Bank Details Row
                          Wrap(
                            spacing: 16,
                            runSpacing: 8,
                            children: [
                              _buildInfoTag('GSTIN', partner.gstNumber ?? 'Not Provided'),
                              _buildInfoTag('PAN', partner.panNumber ?? 'Not Provided'),
                              _buildInfoTag('Bank Account', '${partner.bankDetails.bankName} (${partner.bankDetails.maskedAccount})'),
                              _buildInfoTag('Documents', '${partner.documents.length} Uploaded Files'),
                            ],
                          ),

                          if (partner.rejectionReason != null) ...[
                            const SizedBox(height: 10),
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: Colors.red.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(color: Colors.red.withOpacity(0.3)),
                              ),
                              child: Text(
                                'Notice: ${partner.rejectionReason}',
                                style: const TextStyle(color: Colors.redAccent, fontSize: 12),
                              ),
                            ),
                          ],

                          if (partner.moreInfoRequiredText != null) ...[
                            const SizedBox(height: 10),
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: Colors.purple.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(color: Colors.purple.withOpacity(0.3)),
                              ),
                              child: Text(
                                'Action Required: ${partner.moreInfoRequiredText}',
                                style: const TextStyle(color: Colors.purpleAccent, fontSize: 12),
                              ),
                            ),
                          ],

                          const Divider(height: 22),

                          // Action Buttons
                          Wrap(
                            alignment: WrapAlignment.end,
                            crossAxisAlignment: WrapCrossAlignment.center,
                            spacing: 10,
                            runSpacing: 10,
                            children: [
                              OutlinedButton.icon(
                                onPressed: () => _showAuditDossierDialog(context, partner),
                                icon: const Icon(Icons.visibility_outlined, size: 14),
                                label: const Text('View Dossier & Docs'),
                              ),

                              if (!partner.isApproved && !partner.isSuspended) ...[
                                OutlinedButton(
                                  style: OutlinedButton.styleFrom(foregroundColor: AppTheme.statusMoreInfo),
                                  onPressed: () => _showRequestMoreInfoDialog(context, adminProv, partner),
                                  child: const Text('Request More Info'),
                                ),
                                OutlinedButton(
                                  style: OutlinedButton.styleFrom(foregroundColor: AppTheme.statusRejected),
                                  onPressed: () => _showRejectDialog(context, adminProv, partner),
                                  child: const Text('Reject'),
                                ),
                                ElevatedButton.icon(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppTheme.statusApproved,
                                    foregroundColor: Colors.white,
                                  ),
                                  onPressed: () {
                                    adminProv.approvePartner(partner.id);
                                    context.read<AuthProvider>().refreshPartnerData();
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        backgroundColor: AppTheme.statusApproved,
                                        content: Text('${partner.businessName} approved! Live dashboard activated.'),
                                      ),
                                    );
                                  },
                                  icon: const Icon(Icons.check_circle_outline, size: 16),
                                  label: const Text('Approve Application'),
                                ),
                              ],

                              if (partner.isApproved) ...[
                                OutlinedButton.icon(
                                  style: OutlinedButton.styleFrom(foregroundColor: AppTheme.statusSuspended),
                                  onPressed: () => _showSuspendDialog(context, adminProv, partner),
                                  icon: const Icon(Icons.block, size: 14),
                                  label: const Text('Suspend Partner'),
                                ),
                              ],

                              if (partner.isSuspended) ...[
                                ElevatedButton.icon(
                                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.statusApproved),
                                  onPressed: () {
                                    adminProv.reactivatePartner(partner.id);
                                    context.read<AuthProvider>().refreshPartnerData();
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        backgroundColor: AppTheme.statusApproved,
                                        content: Text('${partner.businessName} reactivated! Operations restored.'),
                                      ),
                                    );
                                  },
                                  icon: const Icon(Icons.replay_rounded, size: 16),
                                  label: const Text('Reactivate Partner'),
                                ),
                              ],
                            ],
                          ),
                        ],
                      ),
                    ),
                  )),
          ],
        ),
      ),
    );
  }

  Widget _buildKpiCard(String title, String count, Color color, IconData icon) {
    return GoldCard(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(color: AppTheme.textMuted, fontSize: 11)),
              Icon(icon, size: 16, color: color),
            ],
          ),
          const SizedBox(height: 6),
          Text(count, style: TextStyle(color: color, fontSize: 20, fontWeight: FontWeight.w900)),
        ],
      ),
    );
  }

  Widget _buildFilterChip(BuildContext context, String code, String label, AdminProvider prov) {
    final isSelected = prov.statusFilter == code;
    return ChoiceChip(
      label: Text(
        label,
        style: TextStyle(
          color: isSelected ? Colors.black : AppTheme.textPrimary,
          fontSize: 12,
          fontWeight: FontWeight.w700,
        ),
      ),
      selected: isSelected,
      selectedColor: AppTheme.gold,
      backgroundColor: AppTheme.surfaceElevated,
      onSelected: (_) => prov.setFilter(code),
    );
  }

  Widget _buildInfoTag(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: AppTheme.textMuted, fontSize: 10)),
        Text(value, style: const TextStyle(color: AppTheme.textPrimary, fontSize: 12, fontWeight: FontWeight.w600)),
      ],
    );
  }

  void _showAuditDossierDialog(BuildContext context, PartnerBusiness partner) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppTheme.surfaceBorder),
        ),
        title: Text(
          'Dossier: ${partner.businessName}',
          style: const TextStyle(color: AppTheme.textPrimary, fontSize: 17, fontWeight: FontWeight.bold),
        ),
        content: SizedBox(
          width: 520,
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('Category: ${partner.category.displayName}', style: const TextStyle(color: AppTheme.goldLight, fontSize: 13, fontWeight: FontWeight.bold)),
                Text('Address: ${partner.businessAddress}, ${partner.city}, ${partner.state} - ${partner.pinCode}', style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                const Divider(height: 20),
                const Text('Uploaded Documents:', style: TextStyle(color: AppTheme.textPrimary, fontSize: 13, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                if (partner.documents.isEmpty)
                  const Text('No uploaded files attached.', style: TextStyle(color: AppTheme.textMuted, fontSize: 12))
                else
                  ...partner.documents.map((doc) => Container(
                        margin: const EdgeInsets.only(bottom: 6),
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(color: AppTheme.surfaceElevated, borderRadius: BorderRadius.circular(6)),
                        child: Row(
                          children: [
                            const Icon(Icons.picture_as_pdf_outlined, color: Colors.redAccent, size: 20),
                            const SizedBox(width: 10),
                            Expanded(child: Text(doc.name, style: const TextStyle(fontSize: 12, color: AppTheme.textPrimary))),
                            Text(doc.type, style: const TextStyle(fontSize: 10, color: AppTheme.gold)),
                          ],
                        ),
                      )),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close', style: TextStyle(color: AppTheme.textMuted))),
        ],
      ),
    );
  }

  void _showRejectDialog(BuildContext context, AdminProvider prov, PartnerBusiness partner) {
    final reasonCtrl = TextEditingController(text: 'Inconsistent tax identification or unverified registration certificates.');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surface,
        title: const Text('Reject Partner Application', style: TextStyle(color: Colors.redAccent, fontSize: 16)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Enter official rejection grounds that will be displayed to the applicant:', style: TextStyle(color: AppTheme.textMuted, fontSize: 12)),
            const SizedBox(height: 12),
            TextField(controller: reasonCtrl, maxLines: 3, decoration: const InputDecoration(labelText: 'Rejection Grounds')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.statusRejected),
            onPressed: () {
              prov.rejectPartner(partner.id, reasonCtrl.text.trim());
              context.read<AuthProvider>().refreshPartnerData();
              Navigator.pop(ctx);
            },
            child: const Text('Confirm Rejection'),
          ),
        ],
      ),
    );
  }

  void _showRequestMoreInfoDialog(BuildContext context, AdminProvider prov, PartnerBusiness partner) {
    final infoCtrl = TextEditingController(text: 'Please upload a revised copy of the Municipality Trade License with clear expiration date.');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surface,
        title: const Text('Request More Information', style: TextStyle(color: AppTheme.statusMoreInfo, fontSize: 16)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Describe the missing documents or corrections required from applicant:', style: TextStyle(color: AppTheme.textMuted, fontSize: 12)),
            const SizedBox(height: 12),
            TextField(controller: infoCtrl, maxLines: 3, decoration: const InputDecoration(labelText: 'Instructions for Partner')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.statusMoreInfo),
            onPressed: () {
              prov.requestMoreInfo(partner.id, infoCtrl.text.trim());
              context.read<AuthProvider>().refreshPartnerData();
              Navigator.pop(ctx);
            },
            child: const Text('Send Action Request'),
          ),
        ],
      ),
    );
  }

  void _showSuspendDialog(BuildContext context, AdminProvider prov, PartnerBusiness partner) {
    final reasonCtrl = TextEditingController(text: 'Suspended pending regulatory audit and box office reconciliation.');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surface,
        title: const Text('Suspend Partner Account', style: TextStyle(color: AppTheme.statusSuspended, fontSize: 16)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('This will immediately lock the partner out of box-office POS ticketing and online bookings:', style: TextStyle(color: AppTheme.textMuted, fontSize: 12)),
            const SizedBox(height: 12),
            TextField(controller: reasonCtrl, maxLines: 2, decoration: const InputDecoration(labelText: 'Suspension Reason')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.statusSuspended),
            onPressed: () {
              prov.suspendPartner(partner.id, reasonCtrl.text.trim());
              context.read<AuthProvider>().refreshPartnerData();
              Navigator.pop(ctx);
            },
            child: const Text('Confirm Suspension'),
          ),
        ],
      ),
    );
  }
}
