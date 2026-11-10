import 'package:flutter/material.dart';
import '../models/partner_business.dart';
import '../models/partner_status.dart';
import '../services/partner_repository.dart';

class AdminProvider extends ChangeNotifier {
  final PartnerRepository _repo = PartnerRepository();

  String _statusFilter = 'ALL'; // ALL, PENDING, UNDER_REVIEW, MORE_INFO_REQUIRED, APPROVED, REJECTED, SUSPENDED
  PartnerBusiness? _selectedPartner;

  String get statusFilter => _statusFilter;
  PartnerBusiness? get selectedPartner => _selectedPartner;

  List<PartnerBusiness> get allPartners {
    final list = _repo.getAllPartners();
    if (_statusFilter == 'ALL') return list;
    return list.where((p) => p.status.code == _statusFilter).toList();
  }

  int get pendingCount => _repo.getAllPartners().where((p) => p.isPending || p.isUnderReview).length;
  int get approvedCount => _repo.getAllPartners().where((p) => p.isApproved).length;
  int get actionReqCount => _repo.getAllPartners().where((p) => p.isMoreInfoRequired).length;
  int get suspendedCount => _repo.getAllPartners().where((p) => p.isSuspended).length;

  void setFilter(String filter) {
    _statusFilter = filter;
    notifyListeners();
  }

  void selectPartner(PartnerBusiness partner) {
    _selectedPartner = partner;
    notifyListeners();
  }

  void approvePartner(String partnerId) {
    _repo.updatePartnerStatus(partnerId, PartnerStatus.approved);
    if (_selectedPartner?.id == partnerId) {
      _selectedPartner = _repo.getPartnerById(partnerId);
    }
    notifyListeners();
  }

  void rejectPartner(String partnerId, String reason) {
    _repo.updatePartnerStatus(partnerId, PartnerStatus.rejected, rejectionReason: reason);
    if (_selectedPartner?.id == partnerId) {
      _selectedPartner = _repo.getPartnerById(partnerId);
    }
    notifyListeners();
  }

  void requestMoreInfo(String partnerId, String text) {
    _repo.updatePartnerStatus(partnerId, PartnerStatus.moreInfoRequired, moreInfoRequiredText: text);
    if (_selectedPartner?.id == partnerId) {
      _selectedPartner = _repo.getPartnerById(partnerId);
    }
    notifyListeners();
  }

  void suspendPartner(String partnerId, String reason) {
    _repo.updatePartnerStatus(partnerId, PartnerStatus.suspended, rejectionReason: reason);
    if (_selectedPartner?.id == partnerId) {
      _selectedPartner = _repo.getPartnerById(partnerId);
    }
    notifyListeners();
  }

  void reactivatePartner(String partnerId) {
    _repo.updatePartnerStatus(partnerId, PartnerStatus.approved);
    if (_selectedPartner?.id == partnerId) {
      _selectedPartner = _repo.getPartnerById(partnerId);
    }
    notifyListeners();
  }
}

