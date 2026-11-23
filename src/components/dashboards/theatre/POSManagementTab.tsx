import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  CreditCard,
  Printer,
  Search,
  Film,
  Calendar,
  Clock,
  Ticket,
  User,
  Phone,
  CheckCircle2,
  DollarSign,
  QrCode,
  Sparkles
} from 'lucide-react';
import { Show, Booking } from '../../../types';

export const POSManagementTab: React.FC = () => {
  const { shows, screens, locations, activeLocationId, createPOSBooking, blockedSeats } = useApp();

  const locationShows = shows.filter(s => s.locationId === activeLocationId || !activeLocationId);

  const [selectedShowId, setSelectedShowId] = useState<string>(locationShows[0]?.id || '');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'VIP' | 'PREMIUM' | 'EXECUTIVE' | 'CLASSIC'>('PREMIUM');
  
  // Customer Info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'POS_CASH' | 'POS_UPI' | 'POS_CARD'>('POS_UPI');

  // Generated Printed Ticket Modal Preview
  const [printedTicket, setPrintedTicket] = useState<Booking | null>(null);

  const activeShow = shows.find(s => s.id === selectedShowId) || locationShows[0];
  const activeScreen = screens.find(sc => sc.id === activeShow?.screenId);

  const currentCategoryPrice = activeShow?.prices[selectedCategory] || 250;
  const totalAmount = selectedSeats.length * currentCategoryPrice;

  // Generate seat grid seats dynamically
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 10;

  const toggleSeatSelection = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
    } else {
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const handlePOSCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShow || selectedSeats.length === 0) return;

    const newBooking = createPOSBooking(
      activeShow.id,
      selectedSeats,
      selectedCategory,
      totalAmount,
      customerName || 'Counter Walk-in Customer',
      customerPhone || '+91 99000 00000',
      paymentMethod
    );

    setPrintedTicket(newBooking);
    setSelectedSeats([]);
    setCustomerName('');
    setCustomerPhone('');
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            Box Office Counter Ticket POS
          </span>
          <h2 className="text-xl font-bold font-cinzel text-zinc-100">
            Counter POS Ticket Booking & Thermal Print
          </h2>
        </div>
        <div className="text-xs text-zinc-400">
          Location: <strong className="text-amber-400">{locations.find(l => l.id === activeLocationId)?.name || 'Baner Multiplex'}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Show Selector & Interactive Seat Picker */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Movie / Show Scheduler Selector Carousel */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Select Show Timing
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {locationShows.map(show => {
                const isSelected = show.id === activeShow?.id;
                return (
                  <div
                    key={show.id}
                    onClick={() => {
                      setSelectedShowId(show.id);
                      setSelectedSeats([]);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 text-zinc-100 shadow-md shadow-amber-500/10'
                        : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <img
                      src={show.moviePoster}
                      alt={show.movieTitle}
                      className="w-12 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-zinc-100 line-clamp-1">{show.movieTitle}</div>
                      <div className="text-[11px] text-amber-400 font-medium">
                        {show.screenName}
                      </div>
                      <div className="text-[10px] text-zinc-400 flex items-center gap-2">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>{show.date} at {show.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seat Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Seating Class Category
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {(['VIP', 'PREMIUM', 'EXECUTIVE', 'CLASSIC'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-zinc-950 border-amber-400 shadow-sm'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {cat} (₹{activeShow?.prices[cat] || 250})
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Cinema Screen Seat Grid */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center space-y-6">
            
            {/* Screen Banner */}
            <div className="max-w-md mx-auto space-y-1">
              <div className="h-2 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full shadow-lg shadow-amber-400/50" />
              <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
                CINEMA SCREEN THIS WAY
              </div>
            </div>

            {/* Grid */}
            <div className="space-y-2 overflow-x-auto py-4">
              {rows.map(r => (
                <div key={r} className="flex items-center justify-center gap-2 min-w-max">
                  <span className="w-6 text-xs font-bold text-zinc-500">{r}</span>
                  <div className="flex gap-2">
                    {Array.from({ length: seatsPerRow }).map((_, idx) => {
                      const seatId = `${r}-${idx + 1}`;
                      const isSelected = selectedSeats.includes(seatId);
                      const isBlocked = blockedSeats[activeShow?.id || '']?.includes(seatId) || (r === 'A' && (idx === 2 || idx === 3));

                      return (
                        <button
                          key={seatId}
                          type="button"
                          disabled={isBlocked}
                          onClick={() => toggleSeatSelection(seatId)}
                          className={`w-8 h-8 rounded-lg font-mono text-[10px] font-bold transition-all flex items-center justify-center ${
                            isBlocked
                              ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-800'
                              : isSelected
                              ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/30 scale-105'
                              : 'bg-zinc-950 text-zinc-300 border border-zinc-800 hover:border-amber-400/50 hover:text-amber-300'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-zinc-950 border border-zinc-800" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-400" />
                <span>Selected ({selectedSeats.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-zinc-800" />
                <span>Booked / Blocked</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: POS Billing Summary & Customer Details */}
        <div className="lg:col-span-4">
          <form onSubmit={handlePOSCheckout} className="bg-zinc-900 border border-amber-500/20 rounded-3xl p-6 space-y-6 sticky top-24 shadow-2xl">
            
            <div className="border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold font-cinzel text-zinc-100 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-amber-400" />
                Counter Order Billing
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Instant counter issuance & receipt print
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
                <div className="font-bold text-zinc-200">{activeShow?.movieTitle}</div>
                <div className="text-amber-400">{activeShow?.screenName} · {activeShow?.time}</div>
                <div className="text-zinc-400 text-[11px]">Category: {selectedCategory}</div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Customer Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Walk-in Customer"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Mobile Phone (For SMS Ticket)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Payment Method</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('POS_UPI')}
                    className={`py-2 rounded-xl text-[11px] font-bold border transition-colors ${
                      paymentMethod === 'POS_UPI' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    UPI QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('POS_CASH')}
                    className={`py-2 rounded-xl text-[11px] font-bold border transition-colors ${
                      paymentMethod === 'POS_CASH' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('POS_CARD')}
                    className={`py-2 rounded-xl text-[11px] font-bold border transition-colors ${
                      paymentMethod === 'POS_CARD' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    Card
                  </button>
                </div>
              </div>

            </div>

            {/* Summary */}
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Selected Seats ({selectedSeats.length}):</span>
                <span className="font-mono text-zinc-200">{selectedSeats.join(', ') || 'None'}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Rate per seat:</span>
                <span>₹{currentCategoryPrice}</span>
              </div>
              <div className="pt-2 border-t border-zinc-800 flex justify-between font-bold text-sm text-zinc-100">
                <span>Total Amount Payable:</span>
                <span className="text-amber-400 font-mono text-base">₹{totalAmount}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={selectedSeats.length === 0}
              className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                selectedSeats.length > 0
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <Printer className="w-4 h-4" />
              Generate & Print Thermal Ticket (₹{totalAmount})
            </button>

          </form>
        </div>

      </div>

      {/* Printed Thermal Ticket Modal */}
      {printedTicket && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-amber-50 text-zinc-950 border-2 border-amber-400 rounded-3xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl relative font-sans">
            
            <div className="text-center space-y-1 border-b-2 border-dashed border-zinc-400 pb-3">
              <div className="font-cinzel text-lg font-black tracking-wider text-zinc-950">
                CINEVENUE GOLD
              </div>
              <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                OFFICIAL THERMAL TICKET PASS
              </div>
              <div className="text-[11px] font-semibold text-amber-700">{printedTicket.locationName}</div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold">Movie Title</div>
                <div className="font-bold text-sm text-zinc-900">{printedTicket.movieTitle}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-bold">Screen</div>
                  <div className="font-bold text-zinc-800">{printedTicket.screenName}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-bold">Show Time</div>
                  <div className="font-bold text-zinc-800">{printedTicket.showDate} {printedTicket.showTime}</div>
                </div>
              </div>

              <div className="bg-amber-100 p-3 rounded-xl border border-amber-300 space-y-1">
                <div className="text-[10px] font-bold text-amber-900 uppercase">Booked Seat(s)</div>
                <div className="font-mono text-base font-extrabold text-amber-950 tracking-wider">
                  {printedTicket.seats.join(', ')}
                </div>
                <div className="text-[10px] text-amber-800">Category: {printedTicket.categoryName}</div>
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="font-semibold text-zinc-600">Customer: {printedTicket.customerName}</span>
                <span className="font-mono font-bold text-zinc-900">₹{printedTicket.totalAmount} ({printedTicket.paymentMethod})</span>
              </div>
            </div>

            {/* Thermal Ticket QR Code Display */}
            <div className="bg-white p-3 rounded-2xl border border-zinc-300 text-center space-y-1">
              <div className="w-32 h-32 mx-auto bg-zinc-950 rounded-xl p-2 flex items-center justify-center">
                <QrCode className="w-full h-full text-amber-400" />
              </div>
              <div className="font-mono text-xs font-bold text-zinc-900 tracking-wider">
                {printedTicket.ticketCode}
              </div>
              <div className="text-[9px] text-zinc-500">Scan at entrance gate for instant check-in</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPrintedTicket(null)}
                className="w-full py-2.5 rounded-xl bg-zinc-950 text-amber-400 font-bold text-xs hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Done (Ticket Issued)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
