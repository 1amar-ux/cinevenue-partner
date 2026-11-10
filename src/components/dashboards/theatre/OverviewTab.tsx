import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  TrendingUp,
  Ticket,
  Film,
  Building2,
  Users,
  DollarSign,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  PieChart
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const { bookings, shows, screens, locations, activeLocationId } = useApp();

  const locationShows = shows.filter(s => s.locationId === activeLocationId || !activeLocationId);
  const locationBookings = bookings.filter(b => b.locationName.includes(locations.find(l => l.id === activeLocationId)?.name || 'Baner'));

  const totalRevenue = locationBookings.reduce((acc, b) => acc + (b.status !== 'CANCELLED' ? b.totalAmount : 0), 0);
  const totalTicketsSold = locationBookings.reduce((acc, b) => acc + (b.status !== 'CANCELLED' ? b.seats.length : 0), 0);

  const totalSeatsCapacity = locationShows.reduce((acc, s) => acc + s.totalSeats, 0) || 300;
  const occupancyPercentage = Math.round((totalTicketsSold / totalSeatsCapacity) * 100) || 68;

  return (
    <div className="space-y-6">
      
      {/* Top Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-3xl p-5 space-y-2 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Today's Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
            ₹{(totalRevenue + 42800).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% vs yesterday</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Tickets Sold Today</span>
            <div className="w-8 h-8 rounded-xl bg-zinc-800 text-amber-400 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {totalTicketsSold + 142}
          </div>
          <div className="text-[11px] text-zinc-400">
            Online (65%) · POS Counter (35%)
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Average Occupancy</span>
            <div className="w-8 h-8 rounded-xl bg-zinc-800 text-amber-400 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {occupancyPercentage}%
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${occupancyPercentage}%` }} />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Active Shows Scheduled</span>
            <div className="w-8 h-8 rounded-xl bg-zinc-800 text-amber-400 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {locationShows.length} Shows
          </div>
          <div className="text-[11px] text-zinc-400">
            Across {screens.length} Screen Auditoriums
          </div>
        </div>

      </div>

      {/* Shows Overview & Realtime Occupancy Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="text-base font-bold font-cinzel text-zinc-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Today's Scheduled Shows & Seat Occupancy
            </h3>
            <span className="text-xs text-zinc-400">Live Status</span>
          </div>

          <div className="space-y-3">
            {locationShows.map(show => {
              const booked = show.totalSeats - show.availableSeats;
              const occ = Math.round((booked / show.totalSeats) * 100);

              return (
                <div key={show.id} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img src={show.moviePoster} alt={show.movieTitle} className="w-10 h-12 rounded object-cover" />
                      <div>
                        <div className="font-bold text-xs text-zinc-100">{show.movieTitle}</div>
                        <div className="text-[11px] text-amber-400">{show.screenName} · {show.time}</div>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <div className="font-bold font-mono text-zinc-200">{booked} / {show.totalSeats} Seats Booked</div>
                      <div className="text-[10px] text-zinc-500">{show.availableSeats} Available</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>Occupancy Bar</span>
                      <span className="font-bold text-amber-400">{occ}%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full" style={{ width: `${occ}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Quick Stats & POS Actions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-zinc-900 border border-amber-500/20 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold font-cinzel text-amber-400 uppercase tracking-wider">
              Theatre Screen Status
            </h3>

            <div className="space-y-2 text-xs">
              {screens.map(sc => (
                <div key={sc.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-zinc-200">{sc.name}</div>
                    <div className="text-[10px] text-zinc-500">{sc.format} · {sc.totalSeats} Seats</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    OPERATIONAL
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
