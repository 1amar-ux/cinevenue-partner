import React, { useState } from 'react';
import { OverviewTab } from './OverviewTab';
import { MyTheatresTab } from './MyTheatresTab';
import { MovieShowScheduler } from './MovieShowScheduler';
import { LiveSeatMap } from './LiveSeatMap';
import { BookingListTab } from './BookingListTab';
import { POSManagementTab } from './POSManagementTab';
import { PaymentsTab } from './PaymentsTab';
import { EmployeeManagementTab } from './EmployeeManagementTab';
import {
  TrendingUp,
  Building2,
  Tv,
  Calendar,
  Grid,
  Ticket,
  CreditCard,
  Users,
  FileText,
  Clock
} from 'lucide-react';

export const TheatreDashboard: React.FC<{ activeTab?: string }> = ({ activeTab: externalTab }) => {
  const [internalTab, setInternalTab] = useState<string>('OVERVIEW');

  const activeTab = externalTab ? (
    externalTab === 'overview' ? 'OVERVIEW' :
    externalTab === 'bookings' ? 'BOOKINGS' :
    externalTab === 'manage' ? 'SHOWS' :
    externalTab === 'payments' ? 'PAYMENTS' : 'OVERVIEW'
  ) : internalTab;

  const tabs: { id: string; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'OVERVIEW', label: "Overview", icon: TrendingUp },
    { id: 'THEATRES', label: 'My Theatres', icon: Building2 },
    { id: 'SHOWS', label: 'Movie & Shows', icon: Calendar },
    { id: 'LIVE_SEATS', label: 'Live Seat Map', icon: Grid },
    { id: 'POS', label: 'POS Box Office', icon: Tv },
    { id: 'BOOKINGS', label: 'Bookings List', icon: Ticket },
    { id: 'PAYMENTS', label: 'Payments', icon: CreditCard },
    { id: 'EMPLOYEES', label: 'Staff Management', icon: Users }
  ];

  return (
    <div className="space-y-6">
      
      {/* Sub Header Segmented Navigation Bar */}
      {!externalTab && (
        <div className="flex items-center gap-1.5 p-1.5 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setInternalTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-950' : 'text-amber-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Render Selected View */}
      {activeTab === 'OVERVIEW' && <OverviewTab />}
      {activeTab === 'THEATRES' && <MyTheatresTab />}
      {activeTab === 'SHOWS' && <MovieShowScheduler />}
      {activeTab === 'LIVE_SEATS' && <LiveSeatMap />}
      {activeTab === 'POS' && <POSManagementTab />}
      {activeTab === 'BOOKINGS' && <BookingListTab />}
      {activeTab === 'PAYMENTS' && <PaymentsTab />}
      {activeTab === 'EMPLOYEES' && <EmployeeManagementTab />}

    </div>
  );
};
