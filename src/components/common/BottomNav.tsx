import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Ticket,
  Sliders,
  CreditCard,
  User,
  QrCode,
  CheckSquare,
  Calendar,
  Building2,
  Film,
  Sparkles,
  Layers
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { userSession, currentPartner } = useApp();

  // If user is Admin or Registration landing page, hide or simplify
  if (userSession.type === 'ADMIN' || userSession.type === 'REGISTRATION') {
    return null;
  }

  // If status is not APPROVED, hide tab bar
  if (currentPartner?.status !== 'APPROVED') {
    return null;
  }

  // Determine dynamic tabs based on role and category
  let navItems: { id: string; label: string; icon: React.FC<{ className?: string }> }[] = [];

  if (userSession.role === 'EMPLOYEE') {
    // For theatre employees: Home | Scan | Tasks | Profile
    navItems = [
      { id: 'overview', label: 'Home', icon: Home },
      { id: 'scan', label: 'Scan Ticket', icon: QrCode },
      { id: 'tasks', label: 'POS & Tasks', icon: CheckSquare },
      { id: 'profile', label: 'My Profile', icon: User }
    ];
  } else if (currentPartner?.category === 'THEATRE_PARTNER') {
    // For theatre owners: Home | Bookings | Manage | Payments | Profile
    navItems = [
      { id: 'overview', label: 'Home', icon: Home },
      { id: 'bookings', label: 'Bookings', icon: Ticket },
      { id: 'manage', label: 'Manage', icon: Sliders },
      { id: 'payments', label: 'Payments', icon: CreditCard },
      { id: 'profile', label: 'Profile', icon: User }
    ];
  } else if (currentPartner?.category === 'EVENT_ORGANIZER') {
    // For event organizers: Home | Events | Bookings | Payments | Profile
    navItems = [
      { id: 'overview', label: 'Home', icon: Home },
      { id: 'events', label: 'Events', icon: Calendar },
      { id: 'bookings', label: 'Bookings', icon: Ticket },
      { id: 'payments', label: 'Payments', icon: CreditCard },
      { id: 'profile', label: 'Profile', icon: User }
    ];
  } else if (currentPartner?.category === 'PRODUCTION_HOUSE') {
    // Production House
    navItems = [
      { id: 'overview', label: 'Home', icon: Home },
      { id: 'screenings', label: 'Screenings', icon: Film },
      { id: 'reports', label: 'Box Office', icon: Layers },
      { id: 'profile', label: 'Profile', icon: User }
    ];
  } else if (currentPartner?.category === 'ENTERTAINMENT_PARTNER') {
    // Entertainment Partner
    navItems = [
      { id: 'overview', label: 'Home', icon: Home },
      { id: 'passes', label: 'Passes', icon: Ticket },
      { id: 'scans', label: 'Entry Scan', icon: QrCode },
      { id: 'profile', label: 'Profile', icon: User }
    ];
  } else {
    // Event Management
    navItems = [
      { id: 'overview', label: 'Home', icon: Home },
      { id: 'projects', label: 'Projects', icon: Building2 },
      { id: 'payments', label: 'Payments', icon: CreditCard },
      { id: 'profile', label: 'Profile', icon: User }
    ];
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-amber-500/20 pb-safe">
      <div className="max-w-md mx-auto h-16 grid grid-cols-4 sm:grid-cols-5 items-center px-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
                isActive ? 'text-amber-400 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-amber-400 rounded-b-full shadow-lg shadow-amber-400/50" />
              )}
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-amber-400' : ''}`} />
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-full px-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
