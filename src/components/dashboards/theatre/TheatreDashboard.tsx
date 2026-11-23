import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  X,
  LayoutDashboard,
  Landmark,
  Layers,
  Sliders,
  Film,
  CalendarRange,
  Ticket,
  PieChart,
  Sparkles,
  Tag,
  Users,
  Settings,
  QrCode,
  ArrowLeft,
  Copy,
  Check,
  LogOut,
  ChevronRight,
  ChevronDown,
  Cpu,
  Laptop,
  Sun,
  Moon,
  Building2,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { Theatre, Booking, MovieSchedule, Movie } from '../../../types';

// Import modular theatre admin subpages
import DashboardSubpage from './theatre-admin/Dashboard';
import TheatreProfileSubpage from './theatre-admin/TheatreProfile';
import ScreensSubpage from './theatre-admin/Screens';
import SeatLayoutSubpage from './theatre-admin/SeatLayout';
import MoviesSubpage from './theatre-admin/Movies';
import ShowsSubpage from './theatre-admin/Shows';
import BookingsSubpage from './theatre-admin/Bookings';
import ReportsSubpage from './theatre-admin/Reports';
import FoodSubpage from './theatre-admin/Food';
import CouponsSubpage from './theatre-admin/Coupons';
import StaffSubpage from './theatre-admin/Staff';
import SettingsSubpage from './theatre-admin/Settings';
import QRScannerSubpage from './theatre-admin/QRScanner';
import TheatreOnboardingWizard from './theatre-admin/TheatreOnboardingWizard';

interface TheatreDashboardProps {
  activeTab?: string;
  onClose?: () => void;
}

