import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Calendar,
  Plus,
  Ticket,
  Users,
  CreditCard,
  QrCode,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { CineEvent } from '../../../types';

export const EventOrganizerDashboard: React.FC<{ activeTab?: string }> = ({ activeTab }) => {
  const { events, createEvent, currentPartner } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Music Concert');
  const [venue, setVenue] = useState('Jio World Garden, BKC');
  const [city, setCity] = useState('Mumbai');
  const [date, setDate] = useState('2026-12-25');
  const [time, setTime] = useState('18:00');

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPartner || !title) return;

    createEvent({
      partnerId: currentPartner.id,
      title,
      category,
      poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
      venue,
      city,
      date,
      time,
      ticketTiers: [
        { id: 'T1', name: 'Early Bird Pass', price: 1499, capacity: 500, sold: 0 },
        { id: 'T2', name: 'VIP Deck', price: 3999, capacity: 150, sold: 0 }
      ],
      totalSeats: 650,
      status: 'PUBLISHED'
    });

    setIsModalOpen(false);
    setTitle('');
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            Event Organizer Authorized Console
          </span>
          <h2 className="text-xl font-bold font-cinzel text-zinc-100">
            Concerts, Festivals & Ticketed Events
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage live ticket inventory, VIP passes, attendee check-ins & direct event settlements.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Ticketed Event
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="text-xs text-zinc-400">Total Event Ticket Revenue</div>
          <div className="text-2xl font-bold font-mono text-amber-400">₹10,871,475</div>
          <div className="text-[11px] text-emerald-400 font-medium">Across 2 Published Concerts</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="text-xs text-zinc-400">Total Attendees Checked In</div>
          <div className="text-2xl font-bold font-mono text-zinc-100">3,065 Passes</div>
          <div className="text-[11px] text-zinc-400">88% Capacity Sold Out</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="text-xs text-zinc-400">Settled Payouts</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">₹9,784,320</div>
          <div className="text-[11px] text-zinc-500 font-mono">Bank: HDFC Bank</div>
        </div>
      </div>

      {/* Active Events List */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          Active Published Events ({events.length})
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map(evt => (
            <div key={evt.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex gap-4">
                  <img src={evt.poster} alt={evt.title} className="w-20 h-24 rounded-2xl object-cover shrink-0" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                      {evt.category}
                    </span>
                    <h3 className="text-base font-bold text-zinc-100">{evt.title}</h3>
                    <div className="text-xs text-zinc-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{evt.venue}, {evt.city}</span>
                    </div>
                    <div className="text-xs text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{evt.date} at {evt.time}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 space-y-2 text-xs">
                  <div className="font-semibold text-zinc-300">Ticket Tiers & Inventory</div>
                  {evt.ticketTiers.map(t => (
                    <div key={t.id} className="flex justify-between items-center text-[11px]">
                      <span className="text-zinc-400">{t.name} (₹{t.price})</span>
                      <span className="font-mono text-amber-300">{t.sold} / {t.capacity} Sold</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-between items-center text-xs">
                <span className="text-zinc-400">Total Gross: <strong className="text-amber-400 font-mono">₹{evt.revenue.toLocaleString()}</strong></span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                  PUBLISHED ON CINEVENUE
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateEvent} className="bg-zinc-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-amber-400 font-cinzel">
              Publish New Event
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunburn Festival / Standup Special"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Venue Name & City</label>
                <input
                  type="text"
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100"
                  />
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
                Publish Event
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
