import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Film,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  KeyRound,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { PartnerCategory, ApprovalStatus } from '../../types';

export const WelcomeEntryScreen: React.FC = () => {
  const {
    loginPartner,
    loginAdmin,
    openRegistration,
    switchPresetAccount,
    checkApplicationStatus,
    partners
  } = useApp();

  const [activePortalTab, setActivePortalTab] = useState<'PARTNER' | 'ADMIN'>('PARTNER');
  const [partnerSubTab, setPartnerSubTab] = useState<'LOGIN' | 'STATUS_TRACKER'>('LOGIN');

  // Partner Login Form
  const [partnerIdentifier, setPartnerIdentifier] = useState('amar.amb@cinevenue.com');
  const [partnerPassword, setPartnerPassword] = useState('Partner@123');
  const [showPartnerPass, setShowPartnerPass] = useState(false);
  const [partnerLoginError, setPartnerLoginError] = useState<string | null>(null);
  const [isPartnerLoggingIn, setIsPartnerLoggingIn] = useState(false);

  // Admin Login Form
  const [adminUsername, setAdminUsername] = useState('superadmin@cinevenue.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('8888');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);
  const [isAdminLoggingIn, setIsAdminLoggingIn] = useState(false);

  // Application Status Lookup
  const [statusSearchQuery, setStatusSearchQuery] = useState('');
  const [searchedPartner, setSearchedPartner] = useState<any | null>(null);
  const [statusSearchError, setStatusSearchError] = useState<string | null>(null);
  const [isSearchingStatus, setIsSearchingStatus] = useState(false);

  // Forgot Password Modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const authpanelUrl =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:3000/authpanel'
      : 'https://cinevenue.com/authpanel';

  const handlePartnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPartnerLoginError(null);
    setIsPartnerLoggingIn(true);

    try {
      const res = await loginPartner(partnerIdentifier, partnerPassword);
      if (!res.success && res.status) {
        // Partner found but pending, rejected, more info or suspended
        // loginPartner automatically sets the session so App.tsx displays StatusBanner
      } else if (!res.success) {
        setPartnerLoginError(res.message);
      }
    } catch (err: any) {
      setPartnerLoginError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsPartnerLoggingIn(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError(null);
    setIsAdminLoggingIn(true);

    try {
      const res = await loginAdmin({
        username: adminUsername,
        password: adminPassword,
        passcode: adminPasscode
      });

      if (!res.success) {
        setAdminLoginError(res.message);
      }
    } catch (err: any) {
      setAdminLoginError(err.message || 'Admin authentication failed.');
    } finally {
      setIsAdminLoggingIn(false);
    }
  };

  const handleStatusSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusSearchQuery.trim()) return;

    setStatusSearchError(null);
    setIsSearchingStatus(true);
    setSearchedPartner(null);

    try {
      const result = await checkApplicationStatus(statusSearchQuery);
      if (result) {
        setSearchedPartner(result);
      } else {
        setStatusSearchError('No partner application found matching this reference. Please check your Application ID, registered email, or phone.');
      }
    } catch (err) {
      setStatusSearchError('Error checking status. Please try again.');
    } finally {
      setIsSearchingStatus(false);
    }
  };

  const handleQuickDemoSelect = (accountKey: string) => {
    switchPresetAccount(accountKey);
  };

  return (
    <div className="min-h-[92vh] flex flex-col justify-center items-center py-6 px-4 sm:px-6">
      
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-amber-600/5 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-500/5 blur-2xl rounded-full" />
      </div>

      <div className="w-full max-w-4xl space-y-8 animate-fade-in">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900 border border-amber-500/30 shadow-lg shadow-amber-500/5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-semibold tracking-wider text-amber-300 uppercase font-mono">
              Official Partner & Admin Gateway
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-xl shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Film className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500">
                CINEVENUE
              </h1>
              <span className="text-[11px] font-bold text-amber-400/80 tracking-widest uppercase block -mt-1 font-sans">
                PARTNER PLATFORM
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Enterprise management hub for Theatres, Event Organizers, Production Houses, and Entertainment Venues with central Founder Admin governance.
          </p>
        </div>

        {/* Dual Pathway Switcher Tabs */}
        <div className="flex justify-center">
          <div className="p-1.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl inline-flex gap-2 shadow-xl">
            <button
              type="button"
              onClick={() => setActivePortalTab('PARTNER')}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activePortalTab === 'PARTNER'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Partner Portal</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePortalTab('ADMIN')}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activePortalTab === 'ADMIN'
                  ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-current" />
              <span>Admin Auth Panel</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-zinc-950/40 text-current uppercase tracking-wider">
                Founder
              </span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* OPTION A: PARTNER PORTAL VIEW                           */}
        {/* ======================================================== */}
        {activePortalTab === 'PARTNER' && (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
            
            {/* Sub-navigation inside Partner Portal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPartnerSubTab('LOGIN')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                    partnerSubTab === 'LOGIN'
                      ? 'bg-zinc-800 text-amber-300 border border-amber-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Partner Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setPartnerSubTab('STATUS_TRACKER')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    partnerSubTab === 'STATUS_TRACKER'
                      ? 'bg-zinc-800 text-amber-300 border border-amber-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Track Application Status
                </button>
              </div>

              <button
                type="button"
                onClick={openRegistration}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Register New Business</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* PARTNER SIGN IN FORM */}
            {partnerSubTab === 'LOGIN' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Form Column */}
                <div className="md:col-span-7 space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold font-cinzel text-zinc-100">
                      Partner Business Login
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Sign in with your verified CineVenue business credentials.
                    </p>
                  </div>

                  {partnerLoginError && (
                    <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                      <div>{partnerLoginError}</div>
                    </div>
                  )}

                  <form onSubmit={handlePartnerLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                        Business Email or Registered Mobile
                      </label>
                      <input
                        type="text"
                        value={partnerIdentifier}
                        onChange={e => setPartnerIdentifier(e.target.value)}
                        placeholder="e.g. partner@ambcinemas.com or +91 98765 43210"
                        required
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                          Password / PIN
                        </label>
                        <button
                          type="button"
                          onClick={() => setForgotModalOpen(true)}
                          className="text-[11px] text-amber-400 hover:text-amber-300 font-medium transition-colors"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPartnerPass ? 'text' : 'password'}
                          value={partnerPassword}
                          onChange={e => setPartnerPassword(e.target.value)}
                          placeholder="Enter your partner account password"
                          required
                          className="w-full px-4 py-3 pr-10 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPartnerPass(!showPartnerPass)}
                          className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-200"
                        >
                          {showPartnerPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isPartnerLoggingIn}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isPartnerLoggingIn ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Authenticating Partner...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to Partner Portal</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Right Info Column: 5 Business Categories */}
                <div className="md:col-span-5 bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Supported Business Categories</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/60 flex items-center gap-2.5">
                      <Film className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-zinc-200">Theatre Partner</div>
                        <div className="text-[10px] text-zinc-400">Multiplexes, Single Screens, IMAX</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/60 flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-zinc-200">Event Organizer</div>
                        <div className="text-[10px] text-zinc-400">Concerts, Live Shows, Festivals</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/60 flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-zinc-200">Event Management Co.</div>
                        <div className="text-[10px] text-zinc-400">Corporate Galas, Expos, Weddings</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/60 flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-zinc-200">Production House</div>
                        <div className="text-[10px] text-zinc-400">Film Studios, Premieres, Box Office</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/60 flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-zinc-200">Entertainment Partner</div>
                        <div className="text-[10px] text-zinc-400">VR Parks, Arenas, Theme Parks</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
                    Need to submit a new venue or organization? Click <strong>Register New Business</strong> above.
                  </div>
                </div>

              </div>
            )}

            {/* APPLICATION STATUS TRACKER VIEW */}
            {partnerSubTab === 'STATUS_TRACKER' && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold font-cinzel text-zinc-100 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <span>Real-time Application Status Tracker</span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Inspect your registration review progress, compliance notes, and Founder approval status.
                  </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleStatusSearch} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={statusSearchQuery}
                      onChange={e => setStatusSearchQuery(e.target.value)}
                      placeholder="Enter Partner ID (e.g. biz_pending_003), registered email or mobile number"
                      className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearchingStatus}
                    className="px-6 py-3 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isSearchingStatus ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span>Check Status</span>
                  </button>
                </form>

                {statusSearchError && (
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                    <div>{statusSearchError}</div>
                  </div>
                )}

                {/* Searched Result Card */}
                {searchedPartner && (
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-400">REF: {searchedPartner.id}</span>
                        <h3 className="text-lg font-bold text-zinc-100">{searchedPartner.businessName}</h3>
                        <div className="text-xs text-zinc-400">Owner: {searchedPartner.ownerName} · {searchedPartner.city}</div>
                      </div>

                      {/* Status Tag */}
                      <div>
                        {searchedPartner.status === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            APPROVED & ACTIVE
                          </span>
                        )}
                        {(searchedPartner.status === 'PENDING' || searchedPartner.status === 'UNDER_REVIEW') && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            <Clock className="w-3.5 h-3.5 animate-pulse" />
                            PENDING VERIFICATION
                          </span>
                        )}
                        {searchedPartner.status === 'MORE_INFO_REQUIRED' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                            <AlertCircle className="w-3.5 h-3.5" />
                            MORE INFO REQUIRED
                          </span>
                        )}
                        {searchedPartner.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                            <XCircle className="w-3.5 h-3.5" />
                            APPLICATION REJECTED
                          </span>
                        )}
                        {searchedPartner.status === 'SUSPENDED' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-950 text-red-400 border border-red-800">
                            <Lock className="w-3.5 h-3.5" />
                            ACCOUNT SUSPENDED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                        <div className="text-[10px] text-zinc-400 uppercase font-semibold">Category</div>
                        <div className="font-bold text-zinc-200 mt-0.5">{searchedPartner.category.replace('_', ' ')}</div>
                      </div>
                      <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                        <div className="text-[10px] text-zinc-400 uppercase font-semibold">Applied On</div>
                        <div className="font-bold text-zinc-200 mt-0.5">{searchedPartner.appliedAt}</div>
                      </div>
                      <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                        <div className="text-[10px] text-zinc-400 uppercase font-semibold">GST Registration</div>
                        <div className="font-mono text-zinc-200 mt-0.5">{searchedPartner.gstNumber || 'Submitted'}</div>
                      </div>
                    </div>

                    {/* Status Specific Explanations */}
                    {searchedPartner.status === 'PENDING' && (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span>Under Review by Founder Admin Team</span>
                        </div>
                        <p className="text-[11px] text-amber-300/80">
                          Your application is in the verification queue. GST compliance, trade license and bank account validation are being completed.
                        </p>
                      </div>
                    )}

                    {searchedPartner.status === 'REJECTED' && (
                      <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-200 space-y-1">
                        <div className="font-bold text-rose-300 flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span>Rejection Reason:</span>
                        </div>
                        <p className="text-[11px] font-mono text-rose-200/90 bg-zinc-950 p-2.5 rounded-lg border border-rose-900/30">
                          "{searchedPartner.rejectionReason || 'Business verification documents did not meet CineVenue regulatory requirements.'}"
                        </p>
                      </div>
                    )}

                    {searchedPartner.status === 'APPROVED' && (
                      <button
                        type="button"
                        onClick={() => {
                          loginPartner(searchedPartner.email, 'any');
                        }}
                        className="w-full py-3 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Launch {searchedPartner.businessName} Dashboard</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Quick Demo Profiles Strip for rapid testing */}
            <div className="pt-4 border-t border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span className="font-semibold text-zinc-300">Quick Testing Demo Profiles:</span>
                <span className="text-[10px] text-zinc-500">1-click switch for evaluation</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('THEATRE_OWNER')}
                  className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
                >
                  <Film className="w-3 h-3 text-amber-400" />
                  <span>AMB Cinemas (Theatre Owner)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('EVENT_ORGANIZER')}
                  className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
                >
                  <Calendar className="w-3 h-3 text-emerald-400" />
                  <span>Sunburn Arena (Event Org)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('PRODUCTION_HOUSE')}
                  className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
                >
                  <Layers className="w-3 h-3 text-blue-400" />
                  <span>Production House</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('PENDING_PARTNER')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
                >
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Pending Applicant View</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('REJECTED_PARTNER')}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
                >
                  <XCircle className="w-3 h-3 text-rose-400" />
                  <span>Rejected Applicant View</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* OPTION B: ADMIN AUTH PANEL LOGIN (cinevenue/authpanel)  */}
        {/* ======================================================== */}
        {activePortalTab === 'ADMIN' && (
          <div className="bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
            
            {/* Ambient golden badge */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Admin Header Notice */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold shadow-lg shadow-amber-500/10 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold font-cinzel text-zinc-100">
                      CineVenue Founder Admin Auth Panel
                    </h2>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500 text-zinc-950 uppercase">
                      /authpanel
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Connects directly to the canonical CineVenue Admin Authentication System.
                  </p>
                </div>
              </div>

              <a
                href={authpanelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-colors shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open /authpanel Directly</span>
              </a>
            </div>

            {/* Admin Security Warning */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-amber-300">
                  Protected System Infrastructure & Authentication Check
                </div>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  The existing CineVenue Founder Admin Panel belongs exclusively to platform administrators. Existing master admin credentials (<code className="bg-zinc-950 px-1 py-0.5 rounded text-amber-300 font-mono">superadmin@cinevenue.com</code> or security passcode <code className="bg-zinc-950 px-1 py-0.5 rounded text-amber-300 font-mono">8888</code>) continue to be strictly enforced.
                </p>
              </div>
            </div>

            {adminLoginError && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <div>{adminLoginError}</div>
              </div>
            )}

            {/* Admin Login Form */}
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                    Master Admin Email / Username
                  </label>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={e => setAdminUsername(e.target.value)}
                    placeholder="superadmin@cinevenue.com or admin"
                    required
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                      Security Passcode / Password
                    </label>
                    <span className="text-[10px] text-amber-400/80 font-mono">Default PIN: 8888</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showAdminPass ? 'text' : 'password'}
                      value={adminPasscode || adminPassword}
                      onChange={e => {
                        setAdminPasscode(e.target.value);
                        setAdminPassword(e.target.value);
                      }}
                      placeholder="Enter master passcode or password"
                      required
                      className="w-full px-4 py-3 pr-10 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPass(!showAdminPass)}
                      className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-200"
                    >
                      {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={isAdminLoggingIn}
                  className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:from-amber-400 hover:to-amber-300 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAdminLoggingIn ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Master Administrator...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Verify Credentials & Open Admin Terminal</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAdminUsername('superadmin@cinevenue.com');
                    setAdminPasscode('8888');
                    loginAdmin({ username: 'superadmin@cinevenue.com', passcode: '8888' });
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-zinc-950 border border-amber-500/30 text-amber-300 font-bold text-xs hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>1-Click Master Unlock (8888)</span>
                </button>
              </div>
            </form>

            <div className="p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Encrypted Connection Ready:</span>
                <code className="text-amber-400 text-[11px] font-mono">{authpanelUrl}</code>
              </div>
              <span className="text-[10px] text-zinc-500">Node/Prisma Backend Sync</span>
            </div>

          </div>
        )}

      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-cinzel text-zinc-100 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <span>Partner Password Recovery</span>
              </h3>
              <button
                type="button"
                onClick={() => { setForgotModalOpen(false); setForgotSubmitted(false); }}
                className="text-zinc-400 hover:text-zinc-200 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {!forgotSubmitted ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  setForgotSubmitted(true);
                }}
                className="space-y-4 text-xs"
              >
                <p className="text-zinc-400 leading-relaxed">
                  Enter your registered partner business email or mobile number. We will dispatch a secure PIN reset link.
                </p>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Registered Email / Mobile</label>
                  <input
                    type="text"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="e.g. partner@cinemas.com or +91 98765 43210"
                    required
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-4 py-2 text-zinc-400 hover:text-zinc-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    Send Recovery Instructions
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-center py-2 text-xs">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-zinc-100 text-sm">Recovery Link Dispatched</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Instructions have been sent to <strong>{forgotEmail || 'your contact'}</strong>. Please verify your inbox and SMS.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setForgotModalOpen(false); setForgotSubmitted(false); }}
                  className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold cursor-pointer"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
