import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../services/partner_repository.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/gold_card.dart';
import '../../core/widgets/status_chip.dart';
import '../../models/partner_business.dart';

class MoreInfoRequiredScreen extends StatefulWidget {
  const MoreInfoRequiredScreen({super.key});

  @override
  State<MoreInfoRequiredScreen> createState() => _MoreInfoRequiredScreenState();
}

class _MoreInfoRequiredScreenState extends State<MoreInfoRequiredScreen> {
  bool _isUploading = false;
  String _selectedDocName = '';

  void _simulateUploadAndResubmit(BuildContext context, PartnerBusiness partner) {
    setState(() => _isUploading = true);

    Future.delayed(const Duration(milliseconds: 1200), () {
      final newDoc = PartnerDocument(
        id: 'doc_${DateTime.now().millisecondsSinceEpoch}',
        name: _selectedDocName.isEmpty ? 'Revised_Document_Compliance.pdf' : _selectedDocName,
        type: 'VENUE_PERMIT',
        fileUrl: 'https://cdn.cinevenue.com/docs/resubmitted_proof.pdf',
        uploadedAt: DateTime.now().toString().substring(0, 10),
        status: 'PENDING',
      );

      PartnerRepository().resubmitPartnerApplication(partner.id, [newDoc]);
      context.read<AuthProvider>().refreshPartnerData();

      setState(() => _isUploading = false);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: AppTheme.statusApproved,
          content: Text('Document uploaded successfully. Application status changed to UNDER REVIEW!'),
        ),
      );
    });
  }

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
            constraints: const BoxConstraints(maxWidth: 620),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                GoldCard(
                  padding: const EdgeInsets.all(24),
                  borderColor: AppTheme.statusMoreInfo,
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.statusMoreInfo.withOpacity(0.12),
                          shape: BoxShape.circle,
                          border: Border.all(color: AppTheme.statusMoreInfo, width: 1.5),
                        ),
                        child: const Icon(
                          Icons.warning_amber_rounded,
                          size: 40,
                          color: AppTheme.statusMoreInfo,
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

                      // Admin Message Box
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceElevated,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppTheme.statusMoreInfo.withOpacity(0.4)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Row(
                              children: [
                                Icon(Icons.mark_chat_unread_outlined,
                                    size: 16, color: AppTheme.statusMoreInfo),
                                SizedBox(width: 8),
                                Text(
                                  'CineVenue Compliance Team Instructions:',
                                  style: TextStyle(
                                    color: AppTheme.statusMoreInfo,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              partner.moreInfoRequiredText ??
                                  'Please upload additional supporting documentation as requested by the admin team.',
                              style: const TextStyle(
                                color: AppTheme.textPrimary,
                                fontSize: 13,
                                height: 1.45,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Document Upload Box
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: const Color(0xFF18181D),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: const Color(0xFF3F3F46),
                            style: BorderStyle.solid,
                          ),
                        ),
                        child: Column(
                          children: [
                            const Icon(Icons.cloud_upload_outlined,
                                size: 36, color: AppTheme.gold),
                            const SizedBox(height: 10),
                            const Text(
                              'Select & Upload Corrected Document',
                              style: TextStyle(
                                color: AppTheme.textPrimary,
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              'Accepted formats: PDF, JPG, PNG (Max 15MB)',
                              style: TextStyle(color: AppTheme.textMuted, fontSize: 11),
                            ),
                            const SizedBox(height: 14),
                            OutlinedButton.icon(
                              onPressed: () {
                                setState(() {
                                  _selectedDocName = 'Signed_Telangana_Fire_Safety_NOC.pdf';
                                });
                              },
                              icon: const Icon(Icons.attach_file, size: 16),
                              label: Text(_selectedDocName.isEmpty
                                  ? 'Browse File'
                                  : 'Selected: $_selectedDocName'),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),

                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: _isUploading
                              ? null
                              : () => _simulateUploadAndResubmit(context, partner),
                          icon: _isUploading
                              ? const SizedBox(
                                  width: 16,
                                  height: 16,
                                  child: CircularProgressIndicator(strokeWidth: 2),
                                )
                              : const Icon(Icons.send_rounded, size: 18),
                          label: Text(_isUploading
                              ? 'Uploading to Compliance Portal...'
                              : 'Resubmit for Verification'),
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
}

