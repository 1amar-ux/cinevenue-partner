import 'package:flutter/material.dart';
import '../models/employee.dart';
import '../services/partner_repository.dart';

class EmployeeProvider extends ChangeNotifier {
  final PartnerRepository _repo = PartnerRepository();
  String _businessId = 'biz_theatre_001';

  EmployeeProvider() {
    loadEmployees(_businessId);
  }

  String get businessId => _businessId;

  List<Employee> get employees => _repo.getEmployeesByBusiness(_businessId);

  void loadEmployees(String businessId) {
    _businessId = businessId;
    notifyListeners();
  }

  Employee inviteEmployee({
    required String locationId,
    required String locationName,
    required String name,
    required String mobile,
    required String designation,
    required String role,
    required List<String> permissions,
  }) {
    final emp = _repo.inviteEmployee(
      businessId: _businessId,
      locationId: locationId,
      locationName: locationName,
      name: name,
      mobile: mobile,
      designation: designation,
      role: role,
      permissions: permissions,
    );
    notifyListeners();
    return emp;
  }

  void updatePermissions(String employeeId, List<String> permissions) {
    _repo.updateEmployeePermissions(employeeId, permissions);
    notifyListeners();
  }

  void toggleStatus(String employeeId) {
    _repo.toggleEmployeeStatus(employeeId);
    notifyListeners();
  }
}

