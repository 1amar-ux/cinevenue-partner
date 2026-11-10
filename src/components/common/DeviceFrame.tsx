import React from 'react';
import { useApp } from '../../context/AppContext';
import { Smartphone, Monitor, Tablet, Battery, Wifi, Signal } from 'lucide-react';

export const DeviceFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { viewMode, setViewMode } = useApp();

  if (viewMode === 'RESPONSIVE') {
    return <div className="w-full min-h-screen">{children}</div>;
  }

  const isIphone = viewMode === 'MOBILE_IPHONE';
  const isAndroid = viewMode === 'MOBILE_ANDROID';
  const isTablet = viewMode === 'TABLET';

  return (
    <div className="w-full min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Viewport Control Bar */}
      <div className="mb-4 flex items-center gap-3 bg-zinc-900 border border-amber-500/20 px-4 py-2 rounded-xl text-xs text-zinc-300">
        <span className="font-medium text-amber-400">Device Simulator:</span>
        <span className="text-zinc-400">
          {isIphone ? 'iPhone 16 Pro (393 x 852)' : isAndroid ? 'Android Flagship (412 x 915)' : 'Tablet iPad Air (820 x 1180)'}
        </span>
        <button
          onClick={() => setViewMode('RESPONSIVE')}
          className="ml-auto px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-semibold text-[11px] hover:bg-amber-500/30 transition-colors"
        >
          Exit Frame (Full Canvas)
        </button>
      </div>

      {/* Frame Wrapper */}
      <div
        className={`relative bg-zinc-950 border-4 border-zinc-800 shadow-2xl rounded-[40px] overflow-hidden flex flex-col transition-all ${
          isIphone
            ? 'w-[393px] h-[830px] border-zinc-800 ring-1 ring-amber-500/30'
            : isAndroid
            ? 'w-[412px] h-[850px] border-zinc-800 ring-1 ring-zinc-700'
            : 'w-[820px] h-[880px] border-zinc-800 ring-1 ring-amber-500/30'
        }`}
      >
        {/* Phone Notch / Dynamic Island */}
        {isIphone && (
          <div className="h-7 bg-zinc-950 flex items-center justify-between px-6 shrink-0 text-zinc-400 text-[11px] font-medium select-none z-50 border-b border-zinc-900">
            <span>9:41</span>
            <div className="w-24 h-4 bg-zinc-900 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700" />
            </div>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Android Punch hole */}
        {isAndroid && (
          <div className="h-7 bg-zinc-950 flex items-center justify-between px-6 shrink-0 text-zinc-400 text-[11px] font-medium select-none z-50 border-b border-zinc-900">
            <span>19:50</span>
            <div className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700" />
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto relative bg-zinc-950 flex flex-col">
          {children}
        </div>

        {/* Mobile Home Indicator Bar */}
        {(isIphone || isAndroid) && (
          <div className="h-5 bg-zinc-950 flex items-center justify-center shrink-0 z-50">
            <div className="w-32 h-1 bg-zinc-700 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
