import 'package:flutter/widgets.dart';

abstract class AuthpanelViewBase implements Widget {
  String get initialUrl;
  VoidCallback? get onPageLoaded;
}
