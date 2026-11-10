import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../providers/theatre_provider.dart';
import '../../../../providers/auth_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/gold_card.dart';
import '../../../../core/utils/currency_formatter.dart';

class PaymentsTab extends StatelessWidget {
  const PaymentsTab({super.key});

  @override
  Widget build(BuildContext context) {
    final theatreProv = context.watch<TheatreProvider>();
    final auth = context.watch<AuthProvider>();
    final partner = auth.currentPartner;
    final settlements = theatreProv.settlements;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Settlements & Bank Payouts',
                    style: TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Direct Bank Disbursements via CineVenue Escrow',
                    style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Payout Overview Card
          GoldCard(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Upcoming Settlement Payout',
                      style: TextStyle(color: AppTheme.textSecondary, fontSize: 13, fontWeight: FontWeight.w600),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.blue.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text(
                        'CYCLE: 08 - 14 NOV',
                        style: TextStyle(color: Colors.blueAccent, fontSize: 10, fontWeight: FontWeight.w800),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  CurrencyFormatter.format(267714.5),
                  style: const TextStyle(
                    color: AppTheme.gold,
                    fontSize: 28,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Gross Bookings: ₹2,84,500.00 • CineVenue Fee: ₹14,225.00 (5%) • Net Payout Scheduled for 15 Nov',
                  style: TextStyle(color: AppTheme.textMuted, fontSize: 12),
                ),
                const Divider(height: 24),

                // Bank Account Details Snapshot
                Row(
                  children: [
                    const Icon(Icons.account_balance_rounded, size: 20, color: AppTheme.goldLight),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Disbursing to: ${partner?.bankDetails.bankName ?? 'HDFC Bank'} (${partner?.bankDetails.maskedAccount ?? '••••1234'})',
                            style: const TextStyle(color: AppTheme.textPrimary, fontSize: 13, fontWeight: FontWeight.w600),
                          ),
                          Text(
                            'IFSC: ${partner?.bankDetails.ifscCode ?? 'HDFC0001234'} • Holder: ${partner?.bankDetails.accountHolderName ?? 'AMB Cinemas'}',
                            style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppTheme.statusApproved.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text(
                        'VERIFIED BANK',
                        style: TextStyle(color: AppTheme.statusApproved, fontSize: 10, fontWeight: FontWeight.w700),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Settlement History Table
          const Text(
            'Settlement Disbursement History',
            style: TextStyle(color: AppTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),

          ...settlements.map((s) => Container(
                margin: const EdgeInsets.only(bottom: 12),
                child: GoldCard(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            s.cycle,
                            style: const TextStyle(
                              color: AppTheme.textPrimary,
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: s.status == 'SETTLED'
                                  ? AppTheme.statusApproved.withOpacity(0.15)
                                  : Colors.blue.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              s.status,
                              style: TextStyle(
                                color: s.status == 'SETTLED' ? AppTheme.statusApproved : Colors.blueAccent,
                                fontSize: 10,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _buildDetailCol('Gross Sales', CurrencyFormatter.format(s.grossRevenue)),
                          _buildDetailCol('Platform Fee (5%)', CurrencyFormatter.format(s.platformFee)),
                          _buildDetailCol('TDS / GST', CurrencyFormatter.format(s.gstDeduction)),
                          _buildDetailCol('Net Disbursed', CurrencyFormatter.format(s.netPayout), isHighlight: true),
                        ],
                      ),
                      const Divider(height: 20),
                      Row(
                        children: [
                          const Icon(Icons.receipt_outlined, size: 14, color: AppTheme.gold),
                          const SizedBox(width: 6),
                          Text(
                            'Bank Ref: ${s.bankRef}',
                            style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                          ),
                          const Spacer(),
                          Text(
                            s.settledAt,
                            style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              )),
        ],
      ),
    );
  }

  Widget _buildDetailCol(String title, String val, {bool isHighlight = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(color: AppTheme.textMuted, fontSize: 11)),
        const SizedBox(height: 2),
        Text(
          val,
          style: TextStyle(
            color: isHighlight ? AppTheme.gold : AppTheme.textPrimary,
            fontSize: 13,
            fontWeight: FontWeight.w700,
          ),
        ),
      ],
    );
  }
}

