import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QRScannerSimulator } from './QRScannerSimulator';
import { POSManagementTab } from '../dashboards/theatre/POSManagementTab';
import {
  Home,
  QrCode,
  CheckSquare,
  User,
  Film,
  Clock,
  ShieldAlert,
  Lock,
  CheckCircle2,
  Building2,
  Ticket
} from 'lucide-react';

export const EmployeePortal: React.FC<{ activeTab?: string }> = ({ activeTab: externalTab }) => {
  const { userSession, shows, screens, locations, activeLocationId } = useApp();
  const [internalTab, setInternalTab] = useState<string>('HOME');

  const activeTab = externalTab ? (
    externalTab === 'scan' ? 'SCAN' :
    externalTab === 'tasks' ? 'TASKS' :
    externalTab === 'profile' ? 'PROFILE' : 'HOME'
  ) : internalTab;

  const activeLocation = locations.find(l => l.id === activeLocationId) || locations[0];
  const locationShows = shows.filter(s => s.locationId === activeLocationId || !activeLocationId);

  return (
    <div className="space-y-6">
      
      {/* Employee Top Profile Info */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-emerald-500/30 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-lg">
            {userSession.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-cinzel text-zinc-100">
                {userSession.name}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                ACTIVE STAFF
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Assigned Venue: <strong className="text-amber-400">{activeLocation?.name}</strong> · Role: <strong className="text-zinc-200">{userSession.role}</strong>
            </p>
          </div>
        </div>

        <div className="text-xs text-right space-y-1 bg-zinc-950 px-4 py-2 rounded-2xl border border-zinc-800">
          <div className="text-zinc-400">Operational Security:</div>
          <div className="text-emerald-400 font-bold flex items-center justify-end gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Restricted Staff Access
          </div>
        </div>
      </div>

      {/* Internal Navigation Bar */}
      {!externalTab && (
        <div className="flex items-center gap-2 p-1.5 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <button
            onClick={() => setInternalTab('HOME')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'HOME' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => setInternalTab('SCAN')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'SCAN' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Scan Ticket
          </button>
          <button
            onClick={() => setInternalTab('TASKS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'TASKS' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            POS & Tasks
          </button>
          <button
            onClick={() => setInternalTab('PROFILE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'PROFILE' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <User className="w-4 h-4" />
            My Profile
          </button>
        </div>
      )}

      {/* Render Active View */}
      {activeTab === 'HOME' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Quick Action: Scan */}
            <div
              onClick={() => setInternalTab('SCAN')}
              className="bg-zinc-900 border border-amber-500/30 hover:border-amber-400 rounded-3xl p-6 cursor-pointer space-y-3 transition-all hover:scale-[1.01]"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-cinzel text-zinc-100">
                Gate Entry Ticket QR Scanner
              </h3>
              <p className="text-xs text-zinc-400">
                Tap to open camera scanner and verify customer tickets at auditorium entrance gates.
              </p>
            </div>

            {/* Quick Action: POS */}
            <div
              onClick={() => setInternalTab('TASKS')}
              className="bg-zinc-900 border border-zinc-800 hover:border-amber-400 rounded-3xl p-6 cursor-pointer space-y-3 transition-all hover:scale-[1.01]"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-amber-400 flex items-center justify-center font-bold">
                <Ticket className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-cinzel text-zinc-100">
                Box Office Counter POS
              </h3>
              <p className="text-xs text-zinc-400">
                Issue counter walk-in tickets & print thermal paper receipts.
              </p>
            </div>

          </div>

          {/* Today's Show Timings Inspection */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold font-cinzel text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Today's Auditorium Show Schedule
            </h3>

            <div className="space-y-3">
              {locationShows.map(s => (
                <div key={s.id} className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={s.moviePoster} alt={s.movieTitle} className="w-9 h-11 rounded object-cover" />
                    <div>
                      <div className="font-bold text-zinc-100">{s.movieTitle}</div>
                      <div className="text-[11px] text-amber-400">{s.screenName} · Start: <strong className="text-zinc-200">{s.time}</strong></div>
                    </div>
                  </div>
                  <div className="text-right text-[11px] font-mono text-emerald-400 font-semibold">
                    {s.availableSeats} Open Seats
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'SCAN' && <QRScannerSimulator />}
      {activeTab === 'TASKS' && <POSManagementTab />}

      {activeTab === 'PROFILE' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 text-xs">
          <h3 className="text-base font-bold font-cinzel text-zinc-100">
            Employee Profile & Assigned Permissions
          </h3>

          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2">
            <div><span className="text-zinc-500">Name:</span> <strong className="text-zinc-200">{userSession.name}</strong></div>
            <div><span className="text-zinc-500">Mobile Phone:</span> <span className="text-amber-400 font-mono">{userSession.mobile}</span></div>
            <div><span className="text-zinc-500">Assigned Venue:</span> <span className="text-zinc-200">{activeLocation?.name}</span></div>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-amber-400 uppercase tracking-wider text-[11px]">
              Assigned Operational Permissions:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {userSession.permissions.map(p => (
                <div key={p} className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-semibold">
                  ✓ {p.replace('_', ' ')}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-rose-950/20 border border-rose-900/40 p-4 rounded-2xl text-rose-300 space-y-1">
            <div className="font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400" />
              Restricted Operations (Owner Only)
            </div>
            <div className="text-[11px] text-zinc-400">
              Financial revenue totals, bank payout accounts, employee administration, and legal business settings are strictly locked for regular staff accounts.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
