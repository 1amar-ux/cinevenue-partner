import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Clock, ShieldAlert, Lock, RefreshCw, Ticket, CheckCircle2 } from 'lucide-react';

export const LiveSeatMap: React.FC = () => {
  const { shows, blockedSeats, toggleSeatBlock, activeLocationId } = useApp();

  const locationShows = shows.filter(s => s.locationId === activeLocationId || !activeLocationId);
  const [activeShowId, setActiveShowId] = useState<string>(locationShows[0]?.id || '');

  const activeShow = shows.find(s => s.id === activeShowId) || locationShows[0];

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 10;

  const currentBlocked = blockedSeats[activeShow?.id || ''] || [];

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            Real-Time Auditorium Seat Control
          </span>
          <h2 className="text-xl font-bold font-cinzel text-zinc-100">
            Live Seat Layout & Realtime Blocking
          </h2>
        </div>

        {/* Show Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={activeShowId}
            onChange={e => setActiveShowId(e.target.value)}
            className="w-full sm:w-auto bg-zinc-900 border border-amber-500/30 rounded-xl px-3 py-2 text-xs font-semibold text-amber-300 focus:outline-none"
          >
            {locationShows.map(s => (
              <option key={s.id} value={s.id}>
                {s.movieTitle} - {s.screenName} ({s.time})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Seat Grid Box */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-6 text-center space-y-6 shadow-2xl">
        
        {/* Screen Visual */}
        <div className="max-w-md mx-auto space-y-2">
          <div className="h-2.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full shadow-lg shadow-amber-400/50" />
          <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
            {activeShow?.screenName} — SILVER SCREEN VIEW
          </div>
          <div className="text-[10px] text-zinc-500 sm:hidden flex items-center justify-center gap-1">
            <span>↔ Swipe horizontally to view all seats</span>
          </div>
        </div>

        {/* Seat Rows */}
        <div className="space-y-2 overflow-x-auto py-6">
          {rows.map(r => (
            <div key={r} className="flex items-center justify-center gap-2 min-w-max">
              <span className="w-6 text-xs font-bold text-zinc-500 font-mono">{r}</span>
              <div className="flex gap-2">
                {Array.from({ length: seatsPerRow }).map((_, idx) => {
                  const seatId = `${r}-${idx + 1}`;
                  const isBlocked = currentBlocked.includes(seatId);
                  const isAlreadyBooked = (r === 'A' || r === 'B') && (idx === 3 || idx === 4 || idx === 5);

                  return (
                    <button
                      key={seatId}
                      type="button"
                      onClick={() => toggleSeatBlock(activeShow?.id || '', seatId)}
                      className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center ${
                        isAlreadyBooked
                          ? 'bg-amber-400 text-zinc-950 font-extrabold shadow-md shadow-amber-400/20'
                          : isBlocked
                          ? 'bg-rose-950 text-rose-400 border border-rose-800 ring-2 ring-rose-500/30'
                          : 'bg-zinc-950 text-zinc-300 border border-zinc-800 hover:border-amber-400/60 hover:text-amber-300'
                      }`}
                      title={isAlreadyBooked ? 'Booked Seat' : isBlocked ? 'Temporarily Blocked (Click to Release)' : 'Available Seat (Click to Block)'}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend & Instructions */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-zinc-950 border border-zinc-800" />
            <span>Available Seat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-400" />
            <span>Booked Ticket</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-rose-950 border border-rose-800" />
            <span>Manually Blocked ({currentBlocked.length})</span>
          </div>
        </div>

        <p className="text-[11px] text-zinc-500">
          * Tap any available seat to instantly toggle manual seat hold / temporary maintenance block for box office staff.
        </p>

      </div>

    </div>
  );
};
