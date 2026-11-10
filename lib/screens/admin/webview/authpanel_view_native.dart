import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../../../core/theme/app_theme.dart';
import 'authpanel_view_base.dart';
import 'authpanel_view_stub.dart';

Widget getAuthpanelWebView({
  required String initialUrl,
  VoidCallback? onPageLoaded,
}) {
  return AuthpanelViewNative(
    initialUrl: initialUrl,
    onPageLoaded: onPageLoaded,
  );
}

class AuthpanelViewNative extends StatefulWidget implements AuthpanelViewBase {
  @override
  final String initialUrl;
  @override
  final VoidCallback? onPageLoaded;

  const AuthpanelViewNative({
    super.key,
    required this.initialUrl,
    this.onPageLoaded,
  });

  @override
  State<AuthpanelViewNative> createState() => _AuthpanelViewNativeState();
}

class _AuthpanelViewNativeState extends State<AuthpanelViewNative> {
  WebViewController? _controller;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    try {
      if (WebViewPlatform.instance != null) {
        _controller = WebViewController()
          ..setJavaScriptMode(JavaScriptMode.unrestricted)
          ..setBackgroundColor(AppTheme.background)
          ..setNavigationDelegate(
            NavigationDelegate(
              onPageFinished: (String url) {
                if (mounted) {
                  setState(() {
                    _isLoading = false;
                  });
                  widget.onPageLoaded?.call();
                }
              },
            ),
          )
          ..loadRequest(Uri.parse(widget.initialUrl));
      } else {
        _controller = null;
        _isLoading = false;
      }
    } catch (_) {
      _controller = null;
      _isLoading = false;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_controller == null) {
      return AuthpanelViewStub(
        initialUrl: widget.initialUrl,
        onPageLoaded: widget.onPageLoaded,
      );
    }

    return Stack(
      children: [
        WebViewWidget(controller: _controller!),
        if (_isLoading)
          const Center(
            child: CircularProgressIndicator(color: AppTheme.gold),
          ),
      ],
    );
  }
}
