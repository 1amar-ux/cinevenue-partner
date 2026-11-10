import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';
import 'tabs/overview_tab.dart';
import 'tabs/my_theatres_tab.dart';
import 'tabs/screen_management_tab.dart';
import 'tabs/movie_scheduler_tab.dart';
import 'tabs/live_seat_management_tab.dart';
import 'tabs/booking_list_tab.dart';
import 'tabs/pos_management_tab.dart';
import 'tabs/payments_tab.dart';
import 'tabs/employee_management_tab.dart';
import 'tabs/reports_tab.dart';

class TheatreDashboardScreen extends StatefulWidget {
  const TheatreDashboardScreen({super.key});

  @override
  State<TheatreDashboardScreen> createState() => _TheatreDashboardScreenState();
}

class _TheatreDashboardScreenState extends State<TheatreDashboardScreen> {
  int _currentTabIndex = 0;

  final List<String> _tabTitles = [
    'Overview',
    'Bookings',
    'Locations',
    'Scheduler',
    'Live Seats',
    'POS Desk',
    'Payments',
    'Employees',
    'Reports',
    'Screens',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: Column(
        children: [
          // Sub-navigation Module Chips
          Container(
            color: AppTheme.surface,
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 10),
              child: Row(
                children: List.generate(_tabTitles.length, (idx) {
                  final isSelected = _currentTabIndex == idx;
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 3),
                    child: ChoiceChip(
                      label: Text(
                        _tabTitles[idx],
                        style: TextStyle(
                          color: isSelected ? Colors.black : AppTheme.textPrimary,
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      selected: isSelected,
                      selectedColor: AppTheme.gold,
                      backgroundColor: AppTheme.surfaceElevated,
                      onSelected: (val) {
                        if (val) setState(() => _currentTabIndex = idx);
                      },
                    ),
                  );
                }),
              ),
            ),
          ),

          // Active Tab Body
          Expanded(
            child: IndexedStack(
              index: _currentTabIndex,
              children: [
                TheatreOverviewTab(onNavigateTab: (idx) => setState(() => _currentTabIndex = idx)),
                const BookingListTab(),
                const MyTheatresTab(),
                const MovieSchedulerTab(),
                const LiveSeatMapTab(),
                const POSManagementTab(),
                const PaymentsTab(),
                const EmployeeManagementTab(),
                const ReportsTab(),
                const ScreenManagementTab(),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _mapTabToBottomNav(_currentTabIndex),
        onTap: (navIndex) {
          setState(() {
            switch (navIndex) {
              case 0:
                _currentTabIndex = 0; // Overview
                break;
              case 1:
                _currentTabIndex = 1; // Bookings
                break;
              case 2:
                _currentTabIndex = 5; // POS Desk
                break;
              case 3:
                _currentTabIndex = 6; // Payments
                break;
              case 4:
                _currentTabIndex = 7; // Employees
                break;
            }
          });
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard_rounded), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.confirmation_number_outlined), label: 'Bookings'),
          BottomNavigationBarItem(icon: Icon(Icons.point_of_sale_rounded), label: 'POS'),
          BottomNavigationBarItem(icon: Icon(Icons.payments_outlined), label: 'Payments'),
          BottomNavigationBarItem(icon: Icon(Icons.people_alt_outlined), label: 'Staff'),
        ],
      ),
    );
  }

  int _mapTabToBottomNav(int tabIndex) {
    switch (tabIndex) {
      case 0:
        return 0;
      case 1:
        return 1;
      case 5:
        return 2;
      case 6:
        return 3;
      case 7:
        return 4;
      default:
        return 0;
    }
  }
}

