import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../providers/employee_provider.dart';
import '../../../../providers/theatre_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/gold_card.dart';
import '../../../../models/employee.dart';

class EmployeeManagementTab extends StatelessWidget {
  const EmployeeManagementTab({super.key});

  @override
  Widget build(BuildContext context) {
    final empProv = context.watch<EmployeeProvider>();
    final theatreProv = context.watch<TheatreProvider>();
    final employees = empProv.employees;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header with Invite button
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Employee & Operational Staff',
                    style: TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${employees.length} Active Staff Across Locations',
                    style: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                  ),
                ],
              ),
              ElevatedButton.icon(
                onPressed: () => _showInviteEmployeeDialog(context, empProv, theatreProv),
                icon: const Icon(Icons.person_add_alt_1_rounded, size: 16),
                label: const Text('Invite Employee'),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Security Policy Banner
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppTheme.gold.withOpacity(0.08),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppTheme.gold.withOpacity(0.3)),
            ),
            child: const Row(
              children: [
                Icon(Icons.admin_panel_settings_outlined, color: AppTheme.gold, size: 24),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Role-Based Operational Security',
                        style: TextStyle(
                          color: AppTheme.goldLight,
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'Staff members log into CineVenue Partner with their mobile number and see ONLY their assigned gate or box office tasks. Financial revenue, settlements, and bank details are strictly hidden.',
                        style: TextStyle(color: AppTheme.textSecondary, fontSize: 12, height: 1.4),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Employee List Cards
          ...employees.map((emp) => Container(
                margin: const EdgeInsets.only(bottom: 12),
                child: GoldCard(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          CircleAvatar(
                            radius: 20,
                            backgroundColor: emp.role == 'MANAGER'
                                ? Colors.blue.withOpacity(0.2)
                                : Colors.teal.withOpacity(0.2),
                            child: Icon(
                              emp.role == 'MANAGER'
                                  ? Icons.manage_accounts_rounded
                                  : Icons.badge_outlined,
                              color: emp.role == 'MANAGER' ? Colors.blue : Colors.teal,
                              size: 20,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      emp.name,
                                      style: const TextStyle(
                                        color: AppTheme.textPrimary,
                                        fontSize: 15,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: emp.role == 'MANAGER'
                                            ? Colors.blue.withOpacity(0.15)
                                            : Colors.teal.withOpacity(0.15),
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                      child: Text(
                                        emp.role,
                                        style: TextStyle(
                                          color: emp.role == 'MANAGER'
                                              ? Colors.blue
                                              : Colors.teal,
                                          fontSize: 10,
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '${emp.designation} • ${emp.locationName}',
                                  style: const TextStyle(
                                      color: AppTheme.textMuted, fontSize: 12),
                                ),
                              ],
                            ),
                          ),
                          Switch(
                            value: emp.isActive,
                            activeColor: AppTheme.statusApproved,
                            onChanged: (_) => empProv.toggleStatus(emp.id),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          const Icon(Icons.phone_iphone_rounded, size: 14, color: AppTheme.gold),
                          const SizedBox(width: 6),
                          Text(
                            emp.mobile,
                            style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                          ),
                          const Spacer(),
                          Text(
                            'Last active: ${emp.lastLoginAt ?? 'Invited'}',
                            style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                          ),
                        ],
                      ),
                      const Divider(height: 20),

                      // Assigned Permissions Chips
                      Row(
                        children: [
                          const Text(
                            'Active Permissions: ',
                            style: TextStyle(color: AppTheme.textMuted, fontSize: 12),
                          ),
                          const Spacer(),
                          InkWell(
                            onTap: () => _showEditPermissionsDialog(context, empProv, emp),
                            child: const Row(
                              children: [
                                Icon(Icons.edit_outlined, size: 13, color: AppTheme.gold),
                                SizedBox(width: 4),
                                Text(
                                  'Customize Permissions',
                                  style: TextStyle(
                                    color: AppTheme.gold,
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 6,
                        runSpacing: 6,
                        children: emp.permissions.map((perm) {
                          final def = AvailablePermissions.all.firstWhere(
                            (p) => p.key == perm,
                            orElse: () => EmployeePermissionDef(key: perm, label: perm, description: ''),
                          );
                          return Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppTheme.surfaceElevated,
                              borderRadius: BorderRadius.circular(4),
                              border: Border.all(color: const Color(0xFF2E2E34)),
                            ),
                            child: Text(
                              def.label,
                              style: const TextStyle(
                                color: AppTheme.textPrimary,
                                fontSize: 11,
                              ),
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

  void _showInviteEmployeeDialog(
    BuildContext context,
    EmployeeProvider empProv,
    TheatreProvider theatreProv,
  ) {
    final nameCtrl = TextEditingController();
    final mobileCtrl = TextEditingController();
    final designationCtrl = TextEditingController(text: 'Gate Entry Usher');
    String selectedRole = 'EMPLOYEE';
    String selectedLocationId = theatreProv.selectedTheatre?.id ?? 'th_001';
    String selectedLocationName = theatreProv.selectedTheatre?.name ?? 'AMB Cinemas Gachibowli';
    final List<String> selectedPermissions = [...AvailablePermissions.defaultEmployeePermissions];

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          backgroundColor: AppTheme.surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: AppTheme.surfaceBorder),
          ),
          title: const Row(
            children: [
              Icon(Icons.person_add_rounded, color: AppTheme.gold),
              SizedBox(width: 10),
              Text(
                'Invite Theatre Employee',
                style: TextStyle(color: AppTheme.textPrimary, fontSize: 17, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          content: SizedBox(
            width: 520,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'An SMS invitation will be dispatched to the employee mobile number with login credentials.',
                    style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                  ),
                  const SizedBox(height: 16),

                  TextField(
                    controller: nameCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Employee Full Name *',
                      hintText: 'e.g. Ramesh Babu',
                    ),
                  ),
                  const SizedBox(height: 12),

                  TextField(
                    controller: mobileCtrl,
                    keyboardType: TextInputType.phone,
                    decoration: const InputDecoration(
                      labelText: 'Mobile Number *',
                      hintText: '+91 98765 43212',
                    ),
                  ),
                  const SizedBox(height: 12),

                  TextField(
                    controller: designationCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Designation / Title',
                      hintText: 'Gate Usher / POS Cashier / Floor Lead',
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Location Selector
                  const Text(
                    'Assign to Cinema Location:',
                    style: TextStyle(color: AppTheme.goldLight, fontSize: 12, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    value: selectedLocationId,
                    dropdownColor: AppTheme.surfaceElevated,
                    decoration: const InputDecoration(contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 10)),
                    items: theatreProv.theatres.map((t) {
                      return DropdownMenuItem(value: t.id, child: Text(t.name, style: const TextStyle(fontSize: 13)));
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) {
                        setDialogState(() {
                          selectedLocationId = val;
                          selectedLocationName = theatreProv.theatres.firstWhere((t) => t.id == val).name;
                        });
                      }
                    },
                  ),
                  const SizedBox(height: 16),

                  // Role selector
                  const Text(
                    'Account Level:',
                    style: TextStyle(color: AppTheme.goldLight, fontSize: 12, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Expanded(
                        child: RadioListTile<String>(
                          title: const Text('EMPLOYEE', style: TextStyle(fontSize: 13)),
                          subtitle: const Text('Operational only', style: TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                          value: 'EMPLOYEE',
                          groupValue: selectedRole,
                          activeColor: AppTheme.gold,
                          onChanged: (v) => setDialogState(() => selectedRole = v!),
                        ),
                      ),
                      Expanded(
                        child: RadioListTile<String>(
                          title: const Text('MANAGER', style: TextStyle(fontSize: 13)),
                          subtitle: const Text('Floor manager', style: TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                          value: 'MANAGER',
                          groupValue: selectedRole,
                          activeColor: AppTheme.gold,
                          onChanged: (v) => setDialogState(() => selectedRole = v!),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Permissions Checkboxes
                  const Text(
                    'Assigned Permissions:',
                    style: TextStyle(color: AppTheme.goldLight, fontSize: 12, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 6),
                  ...AvailablePermissions.all.map((perm) {
                    // Hide sensitive owner-only permissions if account level is EMPLOYEE
                    if (perm.isRestrictedFromRegularStaff && selectedRole == 'EMPLOYEE') {
                      return const SizedBox.shrink();
                    }
                    final isChecked = selectedPermissions.contains(perm.key);
                    return CheckboxListTile(
                      dense: true,
                      title: Text(perm.label, style: const TextStyle(fontSize: 13, color: AppTheme.textPrimary)),
                      subtitle: Text(perm.description, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                      value: isChecked,
                      activeColor: AppTheme.gold,
                      checkColor: Colors.black,
                      onChanged: (val) {
                        setDialogState(() {
                          if (val == true) {
                            selectedPermissions.add(perm.key);
                          } else {
                            selectedPermissions.remove(perm.key);
                          }
                        });
                      },
                    );
                  }),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel', style: TextStyle(color: AppTheme.textMuted)),
            ),
            ElevatedButton(
              onPressed: () {
                if (nameCtrl.text.trim().isEmpty || mobileCtrl.text.trim().isEmpty) {
                  return;
                }
                empProv.inviteEmployee(
                  locationId: selectedLocationId,
                  locationName: selectedLocationName,
                  name: nameCtrl.text.trim(),
                  mobile: mobileCtrl.text.trim(),
                  designation: designationCtrl.text.trim(),
                  role: selectedRole,
                  permissions: selectedPermissions,
                );
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    backgroundColor: AppTheme.statusApproved,
                    content: Text('Invitation dispatched to ${mobileCtrl.text.trim()}!'),
                  ),
                );
              },
              child: const Text('Send Invitation'),
            ),
          ],
        ),
      ),
    );
  }

  void _showEditPermissionsDialog(
    BuildContext context,
    EmployeeProvider empProv,
    Employee emp,
  ) {
    final List<String> currentPerms = [...emp.permissions];

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          backgroundColor: AppTheme.surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: AppTheme.surfaceBorder),
          ),
          title: Text(
            'Permissions: ${emp.name}',
            style: const TextStyle(color: AppTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
          ),
          content: SizedBox(
            width: 480,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  ...AvailablePermissions.all.map((perm) {
                    if (perm.isRestrictedFromRegularStaff && emp.role == 'EMPLOYEE') {
                      return const SizedBox.shrink();
                    }
                    final isChecked = currentPerms.contains(perm.key);
                    return CheckboxListTile(
                      dense: true,
                      title: Text(perm.label, style: const TextStyle(fontSize: 13, color: AppTheme.textPrimary)),
                      subtitle: Text(perm.description, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                      value: isChecked,
                      activeColor: AppTheme.gold,
                      checkColor: Colors.black,
                      onChanged: (val) {
                        setDialogState(() {
                          if (val == true) {
                            currentPerms.add(perm.key);
                          } else {
                            currentPerms.remove(perm.key);
                          }
                        });
                      },
                    );
                  }),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel', style: TextStyle(color: AppTheme.textMuted)),
            ),
            ElevatedButton(
              onPressed: () {
                empProv.updatePermissions(emp.id, currentPerms);
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    backgroundColor: AppTheme.statusApproved,
                    content: Text('Permissions updated successfully.'),
                  ),
                );
              },
              child: const Text('Save Permissions'),
            ),
          ],
        ),
      ),
    );
  }
}

