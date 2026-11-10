import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../providers/theatre_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/gold_card.dart';

class ScreenManagementTab extends StatelessWidget {
  const ScreenManagementTab({super.key});

  @override
  Widget build(BuildContext context) {
    final theatreProv = context.watch<TheatreProvider>();
    final screens = theatreProv.screens;

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
                    'Screens & Seating Layouts',
                    style: TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${screens.length} Screens Configured in ${theatreProv.selectedTheatre?.name ?? 'Theatre'}',
                    style: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                  ),
                ],
              ),
              ElevatedButton.icon(
                onPressed: () => _showAddScreenDialog(context, theatreProv),
                icon: const Icon(Icons.add, size: 16),
                label: const Text('Add Screen'),
              ),
            ],
          ),
          const SizedBox(height: 16),

          ...screens.map((s) => Container(
                margin: const EdgeInsets.only(bottom: 14),
                child: GoldCard(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: AppTheme.gold.withOpacity(0.12),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Icon(Icons.display_settings_rounded, color: AppTheme.gold, size: 24),
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    s.name,
                                    style: const TextStyle(
                                      color: AppTheme.textPrimary,
                                      fontSize: 16,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '${s.format} • ${s.rows} Rows × ${s.seatsPerRow} Seats = ${s.totalSeats} Total Capacity',
                                    style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppTheme.surfaceElevated,
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(color: AppTheme.surfaceBorder),
                            ),
                            child: Text(
                              s.format,
                              style: const TextStyle(
                                color: AppTheme.goldLight,
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const Divider(height: 24),

                      // Seating Categories & Base Pricing
                      const Text(
                        'Category Seating Pricing Structure:',
                        style: TextStyle(color: AppTheme.textSecondary, fontSize: 13, fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(height: 10),

                      Wrap(
                        spacing: 10,
                        runSpacing: 10,
                        children: s.pricing.entries.map((entry) {
                          Color badgeColor = AppTheme.gold;
                          if (entry.key == 'VIP') badgeColor = Colors.amber;
                          if (entry.key == 'PREMIUM') badgeColor = Colors.purpleAccent;
                          if (entry.key == 'EXECUTIVE') badgeColor = Colors.blueAccent;
                          if (entry.key == 'CLASSIC') badgeColor = Colors.tealAccent;

                          return Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            decoration: BoxDecoration(
                              color: AppTheme.surfaceElevated,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: badgeColor.withOpacity(0.4)),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  entry.key,
                                  style: TextStyle(
                                    color: badgeColor,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  '₹${entry.value.toInt()}',
                                  style: const TextStyle(
                                    color: AppTheme.textPrimary,
                                    fontSize: 13,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                      ),
                    ],
                  ),
                ),
              )),
        ],
      ),
    );
  }

  void _showAddScreenDialog(BuildContext context, TheatreProvider theatreProv) {
    final nameCtrl = TextEditingController(text: 'Screen ${theatreProv.screens.length + 1}');
    String selectedFormat = 'Dolby Atmos 4K';
    final rowsCtrl = TextEditingController(text: '8');
    final seatsPerRowCtrl = TextEditingController(text: '12');
    final vipPriceCtrl = TextEditingController(text: '350');
    final premPriceCtrl = TextEditingController(text: '250');
    final execPriceCtrl = TextEditingController(text: '180');
    final classicPriceCtrl = TextEditingController(text: '120');

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          backgroundColor: AppTheme.surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: AppTheme.surfaceBorder),
          ),
          title: const Text('Add Screen to Current Theatre',
              style: TextStyle(color: AppTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.bold)),
          content: SizedBox(
            width: 480,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: nameCtrl,
                    decoration: const InputDecoration(labelText: 'Screen Identifier', hintText: 'Screen 4 (VIP Lounge)'),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: selectedFormat,
                    dropdownColor: AppTheme.surfaceElevated,
                    decoration: const InputDecoration(labelText: 'Projection & Audio Format'),
                    items: const [
                      DropdownMenuItem(value: 'IMAX 3D', child: Text('IMAX 3D Laser')),
                      DropdownMenuItem(value: 'Dolby Atmos 4K', child: Text('Dolby Atmos 4K')),
                      DropdownMenuItem(value: 'VIP Lounge', child: Text('VIP Recliner Lounge')),
                      DropdownMenuItem(value: 'Standard 2D', child: Text('Standard 2D Cinema')),
                    ],
                    onChanged: (val) {
                      if (val != null) setDialogState(() => selectedFormat = val);
                    },
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: rowsCtrl,
                          keyboardType: TextInputType.number,
                          decoration: const InputDecoration(labelText: 'Rows (A-Z)'),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: TextField(
                          controller: seatsPerRowCtrl,
                          keyboardType: TextInputType.number,
                          decoration: const InputDecoration(labelText: 'Seats Per Row'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Text('Category Pricing (₹):', style: TextStyle(color: AppTheme.gold, fontSize: 13, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(child: TextField(controller: vipPriceCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'VIP'))),
                      const SizedBox(width: 8),
                      Expanded(child: TextField(controller: premPriceCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Premium'))),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(child: TextField(controller: execPriceCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Executive'))),
                      const SizedBox(width: 8),
                      Expanded(child: TextField(controller: classicPriceCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Classic'))),
                    ],
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel', style: TextStyle(color: AppTheme.textMuted))),
            ElevatedButton(
              onPressed: () {
                final rows = int.tryParse(rowsCtrl.text) ?? 8;
                final perRow = int.tryParse(seatsPerRowCtrl.text) ?? 12;
                theatreProv.createScreen(
                  name: nameCtrl.text.trim(),
                  format: selectedFormat,
                  rows: rows,
                  seatsPerRow: perRow,
                  pricing: {
                    'VIP': double.tryParse(vipPriceCtrl.text) ?? 350.0,
                    'PREMIUM': double.tryParse(premPriceCtrl.text) ?? 250.0,
                    'EXECUTIVE': double.tryParse(execPriceCtrl.text) ?? 180.0,
                    'CLASSIC': double.tryParse(classicPriceCtrl.text) ?? 120.0,
                  },
                );
                Navigator.pop(ctx);
              },
              child: const Text('Create Screen Layout'),
            ),
          ],
        ),
      ),
    );
  }
}