export const TheatreDashboard: React.FC<TheatreDashboardProps> = ({
  activeTab: externalTab,
  onClose: externalOnClose
}) => {
  const { currentPartner, locations, bookings, shows, movies, activeLocationId, setActiveLocationId, logout } = useApp();

  // Multi-theatre support: build list of authorized theatres for this partner
  const partnerTheatres: Theatre[] = useMemo(() => {
    const list: Theatre[] = [
      {
        id: 'th_2',
        name: 'IMAX Prasads',
        location: 'Hyderabad · Tank Bund',
        city: 'Hyderabad',
        address: 'Tank Bund Road, Necklace Road, Hyderabad',
        features: ['IMAX Dual Laser 70mm', 'Dolby Atmos', 'Dome Screen', 'VIP Recliners'],
        price: '₹220 - ₹480',
        img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
        rating: '4.9'
      },
      {
        id: currentPartner?.id || 'biz_theatre_001',
        name: currentPartner?.businessName || 'AMB Cinemas Gachibowli',
        location: `${currentPartner?.city || 'Hyderabad'} · Financial District`,
        city: currentPartner?.city || 'Hyderabad',
        address: currentPartner?.businessAddress || 'Gachibowli Main Road, Financial District',
        features: ['IMAX 4K Laser', 'Dolby Atmos', 'VIP Recliners', 'Gourmet Lounge'],
        price: '₹250 - ₹550',
        img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
        rating: '4.8'
      },
      {
        id: 'th_3',
        name: 'Cinepolis GVK One',
        location: 'Hyderabad · Banjara Hills',
        city: 'Hyderabad',
        address: 'GVK One Mall, Road No. 1, Banjara Hills',
        features: ['VIP Luxe', 'Dolby Atmos', 'Coffee Lounge'],
        price: '₹280 - ₹600',
        img: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=800&auto=format&fit=crop&q=80',
        rating: '4.7'
      }
    ];

    // Add any additional partner locations
    locations.forEach(loc => {
      if (!list.some(t => String(t.id) === String(loc.id) || t.name === loc.name)) {
        list.push({
          id: loc.id,
          name: loc.name,
          location: `${loc.city} · ${loc.address}`,
          city: loc.city,
          address: loc.address,
          features: ['Dolby Atmos 4K', 'Silver Screen', 'Air Conditioned'],
          price: '₹200 - ₹450',
          img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
          rating: '4.6'
        });
      }
    });

    return list;
  }, [currentPartner, locations]);

  // Selected Active Theatre state (prioritize URL ?theatreId parameter)
  const [selectedTheatreId, setSelectedTheatreId] = useState<string>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTheatreId = params.get('theatreId');
      if (urlTheatreId && partnerTheatres.some(t => String(t.id) === String(urlTheatreId))) {
        return urlTheatreId;
      }
    } catch {
      // fallback
    }
    return activeLocationId || (partnerTheatres[0]?.id ? String(partnerTheatres[0].id) : 'th_2');
  });

  const selectedTheatre = useMemo(() => {
    return partnerTheatres.find(t => String(t.id) === String(selectedTheatreId)) || partnerTheatres[0];
  }, [partnerTheatres, selectedTheatreId]);

  // Active Tab state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [copied, setCopied] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<'system' | 'dark' | 'light'>('system');
  const [isThemeOpen, setIsThemeOpen] = useState<boolean>(false);
  const [isVenueSelectorOpen, setIsVenueSelectorOpen] = useState<boolean>(false);

  // Sync external tab if provided
  useEffect(() => {
    if (externalTab) {
      const mapping: Record<string, string> = {
        overview: 'dashboard',
        seats: 'seat-layout',
        seatmap: 'seat-layout',
        shows: 'shows',
        bookings: 'bookings',
        pos: 'pos-integration',
        reports: 'reports',
        revenue: 'reports',
        profile: 'profile',
        screens: 'screens'
      };
      if (mapping[externalTab]) {
        setActiveTab(mapping[externalTab]);
      }
    }
  }, [externalTab]);

  // Navigation Items Config matching TheatreManagerDashboard exactly
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos-integration', label: 'POS Integration & Sync', icon: Cpu },
    { id: 'profile', label: 'Theatre Profile', icon: Landmark },
    { id: 'screens', label: 'Screens', icon: Layers },
    { id: 'seat-layout', label: 'Seat Layout & Show Occupancy', icon: Sliders },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'shows', label: 'Shows', icon: CalendarRange },
    { id: 'bookings', label: 'Bookings', icon: Ticket },
    { id: 'food', label: 'Food & Beverages', icon: Sparkles },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'reports', label: 'Reports', icon: PieChart },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'qr-scanner', label: 'QR Scanner', icon: QrCode },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Adapt shows to MovieSchedule format
  const schedules: MovieSchedule[] = useMemo(() => {
    if (shows && shows.length > 0) {
      return shows.map(s => ({
        id: s.id,
        movieTitle: s.movieTitle,
        theatreName: selectedTheatre.name,
        timeSlot: s.time,
        pricePerSeat: s.prices?.CLASSIC || 250,
        date: s.date || 'Today',
        screenName: s.screenName || 'Screen 1',
        interval: 15,
        bookingWindow: 'Closes 30m before show'
      }));
    }
    // High-fidelity fallback schedules for IMAX Prasads
    return [
      {
        id: 'sch_1',
        movieTitle: 'Stree 2',
        theatreName: selectedTheatre.name,
        timeSlot: '10:30 AM',
        pricePerSeat: 250,
        date: 'Today',
        screenName: 'IMAX Laser 70mm',
        interval: 15,
        bookingWindow: 'Closes 30m before show'
      },
      {
        id: 'sch_2',
        movieTitle: 'Stree 2',
        theatreName: selectedTheatre.name,
        timeSlot: '02:00 PM',
        pricePerSeat: 250,
        date: 'Today',
        screenName: 'IMAX Laser 70mm',
        interval: 15,
        bookingWindow: 'Closes 30m before show'
      },
      {
        id: 'sch_3',
        movieTitle: 'Stree 2',
        theatreName: selectedTheatre.name,
        timeSlot: '06:30 PM',
        pricePerSeat: 300,
        date: 'Today',
        screenName: 'IMAX Laser 70mm',
        interval: 15,
        bookingWindow: 'Closes 30m before show'
      },
      {
        id: 'sch_4',
        movieTitle: 'Kalki 2898 AD',
        theatreName: selectedTheatre.name,
        timeSlot: '09:45 PM',
        pricePerSeat: 350,
        date: 'Today',
        screenName: 'Dome Screen',
        interval: 15,
        bookingWindow: 'Closes 30m before show'
      }
    ];
  }, [shows, selectedTheatre.name]);

  // Adapt bookings to format expected by subpages
  const formattedBookings: Booking[] = useMemo(() => {
    if (bookings && bookings.length > 0) {
      return bookings.map(b => ({
        ...b,
        theatreName: selectedTheatre.name,
        totalPrice: b.totalAmount || 450,
        timeSlot: b.showTime || '06:30 PM',
        date: b.showDate || 'Today'
      }));
    }
    return [
      {
        id: 'BKG-IMAX-001',
        userId: 'usr_01',
        movieTitle: 'Stree 2',
        theatreName: selectedTheatre.name,
        screenName: 'IMAX Laser 70mm',
        date: 'Today',
        timeSlot: '02:00 PM',
        seats: ['F10', 'F11'],
        totalPrice: 500,
        bookingDate: new Date().toISOString(),
        paymentStatus: 'PAID'
      },
      {
        id: 'BKG-IMAX-002',
        userId: 'usr_02',
        movieTitle: 'Stree 2',
        theatreName: selectedTheatre.name,
        screenName: 'IMAX Laser 70mm',
        date: 'Today',
        timeSlot: '06:30 PM',
        seats: ['G14', 'G15', 'G16'],
        totalPrice: 900,
        bookingDate: new Date().toISOString(),
        paymentStatus: 'PAID'
      }
    ];
  }, [bookings, selectedTheatre.name]);

  // Copy shareable link to clipboard
  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?theatreId=${selectedTheatre.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClose = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      logout();
    }
  };

  const handleUpdateTheatre = (updated: Theatre) => {
    console.log('[TheatreDashboard] Update theatre:', updated);
  };

  const handleScheduleShow = (newSchedule: MovieSchedule) => {
    console.log('[TheatreDashboard] Scheduled show:', newSchedule);
  };

  const handleDeleteSchedule = (id: string) => {
    console.log('[TheatreDashboard] Delete schedule:', id);
  };

  // Dynamically render current page tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardSubpage
            theatre={selectedTheatre}
            bookings={formattedBookings}
            schedules={schedules}
            movies={movies}
          />
        );
      case 'pos-integration':
        return (
          <TheatreOnboardingWizard
            theatre={selectedTheatre}
            onComplete={data => {
              console.log('POS Onboarding completed:', data);
              setActiveTab('dashboard');
            }}
          />
        );
      case 'profile':
        return (
          <TheatreProfileSubpage
            theatre={selectedTheatre}
            onUpdateTheatre={handleUpdateTheatre}
          />
        );
      case 'screens':
        return <ScreensSubpage theatreId={selectedTheatre.id} />;
      case 'seat-layout':
        return (
          <SeatLayoutSubpage
            theatre={selectedTheatre}
            onUpdateTheatre={handleUpdateTheatre}
          />
        );
      case 'movies':
        return <MoviesSubpage movies={movies} />;
      case 'shows':
        return (
          <ShowsSubpage
            theatreName={selectedTheatre.name}
            schedules={schedules}
            movies={movies}
            onScheduleShow={handleScheduleShow}
            onDeleteSchedule={handleDeleteSchedule}
          />
        );
      case 'bookings':
        return <BookingsSubpage theatreName={selectedTheatre.name} bookings={formattedBookings} />;
      case 'reports':
        return <ReportsSubpage theatre={selectedTheatre} bookings={formattedBookings} />;
      case 'food':
        return <FoodSubpage theatreId={selectedTheatre.id} />;
      case 'coupons':
        return <CouponsSubpage theatreId={selectedTheatre.id} />;
      case 'staff':
        return <StaffSubpage theatreId={selectedTheatre.id} />;
      case 'qr-scanner':
        return <QRScannerSubpage theatreName={selectedTheatre.name} bookings={formattedBookings} />;
      case 'settings':
        return (
          <SettingsSubpage
            theatre={selectedTheatre}
            onUpdateTheatre={handleUpdateTheatre}
          />
        );
      default:
        return (
          <div className="text-center py-12 text-zinc-400">
            Section under active construction.
          </div>
        );
    }
  };

  return (
    <div
      id="theatre-manager-portal"
      className="fixed inset-0 z-50 bg-[#0A0A0B] flex overflow-hidden text-left font-sans text-zinc-100"
    >
      {/* =========================================================================
          1. SIDEBAR NAVIGATION (Desktop 64-col docked left panel)
          ========================================================================= */}
      <aside className="w-64 bg-[#121215] border-r border-white/5 flex flex-col justify-between shrink-0 hidden md:flex select-none">
        
        {/* UPPER PART: Identity & Navigation Links */}
        <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
          
          {/* Brand header */}
          <div className="p-6 border-b border-white/5 space-y-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[10px] text-gold font-bold uppercase tracking-[0.2em]">
                Theatre Owner Portal
              </span>
            </div>

            {/* Managed Venue Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsVenueSelectorOpen(!isVenueSelectorOpen)}
                className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-none"
              >
                <h2 className="text-sm font-display font-bold text-zinc-100 tracking-wide truncate group-hover:text-gold transition-colors">
                  {selectedTheatre.name}
                </h2>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-gold transition-transform duration-200 ${isVenueSelectorOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Venue Switcher Menu */}
              {isVenueSelectorOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-[#1a1a1f] border border-gold/30 rounded-xl shadow-2xl z-50 p-1.5 space-y-1 animate-fade-in">
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    Select Managed Venue
                  </div>
                  {partnerTheatres.map(th => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => {
                        setSelectedTheatreId(String(th.id));
                        setActiveLocationId(String(th.id));
                        setIsVenueSelectorOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        String(th.id) === String(selectedTheatre.id)
                          ? 'bg-gold/20 text-gold'
                          : 'text-zinc-300 hover:bg-white/5 hover:text-zinc-100'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-bold truncate">{th.name}</div>
                        <div className="text-[10px] text-zinc-400 truncate">{th.city}</div>
                      </div>
                      {String(th.id) === String(selectedTheatre.id) && (
                        <Check className="w-3.5 h-3.5 text-gold shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Switch to Daily Operations Panel */}
          <div className="px-4 pt-3 pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="w-full py-2.5 px-3 rounded-xl bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold text-xs font-bold flex items-center justify-between cursor-pointer transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Daily Operations Panel</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 flex-1">
            {navigationItems.map(item => {
              const active = activeTab === item.id;
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 ${
                    active
                      ? 'bg-gold/15 text-gold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 ${active ? 'text-gold' : 'text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* LOWER PART: Footer exit operations */}
        <div className="p-4 border-t border-white/5 space-y-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-gold/30 hover:bg-white/[0.08] text-zinc-100 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-gold" />
                <span>Copied Link!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy Shareable URL</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-black text-red-400 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border-0 flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          2. MAIN CONTAINER PANEL
          ========================================================================= */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* SYSTEM STATUS HEAD BAR */}
        <header className="bg-[#121215] border-b border-white/5 h-16 px-4 md:px-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex md:hidden items-center justify-center p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-zinc-100 cursor-pointer border-0"
              title="Logout"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold font-mono">
                CONNECTED
              </span>
              <span className="text-xs text-zinc-400 font-medium hidden sm:inline">
                / {navigationItems.find(n => n.id === activeTab)?.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick mobile dropdown tab switcher */}
            <select
              value={activeTab}
              onChange={e => setActiveTab(e.target.value)}
              className="md:hidden bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-zinc-100 text-xs cursor-pointer focus:outline-none"
            >
              {navigationItems.map(n => (
                <option key={n.id} value={n.id} className="bg-[#0A0A0B] text-zinc-100">
                  {n.label}
                </option>
              ))}
            </select>

            {/* Quick Managed Venue Selector in Header */}
            <select
              value={selectedTheatreId}
              onChange={e => {
                setSelectedTheatreId(e.target.value);
                setActiveLocationId(e.target.value);
              }}
              className="hidden sm:inline-block bg-white/5 border border-white/10 hover:border-gold/30 px-3 py-1.5 rounded-xl text-zinc-200 text-xs cursor-pointer focus:outline-none font-medium"
            >
              {partnerTheatres.map(th => (
                <option key={th.id} value={th.id} className="bg-[#121215] text-zinc-100">
                  {th.name}
                </option>
              ))}
            </select>

            <span className="text-[11px] font-mono text-zinc-500 hidden lg:inline">
              Venue ID: #{selectedTheatre.id}
            </span>

            {/* Theme Toggle Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 text-zinc-200 text-xs font-medium cursor-pointer transition-colors"
                title={`Theme: ${themeMode}`}
              >
                {themeMode === 'system' ? (
                  <Laptop className="w-3.5 h-3.5 text-gold" />
                ) : themeMode === 'light' ? (
                  <Sun className="w-3.5 h-3.5 text-gold" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-gold" />
                )}
                <span className="hidden sm:inline capitalize">{themeMode}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {isThemeOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-xl bg-[#121215] border border-gold/30 shadow-2xl p-1 z-[100] animate-fade-in space-y-1">
                  {(['system', 'dark', 'light'] as const).map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        setThemeMode(mode);
                        setIsThemeOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        themeMode === mode ? 'bg-gold/20 text-gold' : 'text-zinc-300 hover:bg-white/5'
                      }`}
                    >
                      <span className="capitalize">{mode}</span>
                      {themeMode === mode && <Check className="w-3 h-3 text-gold" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Close Workspace Button */}
            <button
              type="button"
              onClick={handleClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-zinc-100 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
              title="Close Workspace and Return"
            >
              <X className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Close Workspace</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT LAYOUT */}
        <div className="flex-1 overflow-y-auto bg-[#0A0A0B] p-4 md:p-8 no-scrollbar">
          <div className="max-w-6xl mx-auto">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TheatreDashboard;
