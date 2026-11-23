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
  resubmissionNotes?: string;
  theatresCount?: number;
  screensCount?: number;
  eventsCount?: number;
  grossRevenue?: number;
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
  ticketCode?: string;
  showId?: string;
  movieTitle: string;
  screenName?: string;
  locationName?: string;
  theatreName?: string;
  showDate?: string;
  showTime?: string;
  timeSlot?: string;
  seats: string[];
  categoryName?: string;
  totalAmount?: number;
  totalPrice?: number;
  customerName?: string;
  userName?: string;
  customerPhone?: string;
  mobileNumber?: string;
  userEmail?: string;
  paymentMethod?: any;
  status: any;
  date?: string;
  bookedAt?: string;
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


export interface Theatre {
  id: number | string;
  name: string;
  location: string;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  features?: string[];
  price?: string;
  img?: string;
  image?: string;
  rating?: number | string;
  screens?: any[];
  facilities?: string[];
  bankRouting?: string;
  lastSettleDate?: string;
  customAllocPercent?: number;
  seatRows?: string[];
  seatsPerRow?: number;
  premiumRows?: string[];
  blockedSeats?: string[];
  seatPrices?: { [row: string]: number };
}

export interface MovieSchedule {
  id: string;
  movieTitle: string;
  theatreName: string;
  timeSlot: string;
  pricePerSeat: number;
  date: string;
  isDeployed?: boolean;
  isActive?: boolean;
  screenName?: string;
  interval?: number;
  bookingWindow?: string;
}

export type BankVerificationStatus =
  | 'Not Added'
  | 'Pending Verification'
  | 'Verified'
  | 'Rejected'
  | 'Suspended';

export interface TheatreBankAccount {
  id: string;
  theatreId: number | string;
  theatreName?: string;
  accountHolderName: string;
  bankName: string;
  encryptedAccountNumber?: string;
  maskedAccountNumber: string;
  ifscCode: string;
  accountType: 'Current' | 'Savings';
  branchName: string;
  branchAddress?: string;
  beneficiaryName: string;
  pan?: string;
  gstin?: string;
  upiId?: string;
  verificationStatus: BankVerificationStatus;
  isPrimary: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  verificationNotes?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  isActive: boolean;
}

export interface TheatreSettlementRecord {
  id: string;
  theatreId: number | string;
  theatreName: string;
  bankAccountId?: string;
  maskedAccountNumber?: string;
  ifscCode?: string;
  beneficiaryName?: string;
  bankName?: string;
  periodStart: string;
  periodEnd: string;
  grossSales: number;
  commission: number;
  taxes: number;
  netAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SETTLED' | 'FAILED' | 'ON_HOLD';
  utr?: string;
  settlementDate: string;
  initiatedBy?: string;
  idempotencyKey?: string;
}
