import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  TrendingUp,
  Building2,
  Tv,
  Calendar,
  Layers,
  Ticket,
  CreditCard,
  Users,
  FileText,
  Clock,
  Sliders,
  Film,
  Sparkles,
  Tag,
  QrCode,
  Settings,
  ChevronDown,
  CheckCircle2,
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react';
import { Theatre, Booking, MovieSchedule } from '../../../types';

// Import existing modular theatre admin components
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

// Native Partner Tabs
import { MyTheatresTab } from './MyTheatresTab';
import { POSManagementTab } from './POSManagementTab';

interface TheatreDashboardProps {
  activeTab?: string;
}

export const TheatreDashboard: React.FC<TheatreDashboardProps> = ({ activeTab: externalTab }) => {
  const { currentPartner, locations, bookings, shows, movies, activeLocationId, setActiveLocationId } = useApp();

  // Multi-theatre support: build list of authorized theatres for this partner
  const partnerTheatres: Theatre[] = useMemo(() => {
    const list: Theatre[] = [
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
        id: 'th_2',
        name: 'IMAX Prasads',
        location: 'Hyderabad · Tank Bund',
        city: 'Hyderabad',
        address: 'Tank Bund Road, Necklace Road',
        features: ['IMAX Dual Laser 70mm', 'Dolby 7.1', 'Dome Screen'],
        price: '₹220 - ₹480',
        img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
        rating: '4.9'
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

    // Add partner locations
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

  // Selected Active Theatre state
  const [selectedTheatreId, setSelectedTheatreId] = useState<string>(() => {
    return activeLocationId || partnerTheatres[0]?.id ? String(partnerTheatres[0].id) : 'biz_theatre_001';
  });

  const selectedTheatre = useMemo(() => {
    return partnerTheatres.find(t => String(t.id) === String(selectedTheatreId)) || partnerTheatres[0];
  }, [partnerTheatres, selectedTheatreId]);

  // Internal Active Tab State
  const [internalTab, setInternalTab] = useState<string>('OVERVIEW');

  // External tab mapping from mobile BottomNav
  const activeTab = useMemo(() => {
    if (!externalTab) return internalTab;
    switch (externalTab) {
      case 'overview': return 'OVERVIEW';
      case 'seatmap':
      case 'seats': return 'SEAT_LAYOUT';
      case 'manage':
      case 'shows': return 'SHOWS';
      case 'bookings': return 'BOOKINGS';
      case 'pos': return 'POS_COUNTER';
      case 'payments':
      case 'revenue': return 'REPORTS';
      case 'theatres': return 'MY_THEATRES';
      default: return internalTab;
    }
  }, [externalTab, internalTab]);

  // Comprehensive 18-Feature Navigation Tabs definition
  const tabs = [
    { id: 'OVERVIEW', label: 'Overview', icon: TrendingUp },
    { id: 'SEAT_LAYOUT', label: 'Original Seat Layout', icon: Sliders, badge: 'Authoritative' },
    { id: 'MY_THEATRES', label: 'My Theatres', icon: Building2 },
    { id: 'SCREENS', label: 'Screen Management', icon: Layers },
    { id: 'SHOWS', label: 'Shows & Timings', icon: Calendar },
    { id: 'MOVIES', label: 'Movie Management', icon: Film },
    { id: 'BOOKINGS', label: 'Online Bookings', icon: Ticket },
    { id: 'POS_COUNTER', label: 'POS Box Office', icon: Tv },
    { id: 'REPORTS', label: 'Revenue & Analytics', icon: CreditCard },
    { id: 'STAFF', label: 'Staff Management', icon: Users },
    { id: 'PROFILE', label: 'Theatre Profile', icon: Building2 },
    { id: 'FOOD', label: 'Food & Combos', icon: Sparkles },
    { id: 'COUPONS', label: 'Coupons & Promos', icon: Tag },
    { id: 'QR_SCANNER', label: 'Ticket QR Scanner', icon: QrCode },
    { id: 'SETTINGS', label: 'Settings', icon: Settings }
  ];

  // Adapt shows to MovieSchedule format
  const schedules: MovieSchedule[] = useMemo(() => {
    return shows.map(s => ({
      id: s.id,
      movieTitle: s.movieTitle,
      theatreName: selectedTheatre.name,
      timeSlot: s.time,
      pricePerSeat: s.prices.CLASSIC || 220,
      date: s.date,
      screenName: s.screenName,
      interval: 15,
      bookingWindow: 'Closes 30m before show'
    }));
  }, [shows, selectedTheatre.name]);

  // Adapt bookings to format expected by subpages
  const formattedBookings: Booking[] = useMemo(() => {
    return bookings.map(b => ({
      ...b,
      theatreName: selectedTheatre.name,
      totalPrice: b.totalAmount || 540,
      timeSlot: b.showTime || '06:30 PM',
      date: b.showDate || 'Today'
    }));
  }, [bookings, selectedTheatre.name]);

  const handleScheduleShow = (newSchedule: MovieSchedule) => {
    console.log('[TheatreDashboard] Scheduled show:', newSchedule);
  };

  const handleDeleteSchedule = (id: string) => {
    console.log('[TheatreDashboard] Delete schedule:', id);
  };

  const handleUpdateTheatre = (updated: Theatre) => {
    console.log('[TheatreDashboard] Update theatre:', updated);
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">

      {/* 1. TOP MULTI-THEATRE SELECTION SWITCHER BAR */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

        {/* Active Theatre Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold shadow-lg shadow-amber-500/10 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500 text-zinc-950 uppercase tracking-wider">
                ACTIVE VENUE
              </span>
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-zinc-300">CineVenue Core Sync Live</span>
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold font-cinzel text-zinc-100 mt-0.5">
              {selectedTheatre.name}
            </h1>
            <p className="text-xs text-zinc-400">
              {selectedTheatre.location} · ID: <code className="text-amber-400 font-mono text-[11px]">{selectedTheatre.id}</code>
            </p>
          </div>
        </div>

        {/* Multi-Theatre Switcher Control */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Switch Managed Theatre:
            </label>
            <div className="relative">
              <select
                value={selectedTheatreId}
                onChange={e => {
                  setSelectedTheatreId(e.target.value);
                  setActiveLocationId(e.target.value);
                }}
                className="w-full bg-zinc-950 border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-xs font-bold text-zinc-100 focus:outline-none focus:border-amber-400 cursor-pointer appearance-none pr-8 shadow-inner"
              >
                {partnerTheatres.map(th => (
                  <option key={th.id} value={th.id} className="bg-zinc-950 text-zinc-100">
                    {th.name} ({th.city})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-amber-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

      </div>

      {/* 2. SUB-HEADER SEGMENTED NAVIGATION BAR (Horizontal Scrolling with Touch Support) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto no-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setInternalTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${isActive
                  ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20 font-bold'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-950' : 'text-amber-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold ${isActive ? 'bg-zinc-950 text-amber-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. DYNAMIC CONTENT RENDERING CONTAINER */}
      <div className="min-h-[500px]">
        {/* 1. Theatre Overview & Live Stats */}
        {activeTab === 'OVERVIEW' && (
          <DashboardSubpage
            theatre={selectedTheatre}
            bookings={formattedBookings}
            schedules={schedules}
            movies={movies}
          />
        )}

        {/* 2. Original Theatre Seat Layout & Show Occupancy */}
        {activeTab === 'SEAT_LAYOUT' && (
          <SeatLayoutSubpage
            theatre={selectedTheatre}
            onUpdateTheatre={handleUpdateTheatre}
          />
        )}

        {/* 3. My Theatres & Registered Venues */}
        {activeTab === 'MY_THEATRES' && (
          <MyTheatresTab />
        )}

        {/* 4. Screen Management */}
        {activeTab === 'SCREENS' && (
          <ScreensSubpage theatreId={selectedTheatre.id} />
        )}

        {/* 5. Shows & Timings */}
        {activeTab === 'SHOWS' && (
          <ShowsSubpage
            theatreName={selectedTheatre.name}
            schedules={schedules}
            movies={movies}
            onScheduleShow={handleScheduleShow}
            onDeleteSchedule={handleDeleteSchedule}
          />
        )}

        {/* 6. Movies Management */}
        {activeTab === 'MOVIES' && (
          <MoviesSubpage movies={movies} />
        )}

        {/* 7. Bookings & Cancellations */}
        {activeTab === 'BOOKINGS' && (
          <BookingsSubpage
            theatreName={selectedTheatre.name}
            bookings={formattedBookings}
          />
        )}

        {/* 8. POS Box Office Counter */}
        {activeTab === 'POS_COUNTER' && (
          <POSManagementTab />
        )}

        {/* 9. Revenue & Reports Analytics */}
        {activeTab === 'REPORTS' && (
          <ReportsSubpage
            theatre={selectedTheatre}
            bookings={formattedBookings}
          />
        )}

        {/* 10. Staff Management */}
        {activeTab === 'STAFF' && (
          <StaffSubpage theatreId={selectedTheatre.id} />
        )}

        {/* 11. Theatre Profile & Bank Accounts */}
        {activeTab === 'PROFILE' && (
          <TheatreProfileSubpage
            theatre={selectedTheatre}
            onUpdateTheatre={handleUpdateTheatre}
          />
        )}

        {/* 12. Food & Beverages */}
        {activeTab === 'FOOD' && (
          <FoodSubpage theatreId={selectedTheatre.id} />
        )}

        {/* 13. Coupons & Promos */}
        {activeTab === 'COUPONS' && (
          <CouponsSubpage theatreId={selectedTheatre.id} />
        )}

        {/* 14. Ticket QR Scanner */}
        {activeTab === 'QR_SCANNER' && (
          <QRScannerSubpage
            theatreName={selectedTheatre.name}
            bookings={formattedBookings}
          />
        )}

        {/* 15. Operational Settings */}
        {activeTab === 'SETTINGS' && (
          <SettingsSubpage
            theatre={selectedTheatre}
            onUpdateTheatre={handleUpdateTheatre}
          />
        )}
      </div>

    </div>
  );
};
