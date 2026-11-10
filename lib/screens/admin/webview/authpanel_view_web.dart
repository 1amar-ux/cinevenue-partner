import 'dart:ui_web' as ui_web;
import 'package:flutter/material.dart';
import 'package:web/web.dart' as web;
import 'authpanel_view_base.dart';

Widget getAuthpanelWebView({
  required String initialUrl,
  VoidCallback? onPageLoaded,
}) {
  return AuthpanelViewWeb(
    initialUrl: initialUrl,
    onPageLoaded: onPageLoaded,
  );
}

class AuthpanelViewWeb extends StatefulWidget implements AuthpanelViewBase {
  @override
  final String initialUrl;
  @override
  final VoidCallback? onPageLoaded;

  const AuthpanelViewWeb({
    super.key,
    required this.initialUrl,
    this.onPageLoaded,
  });

  @override
  State<AuthpanelViewWeb> createState() => _AuthpanelViewWebState();
}

class _AuthpanelViewWebState extends State<AuthpanelViewWeb> {
  late final String _viewId;

  @override
  void initState() {
    super.initState();
    _viewId = 'authpanel-iframe-${DateTime.now().millisecondsSinceEpoch}';

    ui_web.platformViewRegistry.registerViewFactory(
      _viewId,
      (int viewId) {
        final iframe = web.HTMLIFrameElement()
          ..src = widget.initialUrl
          ..style.border = 'none'
          ..style.width = '100%'
          ..style.height = '100%'
          ..setAttribute('allow', 'fullscreen; camera; microphone; payment; geolocation')
          ..setAttribute('allowfullscreen', 'true');

        iframe.onLoad.listen((_) {
          widget.onPageLoaded?.call();
        });

        return iframe;
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return HtmlElementView(viewType: _viewId);
  }
}
