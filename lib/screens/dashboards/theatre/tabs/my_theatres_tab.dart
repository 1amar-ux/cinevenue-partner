import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../providers/theatre_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/gold_card.dart';
import '../../../../models/theatre.dart';

class MyTheatresTab extends StatelessWidget {
  const MyTheatresTab({super.key});

  @override
  Widget build(BuildContext context) {
    final theatreProv = context.watch<TheatreProvider>();
    final theatres = theatreProv.theatres;
    final selected = theatreProv.selectedTheatre;

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
                    'Registered Theatres & Locations',
                    style: TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${theatres.length} Properties Registered Under Your Account',
                    style: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                  ),
                ],
              ),
              ElevatedButton.icon(
                onPressed: () => _showAddTheatreDialog(context, theatreProv),
                icon: const Icon(Icons.add_business_rounded, size: 16),
                label: const Text('Add Theatre'),
              ),
            ],
          ),
          const SizedBox(height: 16),

          ...theatres.map((t) {
            final isCurrent = t.id == selected?.id;
            return Container(
              margin: const EdgeInsets.only(bottom: 14),
              child: GoldCard(
                borderColor: isCurrent ? AppTheme.gold : null,
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: isCurrent ? AppTheme.gold.withOpacity(0.15) : AppTheme.surfaceElevated,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(
                              color: isCurrent ? AppTheme.gold : const Color(0xFF27272A),
                            ),
                          ),
                          child: Icon(
                            Icons.theaters_rounded,
                            size: 28,
                            color: isCurrent ? AppTheme.gold : AppTheme.textSecondary,
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      t.name,
                                      style: TextStyle(
                                        color: isCurrent ? AppTheme.gold : AppTheme.textPrimary,
                                        fontSize: 16,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                  ),
                                  if (isCurrent)
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: AppTheme.gold,
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                      child: const Text(
                                        'ACTIVE DASHBOARD',
                                        style: TextStyle(
                                          color: Colors.black,
                                          fontSize: 10,
                                          fontWeight: FontWeight.w900,
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '${t.address}, ${t.city}, ${t.state}',
                                style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Phone: ${t.phone} • Status: ${t.status}',
                                style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 24),

                    Row(
                      children: [
                        _buildBadge(Icons.tv_rounded, '${t.totalScreens} Registered Screens'),
                        const SizedBox(width: 16),
                        _buildBadge(Icons.groups_rounded, 'Capacity: ${t.totalCapacity} Seats'),
                        const Spacer(),
                        if (!isCurrent)
                          OutlinedButton(
                            onPressed: () {
                              theatreProv.selectTheatre(t.id);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  backgroundColor: AppTheme.surfaceElevated,
                                  content: Text('Switched active management to ${t.name}'),
                                ),
                              );
                            },
                            child: const Text('Manage This Location'),
                          )
                        else
                          const Row(
                            children: [
                              Icon(Icons.check_circle_rounded, color: AppTheme.statusApproved, size: 16),
                              SizedBox(width: 6),
                              Text(
                                'Currently Managing',
                                style: TextStyle(color: AppTheme.statusApproved, fontSize: 12, fontWeight: FontWeight.w700),
                              ),
                            ],
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildBadge(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 15, color: AppTheme.goldLight),
        const SizedBox(width: 6),
        Text(text, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
      ],
    );
  }

  void _showAddTheatreDialog(BuildContext context, TheatreProvider theatreProv) {
    final nameCtrl = TextEditingController();
    final addressCtrl = TextEditingController();
    final cityCtrl = TextEditingController(text: 'Hyderabad');
    final stateCtrl = TextEditingController(text: 'Telangana');
    final phoneCtrl = TextEditingController();
    final screensCtrl = TextEditingController(text: '3');
    final capacityCtrl = TextEditingController(text: '600');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppTheme.surfaceBorder),
        ),
        title: const Text('Register New Theatre Property',
            style: TextStyle(color: AppTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.bold)),
        content: SizedBox(
          width: 480,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameCtrl,
                  decoration: const InputDecoration(labelText: 'Theatre Name *', hintText: 'AMB Cineplex Kukatpally'),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: addressCtrl,
                  decoration: const InputDecoration(labelText: 'Address *', hintText: 'Near Metro Station'),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(child: TextField(controller: cityCtrl, decoration: const InputDecoration(labelText: 'City'))),
                    const SizedBox(width: 10),
                    Expanded(child: TextField(controller: stateCtrl, decoration: const InputDecoration(labelText: 'State'))),
                  ],
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: phoneCtrl,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(labelText: 'Phone Number', hintText: '+91 40 6800 0000'),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: screensCtrl,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(labelText: 'Screens Count'),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: TextField(
                        controller: capacityCtrl,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(labelText: 'Total Capacity'),
                      ),
                    ),
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
              if (nameCtrl.text.trim().isEmpty || addressCtrl.text.trim().isEmpty) return;
              final newTheatre = Theatre(
                id: 'th_${DateTime.now().millisecondsSinceEpoch}',
                partnerBusinessId: theatreProv.partnerId,
                name: nameCtrl.text.trim(),
                address: addressCtrl.text.trim(),
                city: cityCtrl.text.trim(),
                state: stateCtrl.text.trim(),
                phone: phoneCtrl.text.trim().isEmpty ? '+91 40 0000 0000' : phoneCtrl.text.trim(),
                status: 'ACTIVE',
                totalScreens: int.tryParse(screensCtrl.text) ?? 3,
                totalCapacity: int.tryParse(capacityCtrl.text) ?? 600,
              );
              theatreProv.selectTheatre(newTheatre.id);
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  backgroundColor: AppTheme.statusApproved,
                  content: Text('${newTheatre.name} successfully registered to your partner account!'),
                ),
              );
            },
            child: const Text('Register Location'),
          ),
        ],
      ),
    );
  }
}

