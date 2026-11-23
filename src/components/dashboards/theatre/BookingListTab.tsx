import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Ticket, Search, Filter, CheckCircle2, XCircle, Clock, QrCode } from 'lucide-react';

export const BookingListTab: React.FC = () => {
  const { bookings, cancelBooking, locations, activeLocationId } = useApp();

  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredBookings = bookings.filter(b => {
    if (filterType === 'ONLINE' && b.paymentMethod !== 'ONLINE') return false;
    if (filterType === 'POS' && b.paymentMethod === 'ONLINE') return false;
    if (filterType === 'CHECKED_IN' && b.status !== 'CHECKED_IN') return false;
    if (filterType === 'CANCELLED' && b.status !== 'CANCELLED') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.ticketCode.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.toLowerCase().includes(q) ||
        b.movieTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            Ticket Sales Ledger & Audit
          </span>
          <h2 className="text-xl font-bold font-cinzel text-zinc-100">
            Booking & Ticket Management
          </h2>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 text-xs w-full sm:w-auto">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search code, phone, name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-200 shrink-0"
          >
            <option value="ALL">All Sales</option>
            <option value="ONLINE">Online Bookings</option>
            <option value="POS">POS Counter Tickets</option>
            <option value="CHECKED_IN">Checked In Gate</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table / Cards */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs">
          <span className="font-bold uppercase tracking-wider text-amber-400">
            Issued Tickets ({filteredBookings.length})
          </span>
          <span className="text-zinc-500 text-[11px]">Realtime Synchronization</span>
        </div>

        <div className="space-y-3">
          {filteredBookings.map(b => (
            <div key={b.id} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1 w-full sm:w-auto">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-amber-300 text-sm">{b.ticketCode}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    b.status === 'CONFIRMED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : b.status === 'CHECKED_IN'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {b.status}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-medium">
                    {b.paymentMethod}
                  </span>
                </div>

                <div className="font-bold text-zinc-100">{b.movieTitle}</div>
                <div className="text-[11px] text-zinc-400">
                  {b.screenName} · Seats: <strong className="text-amber-300 font-mono">{b.seats.join(', ')}</strong> ({b.categoryName})
                </div>
                <div className="text-[10px] text-zinc-500">
                  Customer: {b.customerName} ({b.customerPhone}) · Booked: {b.bookedAt}
                </div>
              </div>

              <div className="w-full sm:w-auto flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-900 shrink-0">
                <div className="text-sm font-bold font-mono text-amber-400">
                  ₹{b.totalAmount}
                </div>

                {b.status === 'CONFIRMED' && (
                  <button
                    onClick={() => cancelBooking(b.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 font-medium text-[11px] transition-colors cursor-pointer"
                  >
                    Cancel & Refund
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
