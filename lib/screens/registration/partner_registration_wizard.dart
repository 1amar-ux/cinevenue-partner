import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/partner_category.dart';
import '../../models/partner_business.dart';
import '../../models/user_session.dart';
import '../../providers/auth_provider.dart';
import '../../services/partner_repository.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/gold_card.dart';

class PartnerRegistrationWizard extends StatefulWidget {
  final PartnerCategory category;

  const PartnerRegistrationWizard({super.key, required this.category});

  @override
  State<PartnerRegistrationWizard> createState() => _PartnerRegistrationWizardState();
}

class _PartnerRegistrationWizardState extends State<PartnerRegistrationWizard> {
  final _formKey = GlobalKey<FormState>();

  int _currentStep = 0;
  bool _isSubmitting = false;

  // Controllers
  final _businessNameCtrl = TextEditingController();
  final _ownerNameCtrl = TextEditingController();
  final _mobileCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _addressCtrl = TextEditingController();
  final _cityCtrl = TextEditingController();
  final _stateCtrl = TextEditingController(text: 'Telangana');
  final _pinCodeCtrl = TextEditingController();
  final _gstCtrl = TextEditingController();
  final _panCtrl = TextEditingController();

  // Bank Controllers
  final _accHolderCtrl = TextEditingController();
  final _bankNameCtrl = TextEditingController();
  final _accNumberCtrl = TextEditingController();
  final _confirmAccNumberCtrl = TextEditingController();
  final _ifscCtrl = TextEditingController();
  final _branchCtrl = TextEditingController();

  // Document Uploads
  final List<PartnerDocument> _documents = [];

  @override
  void initState() {
    super.initState();
    // Default document placeholders
    _documents.add(PartnerDocument(
      id: 'doc_init_1',
      name: '${widget.category.displayName}_Registration_Certificate.pdf',
      type: 'TRADE_LICENSE',
      fileUrl: 'https://cdn.cinevenue.com/uploads/sample_license.pdf',
      uploadedAt: DateTime.now().toString().substring(0, 10),
      status: 'PENDING',
    ));
    _documents.add(PartnerDocument(
      id: 'doc_init_2',
      name: 'Bank_Cancelled_Cheque_Proof.pdf',
      type: 'BANK_CHEQUE',
      fileUrl: 'https://cdn.cinevenue.com/uploads/sample_cheque.pdf',
      uploadedAt: DateTime.now().toString().substring(0, 10),
      status: 'PENDING',
    ));
  }

  @override
  void dispose() {
    _businessNameCtrl.dispose();
    _ownerNameCtrl.dispose();
    _mobileCtrl.dispose();
    _emailCtrl.dispose();
    _addressCtrl.dispose();
    _cityCtrl.dispose();
    _stateCtrl.dispose();
    _pinCodeCtrl.dispose();
    _gstCtrl.dispose();
    _panCtrl.dispose();
    _accHolderCtrl.dispose();
    _bankNameCtrl.dispose();
    _accNumberCtrl.dispose();
    _confirmAccNumberCtrl.dispose();
    _ifscCtrl.dispose();
    _branchCtrl.dispose();
    super.dispose();
  }

  void _addSampleDocument(String docType, String defaultName) {
    setState(() {
      _documents.add(PartnerDocument(
        id: 'doc_${DateTime.now().millisecondsSinceEpoch}',
        name: defaultName,
        type: docType,
        fileUrl: 'https://cdn.cinevenue.com/uploads/$defaultName',
        uploadedAt: DateTime.now().toString().substring(0, 10),
        status: 'PENDING',
      ));
    });
  }

