import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Film,
  Building2,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Clock,
  AlertTriangle,
  LogOut,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lock
} from 'lucide-react';
import { PartnerCategory } from '../../types';

export const Header: React.FC = () => {
  const {
    userSession,
    currentPartner,
    locations,
    activeLocationId,
    setActiveLocationId,
    switchPresetAccount,
    viewMode,
    setViewMode,
    logout
  } = useApp();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);

  const activeLocation = locations.find(l => l.id === activeLocationId) || locations[0];
  const partnerLocations = locations.filter(l => l.partnerId === currentPartner?.id);

  const getCategoryLabel = (cat?: PartnerCategory) => {
    switch (cat) {
      case 'THEATRE_PARTNER':
        return 'Theatre Partner';
      case 'EVENT_ORGANIZER':
        return 'Event Organizer';
      case 'EVENT_MANAGEMENT':
        return 'Event Management Co.';
      case 'PRODUCTION_HOUSE':
        return 'Production House';
      case 'ENTERTAINMENT_PARTNER':
        return 'Entertainment Partner';
      default:
        return 'CineVenue Partner';
    }
  };

  const getStatusBadge = () => {
    if (userSession.type === 'ADMIN') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          CineVenue Admin
        </span>
      );
    }

    if (userSession.type === 'REGISTRATION') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Registration
        </span>
      );
    }

    const status = currentPartner?.status;
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            Pending Verification
          </span>
        );
      case 'MORE_INFO_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <HelpCircle className="w-3.5 h-3.5" />
            More Info Required
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-red-950 text-red-400 border border-red-800">
            <Lock className="w-3.5 h-3.5" />
            Suspended
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-amber-500/20 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Wordmark (CineVenue Logo & Gold Crown Emblem) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Film className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                CINEVENUE
              </span>
              <span className="text-xs font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 tracking-wider">
                PARTNER
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 block -mt-1 font-medium tracking-tight">
              CineVenue Entertainments Pvt Ltd
            </span>
          </div>
        </div>

        {/* Zone 2: Context Controls (Location Switcher & Device Frame Toggler) */}
        <div className="hidden lg:flex items-center gap-4">
          
          {/* Multi-Location Switcher (Only for Theatre Partner Owners with multiple venues) */}
          {userSession.role === 'OWNER' && currentPartner?.category === 'THEATRE_PARTNER' && currentPartner?.status === 'APPROVED' && (
            <div className="relative">
              <button
                onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-xs font-medium text-zinc-200 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate max-w-[160px]">{activeLocation?.name}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {isLocationMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-zinc-900 border border-amber-500/30 rounded-xl shadow-2xl z-50 py-2">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Select Business Location ({partnerLocations.length})
                  </div>
                  {partnerLocations.map(loc => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        setActiveLocationId(loc.id);
                        setIsLocationMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-zinc-800 ${
                        loc.id === activeLocationId ? 'bg-amber-500/10 text-amber-400 font-semibold' : 'text-zinc-300'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{loc.name}</div>
                        <div className="text-[10px] text-zinc-400">{loc.city} · {loc.totalScreens} Screens</div>
                      </div>
                      {loc.id === activeLocationId && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Status Badge */}
          {getStatusBadge()}

          {/* View Mode Canvas Switcher */}
          <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('RESPONSIVE')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                viewMode === 'RESPONSIVE' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Full Responsive View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Desktop</span>
            </button>
            <button
              onClick={() => setViewMode('MOBILE_IPHONE')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                viewMode === 'MOBILE_IPHONE' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Mobile iOS View"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Mobile</span>
            </button>
            <button
              onClick={() => setViewMode('TABLET')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                viewMode === 'TABLET' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Tablet</span>
            </button>
          </div>
        </div>

        {/* Zone 3: Account & Session Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Lock & Exit Admin button (visible when Admin is logged in) */}
          {userSession.type === 'ADMIN' && (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
              title="Lock Admin session and return to Common Sign-in"
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Lock Admin</span>
            </button>
          )}

          {/* Account & Role Switcher Simulator Trigger */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-900/80 border border-amber-500/30 hover:border-amber-400/60 text-xs font-medium text-zinc-100 transition-all shadow-md shadow-amber-500/5 active:scale-95"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                {userSession.type === 'WELCOME' ? (
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  userSession.name.charAt(0) || 'U'
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-semibold text-zinc-100 truncate max-w-[140px]">
                  {userSession.type === 'WELCOME' ? 'Single Sign-In' : userSession.name}
                </div>
                <div className="text-[10px] text-amber-400 font-medium -mt-0.5">
                  {userSession.type === 'WELCOME'
                    ? 'Portal Gateway'
                    : userSession.type === 'ADMIN'
                    ? 'Super Admin'
                    : userSession.type === 'REGISTRATION'
                    ? 'Applicant'
                    : `${getCategoryLabel(currentPartner?.category)} (${userSession.role})`}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            </button>

          {/* Quick Account Switcher Dropdown (Crucial for testing all requirements!) */}
          {isRoleMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-900 border border-amber-500/40 rounded-2xl shadow-2xl z-50 p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  Role & Account Switcher
                </span>
                <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded">
                  Demo Mode
                </span>
              </div>

              <div className="text-[10px] text-zinc-400 px-1">
                Select an account role to test dynamic dashboard isolation:
              </div>

              <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                <button
                  onClick={() => { switchPresetAccount('THEATRE_OWNER'); setIsRoleMenuOpen(false); }}
                  className="w-full text-left p-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-amber-300">Theatre Partner Owner</div>
                    <div className="text-[10px] text-zinc-400">Approved · Full Theatre & POS Dashboard</div>
                  </div>
                  {userSession.role === 'OWNER' && currentPartner?.category === 'THEATRE_PARTNER' && currentPartner?.status === 'APPROVED' && (
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                </button>

                <button
                  onClick={() => { switchPresetAccount('THEATRE_EMPLOYEE'); setIsRoleMenuOpen(false); }}
                  className="w-full text-left p-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-emerald-300">Theatre Employee (Staff)</div>
                    <div className="text-[10px] text-zinc-400">QR Ticket Scanner + POS (No Revenue/Bank)</div>
                  </div>
                  {userSession.role === 'EMPLOYEE' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </button>

                <button
                  onClick={() => { switchPresetAccount('EVENT_ORGANIZER'); setIsRoleMenuOpen(false); }}
                  className="w-full text-left p-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-purple-300">Event Organizer</div>
                    <div className="text-[10px] text-zinc-400">Concerts, Passes & Attendee Check-In</div>
                  </div>
                  {currentPartner?.category === 'EVENT_ORGANIZER' && (
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  )}
                </button>

                <button
                  onClick={() => { switchPresetAccount('PRODUCTION_HOUSE'); setIsRoleMenuOpen(false); }}
                  className="w-full text-left p-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-blue-300">Production House</div>
                    <div className="text-[10px] text-zinc-400">Screening Requests & Premiere Box Office</div>
                  </div>
                  {currentPartner?.category === 'PRODUCTION_HOUSE' && (
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  )}
                </button>

                <button
                  onClick={() => { switchPresetAccount('ENTERTAINMENT_PARTNER'); setIsRoleMenuOpen(false); }}
                  className="w-full text-left p-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-rose-300">Entertainment Partner</div>
                    <div className="text-[10px] text-zinc-400">VR Arenas & Theme Park Visitors</div>
                  </div>
                  {currentPartner?.category === 'ENTERTAINMENT_PARTNER' && (
                    <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </button>

                <button
                  onClick={() => { switchPresetAccount('EVENT_MANAGEMENT'); setIsRoleMenuOpen(false); }}
                  className="w-full text-left p-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-cyan-300">Event Management Co.</div>
                    <div className="text-[10px] text-zinc-400">Corporate Galas & Venue Vendors</div>
                  </div>
                  {currentPartner?.category === 'EVENT_MANAGEMENT' && (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  )}
                </button>

                <div className="pt-2 border-t border-zinc-800 text-[10px] font-semibold text-zinc-400 uppercase">
                  Approval Statuses & Admin
                </div>

                <button
                  onClick={() => { switchPresetAccount('PENDING_PARTNER'); setIsRoleMenuOpen(false); }}
                  className="w-full text-left p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">Pending Verification Partner</div>
                    <div className="text-[10px] text-amber-400/70">Application Tracking Screen</div>
                  </div>
                </button>

                <button
                  onClick={() => { switchPresetAccount('REJECTED_PARTNER'); setIsRoleMenuOpen(false); }}
                  className="w-full text-left p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">Rejected Partner</div>
                    <div className="text-[10px] text-rose-400/70">Rejection reason & re-submission</div>
                  </div>
                </button>

                <button
                  onClick={() => { switchPresetAccount('CINEVENUE_ADMIN'); setIsRoleMenuOpen(false); }}
                  className="w-full text-left p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 flex items-center justify-between font-bold border border-amber-500/30"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>CineVenue Admin Panel</span>
                  </div>
                  <span className="text-[10px] bg-amber-400 text-zinc-950 px-1.5 py-0.5 rounded font-extrabold">ADMIN</span>
                </button>

                <button
                  onClick={() => { switchPresetAccount('NEW_REGISTRATION'); setIsRoleMenuOpen(false); }}
                  className="w-full text-left p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Become a Partner Registration</span>
                  </div>
                </button>

                <div className="pt-2 border-t border-zinc-800">
                  <button
                    onClick={() => { logout(); setIsRoleMenuOpen(false); }}
                    className="w-full text-left p-2 rounded-lg bg-zinc-900 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300 flex items-center gap-2 text-xs transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out & Return to Welcome Screen</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  </header>
  );
};
