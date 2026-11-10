import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// Theme & Core
import 'core/theme/app_theme.dart';
import 'core/constants/app_constants.dart';

// Providers
import 'providers/auth_provider.dart';
import 'providers/theatre_provider.dart';
import 'providers/employee_provider.dart';
import 'providers/event_provider.dart';
import 'providers/admin_provider.dart';

// Master Gateway
import 'screens/partner_master_gate.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const CineVenuePartnerApp());
}

class CineVenuePartnerApp extends StatelessWidget {
  const CineVenuePartnerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => TheatreProvider()),
        ChangeNotifierProvider(create: (_) => EmployeeProvider()),
        ChangeNotifierProvider(create: (_) => EventProvider()),
        ChangeNotifierProvider(create: (_) => AdminProvider()),
      ],
      child: MaterialApp(
        title: AppConstants.appName,
        debugShowCheckedModeBanner: false,
        theme: AppTheme.darkTheme,
        home: const PartnerMasterGate(),
      ),
    );
  }
}