  void _submitRegistration() {
    if (!_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: AppTheme.statusRejected,
          content: Text('Please correct the highlighted form errors before submitting.'),
        ),
      );
      return;
    }

    if (_documents.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: AppTheme.statusRejected,
          content: Text('Please upload at least one supporting business document or license.'),
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    Future.delayed(const Duration(milliseconds: 1400), () {
      final bankDetails = BankDetails(
        accountHolderName: _accHolderCtrl.text.trim().isEmpty ? _businessNameCtrl.text.trim() : _accHolderCtrl.text.trim(),
        bankName: _bankNameCtrl.text.trim().isEmpty ? 'HDFC Bank' : _bankNameCtrl.text.trim(),
        accountNumber: _accNumberCtrl.text.trim().isEmpty ? '50200099887766' : _accNumberCtrl.text.trim(),
        ifscCode: _ifscCtrl.text.trim().isEmpty ? 'HDFC0001234' : _ifscCtrl.text.trim(),
        branchName: _branchCtrl.text.trim().isEmpty ? 'Main City Branch' : _branchCtrl.text.trim(),
      );

      final newPartner = PartnerRepository().registerNewPartner(
        businessName: _businessNameCtrl.text.trim(),
        ownerName: _ownerNameCtrl.text.trim(),
        category: widget.category,
        mobile: _mobileCtrl.text.trim(),
        email: _emailCtrl.text.trim(),
        businessAddress: _addressCtrl.text.trim(),
        city: _cityCtrl.text.trim(),
        state: _stateCtrl.text.trim(),
        pinCode: _pinCodeCtrl.text.trim(),
        gstNumber: _gstCtrl.text.trim().isEmpty ? null : _gstCtrl.text.trim(),
        panNumber: _panCtrl.text.trim().isEmpty ? null : _panCtrl.text.trim(),
        bankDetails: bankDetails,
        documents: _documents,
      );

      // Log in as this newly registered pending partner so they see Application Tracking
      context.read<AuthProvider>().loginAs(
        partnerId: newPartner.id,
        role: UserRole.owner,
        type: SessionType.partner,
      );

      setState(() => _isSubmitting = false);

      Navigator.of(context).pop(); // Back to main wrapper which will now show status banner / tracking screen
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: Text('Register as ${widget.category.displayName}'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 760),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Step Indicator Header
                  Row(
                    children: [
                      _buildStepTab(0, 'Business Info'),
                      const SizedBox(width: 8),
                      _buildStepTab(1, 'Tax & Bank'),
                      const SizedBox(width: 8),
                      _buildStepTab(2, 'Documents'),
                    ],
                  ),
                  const SizedBox(height: 24),

                  if (_currentStep == 0) _buildBusinessInfoStep(),
                  if (_currentStep == 1) _buildTaxAndBankStep(),
                  if (_currentStep == 2) _buildDocumentsStep(),

                  const SizedBox(height: 32),

                  // Navigation buttons
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      if (_currentStep > 0)
                        OutlinedButton(
                          onPressed: () => setState(() => _currentStep--),
                          child: const Text('Previous Step'),
                        )
                      else
                        const SizedBox.shrink(),
                      if (_currentStep < 2)
                        ElevatedButton(
                          onPressed: () {
                            if (_currentStep == 0) {
                              if (_businessNameCtrl.text.trim().isEmpty ||
                                  _ownerNameCtrl.text.trim().isEmpty ||
                                  _mobileCtrl.text.trim().isEmpty ||
                                  _emailCtrl.text.trim().isEmpty) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    backgroundColor: AppTheme.statusRejected,
                                    content: Text('Please fill mandatory contact & entity fields.'),
                                  ),
                                );
                                return;
                              }
                            }
                            setState(() => _currentStep++);
                          },
                          child: const Text('Next: Tax & KYC'),
                        )
                      else
                        ElevatedButton.icon(
                          onPressed: _isSubmitting ? null : _submitRegistration,
                          icon: _isSubmitting
                              ? const SizedBox(
                                  width: 16,
                                  height: 16,
                                  child: CircularProgressIndicator(strokeWidth: 2),
                                )
                              : const Icon(Icons.check_circle_outline_rounded, size: 18),
                          label: Text(_isSubmitting
                              ? 'Submitting to Admin Panel...'
                              : 'Submit for Admin Approval'),
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

  Widget _buildStepTab(int stepIndex, String title) {
    final isActive = _currentStep == stepIndex;
    final isDone = _currentStep > stepIndex;

    return Expanded(
      child: InkWell(
        onTap: () => setState(() => _currentStep = stepIndex),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isActive
                ? AppTheme.gold.withOpacity(0.15)
                : isDone
                    ? AppTheme.surfaceElevated
                    : AppTheme.surface,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: isActive
                  ? AppTheme.gold
                  : isDone
                      ? AppTheme.statusApproved
                      : const Color(0xFF27272A),
            ),
          ),
          child: Column(
            children: [
              Text(
                'STEP ${stepIndex + 1}',
                style: TextStyle(
                  color: isActive ? AppTheme.gold : AppTheme.textMuted,
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.0,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                title,
                style: TextStyle(
                  color: isActive ? AppTheme.textPrimary : AppTheme.textSecondary,
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBusinessInfoStep() {
    return GoldCard(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.business_rounded, color: AppTheme.gold, size: 22),
              const SizedBox(width: 8),
              Text(
                '${widget.category.displayName} Business Details',
                style: const TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 17,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          const Text(
            'Enter the legal entity name and primary authorized representative contact info.',
            style: TextStyle(color: AppTheme.textSecondary, fontSize: 13),
          ),
          const Divider(height: 28),

          TextFormField(
            controller: _businessNameCtrl,
            decoration: const InputDecoration(
              labelText: 'Registered Business Name *',
              hintText: 'e.g. AMB Cinemas / Sunburn Arena Live',
              prefixIcon: Icon(Icons.storefront_outlined, color: AppTheme.gold),
            ),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Business name required' : null,
          ),
          const SizedBox(height: 16),

          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _ownerNameCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Authorized Owner / Director *',
                    hintText: 'Full legal name',
                    prefixIcon: Icon(Icons.person_outline, color: AppTheme.gold),
                  ),
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'Owner name required' : null,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: TextFormField(
                  controller: _mobileCtrl,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(
                    labelText: 'Mobile Number *',
                    hintText: '+91 98765 43210',
                    prefixIcon: Icon(Icons.phone_outlined, color: AppTheme.gold),
                  ),
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'Mobile required' : null,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          TextFormField(
            controller: _emailCtrl,
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(
              labelText: 'Official Business Email *',
              hintText: 'contact@business.com',
              prefixIcon: Icon(Icons.email_outlined, color: AppTheme.gold),
            ),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Email required' : null,
          ),
          const SizedBox(height: 16),

          TextFormField(
            controller: _addressCtrl,
            decoration: const InputDecoration(
              labelText: 'Business Operating Address *',
              hintText: 'Door/Plot No., Street, Landmark',
              prefixIcon: Icon(Icons.location_on_outlined, color: AppTheme.gold),
            ),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Address required' : null,
          ),
          const SizedBox(height: 16),

          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _cityCtrl,
                  decoration: const InputDecoration(
                    labelText: 'City *',
                    hintText: 'Hyderabad',
                  ),
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'City required' : null,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextFormField(
                  controller: _stateCtrl,
                  decoration: const InputDecoration(
                    labelText: 'State *',
                    hintText: 'Telangana',
                  ),
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'State required' : null,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextFormField(
                  controller: _pinCodeCtrl,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'PIN Code *',
                    hintText: '500032',
                  ),
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'PIN required' : null,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTaxAndBankStep() {
    return GoldCard(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.account_balance_rounded, color: AppTheme.gold, size: 22),
              SizedBox(width: 8),
              Text(
                'GST, PAN & Settlement Bank Account',
                style: TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 17,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          const Text(
            'Daily ticket revenue payouts are automatically disbursed to this verified bank account.',
            style: TextStyle(color: AppTheme.textSecondary, fontSize: 13),
          ),
          const Divider(height: 28),

          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _gstCtrl,
                  textCapitalization: TextCapitalization.characters,
                  decoration: const InputDecoration(
                    labelText: 'GSTIN Number (Where Applicable)',
                    hintText: '36AAAAA0000A1Z5',
                    prefixIcon: Icon(Icons.receipt_long_outlined, color: AppTheme.gold),
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: TextFormField(
                  controller: _panCtrl,
                  textCapitalization: TextCapitalization.characters,
                  decoration: const InputDecoration(
                    labelText: 'Entity / Personal PAN Details *',
                    hintText: 'ABCDE1234F',
                    prefixIcon: Icon(Icons.badge_outlined, color: AppTheme.gold),
                  ),
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'PAN details required' : null,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          const Text(
            'Direct Settlement Bank Account Details',
            style: TextStyle(
              color: AppTheme.goldLight,
              fontSize: 14,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 14),

          TextFormField(
            controller: _accHolderCtrl,
            decoration: const InputDecoration(
              labelText: 'Bank Account Holder Name *',
              hintText: 'Must match registered business or director name',
            ),
          ),
          const SizedBox(height: 14),

          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _bankNameCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Bank Name *',
                    hintText: 'HDFC Bank / ICICI / SBI',
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: TextFormField(
                  controller: _branchCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Branch Name',
                    hintText: 'Gachibowli Branch',
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _accNumberCtrl,
                  keyboardType: TextInputType.number,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: 'Bank Account Number *',
                    hintText: '50200012345678',
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: TextFormField(
                  controller: _ifscCtrl,
                  textCapitalization: TextCapitalization.characters,
                  decoration: const InputDecoration(
                    labelText: 'IFSC Code *',
                    hintText: 'HDFC0001234',
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDocumentsStep() {
    return GoldCard(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.upload_file_rounded, color: AppTheme.gold, size: 22),
              const SizedBox(width: 8),
              Text(
                'Supporting Business Documents',
                style: const TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 17,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          const Text(
            'Upload mandatory compliance documents for CineVenue Admin Panel verification. Clear PDFs or JPGs are accepted.',
            style: TextStyle(color: AppTheme.textSecondary, fontSize: 13),
          ),
          const Divider(height: 28),

          // Action buttons to add documents
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: [
              OutlinedButton.icon(
                onPressed: () => _addSampleDocument('GST', 'GST_Registration_Certificate.pdf'),
                icon: const Icon(Icons.add, size: 16),
                label: const Text('+ GST Certificate'),
              ),
              OutlinedButton.icon(
                onPressed: () => _addSampleDocument('PAN', 'Business_PAN_Card.pdf'),
                icon: const Icon(Icons.add, size: 16),
                label: const Text('+ PAN Card'),
              ),
              OutlinedButton.icon(
                onPressed: () => _addSampleDocument('TRADE_LICENSE', 'Municipality_Trade_License.pdf'),
                icon: const Icon(Icons.add, size: 16),
                label: const Text('+ Trade / Theatre License'),
              ),
              OutlinedButton.icon(
                onPressed: () => _addSampleDocument('IDENTITY_PROOF', 'Director_Aadhaar_Passport.pdf'),
                icon: const Icon(Icons.add, size: 16),
                label: const Text('+ ID Proof'),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // List of uploaded files
          ..._documents.map((doc) => Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.surfaceElevated,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFF27272A)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.picture_as_pdf_rounded, color: Colors.redAccent, size: 24),
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
                            'Category: ${doc.type} • Uploaded today',
                            style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete_outline, size: 18, color: Colors.grey),
                      onPressed: () {
                        setState(() {
                          _documents.remove(doc);
                        });
                      },
                    ),
                  ],
                ),
              )),

          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.gold.withOpacity(0.08),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppTheme.gold.withOpacity(0.3)),
            ),
            child: const Row(
              children: [
                Icon(Icons.shield_outlined, color: AppTheme.gold, size: 20),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'All uploaded credentials and tax records are strictly stored on CineVenue enterprise encrypted servers with bank-grade security.',
                    style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
