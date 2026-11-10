import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Sparkles, Ticket, Users, QrCode, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

export const EntertainmentDashboard: React.FC = () => {
  const passes = [
    { id: 'P-1', name: '4D Motion Theatre & VR Simulator Pass', price: 599, sold: 340, capacity: 500 },
    { id: 'P-2', name: 'Laser Tag & Multiplayer Gaming Arena', price: 899, sold: 180, capacity: 250 },
    { id: 'P-3', name: 'Fast-Track VIP Experience Day Pass', price: 1499, sold: 75, capacity: 100 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-zinc-800 pb-4">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
          Entertainment Partner Console
        </span>
        <h2 className="text-xl font-bold font-cinzel text-zinc-100">
          VR Arenas, Theme Parks & Experience Hubs
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Hourly time-slot passes, fast-track VIP entries, visitor scans & attraction analytics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="text-xs text-zinc-400">Total Today's Pass Revenue</div>
          <div className="text-2xl font-bold font-mono text-amber-400">₹377,905</div>
          <div className="text-[11px] text-emerald-400 font-medium">+18% vs last weekend</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="text-xs text-zinc-400">Live Visitors in Venue</div>
          <div className="text-2xl font-bold font-mono text-zinc-100">595 Visitors</div>
          <div className="text-[11px] text-amber-400 font-medium">Nexus Mall Floor 4, Hyd</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="text-xs text-zinc-400">Pass Redemption Rate</div>
          <div className="text-2xl font-bold font-mono text-zinc-100">94.5%</div>
          <div className="text-[11px] text-zinc-500">QR Gate Scanned</div>
        </div>
      </div>

      {/* Experience Passes */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-bold uppercase tracking-wider text-amber-400">
          <span>Active Attraction Passes & Slots</span>
          <span className="text-zinc-500">CineVenue Ticket Integration</span>
        </div>

        <div className="space-y-3">
          {passes.map(p => (
            <div key={p.id} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-sm text-zinc-100">{p.name}</div>
                <div className="text-amber-400 font-mono text-xs">Price: ₹{p.price} per person</div>
              </div>

              <div className="text-right space-y-1">
                <div className="font-mono font-bold text-zinc-200">{p.sold} / {p.capacity} Passes Redeemed</div>
                <div className="w-32 bg-zinc-900 h-1.5 rounded-full overflow-hidden ml-auto">
                  <div className="bg-amber-400 h-full" style={{ width: `${(p.sold / p.capacity) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
