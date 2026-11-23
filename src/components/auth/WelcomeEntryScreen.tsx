import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Film,
  Sparkles,
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
  ChevronRight,
  KeyRound,
  ShieldCheck,
  Lock
} from 'lucide-react';

export const WelcomeEntryScreen: React.FC = () => {
  const {
    login,
    openRegistration,
    checkApplicationStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'STATUS_TRACKER'>('LOGIN');

  // Single Common Login Form
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Application Status Lookup
  const [statusSearchQuery, setStatusSearchQuery] = useState('');
  const [searchedPartner, setSearchedPartner] = useState<any | null>(null);
  const [statusSearchError, setStatusSearchError] = useState<string | null>(null);
  const [isSearchingStatus, setIsSearchingStatus] = useState(false);

  // Forgot Password Modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await login(identifier, password);
      if (!res.success && res.status) {
        // Status gated partner (PENDING, MORE_INFO_REQUIRED, REJECTED, SUSPENDED)
      } else if (!res.success) {
        setLoginError(res.message || 'Login failed. Please verify your mobile/email and password.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
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
        setStatusSearchError('No partner application found with this reference. Please check your Partner ID, email, or mobile number.');
      }
    } catch (err) {
      setStatusSearchError('Error checking status. Please try again.');
    } finally {
      setIsSearchingStatus(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-6 px-4 sm:px-6">
      
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-amber-600/5 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-500/5 blur-2xl rounded-full" />
      </div>

      <div className="w-full max-w-lg space-y-6 animate-fade-in">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-xl shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Film className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-extrabold tracking-tight font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500">
                CINEVENUE
              </h1>
              <span className="text-[10px] font-bold text-amber-400/80 tracking-widest uppercase block -mt-1 font-sans">
                PARTNER PLATFORM
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Authorized sign-in gateway for CineVenue business partners & administrators.
          </p>
        </div>

        {/* Central Card Container */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
          
          {/* Top Bar Switcher: Sign In vs Track Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('LOGIN')}
                className={`px-3.5 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                  activeTab === 'LOGIN'
                    ? 'bg-zinc-800 text-amber-300 border border-amber-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('STATUS_TRACKER')}
                className={`px-3.5 py-2 rounded-xl font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'STATUS_TRACKER'
                    ? 'bg-zinc-800 text-amber-300 border border-amber-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Track Status</span>
              </button>
            </div>

            <button
              type="button"
              onClick={openRegistration}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Register Business</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* TAB 1: COMMON SINGLE LOGIN FORM */}
          {activeTab === 'LOGIN' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold font-cinzel text-zinc-100">
                  Account Sign In
                </h2>
                <p className="text-xs text-zinc-400">
                  Enter your credentials to access your authorized workspace.
                </p>
              </div>

              {loginError && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <div>{loginError}</div>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                    Mobile Number or Email Address
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="e.g. +91 98765 43210 or user@cinevenue.com"
                    required
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(true)}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full px-4 py-3 pr-10 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Platform</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-Bit Encrypted · Role-Based Routing</span>
                </span>
                <span className="text-zinc-600 font-mono text-[10px]">SECURE GATEWAY</span>
              </div>
            </div>
          )}

          {/* TAB 2: APPLICATION STATUS TRACKER */}
          {activeTab === 'STATUS_TRACKER' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold font-cinzel text-zinc-100 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span>Application Status Tracker</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Track your registration review status and Founder verification progress.
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
                    placeholder="Enter Partner ID, mobile number, or email"
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
                          <HelpCircle className="w-3.5 h-3.5" />
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

                  {/* Particulars Grid */}
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
                      <div className="text-[10px] text-zinc-400 uppercase font-semibold">Tax Compliance</div>
                      <div className="font-mono text-zinc-200 mt-0.5">{searchedPartner.gstNumber || 'GST Submitted'}</div>
                    </div>
                  </div>

                  {searchedPartner.status === 'APPROVED' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifier(searchedPartner.email || searchedPartner.mobile);
                        setActiveTab('LOGIN');
                      }}
                      className="w-full py-3 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Proceed to Sign In</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-cinzel text-zinc-100 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <span>Account Password Recovery</span>
              </h3>
              <button
                type="button"
                onClick={() => { setForgotModalOpen(false); setForgotSubmitted(false); }}
                className="text-zinc-400 hover:text-zinc-200 text-sm font-bold p-1 cursor-pointer"
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
                  Enter your registered mobile number or email address. We will dispatch a secure PIN reset authorization.
                </p>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Registered Mobile or Email</label>
                  <input
                    type="text"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="e.g. +91 98765 43210 or user@cinevenue.com"
                    required
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-4 py-2 text-zinc-400 hover:text-zinc-200 cursor-pointer"
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
                    Instructions have been sent to <strong>{forgotEmail || 'your contact'}</strong>. Please check your messages and inbox.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setForgotModalOpen(false); setForgotSubmitted(false); }}
                  className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
