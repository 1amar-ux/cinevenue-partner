import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PartnerBusiness,
  TheatreLocation,
  Screen,
  Movie,
  Show,
  Booking,
  Employee,
  CineEvent,
  AuditLog,
  Settlement,
  UserRole,
  Permission,
  ApprovalStatus,
  PartnerCategory
} from '../types';
import {
  INITIAL_PARTNERS,
  INITIAL_LOCATIONS,
  INITIAL_SCREENS,
  INITIAL_MOVIES,
  INITIAL_SHOWS,
  INITIAL_BOOKINGS,
  INITIAL_EMPLOYEES,
  INITIAL_EVENTS,
  INITIAL_SETTLEMENTS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

export type ViewMode =
  | 'RESPONSIVE'
  | 'MOBILE_SMALL_ANDROID'
  | 'MOBILE_IPHONE_SE'
  | 'MOBILE_IPHONE_PRO'
  | 'MOBILE_IPHONE_MAX'
  | 'MOBILE_ANDROID_LARGE'
  | 'TABLET_IPAD'
  | 'MOBILE_IPHONE'
  | 'MOBILE_ANDROID'
  | 'TABLET';

export interface AppUserSession {
  type: 'OWNER' | 'MANAGER' | 'EMPLOYEE' | 'ADMIN' | 'REGISTRATION' | 'WELCOME' | 'STATUS_CHECK';
  partnerId: string;
  employeeId?: string;
  name: string;
  mobile: string;
  role: UserRole;
  permissions: Permission[];
  adminToken?: string;
  partnerToken?: string;
}

interface AppContextType {
  // Session & Access Control
  userSession: AppUserSession;
  setUserSession: (session: AppUserSession) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  
  // Active partner context
  partners: PartnerBusiness[];
  currentPartner: PartnerBusiness | null;
  activeLocationId: string | null;
  setActiveLocationId: (locId: string) => void;

  // Locations & Screens
  locations: TheatreLocation[];
  screens: Screen[];
  movies: Movie[];
  shows: Show[];
  bookings: Booking[];
  employees: Employee[];
  events: CineEvent[];
  settlements: Settlement[];
  auditLogs: AuditLog[];

  // Admin Tab Control
  activeAdminTab: 'AUTHPANEL' | 'PARTNERS' | 'AUDIT_LOGS';
  setActiveAdminTab: (tab: 'AUTHPANEL' | 'PARTNERS' | 'AUDIT_LOGS') => void;

  // Auth & Navigation Actions
  login: (identifier: string, password: string) => Promise<{ success: boolean; message: string; role?: string; status?: ApprovalStatus; partner?: PartnerBusiness }>;
  loginPartner: (identifier: string, password?: string) => Promise<{ success: boolean; message: string; partner?: PartnerBusiness; status?: ApprovalStatus }>;
  loginAdmin: (credentials: { username: string; password?: string; passcode?: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  openRegistration: () => void;
  openStatusCheck: (partnerId?: string) => void;
  checkApplicationStatus: (identifier: string) => Promise<PartnerBusiness | null>;
  resubmitPartnerInfo: (partnerId: string, notes: string, docs?: any[]) => Promise<boolean>;

  // Actions
  refreshPartners: () => Promise<void>;
  switchPresetAccount: (accountKey: string) => void;
  registerPartner: (partnerData: Omit<PartnerBusiness, 'id' | 'status' | 'appliedAt'>) => string;
  updatePartnerStatus: (partnerId: string, status: ApprovalStatus, reason?: string) => void;
  inviteEmployee: (partnerId: string, name: string, phone: string, email: string, role: UserRole, designation: string, permissions: Permission[]) => void;
  updateEmployeePermissions: (employeeId: string, permissions: Permission[]) => void;
  toggleEmployeeStatus: (employeeId: string, status: 'ACTIVE' | 'SUSPENDED') => void;
  acceptEmployeeInvitation: (employeeId: string) => void;

  // Booking & POS & Seats
  createPOSBooking: (showId: string, seats: string[], categoryName: string, amount: number, customerName: string, customerPhone: string, paymentMethod: 'POS_CASH' | 'POS_UPI' | 'POS_CARD') => Booking;
  cancelBooking: (bookingId: string) => void;
  scanAndCheckInTicket: (ticketCode: string) => { success: boolean; message: string; booking?: Booking };

  // Show & Screen Management
  createShow: (show: Omit<Show, 'id'>) => void;
  createScreen: (screen: Omit<Screen, 'id'>) => void;
  addTheatreLocation: (location: Omit<TheatreLocation, 'id'>) => void;
  createEvent: (eventData: Omit<CineEvent, 'id' | 'soldSeats' | 'revenue'>) => void;

  // Realtime Seat Map Override
  blockedSeats: Record<string, string[]>; // showId -> seatIds
  toggleSeatBlock: (showId: string, seatId: string) => void;
}

const STORAGE_PREFIX = 'cinevenue_partner_v1_';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage if existing
  const [partners, setPartners] = useState<PartnerBusiness[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'partners');
    return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
  });

  const [locations, setLocations] = useState<TheatreLocation[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'locations');
    return saved ? JSON.parse(saved) : INITIAL_LOCATIONS;
  });

  const [screens, setScreens] = useState<Screen[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'screens');
    return saved ? JSON.parse(saved) : INITIAL_SCREENS;
  });

  const [movies] = useState<Movie[]>(INITIAL_MOVIES);

  const [shows, setShows] = useState<Show[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'shows');
    return saved ? JSON.parse(saved) : INITIAL_SHOWS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [events, setEvents] = useState<CineEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [settlements] = useState<Settlement[]>(INITIAL_SETTLEMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  const [blockedSeats, setBlockedSeats] = useState<Record<string, string[]>>({});

  const [viewMode, setViewMode] = useState<ViewMode>('RESPONSIVE');
  const [activeAdminTab, setActiveAdminTab] = useState<'AUTHPANEL' | 'PARTNERS' | 'AUDIT_LOGS'>('AUTHPANEL');

  // Default initial session: Welcome Entry Screen or Persisted Session
  const [userSession, setUserSession] = useState<AppUserSession>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'user_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.type) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return {
      type: 'WELCOME',
      partnerId: '',
      name: '',
      mobile: '',
      role: 'OWNER',
      permissions: []
    };
  });

  // Current active partner object (null if unauthenticated welcome screen)
  const currentPartner = partners.find(p => p.id === userSession.partnerId) || (userSession.type === 'WELCOME' ? null : partners[0]);

  // Active Location ID for Multi-location Theatre partners
  const [activeLocationId, setActiveLocationId] = useState<string | null>(() => {
    return currentPartner?.activeLocationId || 'LOC-PUNE-01';
  });

  // Sync session state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'user_session', JSON.stringify(userSession));
  }, [userSession]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'partners', JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'screens', JSON.stringify(screens));
  }, [screens]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'shows', JSON.stringify(shows));
  }, [shows]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'events', JSON.stringify(events));
  }, [events]);

  const mapBackendPartner = (bp: any): PartnerBusiness => {
    return {
      id: bp.id,
      businessName: bp.businessName || '',
      ownerName: bp.ownerName || '',
      category: (bp.category as PartnerCategory) || 'THEATRE_PARTNER',
      status: (bp.status as ApprovalStatus) || 'PENDING',
      mobile: bp.mobile || '',
      email: bp.email || '',
      businessAddress: bp.businessAddress || `${bp.city || ''}, ${bp.state || ''}`,
      city: bp.city || '',
      state: bp.state || '',
      pinCode: bp.pinCode || '',
      gstNumber: bp.gstNumber || '',
      panNumber: bp.panNumber || '',
      bankDetails: bp.bankDetails || {
        accountNumber: bp.accountNumber || '',
        accountHolderName: bp.ownerName || '',
        ifscCode: bp.ifscCode || '',
        bankName: bp.bankName || '',
        branchName: bp.branchName || ''
      },
      documents: (bp.documents || []).map((d: any, idx: number) => ({
        id: d.id || `DOC-${idx}`,
        name: d.name || 'Document.pdf',
        type: d.type || 'TRADE_LICENSE',
        fileUrl: d.url || d.fileUrl || '#',
        uploadedAt: d.uploadedAt || new Date().toISOString(),
        status: d.status || 'VERIFIED'
      })),
      appliedAt: bp.appliedAt || new Date().toISOString(),
      approvedAt: bp.approvedAt,
      rejectionReason: bp.rejectionReason,
      moreInfoRequiredText: bp.moreInfoRequiredText,
      activeLocationId: bp.activeLocationId || 'LOC-PUNE-01'
    };
  };

  const refreshPartners = async () => {
    try {
      const res = await fetch('/api/partners');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.partners) && data.partners.length > 0) {
          const backendList: PartnerBusiness[] = data.partners.map(mapBackendPartner);
          setPartners(prev => {
            const map = new Map<string, PartnerBusiness>();
            prev.forEach(p => map.set(p.id, p));
            backendList.forEach((bp: PartnerBusiness) => map.set(bp.id, bp));
            return Array.from(map.values());
          });
        }
      }
    } catch (err) {
      console.warn('Backend /api/partners sync notice:', err);
    }
  };

  useEffect(() => {
    refreshPartners();
  }, []);

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: userSession.name,
      actorRole: userSession.role,
      action,
      details,
      ipAddress: '127.0.0.1'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const switchPresetAccount = (accountKey: string) => {
    switch (accountKey) {
      case 'THEATRE_OWNER':
        setUserSession({
          type: 'OWNER',
          partnerId: 'PARTNER-THEATRE-001',
          name: 'Vikramaditya Rao',
          mobile: '+91 98765 43210',
          role: 'OWNER',
          permissions: [
            'QR_SCANNING', 'TICKET_VERIFICATION', 'POS_BOOKING', 'SHOW_TIMINGS',
            'VIEW_SCREENS', 'CUSTOMER_ASSIST', 'REVENUE_VIEW', 'EMPLOYEE_ADMIN',
            'BANK_SETTINGS', 'BUSINESS_SETTINGS'
          ]
        });
        setActiveLocationId('LOC-PUNE-01');
        break;

      case 'THEATRE_MANAGER':
        setUserSession({
          type: 'MANAGER',
          partnerId: 'PARTNER-THEATRE-001',
          name: 'Suresh Patil (Manager)',
          mobile: '+91 97676 54321',
          role: 'MANAGER',
          permissions: [
            'QR_SCANNING', 'TICKET_VERIFICATION', 'POS_BOOKING', 'SHOW_TIMINGS',
            'VIEW_SCREENS', 'CUSTOMER_ASSIST', 'REVENUE_VIEW'
          ]
        });
        setActiveLocationId('LOC-PUNE-01');
        break;

      case 'THEATRE_EMPLOYEE':
        setUserSession({
          type: 'EMPLOYEE',
          partnerId: 'PARTNER-THEATRE-001',
          employeeId: 'EMP-101',
          name: 'Rahul Sharma (Theatre Usher & Gate Lead)',
          mobile: '+91 98989 89898',
          role: 'EMPLOYEE',
          permissions: [
            'QR_SCANNING', 'TICKET_VERIFICATION', 'POS_BOOKING', 'SHOW_TIMINGS',
            'VIEW_SCREENS', 'CUSTOMER_ASSIST'
          ]
        });
        setActiveLocationId('LOC-PUNE-01');
        break;

      case 'EVENT_ORGANIZER':
        setUserSession({
          type: 'OWNER',
          partnerId: 'PARTNER-EVENT-002',
          name: 'Ananya Deshmukh',
          mobile: '+91 98112 34567',
          role: 'OWNER',
          permissions: [
            'QR_SCANNING', 'TICKET_VERIFICATION', 'REVENUE_VIEW', 'EMPLOYEE_ADMIN',
            'BANK_SETTINGS', 'BUSINESS_SETTINGS'
          ]
        });
        break;

      case 'PRODUCTION_HOUSE':
        setUserSession({
          type: 'OWNER',
          partnerId: 'PARTNER-PROD-003',
          name: 'Rajesh Sharma',
          mobile: '+91 99000 88776',
          role: 'OWNER',
          permissions: ['REVENUE_VIEW', 'BUSINESS_SETTINGS']
        });
        break;

      case 'ENTERTAINMENT_PARTNER':
        setUserSession({
          type: 'OWNER',
          partnerId: 'PARTNER-ENT-004',
          name: 'Karan Mehra',
          mobile: '+91 97654 32109',
          role: 'OWNER',
          permissions: ['QR_SCANNING', 'TICKET_VERIFICATION', 'REVENUE_VIEW', 'BUSINESS_SETTINGS']
        });
        break;

      case 'EVENT_MANAGEMENT':
        setUserSession({
          type: 'OWNER',
          partnerId: 'PARTNER-MGMT-005',
          name: 'Priya Nambiar',
          mobile: '+91 98450 11223',
          role: 'OWNER',
          permissions: ['REVENUE_VIEW', 'BUSINESS_SETTINGS']
        });
        break;

      case 'PENDING_PARTNER':
        setUserSession({
          type: 'OWNER',
          partnerId: 'PARTNER-PENDING-006',
          name: 'Sanjay Dutt Gupta',
          mobile: '+91 98220 77112',
          role: 'OWNER',
          permissions: []
        });
        break;

      case 'REJECTED_PARTNER':
        setUserSession({
          type: 'OWNER',
          partnerId: 'PARTNER-REJECTED-007',
          name: 'Rohan Joshi',
          mobile: '+91 98333 44555',
          role: 'OWNER',
          permissions: []
        });
        break;

      case 'CINEVENUE_ADMIN':
        setUserSession({
          type: 'ADMIN',
          partnerId: 'ADMIN-PORTAL',
          name: 'CineVenue Super Admin',
          mobile: '+91 1800 200 999',
          role: 'ADMIN',
          permissions: [
            'QR_SCANNING', 'TICKET_VERIFICATION', 'POS_BOOKING', 'SHOW_TIMINGS',
            'VIEW_SCREENS', 'CUSTOMER_ASSIST', 'REVENUE_VIEW', 'EMPLOYEE_ADMIN',
            'BANK_SETTINGS', 'BUSINESS_SETTINGS'
          ]
        });
        break;

      case 'NEW_REGISTRATION':
        setUserSession({
          type: 'REGISTRATION',
          partnerId: 'NEW-APPLICANT',
          name: 'Guest Applicant',
          mobile: '',
          role: 'OWNER',
          permissions: []
        });
        break;

      case 'WELCOME':
        setUserSession({
          type: 'WELCOME',
          partnerId: '',
          name: '',
          mobile: '',
          role: 'OWNER',
          permissions: []
        });
        break;

      default:
        break;
    }
  };

  // Unified Single Login Gateway: Automatic Admin & Partner Identification
  const login = async (identifier: string, password: string): Promise<{ success: boolean; message: string; role?: string; status?: ApprovalStatus; partner?: PartnerBusiness }> => {
    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, message: 'Please enter your registered mobile number or email address and password.' };
    }

    // 1. Central Backend Request (Single Unified Login Gateway)
    try {
      const res = await fetch('/api/partners/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanId, email: cleanId, mobile: cleanId, password: cleanPass })
      });
      const data = await res.json();

      // Case A: CineVenue Administrator
      if (data.role === 'ADMIN' && (data.success || data.status === 'APPROVED')) {
        setUserSession({
          type: 'ADMIN',
          partnerId: 'ADMIN-PORTAL',
          name: data.user?.name || 'CineVenue Platform Administrator',
          mobile: data.user?.mobile || '+91 1800 200 999',
          role: 'ADMIN',
          permissions: [
            'QR_SCANNING', 'TICKET_VERIFICATION', 'POS_BOOKING', 'SHOW_TIMINGS',
            'VIEW_SCREENS', 'CUSTOMER_ASSIST', 'REVENUE_VIEW', 'EMPLOYEE_ADMIN',
            'BANK_SETTINGS', 'BUSINESS_SETTINGS'
          ],
          adminToken: data.token || data.accessToken
        });
        setActiveAdminTab('AUTHPANEL');
        addAuditLog('ADMIN_AUTHENTICATED', 'Super Admin verified credentials and unlocked Founder Control Hub.');
        return { success: true, message: data.message || 'Super Admin authentication verified.', role: 'ADMIN', status: 'APPROVED' };
      }

      // Case B: Partner Account (Approved or Status Gated)
      if (data.partner) {
        const bp = mapBackendPartner(data.partner);
        setPartners(prev => {
          const map = new Map<string, PartnerBusiness>();
          prev.forEach(p => map.set(p.id, p));
          map.set(bp.id, bp);
          return Array.from(map.values());
        });

        if (data.success && (data.status === 'APPROVED' || bp.status === 'APPROVED')) {
          // Approved Partner -> Open respective Dashboard
          setUserSession({
            type: 'OWNER',
            partnerId: bp.id,
            name: bp.ownerName,
            mobile: bp.mobile,
            role: 'OWNER',
            permissions: [
              'QR_SCANNING', 'TICKET_VERIFICATION', 'POS_BOOKING', 'SHOW_TIMINGS',
              'VIEW_SCREENS', 'CUSTOMER_ASSIST', 'REVENUE_VIEW', 'EMPLOYEE_ADMIN',
              'BANK_SETTINGS', 'BUSINESS_SETTINGS'
            ],
            partnerToken: data.token || data.accessToken
          });
          setActiveLocationId(bp.activeLocationId || 'LOC-PUNE-01');
          addAuditLog('PARTNER_LOGIN', `Partner '${bp.businessName}' (${bp.category}) logged in successfully.`);
          return { success: true, message: 'Login successful.', role: bp.category, status: 'APPROVED', partner: bp };
        } else {
          // Status Gated: PENDING, UNDER_REVIEW, MORE_INFO_REQUIRED, REJECTED, SUSPENDED
          setUserSession({
            type: 'STATUS_CHECK',
            partnerId: bp.id,
            name: bp.ownerName,
            mobile: bp.mobile,
            role: 'OWNER',
            permissions: []
          });
          return {
            success: false,
            message: data.message || `Application status: ${bp.status}`,
            role: data.role || bp.category,
            status: bp.status,
            partner: bp
          };
        }
      }

      // If backend explicitly rejected due to incorrect password or credentials
      if (!res.ok || data.success === false) {
        if (data.message && (data.message.toLowerCase().includes('password') || data.message.toLowerCase().includes('credentials'))) {
          return { success: false, message: data.message };
        }
      }
    } catch (err) {
      console.warn('Backend login request fallback to local checks:', err);
    }

    // 2. Local Fallback (for offline or local simulated accounts)
    const lowerId = cleanId.toLowerCase();
    const cleanDigits = cleanId.replace(/\D/g, '');
    const last10 = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : '';

    // Check if Administrator credentials match
    const isAdminId =
      lowerId === 'superadmin@cinevenue.com' ||
      lowerId === 'admin' ||
      lowerId === 'superadmin' ||
      lowerId === 'amarnathgattem@gmail.com' ||
      cleanDigits === '9876543210' ||
      cleanDigits === '1800200999';
    const isAdminPass =
      cleanPass === 'Amarnath123' ||
      cleanPass === 'SuperAdmin@2026' ||
      cleanPass === 'asdfghjkl' ||
      cleanPass === '8888';

    if (isAdminId && isAdminPass) {
      setUserSession({
        type: 'ADMIN',
        partnerId: 'ADMIN-PORTAL',
        name: 'CineVenue Super Admin',
        mobile: '+91 1800 200 999',
        role: 'ADMIN',
        permissions: [
          'QR_SCANNING', 'TICKET_VERIFICATION', 'POS_BOOKING', 'SHOW_TIMINGS',
          'VIEW_SCREENS', 'CUSTOMER_ASSIST', 'REVENUE_VIEW', 'EMPLOYEE_ADMIN',
          'BANK_SETTINGS', 'BUSINESS_SETTINGS'
        ],
        adminToken: 'admin_session_' + Date.now()
      });
      setActiveAdminTab('AUTHPANEL');
      addAuditLog('ADMIN_AUTHENTICATED', 'Super Admin verified credentials and unlocked Founder Control Hub.');
      return { success: true, message: 'Super Admin authentication verified.', role: 'ADMIN', status: 'APPROVED' };
    }

    // Check local partners store
    const localMatch = partners.find(p => {
      const pEmail = p.email?.toLowerCase().trim();
      const pMobileDigits = (p.mobile || '').replace(/\D/g, '');
      if (pEmail && pEmail === lowerId) return true;
      if (last10 && pMobileDigits && pMobileDigits.endsWith(last10)) return true;
      if (p.id.toLowerCase() === lowerId) return true;
      return false;
    });

    if (localMatch) {
      if (localMatch.status === 'APPROVED') {
        setUserSession({
          type: 'OWNER',
          partnerId: localMatch.id,
          name: localMatch.ownerName,
          mobile: localMatch.mobile,
          role: 'OWNER',
          permissions: [
            'QR_SCANNING', 'TICKET_VERIFICATION', 'POS_BOOKING', 'SHOW_TIMINGS',
            'VIEW_SCREENS', 'CUSTOMER_ASSIST', 'REVENUE_VIEW', 'EMPLOYEE_ADMIN',
            'BANK_SETTINGS', 'BUSINESS_SETTINGS'
          ]
        });
        setActiveLocationId(localMatch.activeLocationId || 'LOC-PUNE-01');
        return { success: true, message: 'Login successful.', role: localMatch.category, status: 'APPROVED', partner: localMatch };
      } else {
        setUserSession({
          type: 'STATUS_CHECK',
          partnerId: localMatch.id,
          name: localMatch.ownerName,
          mobile: localMatch.mobile,
          role: 'OWNER',
          permissions: []
        });
        return {
          success: false,
          message: `Application status: ${localMatch.status}`,
          role: localMatch.category,
          status: localMatch.status,
          partner: localMatch
        };
      }
    }

    return {
      success: false,
      message: 'No registered account found with these credentials. Please check your mobile/email or register.'
    };
  };

  const loginPartner = async (identifier: string, password?: string) => {
    return login(identifier, password || 'Partner@123');
  };

  const loginAdmin = async (credentials: { username: string; password?: string; passcode?: string }) => {
    return login(credentials.username, credentials.password || credentials.passcode || '8888');
  };

  const logout = () => {
    setUserSession({
      type: 'WELCOME',
      partnerId: '',
      name: '',
      mobile: '',
      role: 'OWNER',
      permissions: []
    });
    localStorage.removeItem(STORAGE_PREFIX + 'user_session');
    addAuditLog('USER_LOGOUT', 'User logged out and returned to Welcome screen.');
  };

  const openRegistration = () => {
    setUserSession({
      type: 'REGISTRATION',
      partnerId: 'NEW-APPLICANT',
      name: 'Guest Applicant',
      mobile: '',
      role: 'OWNER',
      permissions: []
    });
  };

  const openStatusCheck = (partnerId?: string) => {
    if (partnerId) {
      const match = partners.find(p => p.id === partnerId);
      if (match) {
        setUserSession({
          type: 'STATUS_CHECK',
          partnerId: match.id,
          name: match.ownerName,
          mobile: match.mobile,
          role: 'OWNER',
          permissions: []
        });
        return;
      }
    }
    setUserSession({
      type: 'STATUS_CHECK',
      partnerId: partners[0]?.id || '',
      name: '',
      mobile: '',
      role: 'OWNER',
      permissions: []
    });
  };

  const checkApplicationStatus = async (identifier: string): Promise<PartnerBusiness | null> => {
    const q = identifier.trim().toLowerCase();
    await refreshPartners();
    const match = partners.find(p =>
      p.id.toLowerCase() === q ||
      p.email.toLowerCase() === q ||
      p.mobile.replace(/\s+/g, '') === q.replace(/\s+/g, '') ||
      p.businessName.toLowerCase().includes(q)
    );
    return match || null;
  };

  const resubmitPartnerInfo = async (partnerId: string, notes: string, docs?: any[]): Promise<boolean> => {
    try {
      const res = await fetch(`/api/partners/${partnerId}/resubmit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, documents: docs })
      });
      if (res.ok) {
        await refreshPartners();
        return true;
      }
    } catch (e) {
      console.warn('Resubmit error:', e);
    }

    setPartners(prev => prev.map(p => {
      if (p.id === partnerId) {
        return {
          ...p,
          status: 'UNDER_REVIEW',
          moreInfoRequiredText: undefined,
          resubmissionNotes: notes
        };
      }
      return p;
    }));
    return true;
  };

  const registerPartner = (partnerData: Omit<PartnerBusiness, 'id' | 'status' | 'appliedAt'>) => {
    const newId = `PARTNER-${partnerData.category.split('_')[0]}-${Date.now().toString().slice(-4)}`;
    const newPartner: PartnerBusiness = {
      ...partnerData,
      id: newId,
      status: 'PENDING',
      appliedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    };

    setPartners(prev => [newPartner, ...prev]);

    // Asynchronously sync with central backend
    fetch('/api/partners/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newPartner.id,
        businessName: newPartner.businessName,
        ownerName: newPartner.ownerName,
        mobile: newPartner.mobile,
        email: newPartner.email,
        category: newPartner.category,
        city: newPartner.city,
        state: newPartner.state,
        pinCode: newPartner.pinCode,
        gstNumber: newPartner.gstNumber,
        panNumber: newPartner.panNumber,
        bankName: newPartner.bankDetails?.bankName,
        accountNumber: newPartner.bankDetails?.accountNumber,
        ifscCode: newPartner.bankDetails?.ifscCode,
        documents: newPartner.documents
      })
    }).catch(err => console.warn('Async backend register error:', err));

    // Automatically set session to this pending applicant
    setUserSession({
      type: 'OWNER',
      partnerId: newId,
      name: newPartner.ownerName,
      mobile: newPartner.mobile,
      role: 'OWNER',
      permissions: []
    });

    addAuditLog('PARTNER_REGISTERED', `Registered new business '${newPartner.businessName}' under ${newPartner.category}. Status set to PENDING.`);
    return newId;
  };

  const updatePartnerStatus = (partnerId: string, status: ApprovalStatus, reason?: string) => {
    setPartners(prev =>
      prev.map(p => {
        if (p.id === partnerId) {
          return {
            ...p,
            status,
            rejectionReason: status === 'REJECTED' ? reason : p.rejectionReason,
            moreInfoRequiredText: status === 'MORE_INFO_REQUIRED' ? reason : p.moreInfoRequiredText,
            approvedAt: status === 'APPROVED' ? new Date().toISOString() : p.approvedAt
          };
        }
        return p;
      })
    );

    // Asynchronously sync with central backend
    fetch(`/api/partners/${partnerId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reason })
    }).catch(err => console.warn('Async backend status update error:', err));

    addAuditLog('ADMIN_STATUS_CHANGE', `Changed approval status of partner ${partnerId} to ${status}. ${reason ? `Notes: ${reason}` : ''}`);
  };

  const inviteEmployee = (
    partnerId: string,
    name: string,
    phone: string,
    email: string,
    role: UserRole,
    designation: string,
    permissions: Permission[]
  ) => {
    const newEmployee: Employee = {
      id: `EMP-${Date.now().toString().slice(-4)}`,
      partnerId,
      name,
      phone,
      email,
      role,
      designation,
      permissions,
      status: 'INVITED',
      assignedLocationIds: activeLocationId ? [activeLocationId] : [],
      invitedAt: new Date().toISOString().split('T')[0]
    };

    setEmployees(prev => [newEmployee, ...prev]);
    addAuditLog('EMPLOYEE_INVITED', `Invited employee ${name} (${phone}) as ${designation} with ${permissions.length} permissions.`);
  };

  const updateEmployeePermissions = (employeeId: string, permissions: Permission[]) => {
    setEmployees(prev =>
      prev.map(e => (e.id === employeeId ? { ...e, permissions } : e))
    );
    addAuditLog('EMPLOYEE_PERMISSIONS_UPDATED', `Updated permissions for employee ${employeeId}. Total permissions: ${permissions.length}`);
  };

  const toggleEmployeeStatus = (employeeId: string, status: 'ACTIVE' | 'SUSPENDED') => {
    setEmployees(prev =>
      prev.map(e => (e.id === employeeId ? { ...e, status } : e))
    );
    addAuditLog('EMPLOYEE_STATUS_CHANGED', `Changed employee ${employeeId} status to ${status}.`);
  };

  const acceptEmployeeInvitation = (employeeId: string) => {
    setEmployees(prev =>
      prev.map(e => (e.id === employeeId ? { ...e, status: 'ACTIVE', acceptedAt: new Date().toISOString() } : e))
    );
  };

  const createPOSBooking = (
    showId: string,
    seats: string[],
    categoryName: string,
    amount: number,
    customerName: string,
    customerPhone: string,
    paymentMethod: 'POS_CASH' | 'POS_UPI' | 'POS_CARD'
  ): Booking => {
    const targetShow = shows.find(s => s.id === showId);
    const location = locations.find(l => l.id === targetShow?.locationId);

    const ticketCode = `CNV-POS-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: `BKG-${Date.now().toString().slice(-5)}`,
      ticketCode,
      showId,
      movieTitle: targetShow?.movieTitle || 'Movie Show',
      screenName: targetShow?.screenName || 'Screen 1',
      locationName: location?.name || 'CineVenue Theatre',
      showDate: targetShow?.date || new Date().toISOString().split('T')[0],
      showTime: targetShow?.time || '18:00',
      seats,
      categoryName,
      totalAmount: amount,
      customerName,
      customerPhone,
      paymentMethod,
      status: 'CONFIRMED',
      bookedAt: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
    };

    setBookings(prev => [newBooking, ...prev]);

    // Update show available seats
    setShows(prev =>
      prev.map(s => {
        if (s.id === showId) {
          return {
            ...s,
            availableSeats: Math.max(0, s.availableSeats - seats.length)
          };
        }
        return s;
      })
    );

    addAuditLog('POS_TICKET_GENERATED', `Counter Ticket generated #${ticketCode} for ${customerName} (${seats.join(', ')}) - Total ₹${amount}`);
    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
    );
    addAuditLog('BOOKING_CANCELLED', `Cancelled booking ticket ID ${bookingId}.`);
  };

  const scanAndCheckInTicket = (ticketCode: string) => {
    const cleanCode = ticketCode.trim().toUpperCase();
    const booking = bookings.find(b => b.ticketCode.toUpperCase() === cleanCode);

    if (!booking) {
      return { success: false, message: `Invalid Ticket Code: '${cleanCode}'. Ticket not found in CineVenue database.` };
    }

    if (booking.status === 'CHECKED_IN') {
      return {
        success: false,
        message: `TICKET ALREADY USED! Ticket #${booking.ticketCode} was scanned on ${booking.scannedAt || 'earlier today'} by ${booking.scannedBy || 'Gate Staff'}.`,
        booking
      };
    }

    if (booking.status === 'CANCELLED') {
      return {
        success: false,
        message: `CANCELLED TICKET! Booking #${booking.ticketCode} was cancelled. Entry denied.`,
        booking
      };
    }

    const scanTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const updatedBooking: Booking = {
      ...booking,
      status: 'CHECKED_IN',
      scannedAt: scanTime,
      scannedBy: `${userSession.name} (${userSession.role})`
    };

    setBookings(prev => prev.map(b => (b.id === booking.id ? updatedBooking : b)));
    addAuditLog('TICKET_CHECKED_IN', `Valid entry scanned for #${booking.ticketCode} (${booking.customerName}, Seats: ${booking.seats.join(', ')})`);

    return {
      success: true,
      message: `ENTRY ALLOWED! Valid Ticket for ${booking.customerName} (${booking.seats.join(', ')}) at ${booking.screenName}.`,
      booking: updatedBooking
    };
  };

  const createShow = (showData: Omit<Show, 'id'>) => {
    const newShow: Show = {
      ...showData,
      id: `SHOW-${Date.now().toString().slice(-4)}`
    };
    setShows(prev => [newShow, ...prev]);
    addAuditLog('SHOW_CREATED', `Scheduled show for ${newShow.movieTitle} at ${newShow.screenName} on ${newShow.date} ${newShow.time}`);
  };

  const createScreen = (screenData: Omit<Screen, 'id'>) => {
    const newScreen: Screen = {
      ...screenData,
      id: `SCR-${Date.now().toString().slice(-4)}`
    };
    setScreens(prev => [...prev, newScreen]);
    addAuditLog('SCREEN_ADDED', `Added new screen ${newScreen.name} (${newScreen.format}, ${newScreen.totalSeats} seats)`);
  };

  const addTheatreLocation = (locData: Omit<TheatreLocation, 'id'>) => {
    const newLoc: TheatreLocation = {
      ...locData,
      id: `LOC-${Date.now().toString().slice(-4)}`
    };
    setLocations(prev => [...prev, newLoc]);
    setActiveLocationId(newLoc.id);
    addAuditLog('LOCATION_ADDED', `Registered new theatre location: ${newLoc.name} in ${newLoc.city}`);
  };

  const createEvent = (eventData: Omit<CineEvent, 'id' | 'soldSeats' | 'revenue'>) => {
    const newEvent: CineEvent = {
      ...eventData,
      id: `EVT-${Date.now().toString().slice(-4)}`,
      soldSeats: 0,
      revenue: 0
    };
    setEvents(prev => [newEvent, ...prev]);
    addAuditLog('EVENT_CREATED', `Created new event: ${newEvent.title} at ${newEvent.venue}`);
  };

  const toggleSeatBlock = (showId: string, seatId: string) => {
    setBlockedSeats(prev => {
      const current = prev[showId] || [];
      const updated = current.includes(seatId)
        ? current.filter(s => s !== seatId)
        : [...current, seatId];
      return { ...prev, [showId]: updated };
    });
  };

  return (
    <AppContext.Provider
      value={{
        userSession,
        setUserSession,
        viewMode,
        setViewMode,
        partners,
        currentPartner,
        activeLocationId,
        setActiveLocationId,
        locations,
        screens,
        movies,
        shows,
        bookings,
        employees,
        events,
        settlements,
        auditLogs,
        activeAdminTab,
        setActiveAdminTab,
        login,
        loginPartner,
        loginAdmin,
        logout,
        openRegistration,
        openStatusCheck,
        checkApplicationStatus,
        resubmitPartnerInfo,
        refreshPartners,
        switchPresetAccount,
        registerPartner,
        updatePartnerStatus,
        inviteEmployee,
        updateEmployeePermissions,
        toggleEmployeeStatus,
        acceptEmployeeInvitation,
        createPOSBooking,
        cancelBooking,
        scanAndCheckInTicket,
        createShow,
        createScreen,
        addTheatreLocation,
        createEvent,
        blockedSeats,
        toggleSeatBlock
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
