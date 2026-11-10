enum PartnerCategory {
  theatrePartner,
  eventOrganizer,
  eventManagement,
  productionHouse,
  entertainmentPartner,
}

extension PartnerCategoryExtension on PartnerCategory {
  String get code {
    switch (this) {
      case PartnerCategory.theatrePartner:
        return 'THEATRE_PARTNER';
      case PartnerCategory.eventOrganizer:
        return 'EVENT_ORGANIZER';
      case PartnerCategory.eventManagement:
        return 'EVENT_MANAGEMENT';
      case PartnerCategory.productionHouse:
        return 'PRODUCTION_HOUSE';
      case PartnerCategory.entertainmentPartner:
        return 'ENTERTAINMENT_PARTNER';
    }
  }

  String get displayName {
    switch (this) {
      case PartnerCategory.theatrePartner:
        return 'Theatre Partner';
      case PartnerCategory.eventOrganizer:
        return 'Event Organizer';
      case PartnerCategory.eventManagement:
        return 'Event Management Company';
      case PartnerCategory.productionHouse:
        return 'Production House';
      case PartnerCategory.entertainmentPartner:
        return 'Entertainment Partner';
    }
  }

  String get subtitle {
    switch (this) {
      case PartnerCategory.theatrePartner:
        return 'Multiplexes, single screens, and cinema chains';
      case PartnerCategory.eventOrganizer:
        return 'Concerts, festivals, live standup, and cultural shows';
      case PartnerCategory.eventManagement:
        return 'Corporate galas, expos, stage production, and brand events';
      case PartnerCategory.productionHouse:
        return 'Film studios, casting, OTT releases, and previews';
      case PartnerCategory.entertainmentPartner:
        return 'Theme parks, gaming arenas, clubs, and experiential lounges';
    }
  }

  static PartnerCategory fromCode(String? code) {
    switch (code) {
      case 'THEATRE_PARTNER':
        return PartnerCategory.theatrePartner;
      case 'EVENT_ORGANIZER':
        return PartnerCategory.eventOrganizer;
      case 'EVENT_MANAGEMENT':
        return PartnerCategory.eventManagement;
      case 'PRODUCTION_HOUSE':
        return PartnerCategory.productionHouse;
      case 'ENTERTAINMENT_PARTNER':
        return PartnerCategory.entertainmentPartner;
      default:
        return PartnerCategory.theatrePartner;
    }
  }
}

