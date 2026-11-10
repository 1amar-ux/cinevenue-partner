import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QrCode, CheckCircle2, XCircle, AlertTriangle, Search, Sparkles, RefreshCw } from 'lucide-react';
import { Booking } from '../../types';

export const QRScannerSimulator: React.FC = () => {
  const { scanAndCheckInTicket, bookings } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    booking?: Booking;
  } | null>(null);

  const sampleTicketCodes = bookings.map(b => b.ticketCode);

  const handleSimulateScan = (codeToScan: string) => {
    const res = scanAndCheckInTicket(codeToScan);
    setScanResult(res);
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode) {
      handleSimulateScan(inputCode);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="text-center space-y-1 border-b border-zinc-800 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-wider uppercase border border-emerald-500/20">
          <QrCode className="w-3.5 h-3.5" />
          Live Gate Verification Scanner
        </div>
        <h2 className="text-xl font-bold font-cinzel text-zinc-100">
          QR Ticket Gate Scanner & Check-In
        </h2>
        <p className="text-xs text-zinc-400">
          Scan customer digital tickets or thermal prints for instant entrance validation.
        </p>
      </div>

      {/* Simulated Camera Viewport Box */}
      <div className="bg-zinc-900 border-2 border-amber-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Animated Scanner Laser Beam */}
        <div className="relative w-48 h-48 mx-auto bg-zinc-950 border-2 border-dashed border-amber-400/60 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-lg shadow-amber-400/80 animate-bounce top-1/2" />
          <QrCode className="w-24 h-24 text-zinc-700" />
        </div>

        <p className="text-xs font-medium text-zinc-300">
          Point camera at CineVenue Ticket QR Code or enter ticket code manually below:
        </p>

        {/* Preset Sample Codes for Quick One-Click Testing */}
        <div className="space-y-2 text-xs">
          <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
            Quick Test Ticket Codes (Click to Scan):
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {sampleTicketCodes.map(code => (
              <button
                key={code}
                type="button"
                onClick={() => handleSimulateScan(code)}
                className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-400 text-amber-300 font-mono text-xs transition-all hover:scale-105 active:scale-95"
              >
                Scan #{code}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleSimulateScan('CNV-FAKE-9999')}
              className="px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 font-mono text-xs hover:bg-rose-900 transition-all"
            >
              Scan Invalid Fake Ticket
            </button>
          </div>
        </div>

        {/* Manual Code Input Form */}
        <form onSubmit={handleSubmitCustom} className="flex items-center justify-center gap-2 max-w-sm mx-auto">
          <input
            type="text"
            placeholder="Enter CNV-2026-XXXX..."
            value={inputCode}
            onChange={e => setInputCode(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-amber-500 uppercase"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors"
          >
            Verify
          </button>
        </form>

      </div>

      {/* Live Scan Result Card */}
      {scanResult && (
        <div className={`p-6 rounded-3xl border text-left space-y-4 shadow-2xl transition-all ${
          scanResult.success
            ? 'bg-emerald-950/30 border-emerald-500/50 text-zinc-100'
            : scanResult.message.includes('ALREADY USED')
            ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
            : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
        }`}>
          <div className="flex items-center gap-3">
            {scanResult.success ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
            )}
            <div>
              <h3 className="font-bold text-base font-cinzel">
                {scanResult.success ? 'ENTRY APPROVED' : 'ENTRY DENIED'}
              </h3>
              <p className="text-xs leading-relaxed mt-0.5 font-medium">
                {scanResult.message}
              </p>
            </div>
          </div>

          {scanResult.booking && (
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2 text-xs">
              <div className="font-bold text-amber-400">{scanResult.booking.movieTitle}</div>
              <div className="text-zinc-300">Auditorium: {scanResult.booking.screenName}</div>
              <div className="text-zinc-300">Seats: <strong className="text-amber-300 font-mono">{scanResult.booking.seats.join(', ')}</strong></div>
              <div className="text-[11px] text-zinc-400">Customer: {scanResult.booking.customerName} ({scanResult.booking.customerPhone})</div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
