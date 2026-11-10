export type PartnerCategory =
  | 'THEATRE_PARTNER'
  | 'EVENT_ORGANIZER'
  | 'EVENT_MANAGEMENT'
  | 'PRODUCTION_HOUSE'
  | 'ENTERTAINMENT_PARTNER';

export type ApprovalStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'MORE_INFO_REQUIRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED';

export type UserRole = 'OWNER' | 'MANAGER' | 'EMPLOYEE' | 'ADMIN';

export type Permission =
  | 'QR_SCANNING'
  | 'TICKET_VERIFICATION'
  | 'POS_BOOKING'
  | 'SHOW_TIMINGS'
  | 'VIEW_SCREENS'
  | 'CUSTOMER_ASSIST'
  | 'REVENUE_VIEW'
  | 'EMPLOYEE_ADMIN'
  | 'BANK_SETTINGS'
  | 'BUSINESS_SETTINGS';

export interface PartnerDocument {
  id: string;
  name: string;
  type: 'GST' | 'PAN' | 'BANK_CHEQUE' | 'TRADE_LICENSE' | 'IDENTITY_PROOF';
  fileUrl: string;
  uploadedAt: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
}

export interface BankDetails {
  accountNumber: string;
  accountHolderName: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
}

export interface PartnerBusiness {
  id: string;
  businessName: string;
  ownerName: string;
  category: PartnerCategory;
  status: ApprovalStatus;
  rejectionReason?: string;
  moreInfoRequiredText?: string;
  mobile: string;
  email: string;
  businessAddress: string;
  city: string;
  state: string;
  pinCode: string;
  gstNumber?: string;
  panNumber?: string;
  bankDetails: BankDetails;
  documents: PartnerDocument[];
  appliedAt: string;
  approvedAt?: string;
  activeLocationId?: string;
}

export interface SeatCategory {
  id: 'VIP' | 'PREMIUM' | 'EXECUTIVE' | 'CLASSIC';
  name: string;
  price: number;
  color: string;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  category: 'VIP' | 'PREMIUM' | 'EXECUTIVE' | 'CLASSIC';
  status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED' | 'SELECTED';
  bookedBy?: string;
  ticketId?: string;
}

export interface Screen {
  id: string;
  locationId: string;
  name: string;
  format: 'IMAX 3D' | 'Dolby Atmos 4K' | 'VIP Lounge' | 'Standard 2D';
  rows: number;
  seatsPerRow: number;
  totalSeats: number;
  vipRows: number;
  premiumRows: number;
  executiveRows: number;
  classicRows: number;
  pricing: {
    VIP: number;
    PREMIUM: number;
    EXECUTIVE: number;
    CLASSIC: number;
  };
}

export interface TheatreLocation {
  id: string;
  partnerId: string;
  name: string;
  city: string;
  address: string;
  contactNumber: string;
  totalScreens: number;
  status: 'ACTIVE' | 'MAINTENANCE';
}

export interface Movie {
  id: string;
  title: string;
  poster: string;
  duration: string;
  genre: string;
  language: string;
  certificate: string;
  rating: number;
}

export interface Show {
  id: string;
  locationId: string;
  screenId: string;
  screenName: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g., "14:30"
  prices: {
    VIP: number;
    PREMIUM: number;
    EXECUTIVE: number;
    CLASSIC: number;
  };
  totalSeats: number;
  availableSeats: number;
}

export interface Booking {
  id: string;
  ticketCode: string;
  showId: string;
  movieTitle: string;
  screenName: string;
  locationName: string;
  showDate: string;
  showTime: string;
  seats: string[];
  categoryName: string;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: 'ONLINE' | 'POS_CASH' | 'POS_UPI' | 'POS_CARD';
  status: 'CONFIRMED' | 'CANCELLED' | 'CHECKED_IN';
  bookedAt: string;
  scannedAt?: string;
  scannedBy?: string;
}

export interface Employee {
  id: string;
  partnerId: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  designation: string;
  permissions: Permission[];
  status: 'INVITED' | 'ACTIVE' | 'SUSPENDED';
  assignedLocationIds: string[];
  invitedAt: string;
  acceptedAt?: string;
}

export interface EventTicketTier {
  id: string;
  name: string;
  price: number;
  capacity: number;
  sold: number;
}

export interface CineEvent {
  id: string;
  partnerId: string;
  title: string;
  category: string;
  poster: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  ticketTiers: EventTicketTier[];
  totalSeats: number;
  soldSeats: number;
  revenue: number;
  status: 'DRAFT' | 'PUBLISHED' | 'COMPLETED' | 'CANCELLED';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  details: string;
  ipAddress: string;
}

export interface Settlement {
  id: string;
  partnerId: string;
  period: string;
  grossEarnings: number;
  platformFee: number;
  gstDeduction: number;
  netPayout: number;
  status: 'PAID' | 'PROCESSING' | 'PENDING';
  payoutDate?: string;
  transactionRef?: string;
}
