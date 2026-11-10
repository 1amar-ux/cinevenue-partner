import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/event_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/gold_card.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../models/event.dart';

class EventOrganizerDashboardScreen extends StatefulWidget {
  const EventOrganizerDashboardScreen({super.key});

  @override
  State<EventOrganizerDashboardScreen> createState() => _EventOrganizerDashboardScreenState();
}

class _EventOrganizerDashboardScreenState extends State<EventOrganizerDashboardScreen> {
  int _activeTab = 0; // 0: Events, 1: Attendee Scanner, 2: Financials

  @override
  Widget build(BuildContext context) {
    final eventProv = context.watch<EventProvider>();

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: Column(
        children: [
          // Sub-navigation bar
          Container(
            color: AppTheme.surface,
            padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 10),
            child: Row(
              children: [
                ChoiceChip(
                  label: const Text('My Events', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  selected: _activeTab == 0,
                  selectedColor: AppTheme.gold,
                  onSelected: (v) => setState(() => _activeTab = 0),
                ),
                const SizedBox(width: 8),
                ChoiceChip(
                  label: const Text('Gate QR Scanner', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  selected: _activeTab == 1,
                  selectedColor: AppTheme.gold,
                  onSelected: (v) => setState(() => _activeTab = 1),
                ),
                const SizedBox(width: 8),
                ChoiceChip(
                  label: const Text('Revenue & Payouts', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  selected: _activeTab == 2,
                  selectedColor: AppTheme.gold,
                  onSelected: (v) => setState(() => _activeTab = 2),
                ),
              ],
            ),
          ),

          Expanded(
            child: _activeTab == 0
                ? _buildEventsListTab(context, eventProv)
                : _activeTab == 1
                    ? _buildGateScannerTab(context, eventProv)
                    : _buildFinancialsTab(context, eventProv),
          ),
        ],
      ),
      floatingActionButton: _activeTab == 0
          ? FloatingActionButton.extended(
              backgroundColor: AppTheme.gold,
              foregroundColor: Colors.black,
              onPressed: () => _showCreateEventModal(context, eventProv),
              icon: const Icon(Icons.add),
              label: const Text('Publish Event', style: TextStyle(fontWeight: FontWeight.bold)),
            )
          : null,
    );
  }

  Widget _buildEventsListTab(BuildContext context, EventProvider eventProv) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Metric Cards
          Row(
            children: [
              Expanded(
                child: GoldCard(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Total Event Revenue', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                      const SizedBox(height: 6),
                      Text(
                        CurrencyFormatter.formatCompact(eventProv.totalRevenue),
                        style: const TextStyle(color: AppTheme.gold, fontSize: 20, fontWeight: FontWeight.w900),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: GoldCard(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Total Attendees Checked-in', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                      const SizedBox(height: 6),
                      Text(
                        '${eventProv.totalCheckedIn} / ${eventProv.totalAttendees}',
                        style: const TextStyle(color: AppTheme.statusApproved, fontSize: 20, fontWeight: FontWeight.w900),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),

          const Text(
            'Live & Upcoming Events',
            style: TextStyle(color: AppTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),

          ...eventProv.events.map((ev) => Container(
                margin: const EdgeInsets.only(bottom: 16),
                child: GoldCard(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.network(
                              ev.bannerUrl,
                              width: 80,
                              height: 80,
                              fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => Container(
                                width: 80,
                                height: 80,
                                color: AppTheme.surfaceElevated,
                                child: const Icon(Icons.music_note, color: AppTheme.gold),
                              ),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: AppTheme.gold.withOpacity(0.12),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    ev.category.toUpperCase(),
                                    style: const TextStyle(color: AppTheme.gold, fontSize: 9, fontWeight: FontWeight.w800),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  ev.title,
                                  style: const TextStyle(
                                    color: AppTheme.textPrimary,
                                    fontSize: 15,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  '${ev.venue}, ${ev.city}',
                                  style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  '${ev.date} • ${ev.time}',
                                  style: const TextStyle(color: AppTheme.goldLight, fontSize: 11, fontWeight: FontWeight.w600),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const Divider(height: 20),

                      // Ticket Tiers
                      const Text('Ticket Inventory & Tiers:', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: ev.ticketTiers.map((t) {
                          return Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: AppTheme.surfaceElevated,
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(color: const Color(0xFF27272A)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(t.name, style: const TextStyle(color: AppTheme.textPrimary, fontSize: 11, fontWeight: FontWeight.w600)),
                                Text('₹${t.price.toInt()} • Sold: ${t.soldCount}/${t.totalCapacity}', style: const TextStyle(color: AppTheme.gold, fontSize: 11, fontWeight: FontWeight.bold)),
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

  Widget _buildGateScannerTab(BuildContext context, EventProvider eventProv) {
    final ticketCodeCtrl = TextEditingController(text: 'CV-EVT-77291');
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 540),
          child: GoldCard(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                const Icon(Icons.qr_code_scanner_rounded, size: 60, color: AppTheme.gold),
                const SizedBox(height: 12),
                const Text(
                  'Event Door Gate Scanner',
                  style: TextStyle(color: AppTheme.textPrimary, fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Scan digital attendee ticket pass QR codes to validate entry and prevent duplicate admissions.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                ),
                const SizedBox(height: 20),

                TextField(
                  controller: ticketCodeCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Ticket Passcode / QR Code',
                    hintText: 'CV-EVT-77291',
                    prefixIcon: Icon(Icons.qr_code, color: AppTheme.gold),
                  ),
                ),
                const SizedBox(height: 16),

                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      final evId = eventProv.events.first.id;
                      eventProv.checkInAttendee(evId, ticketCodeCtrl.text.trim());
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          backgroundColor: AppTheme.statusApproved,
                          content: Text('TICKET VALID! Attendee admitted to Sunburn Arena.'),
                        ),
                      );
                    },
                    icon: const Icon(Icons.check_circle_outline, size: 18),
                    label: const Text('Verify & Check-In Attendee'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFinancialsTab(BuildContext context, EventProvider eventProv) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          GoldCard(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Gross Ticket Sales', style: TextStyle(color: AppTheme.textSecondary, fontSize: 13)),
                const SizedBox(height: 6),
                Text(
                  CurrencyFormatter.format(eventProv.totalRevenue),
                  style: const TextStyle(color: AppTheme.gold, fontSize: 26, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 4),
                const Text('CineVenue 5% Platform Commission Deducted at Payout Cycle', style: TextStyle(color: AppTheme.textMuted, fontSize: 12)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showCreateEventModal(BuildContext context, EventProvider eventProv) {
    final titleCtrl = TextEditingController();
    final catCtrl = TextEditingController(text: 'EDM Concert');
    final descCtrl = TextEditingController();
    final dateCtrl = TextEditingController(text: '28 Dec 2026');
    final timeCtrl = TextEditingController(text: '06:00 PM');
    final venueCtrl = TextEditingController(text: 'GMR Arena Shamshabad');
    final gaPriceCtrl = TextEditingController(text: '1299');
    final vipPriceCtrl = TextEditingController(text: '2999');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppTheme.surfaceBorder),
        ),
        title: const Text('Publish New Live Event', style: TextStyle(color: AppTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.bold)),
        content: SizedBox(
          width: 480,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(controller: titleCtrl, decoration: const InputDecoration(labelText: 'Event Title *', hintText: 'Martin Garrix Live')),
                const SizedBox(height: 10),
                TextField(controller: catCtrl, decoration: const InputDecoration(labelText: 'Category', hintText: 'Music / Standup / Expo')),
                const SizedBox(height: 10),
                TextField(controller: descCtrl, maxLines: 2, decoration: const InputDecoration(labelText: 'Description')),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(child: TextField(controller: dateCtrl, decoration: const InputDecoration(labelText: 'Date'))),
                    const SizedBox(width: 8),
                    Expanded(child: TextField(controller: timeCtrl, decoration: const InputDecoration(labelText: 'Time'))),
                  ],
                ),
                const SizedBox(height: 10),
                TextField(controller: venueCtrl, decoration: const InputDecoration(labelText: 'Venue & Location')),
                const SizedBox(height: 12),
                const Text('Ticket Tier Pricing (₹):', style: TextStyle(color: AppTheme.gold, fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(child: TextField(controller: gaPriceCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'General Pass'))),
                    const SizedBox(width: 8),
                    Expanded(child: TextField(controller: vipPriceCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'VIP Lounge'))),
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
              if (titleCtrl.text.trim().isEmpty) return;
              eventProv.createEvent(
                title: titleCtrl.text.trim(),
                category: catCtrl.text.trim(),
                description: descCtrl.text.trim(),
                bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500',
                date: dateCtrl.text.trim(),
                time: timeCtrl.text.trim(),
                city: 'Hyderabad',
                venue: venueCtrl.text.trim(),
                ticketTiers: [
                  TicketTier(
                    id: 'tt_new_1',
                    name: 'General Admission',
                    price: double.tryParse(gaPriceCtrl.text) ?? 1299.0,
                    totalCapacity: 2000,
                    soldCount: 0,
                  ),
                  TicketTier(
                    id: 'tt_new_2',
                    name: 'VIP Experience',
                    price: double.tryParse(vipPriceCtrl.text) ?? 2999.0,
                    totalCapacity: 500,
                    soldCount: 0,
                  ),
                ],
              );
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  backgroundColor: AppTheme.statusApproved,
                  content: Text('Event published live to CineVenue customer app!'),
                ),
              );
            },
            child: const Text('Publish Event'),
          ),
        ],
      ),
    );
  }
}

