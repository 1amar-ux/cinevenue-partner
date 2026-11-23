import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Tv, Film, Building2, TrendingUp, DollarSign, Calendar, CheckCircle2, Plus } from 'lucide-react';

export const ProductionHouseDashboard: React.FC = () => {
  const { movies } = useApp();

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(movies[0]?.title || '');
  const [targetCity, setTargetCity] = useState('Pune');
  const [requestedScreens, setRequestedScreens] = useState(5);

  const [screeningRequests, setScreeningRequests] = useState([
    { id: 'REQ-1', movie: 'Kalki 2898 AD: Part 2', theatre: 'CineVenue Gold Baner Multiplex', city: 'Pune', status: 'CONFIRMED', split: '55% Distributor / 45% Theatre' },
    { id: 'REQ-2', movie: 'Pushpa 2: The Rule', theatre: 'CineVenue Gold Connaught Place', city: 'New Delhi', status: 'CONFIRMED', split: '50% Distributor / 50% Theatre' },
    { id: 'REQ-3', movie: 'Devara: Part 1', theatre: 'Starline Talkies', city: 'Nagpur', status: 'PENDING', split: 'Standard 50-50 Split' }
  ]);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setScreeningRequests(prev => [
      { id: `REQ-${Date.now()}`, movie: selectedMovie, theatre: `Multiplex Chain (${targetCity})`, city: targetCity, status: 'PENDING', split: '50% Distributor / 50% Theatre' },
      ...prev
    ]);
    setRequestModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            Production House & Distribution Portal
          </span>
          <h2 className="text-xl font-bold font-cinzel text-zinc-100">
            Film Premiere & Screening Distribution
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Submit screening allotment requests to CineVenue theatre chains and monitor distributor box office splits.
          </p>
        </div>

        <button
          onClick={() => setRequestModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Request Screen Allotment
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="text-xs text-zinc-400">Distributor Box Office Share</div>
          <div className="text-2xl font-bold font-mono text-amber-400">₹4,820,000</div>
          <div className="text-[11px] text-emerald-400 font-medium">55% Share on Opening Weekend</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="text-xs text-zinc-400">Active Licensed Screens</div>
          <div className="text-2xl font-bold font-mono text-zinc-100">12 Auditoriums</div>
          <div className="text-[11px] text-zinc-400">Across Pune, Delhi NCR & Hyd</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="text-xs text-zinc-400">Trailers & Premiere Launches</div>
          <div className="text-2xl font-bold font-mono text-zinc-100">3 Special Events</div>
          <div className="text-[11px] text-amber-400 font-medium">IMAX Fan Screening Ready</div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-bold uppercase tracking-wider text-amber-400">
          <span>Theatrical Screening Allotment Requests</span>
          <span className="text-zinc-500">CineVenue Admin Sync</span>
        </div>

        <div className="space-y-3">
          {screeningRequests.map(req => (
            <div key={req.id} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-100 text-sm">{req.movie}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    req.status === 'CONFIRMED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {req.status}
                  </span>
                </div>
                <div className="text-amber-400 font-medium">{req.theatre} ({req.city})</div>
                <div className="text-zinc-500 text-[10px]">Revenue Model: {req.split}</div>
              </div>

              <div className="text-right">
                <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-lg">
                  Screen ID Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateRequest} className="bg-zinc-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-amber-400 font-cinzel">
              Request Screen Allotment
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Select Film Title</label>
                <select
                  value={selectedMovie}
                  onChange={e => setSelectedMovie(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100"
                >
                  {movies.map(m => (
                    <option key={m.id} value={m.title}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Target City</label>
                <input
                  type="text"
                  value={targetCity}
                  onChange={e => setTargetCity(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Requested Screens Count</label>
                <input
                  type="number"
                  value={requestedScreens}
                  onChange={e => setRequestedScreens(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setRequestModalOpen(false)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors"
              >
                Submit Allotment Request
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
