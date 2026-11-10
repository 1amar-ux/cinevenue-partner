import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../providers/theatre_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/gold_card.dart';

class MovieSchedulerTab extends StatelessWidget {
  const MovieSchedulerTab({super.key});

  @override
  Widget build(BuildContext context) {
    final theatreProv = context.watch<TheatreProvider>();
    final shows = theatreProv.shows;

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
                    'Movie & Show Scheduler',
                    style: TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${shows.length} Scheduled Shows • Live on CineVenue App',
                    style: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                  ),
                ],
              ),
              ElevatedButton.icon(
                onPressed: () => _showScheduleModal(context, theatreProv),
                icon: const Icon(Icons.add, size: 16),
                label: const Text('Schedule Show'),
              ),
            ],
          ),
          const SizedBox(height: 16),

          ...shows.map((show) => Container(
                margin: const EdgeInsets.only(bottom: 12),
                child: GoldCard(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(
                          show.moviePoster,
                          width: 64,
                          height: 84,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(
                            width: 64,
                            height: 84,
                            color: AppTheme.surfaceElevated,
                            child: const Icon(Icons.movie_filter, color: AppTheme.gold),
                          ),
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
                                    show.movieTitle,
                                    style: const TextStyle(
                                      color: AppTheme.textPrimary,
                                      fontSize: 15,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: AppTheme.gold.withOpacity(0.12),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    show.format,
                                    style: const TextStyle(
                                      color: AppTheme.gold,
                                      fontSize: 10,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${show.screenName} • Language: ${show.language}',
                              style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                            ),
                            const SizedBox(height: 6),
                            Row(
                              children: [
                                const Icon(Icons.access_time_rounded, size: 14, color: AppTheme.gold),
                                const SizedBox(width: 4),
                                Text(
                                  '${show.startTime} to ${show.endTime}',
                                  style: const TextStyle(color: AppTheme.goldLight, fontSize: 12, fontWeight: FontWeight.w600),
                                ),
                                const SizedBox(width: 12),
                                Text(
                                  'Base Ticket: ₹${show.ticketPrice.toInt()}',
                                  style: const TextStyle(color: AppTheme.textPrimary, fontSize: 12, fontWeight: FontWeight.w600),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),

                            // Progress Occupancy Bar
                            ClipRRect(
                              borderRadius: BorderRadius.circular(4),
                              child: LinearProgressIndicator(
                                value: show.totalSeats > 0 ? show.bookedSeats / show.totalSeats : 0,
                                backgroundColor: const Color(0xFF27272A),
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  show.occupancyPercentage > 80 ? Colors.redAccent : AppTheme.gold,
                                ),
                                minHeight: 6,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  '${show.bookedSeats} Booked (${show.occupancyPercentage.toStringAsFixed(0)}% Occupancy)',
                                  style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                                ),
                                Text(
                                  '${show.availableSeats} Available',
                                  style: const TextStyle(color: AppTheme.statusApproved, fontSize: 11, fontWeight: FontWeight.w600),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              )),
        ],
      ),
    );
  }

  void _showScheduleModal(BuildContext context, TheatreProvider theatreProv) {
    if (theatreProv.screens.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please add at least one screen before scheduling shows.')),
      );
      return;
    }

    final movieTitleCtrl = TextEditingController(text: 'Game Changer');
    final startTimeCtrl = TextEditingController(text: '07:00 PM');
    final endTimeCtrl = TextEditingController(text: '10:15 PM');
    final priceCtrl = TextEditingController(text: '280');
    String selectedScreenId = theatreProv.screens.first.id;
    String selectedLanguage = 'Telugu';
    String selectedFormat = '2D';

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          backgroundColor: AppTheme.surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: AppTheme.surfaceBorder),
          ),
          title: const Text('Schedule New Movie Show',
              style: TextStyle(color: AppTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.bold)),
          content: SizedBox(
            width: 480,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: movieTitleCtrl,
                    decoration: const InputDecoration(labelText: 'Movie Title *', hintText: 'Pushpa 2 / Devara'),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: selectedScreenId,
                    dropdownColor: AppTheme.surfaceElevated,
                    decoration: const InputDecoration(labelText: 'Target Screen'),
                    items: theatreProv.screens.map((s) {
                      return DropdownMenuItem(value: s.id, child: Text('${s.name} (${s.format})'));
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) setDialogState(() => selectedScreenId = val);
                    },
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          value: selectedLanguage,
                          dropdownColor: AppTheme.surfaceElevated,
                          decoration: const InputDecoration(labelText: 'Language'),
                          items: const [
                            DropdownMenuItem(value: 'Telugu', child: Text('Telugu')),
                            DropdownMenuItem(value: 'Hindi', child: Text('Hindi')),
                            DropdownMenuItem(value: 'Tamil', child: Text('Tamil')),
                            DropdownMenuItem(value: 'English', child: Text('English')),
                          ],
                          onChanged: (v) => setDialogState(() => selectedLanguage = v!),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          value: selectedFormat,
                          dropdownColor: AppTheme.surfaceElevated,
                          decoration: const InputDecoration(labelText: 'Format'),
                          items: const [
                            DropdownMenuItem(value: '2D', child: Text('2D')),
                            DropdownMenuItem(value: '3D', child: Text('3D')),
                            DropdownMenuItem(value: 'IMAX 3D', child: Text('IMAX 3D')),
                            DropdownMenuItem(value: '4DX', child: Text('4DX')),
                          ],
                          onChanged: (v) => setDialogState(() => selectedFormat = v!),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: startTimeCtrl,
                          decoration: const InputDecoration(labelText: 'Start Time', hintText: '02:30 PM'),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: TextField(
                          controller: endTimeCtrl,
                          decoration: const InputDecoration(labelText: 'End Time', hintText: '05:45 PM'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: priceCtrl,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Base Ticket Price (₹)', hintText: '250'),
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel', style: TextStyle(color: AppTheme.textMuted))),
            ElevatedButton(
              onPressed: () {
                final scr = theatreProv.screens.firstWhere((s) => s.id == selectedScreenId);
                theatreProv.scheduleShow(
                  screenId: scr.id,
                  screenName: scr.name,
                  movieTitle: movieTitleCtrl.text.trim(),
                  moviePoster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
                  startTime: startTimeCtrl.text.trim(),
                  endTime: endTimeCtrl.text.trim(),
                  date: 'Today',
                  language: selectedLanguage,
                  format: selectedFormat,
                  ticketPrice: double.tryParse(priceCtrl.text) ?? 250.0,
                  totalSeats: scr.totalSeats,
                );
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    backgroundColor: AppTheme.statusApproved,
                    content: Text('Show scheduled and published to CineVenue live customer app!'),
                  ),
                );
              },
              child: const Text('Publish Show'),
            ),
          ],
        ),
      ),
    );
  }
}

