import React from 'react';
import { useApp } from '../../../context/AppContext';
import { CreditCard, DollarSign, ArrowUpRight, CheckCircle2, Clock, Landmark } from 'lucide-react';

export const PaymentsTab: React.FC = () => {
  const { settlements, currentPartner } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            Direct Settlement & Payout Ledger
          </span>
          <h2 className="text-xl font-bold font-cinzel text-zinc-100">
            Earnings & Bank Settlements
          </h2>
        </div>

        <div className="text-xs text-zinc-400">
          Bank A/C: <code className="text-amber-400 font-mono">{currentPartner?.bankDetails.accountNumber || '918020048192834'}</code> ({currentPartner?.bankDetails.bankName})
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="text-xs text-zinc-400">Total Net Settled Earnings</div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            ₹787,727
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Directly credited to bank</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="text-xs text-zinc-400">Pending Processing Payout</div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            ₹384,450
          </div>
          <div className="text-[11px] text-amber-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Next Settlement: Friday 12 Nov</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="text-xs text-zinc-400">CineVenue Platform Fee (5%)</div>
          <div className="text-2xl font-bold font-mono text-zinc-400">
            ₹62,885
          </div>
          <div className="text-[11px] text-zinc-500">
            Auto-deducted before bank credit
          </div>
        </div>

      </div>

      {/* Settlements Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-bold uppercase tracking-wider text-amber-400">
          <span>Weekly Bank Settlement Statement</span>
          <span className="text-zinc-500">Automated NEFT / RTGS Payouts</span>
        </div>

        <div className="space-y-3">
          {settlements.map(st => (
            <div key={st.id} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-100">{st.period}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    st.status === 'PAID'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {st.status}
                  </span>
                </div>
                <div className="text-zinc-400 text-[11px]">
                  Gross Ticket Revenue: ₹{st.grossEarnings.toLocaleString()} · Fee: ₹{st.platformFee.toLocaleString()} · GST: ₹{st.gstDeduction.toLocaleString()}
                </div>
                {st.transactionRef && (
                  <div className="text-[10px] font-mono text-zinc-500">
                    Bank Ref UTR: {st.transactionRef} (Paid on {st.payoutDate})
                  </div>
                )}
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs text-zinc-400">Net Bank Transfer:</div>
                <div className="text-base font-bold font-mono text-amber-400">
                  ₹{st.netPayout.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
