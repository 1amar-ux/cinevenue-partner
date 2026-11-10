import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Film, Calendar, Clock, Plus, Ticket, CheckCircle2 } from 'lucide-react';
import { Show } from '../../../types';

export const MovieShowScheduler: React.FC = () => {
  const { movies, screens, shows, createShow, activeLocationId } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(movies[0]?.id || '');
  const [selectedScreenId, setSelectedScreenId] = useState(screens[0]?.id || '');
  const [showDate, setShowDate] = useState('2026-11-12');
  const [showTime, setShowTime] = useState('18:30');

  // Pricing
  const [vipPrice, setVipPrice] = useState(450);
  const [premiumPrice, setPremiumPrice] = useState(350);
  const [execPrice, setExecPrice] = useState(250);
  const [classicPrice, setClassicPrice] = useState(180);

  const locationShows = shows.filter(s => s.locationId === activeLocationId || !activeLocationId);

  const handleCreateShowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMovie = movies.find(m => m.id === selectedMovieId);
    const targetScreen = screens.find(sc => sc.id === selectedScreenId);

    if (!targetMovie || !targetScreen) return;

    createShow({
      locationId: activeLocationId || 'LOC-PUNE-01',
      screenId: targetScreen.id,
      screenName: targetScreen.name,
      movieId: targetMovie.id,
      movieTitle: targetMovie.title,
      moviePoster: targetMovie.poster,
      date: showDate,
      time: showTime,
      prices: {
        VIP: vipPrice,
        PREMIUM: premiumPrice,
        EXECUTIVE: execPrice,
        CLASSIC: classicPrice
      },
      totalSeats: targetScreen.totalSeats,
      availableSeats: targetScreen.totalSeats
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            Auditorium Programming & Timings
          </span>
          <h2 className="text-xl font-bold font-cinzel text-zinc-100">
            Movie & Show Management Scheduler
          </h2>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Schedule New Movie Show
        </button>
      </div>

      {/* Movies Catalog Strip */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          Currently Licensing Movies Catalog ({movies.length})
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {movies.map(m => (
            <div key={m.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex gap-3 items-center">
              <img src={m.poster} alt={m.title} className="w-12 h-16 rounded-lg object-cover" />
              <div className="space-y-0.5 text-xs">
                <div className="font-bold text-zinc-100 line-clamp-1">{m.title}</div>
                <div className="text-[10px] text-amber-400">{m.genre}</div>
                <div className="text-[10px] text-zinc-500">{m.duration} · ⭐ {m.rating}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Shows Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-bold uppercase tracking-wider text-amber-400">
          <span>Active Scheduled Show Timings ({locationShows.length})</span>
          <span className="text-zinc-500">Auto-synced to CineVenue Consumer App</span>
        </div>

        <div className="space-y-3">
          {locationShows.map(s => (
            <div key={s.id} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <img src={s.moviePoster} alt={s.movieTitle} className="w-10 h-14 rounded object-cover" />
                <div>
                  <div className="font-bold text-sm text-zinc-100">{s.movieTitle}</div>
                  <div className="text-amber-400 font-medium">{s.screenName}</div>
                  <div className="text-[11px] text-zinc-400">Date: {s.date} at <strong className="text-zinc-200">{s.time}</strong></div>
                </div>
              </div>

              <div className="text-right space-y-1 shrink-0">
                <div className="text-xs font-mono text-zinc-300">
                  Prices: VIP ₹{s.prices.VIP} · Premium ₹{s.prices.PREMIUM}
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold">
                  {s.availableSeats} of {s.totalSeats} seats open
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Show Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateShowSubmit} className="bg-zinc-900 border border-amber-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-amber-400 font-cinzel">
              Schedule New Movie Show
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Select Movie</label>
                <select
                  value={selectedMovieId}
                  onChange={e => setSelectedMovieId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100"
                >
                  {movies.map(m => (
                    <option key={m.id} value={m.id}>{m.title} ({m.duration})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Select Auditorium Screen</label>
                <select
                  value={selectedScreenId}
                  onChange={e => setSelectedScreenId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100"
                >
                  {screens.map(sc => (
                    <option key={sc.id} value={sc.id}>{sc.name} ({sc.format})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Show Date</label>
                  <input
                    type="date"
                    value={showDate}
                    onChange={e => setShowDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Show Time</label>
                  <input
                    type="time"
                    value={showTime}
                    onChange={e => setShowTime(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="text-zinc-300 font-bold uppercase text-[10px] tracking-wider text-amber-400">
                  Set Category Ticket Prices (₹)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-zinc-400">VIP Recline ₹</span>
                    <input
                      type="number"
                      value={vipPrice}
                      onChange={e => setVipPrice(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400">Premium ₹</span>
                    <input
                      type="number"
                      value={premiumPrice}
                      onChange={e => setPremiumPrice(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 font-mono"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors"
              >
                Publish Show to CineVenue
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
