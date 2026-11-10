import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Building2, Calendar, Users, DollarSign, CheckCircle2, Clock } from 'lucide-react';

export const EventMgmtDashboard: React.FC = () => {
  const projects = [
    { id: 'PRJ-1', client: 'TechCorp Annual Summit 2026', venue: 'Grand Hyatt Convention Center, Pune', budget: 2500000, status: 'IN_PROGRESS', staffAssigned: 8 },
    { id: 'PRJ-2', client: 'Royal Luxe Wedding Expo', venue: 'Leela Palace Ballroom, Bengaluru', budget: 4200000, status: 'CONFIRMED', staffAssigned: 14 }
  ];

  return (
    <div className="space-y-6">
      
      <div className="border-b border-zinc-800 pb-4">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
          Event Management Company Console
        </span>
        <h2 className="text-xl font-bold font-cinzel text-zinc-100">
          Corporate Galas, Exhibitions & Vendor Management
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Manage client event contracts, venue partner assignments & staff operations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="text-xs text-zinc-400">Total Contract Value</div>
          <div className="text-2xl font-bold font-mono text-amber-400">₹6,700,000</div>
          <div className="text-[11px] text-emerald-400 font-medium">2 Active Major Projects</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="text-xs text-zinc-400">Deployed Staff Members</div>
          <div className="text-2xl font-bold font-mono text-zinc-100">22 Personnel</div>
          <div className="text-[11px] text-zinc-400">Role-based Access Granted</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="text-xs text-zinc-400">Venue Vendors Onboarded</div>
          <div className="text-2xl font-bold font-mono text-zinc-100">16 Partners</div>
          <div className="text-[11px] text-amber-400 font-medium font-mono">CineVenue Verified</div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-bold uppercase tracking-wider text-amber-400">
          <span>Client Event Projects Ledger</span>
        </div>

        <div className="space-y-3">
          {projects.map(p => (
            <div key={p.id} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-sm text-zinc-100">{p.client}</div>
                <div className="text-amber-400 font-medium">{p.venue}</div>
                <div className="text-[10px] text-zinc-500">Staff Assigned: {p.staffAssigned} Members</div>
              </div>

              <div className="text-right">
                <div className="font-mono font-bold text-amber-400 text-base">₹{p.budget.toLocaleString()}</div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
