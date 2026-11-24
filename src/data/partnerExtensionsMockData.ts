import { PartnerNotification, SupportTicket, PromotionCampaign } from '../types';

export const INITIAL_NOTIFICATIONS: PartnerNotification[] = [
  {
    id: 'NOTIF-1',
    type: 'SETTLEMENT',
    title: 'Commercial Settlement Processed',
    message: 'Batch #SET-2026-99 of ₹4,50,000 has been credited to HDFC Bank (A/C ending in 4102). UTR: HDFCN26112349102.',
    timestamp: '10 mins ago',
    isRead: false,
    actionUrl: 'finance'
  },
  {
    id: 'NOTIF-2',
    type: 'BOOKING',
    title: 'New VIP Recliner Booking Confirmed',
    message: '2 Tickets booked for Stree 2 (06:30 PM Show, Screen 1 IMAX Laser). Total Amount: ₹600.',
    timestamp: '25 mins ago',
    isRead: false,
    actionUrl: 'bookings'
  },
  {
    id: 'NOTIF-3',
    type: 'ADMIN_REQUEST',
    title: 'Tax Invoice Verification Completed',
    message: 'Your GSTIN 27AABCT3518Q1ZV has been verified by CineVenue Admin and mapped for auto-settlement.',
    timestamp: '1 hour ago',
    isRead: false
  },
  {
    id: 'NOTIF-4',
    type: 'ANNOUNCEMENT',
    title: 'Festive Booking Window Opened',
    message: 'Special Dussehra & Diwali advance booking quotas are now unlocked for all partner screens and auditoriums.',
    timestamp: '3 hours ago',
    isRead: true
  },
  {
    id: 'NOTIF-5',
    type: 'SHOW_CHANGE',
    title: 'Screen 2 Atmos Maintenance Complete',
    message: 'Routine laser alignment and calibration complete. All screens operational with 100% capacity.',
    timestamp: 'Yesterday',
    isRead: true
  }
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-8921',
    partnerId: 'PARTNER-THEATRE-001',
    partnerName: 'AMB Cinemas Gachibowli',
    category: 'PAYMENTS_SETTLEMENTS',
    priority: 'HIGH',
    subject: 'Confirm IFSC routing verification for secondary branch account',
    description: 'We recently updated our banking details to add a secondary settlement routing gate for IMAX Prasads. Please verify if the IFSC code HDFC0000240 is active on the auto-settlement router.',
    status: 'RESOLVED',
    createdAt: '2026-11-20 14:30',
    updatedAt: '2026-11-21 10:15',
    messages: [
      {
        id: 'MSG-1',
        senderName: 'Vikramaditya Rao',
        senderRole: 'PARTNER',
        message: 'We added the secondary account IFSC HDFC0000240 for weekend box office splits. Kindly confirm verification status.',
        timestamp: '2026-11-20 14:30'
      },
      {
        id: 'MSG-2',
        senderName: 'CineVenue Admin Support',
        senderRole: 'SUPPORT_ADMIN',
        message: 'Your banking mandate has been verified with HDFC Bank gateway. Settlements are now configured for T+1 auto-credit.',
        timestamp: '2026-11-21 10:15'
      }
    ]
  },
  {
    id: 'TKT-9104',
    partnerId: 'PARTNER-THEATRE-001',
    partnerName: 'AMB Cinemas Gachibowli',
    category: 'FEATURE_REQUEST',
    priority: 'NORMAL',
    subject: 'Custom pricing tier for 3D glasses add-on at POS box office',
    description: 'Requesting the capability to configure 3D glasses add-on charges (₹30/unit) directly in the POS counter ticket printing flow.',
    status: 'IN_PROGRESS',
    createdAt: '2026-11-22 11:00',
    updatedAt: '2026-11-23 09:30',
    messages: [
      {
        id: 'MSG-3',
        senderName: 'Vikramaditya Rao',
        senderRole: 'PARTNER',
        message: 'Many guests ask for 3D glasses during POS counter booking. Can we have a 1-click add-on in the POS dialog?',
        timestamp: '2026-11-22 11:00'
      },
      {
        id: 'MSG-4',
        senderName: 'CineVenue Product Operations',
        senderRole: 'SUPPORT_ADMIN',
        message: 'This feature has been scheduled for POS Release v2.5. Counter operators can currently use the F&B combo add-on selector.',
        timestamp: '2026-11-23 09:30'
      }
    ]
  }
];

export const INITIAL_PROMOTIONS: PromotionCampaign[] = [
  {
    id: 'PROMO-1',
    partnerId: 'PARTNER-THEATRE-001',
    partnerName: 'AMB Cinemas Gachibowli',
    campaignName: 'Weekend Blockbuster Gala',
    code: 'WEEKEND20',
    type: 'PERCENT_DISCOUNT',
    discountValue: 20,
    minPurchaseAmount: 400,
    maxDiscountCap: 150,
    startDate: '2026-11-01',
    endDate: '2026-11-30',
    maxUsageLimit: 500,
    currentRedemptions: 142,
    revenueGenerated: 78400,
    status: 'ACTIVE',
    createdAt: '2026-10-28 10:00'
  },
  {
    id: 'PROMO-2',
    partnerId: 'PARTNER-THEATRE-001',
    partnerName: 'AMB Cinemas Gachibowli',
    campaignName: 'Festive Family Special',
    code: 'FESTIVE100',
    type: 'FLAT_DISCOUNT',
    discountValue: 100,
    minPurchaseAmount: 600,
    startDate: '2026-11-10',
    endDate: '2026-11-28',
    maxUsageLimit: 300,
    currentRedemptions: 89,
    revenueGenerated: 48950,
    status: 'ACTIVE',
    createdAt: '2026-11-05 15:30'
  },
  {
    id: 'PROMO-3',
    partnerId: 'PARTNER-THEATRE-001',
    partnerName: 'AMB Cinemas Gachibowli',
    campaignName: 'Buy 1 Get 1 Laser Recliner',
    code: 'BOGOIMAX',
    type: 'BUY_ONE_GET_ONE',
    discountValue: 50,
    minPurchaseAmount: 500,
    startDate: '2026-12-01',
    endDate: '2026-12-15',
    maxUsageLimit: 200,
    currentRedemptions: 0,
    revenueGenerated: 0,
    status: 'PENDING_APPROVAL',
    createdAt: '2026-11-23 09:00'
  }
];
