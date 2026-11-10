import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { MapPin, Building2, Plus, Phone, CheckCircle2, Film } from 'lucide-react';

export const MyTheatresTab: React.FC = () => {
  const { locations, currentPartner, addTheatreLocation, setActiveLocationId, activeLocationId } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [totalScreens, setTotalScreens] = useState(3);

  const partnerLocations = locations.filter(l => l.partnerId === currentPartner?.id || true);

  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPartner || !name || !city) return;

    addTheatreLocation({
      partnerId: currentPartner.id,
      name,
      city,
      address: address || 'Main City Road',
      contactNumber: contactNumber || '+91 20 1234 5678',
      totalScreens,
      status: 'ACTIVE'
    });

    setIsModalOpen(false);
    setName('');
    setCity('');
    setAddress('');
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            Multi-Location Business Properties
          </span>
          <h2 className="text-xl font-bold font-cinzel text-zinc-100">
            Registered Theatre Venues & Locations
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage multiple registered cinema multiplexes under your owner account.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Register New Theatre Location
        </button>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {partnerLocations.map(loc => {
          const isCurrentActive = loc.id === activeLocationId;
          return (
            <div
              key={loc.id}
              className={`bg-zinc-900 border rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between transition-all ${
                isCurrentActive ? 'border-amber-400/80 ring-1 ring-amber-400/50 bg-amber-500/5' : 'border-zinc-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    VERIFIED VENUE
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-100">{loc.name}</h3>
                  <div className="text-xs text-amber-400 font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{loc.city}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400">{loc.address}</p>

                <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-300 space-y-1">
                  <div>Screens: <strong className="text-amber-300 font-mono">{loc.totalScreens} Auditoriums</strong></div>
                  <div>Phone: <span className="font-mono text-zinc-400">{loc.contactNumber}</span></div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/80">
                <button
                  onClick={() => setActiveLocationId(loc.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isCurrentActive
                      ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                      : 'bg-zinc-950 text-zinc-300 border border-zinc-800 hover:border-amber-400/50 hover:text-amber-300'
                  }`}
                >
                  {isCurrentActive ? '✓ Currently Active Location' : 'Switch to this Venue'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Register New Location Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateLocation} className="bg-zinc-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-amber-400 font-cinzel">
              Register New Theatre Venue
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Theatre Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CineVenue Gold IMAX Connaught Place"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Delhi / Mumbai / Bengaluru"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Full Address</label>
                <input
                  type="text"
                  placeholder="Street / Mall Name..."
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 11 2341 9988"
                    value={contactNumber}
                    onChange={e => setContactNumber(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Registered Screens</label>
                  <input
                    type="number"
                    value={totalScreens}
                    onChange={e => setTotalScreens(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 font-mono"
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
                Save Theatre Venue
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
