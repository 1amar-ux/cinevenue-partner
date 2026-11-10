import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/theatre_provider.dart';
import '../theme/app_theme.dart';
import '../../models/partner_category.dart';

class BrandHeader extends StatelessWidget implements PreferredSizeWidget {
  const BrandHeader({super.key});

  @override
  Size get preferredSize => const Size.fromHeight(68);

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final session = auth.currentSession;
    final partner = auth.currentPartner;
    final theatreProv = context.watch<TheatreProvider>();

    return AppBar(
      automaticallyImplyLeading: false,
      backgroundColor: const Color(0xFF0F0F12),
      elevation: 0,
      titleSpacing: 16,
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(1),
        child: Container(
          color: const Color(0x33D4AF37),
          height: 1,
        ),
      ),
      title: Row(
        children: [
          // CineVenue Official Brand Badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF231F10), Color(0xFF14130A)],
              ),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppTheme.gold, width: 1.2),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.movie_filter_rounded, size: 20, color: AppTheme.gold),
                const SizedBox(width: 8),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      'CINEVENUE',
                      style: TextStyle(
                        color: AppTheme.gold,
                        fontSize: 13,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 2.0,
                        height: 1.0,
                      ),
                    ),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                          decoration: BoxDecoration(
                            color: AppTheme.gold,
                            borderRadius: BorderRadius.circular(2),
                          ),
                          child: const Text(
                            'PARTNER',
                            style: TextStyle(
                              color: Colors.black,
                              fontSize: 8,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 14),

          // Business / Location Info
          if (partner != null)
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    children: [
                      Flexible(
                        child: Text(
                          partner.businessName,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: AppTheme.textPrimary,
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
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
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  // Multi-location switcher if partner is a theatre partner
                  if (partner.category == PartnerCategory.theatrePartner &&
                      theatreProv.theatres.isNotEmpty)
                    InkWell(
                      onTap: () => _showLocationSelector(context, theatreProv),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.location_on, size: 12, color: AppTheme.gold),
                          const SizedBox(width: 4),
                          Text(
                            theatreProv.selectedTheatre?.name ?? 'Select Theatre',
                            style: const TextStyle(
                              color: AppTheme.textSecondary,
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                              decoration: TextDecoration.underline,
                            ),
                          ),
                          const Icon(Icons.arrow_drop_down, size: 16, color: AppTheme.gold),
                        ],
                      ),
                    )
                  else
                    Text(
                      '${partner.city}, ${partner.state}',
                      style: const TextStyle(
                        color: AppTheme.textMuted,
                        fontSize: 11,
                      ),
                    ),
                ],
              ),
            )
          else
            const Expanded(
              child: Text(
                'Enterprise Partner App',
                style: TextStyle(
                  color: AppTheme.textSecondary,
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),

          // Role Badge and Account Popup Menu
          if (session != null) ...[
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: session.isOwner
                    ? AppTheme.gold.withOpacity(0.15)
                    : session.isManager
                        ? Colors.blue.withOpacity(0.15)
                        : Colors.teal.withOpacity(0.15),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(
                  color: session.isOwner
                      ? AppTheme.gold
                      : session.isManager
                          ? Colors.blue
                          : Colors.teal,
                  width: 0.8,
                ),
              ),
              child: Text(
                session.role.name.toUpperCase(),
                style: TextStyle(
                  color: session.isOwner
                      ? AppTheme.gold
                      : session.isManager
                          ? Colors.blue
                          : Colors.teal,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            const SizedBox(width: 8),
            PopupMenuButton<String>(
              icon: const Icon(Icons.account_circle_outlined, color: AppTheme.gold),
              color: AppTheme.surfaceElevated,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
                side: const BorderSide(color: AppTheme.surfaceBorder),
              ),
              onSelected: (val) {
                if (val == 'switch_role') {
                  auth.showRoleSwitcherDialog(context);
                } else if (val == 'logout') {
                  auth.logout();
                }
              },
              itemBuilder: (ctx) => [
                PopupMenuItem(
                  enabled: false,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        session.name,
                        style: const TextStyle(
                          color: AppTheme.textPrimary,
                          fontWeight: FontWeight.w700,
                          fontSize: 14,
                        ),
                      ),
                      Text(
                        session.mobile,
                        style: const TextStyle(
                          color: AppTheme.textMuted,
                          fontSize: 12,
                        ),
                      ),
                      const Divider(),
                    ],
                  ),
                ),
                const PopupMenuItem(
                  value: 'switch_role',
                  child: Row(
                    children: [
                      Icon(Icons.swap_horiz_rounded, size: 18, color: AppTheme.gold),
                      SizedBox(width: 8),
                      Text('Switch Account / Role', style: TextStyle(color: AppTheme.textPrimary)),
                    ],
                  ),
                ),
                const PopupMenuItem(
                  value: 'logout',
                  child: Row(
                    children: [
                      Icon(Icons.logout_rounded, size: 18, color: Colors.redAccent),
                      SizedBox(width: 8),
                      Text('Sign Out', style: TextStyle(color: Colors.redAccent)),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  void _showLocationSelector(BuildContext context, TheatreProvider provider) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Icon(Icons.storefront_rounded, color: AppTheme.gold, size: 22),
                  SizedBox(width: 8),
                  Text(
                    'Switch Registered Theatre',
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
                'Select which cinema property you want to manage right now:',
                style: TextStyle(color: AppTheme.textSecondary, fontSize: 13),
              ),
              const SizedBox(height: 16),
              ...provider.theatres.map((t) {
                final isSelected = t.id == provider.selectedTheatre?.id;
                return Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  decoration: BoxDecoration(
                    color: isSelected ? AppTheme.gold.withOpacity(0.12) : AppTheme.surfaceElevated,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: isSelected ? AppTheme.gold : const Color(0xFF27272A),
                    ),
                  ),
                  child: ListTile(
                    leading: Icon(
                      Icons.movie_creation_outlined,
                      color: isSelected ? AppTheme.gold : AppTheme.textMuted,
                    ),
                    title: Text(
                      t.name,
                      style: TextStyle(
                        color: isSelected ? AppTheme.gold : AppTheme.textPrimary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    subtitle: Text(
                      '${t.city} • ${t.totalScreens} Screens • Capacity: ${t.totalCapacity}',
                      style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                    ),
                    trailing: isSelected
                        ? const Icon(Icons.check_circle, color: AppTheme.gold)
                        : null,
                    onTap: () {
                      provider.selectTheatre(t.id);
                      Navigator.pop(ctx);
                    },
                  ),
                );
              }),
            ],
          ),
        ),
      ),
    );
  }
}
