import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  Ticket,
  DollarSign,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  Trash2,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import { NotificationType, PartnerNotification } from '../../types';

interface NotificationCenterProps {
  onNavigateTab?: (tab: string) => void;
}

export const PartnerNotificationCenter: React.FC<NotificationCenterProps> = ({ onNavigateTab }) => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<string>('ALL');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'BOOKING':
        return <Ticket className="w-4 h-4 text-amber-400" />;
      case 'SETTLEMENT':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'ADMIN_REQUEST':
      case 'STATUS_CHANGE':
        return <AlertTriangle className="w-4 h-4 text-blue-400" />;
      case 'SHOW_CHANGE':
      case 'EVENT_UPDATE':
        return <Calendar className="w-4 h-4 text-purple-400" />;
      default:
        return <Info className="w-4 h-4 text-gold" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'ALL') return true;
    if (filter === 'BOOKING') return n.type === 'BOOKING' || n.type === 'CANCELLATION';
    if (filter === 'SETTLEMENT') return n.type === 'SETTLEMENT';
    if (filter === 'SYSTEM') return n.type === 'ADMIN_REQUEST' || n.type === 'STATUS_CHANGE' || n.type === 'ANNOUNCEMENT';
    return true;
  });

  return (
    <div className="relative inline-block text-left" ref={panelRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-gold border border-white/10 transition-colors cursor-pointer"
        title="Notifications & Live Alerts"
      >
        <Bell className="w-4 h-4" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-zinc-950 font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse shadow-sm">
            {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Notifications Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#121215] border border-gold/30 rounded-2xl shadow-2xl z-[150] p-4 space-y-3 animate-fade-in text-left">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100 font-sans">
                Activity & Alerts
              </h3>
              {unreadNotificationsCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold font-mono">
                  {unreadNotificationsCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadNotificationsCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="text-[10px] text-gold hover:underline cursor-pointer bg-transparent border-0 font-medium"
                >
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 p-0.5 cursor-pointer bg-transparent border-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-semibold no-scrollbar">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'BOOKING', label: 'Bookings' },
              { id: 'SETTLEMENT', label: 'Payouts' },
              { id: 'SYSTEM', label: 'System' }
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilter(t.id)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0 border-0 ${
                  filter === t.id
                    ? 'bg-gold/20 text-gold font-bold'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Notification Items List */}
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1 no-scrollbar">
            {filteredNotifications.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs">
                <Bell className="w-8 h-8 text-white/5 mx-auto mb-2" />
                <p>No alerts in this category.</p>
              </div>
            ) : (
              filteredNotifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationRead(n.id);
                    if (n.actionUrl && onNavigateTab) {
                      onNavigateTab(n.actionUrl);
                      setIsOpen(false);
                    }
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    n.isRead
                      ? 'bg-black/30 border-white/5 text-zinc-400'
                      : 'bg-white/[0.03] border-gold/30 text-zinc-200 hover:border-gold/50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/5 shrink-0 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 space-y-0.5 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-zinc-100 truncate">
                          {n.title}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono shrink-0">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Action */}
          {notifications.length > 0 && (
            <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px]">
              <span className="text-zinc-500">Auto-refreshed with CineVenue Core</span>
              <button
                type="button"
                onClick={clearNotifications}
                className="text-zinc-500 hover:text-red-400 flex items-center gap-1 cursor-pointer bg-transparent border-0"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear history</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default PartnerNotificationCenter;
