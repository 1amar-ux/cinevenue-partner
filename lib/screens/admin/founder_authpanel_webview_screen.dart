import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../core/theme/app_theme.dart';
import '../../models/user_session.dart';
import '../../providers/auth_provider.dart';
import 'webview/authpanel_view.dart';

class FounderAuthpanelWebviewScreen extends StatefulWidget {
  const FounderAuthpanelWebviewScreen({super.key});

  @override
  State<FounderAuthpanelWebviewScreen> createState() =>
      _FounderAuthpanelWebviewScreenState();
}

class _FounderAuthpanelWebviewScreenState
    extends State<FounderAuthpanelWebviewScreen> {
  late String _activeUrl;
  bool _useLocalDevUrl = false;
  int _reloadKey = 0;

  @override
  void initState() {
    super.initState();
    // In local web preview, default to local if requested, else canonical production URL
    _activeUrl = kDebugMode && _useLocalDevUrl
        ? AppConstants.founderAdminLocalUrl
        : AppConstants.founderAdminUrl;
  }

  void _toggleUrlSource() {
    setState(() {
      _useLocalDevUrl = !_useLocalDevUrl;
      _activeUrl = _useLocalDevUrl
          ? AppConstants.founderAdminLocalUrl
          : AppConstants.founderAdminUrl;
      _reloadKey++;
    });
  }

  void _reloadPage() {
    setState(() {
      _reloadKey++;
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final session = auth.currentSession;

    // Strict Founder Verification Gate
    final hasFounderPrivilege =
        session != null &&
        (session.isFounder ||
            session.isAdmin ||
            session.email.toLowerCase().contains('superadmin') ||
            session.email.toLowerCase().contains('amarnath'));

    if (!hasFounderPrivilege) {
      return Scaffold(
        backgroundColor: AppTheme.background,
        body: Center(
          child: Container(
            margin: const EdgeInsets.all(24),
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: AppTheme.surface,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.redAccent.withOpacity(0.5)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.gpp_bad, color: Colors.redAccent, size: 54),
                const SizedBox(height: 16),
                const Text(
                  'ACCESS STRICTLY RESTRICTED',
                  style: TextStyle(
                    color: Colors.redAccent,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.2,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'The Founder Admin Panel (/authpanel) is strictly reserved for the CineVenue platform founder.\nPartners, theatre managers, and staff accounts cannot access this command deck.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () {
                    auth.loginAs(
                      partnerId: 'biz_theatre_001',
                      role: UserRole.owner,
                      type: SessionType.partner,
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.gold,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Return to Partner Dashboard',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Column(
          children: [
            // 1. Top Integrated Control Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: const BoxDecoration(
                color: AppTheme.surface,
                border: Border(bottom: BorderSide(color: Colors.white10)),
              ),
              child: Row(
                children: [
                  // CineVenue Founder Badge
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 5,
                    ),
                    decoration: BoxDecoration(
                      color: AppTheme.gold.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppTheme.gold.withOpacity(0.4)),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.shield, color: AppTheme.gold, size: 16),
                        SizedBox(width: 6),
                        Text(
                          'FOUNDER ADMIN',
                          style: TextStyle(
                            color: AppTheme.gold,
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.0,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(width: 12),

                  // Active Terminal URL indicator
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.black38,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.white12),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.lock,
                            color: Colors.greenAccent,
                            size: 12,
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              _activeUrl,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                color: Colors.white70,
                                fontSize: 11,
                                fontFamily: 'monospace',
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(width: 8),

                  // Toggle Local / Production Dev Switcher
                  if (kDebugMode)
                    IconButton(
                      tooltip: _useLocalDevUrl
                          ? 'Switch to Production (cinevenue.com)'
                          : 'Switch to Local (localhost:3000)',
                      icon: Icon(
                        _useLocalDevUrl ? Icons.cloud_off : Icons.cloud_done,
                        color: _useLocalDevUrl
                            ? Colors.amberAccent
                            : Colors.lightBlueAccent,
                        size: 20,
                      ),
                      onPressed: _toggleUrlSource,
                    ),

                  // Reload Button
                  IconButton(
                    tooltip: 'Refresh / Reload AuthPanel',
                    icon: const Icon(
                      Icons.refresh,
                      color: Colors.white70,
                      size: 20,
                    ),
                    onPressed: _reloadPage,
                  ),

                  // Return / Exit Button
                  IconButton(
                    tooltip: 'Switch Account / Exit',
                    icon: const Icon(
                      Icons.close,
                      color: Colors.white70,
                      size: 20,
                    ),
                    onPressed: () {
                      auth.loginAs(
                        partnerId: 'biz_theatre_001',
                        role: UserRole.owner,
                        type: SessionType.partner,
                      );
                    },
                  ),
                ],
              ),
            ),

            // 2. Exact Existing Founder Admin Panel WebView / IFrame
            Expanded(
              child: KeyedSubtree(
                key: ValueKey('$_activeUrl-$_reloadKey'),
                child: getAuthpanelWebView(initialUrl: _activeUrl),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
