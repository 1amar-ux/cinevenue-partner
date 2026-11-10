import 'package:flutter/material.dart';
import '../core/theme/app_theme.dart';

enum PartnerStatus {
  pending,
  underReview,
  moreInfoRequired,
  approved,
  rejected,
  suspended,
}

extension PartnerStatusExtension on PartnerStatus {
  String get code {
    switch (this) {
      case PartnerStatus.pending:
        return 'PENDING';
      case PartnerStatus.underReview:
        return 'UNDER_REVIEW';
      case PartnerStatus.moreInfoRequired:
        return 'MORE_INFO_REQUIRED';
      case PartnerStatus.approved:
        return 'APPROVED';
      case PartnerStatus.rejected:
        return 'REJECTED';
      case PartnerStatus.suspended:
        return 'SUSPENDED';
    }
  }

  String get displayName {
    switch (this) {
      case PartnerStatus.pending:
        return 'Pending Verification';
      case PartnerStatus.underReview:
        return 'Under Compliance Review';
      case PartnerStatus.moreInfoRequired:
        return 'Action Required';
      case PartnerStatus.approved:
        return 'Approved & Active';
      case PartnerStatus.rejected:
        return 'Application Rejected';
      case PartnerStatus.suspended:
        return 'Account Suspended';
    }
  }

  Color get color {
    switch (this) {
      case PartnerStatus.pending:
        return AppTheme.statusPending;
      case PartnerStatus.underReview:
        return AppTheme.statusUnderReview;
      case PartnerStatus.moreInfoRequired:
        return AppTheme.statusMoreInfo;
      case PartnerStatus.approved:
        return AppTheme.statusApproved;
      case PartnerStatus.rejected:
        return AppTheme.statusRejected;
      case PartnerStatus.suspended:
        return AppTheme.statusSuspended;
    }
  }

  IconData get icon {
    switch (this) {
      case PartnerStatus.pending:
        return Icons.hourglass_top_rounded;
      case PartnerStatus.underReview:
        return Icons.policy_rounded;
      case PartnerStatus.moreInfoRequired:
        return Icons.warning_amber_rounded;
      case PartnerStatus.approved:
        return Icons.verified_rounded;
      case PartnerStatus.rejected:
        return Icons.cancel_outlined;
      case PartnerStatus.suspended:
        return Icons.block_rounded;
    }
  }

  static PartnerStatus fromCode(String? code) {
    switch (code) {
      case 'PENDING':
        return PartnerStatus.pending;
      case 'UNDER_REVIEW':
        return PartnerStatus.underReview;
      case 'MORE_INFO_REQUIRED':
        return PartnerStatus.moreInfoRequired;
      case 'APPROVED':
        return PartnerStatus.approved;
      case 'REJECTED':
        return PartnerStatus.rejected;
      case 'SUSPENDED':
        return PartnerStatus.suspended;
      default:
        return PartnerStatus.pending;
    }
  }
}

