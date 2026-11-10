import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import 'authpanel_view_base.dart';

Widget getAuthpanelWebView({
  required String initialUrl,
  VoidCallback? onPageLoaded,
}) {
  return AuthpanelViewStub(
    initialUrl: initialUrl,
    onPageLoaded: onPageLoaded,
  );
}

class AuthpanelViewStub extends StatelessWidget implements AuthpanelViewBase {
  @override
  final String initialUrl;
  @override
  final VoidCallback? onPageLoaded;

  const AuthpanelViewStub({
    super.key,
    required this.initialUrl,
    this.onPageLoaded,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppTheme.background,
      width: double.infinity,
      height: double.infinity,
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(24),
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: AppTheme.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppTheme.gold.withOpacity(0.4)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.shield, color: AppTheme.gold, size: 48),
              const SizedBox(height: 16),
              const Text(
                'CINEVENUE FOUNDER ADMIN PANEL',
                style: TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.1,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Live Terminal URL: $initialUrl',
                style: const TextStyle(
                  color: AppTheme.gold,
                  fontFamily: 'monospace',
                  fontSize: 12,
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Webview engine initialized in test/desktop mode.\nAll forms, modules, and sessions run live on web and mobile devices.',
                textAlign: TextAlign.center,
                style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
