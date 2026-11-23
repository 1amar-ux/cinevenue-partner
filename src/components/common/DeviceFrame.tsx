import React from 'react';
import { useApp, ViewMode } from '../../context/AppContext';
import { Smartphone, Monitor, Tablet, Battery, Wifi, Signal, Check, ChevronDown } from 'lucide-react';

interface DevicePreset {
  id: ViewMode;
  name: string;
  category: 'MOBILE' | 'TABLET' | 'DESKTOP';
  width: number;
  height: number;
  label: string;
  os: 'iOS' | 'Android' | 'Desktop';
}

const DEVICE_PRESETS: DevicePreset[] = [
  { id: 'MOBILE_SMALL_ANDROID', name: 'Small Android Phone', category: 'MOBILE', width: 360, height: 740, label: '360 x 740 (Android)', os: 'Android' },
  { id: 'MOBILE_IPHONE_SE', name: 'iPhone SE Class', category: 'MOBILE', width: 375, height: 667, label: '375 x 667 (iOS)', os: 'iOS' },
  { id: 'MOBILE_IPHONE_PRO', name: 'iPhone 16 Pro', category: 'MOBILE', width: 393, height: 852, label: '393 x 852 (iOS)', os: 'iOS' },
  { id: 'MOBILE_IPHONE_MAX', name: 'Large iPhone Pro Max', category: 'MOBILE', width: 430, height: 932, label: '430 x 932 (iOS)', os: 'iOS' },
  { id: 'MOBILE_ANDROID_LARGE', name: 'Android Flagship / 480px', category: 'MOBILE', width: 412, height: 915, label: '412 x 915 (Android)', os: 'Android' },
  { id: 'TABLET_IPAD', name: 'iPad / Android Tablet', category: 'TABLET', width: 768, height: 1024, label: '768 x 1024 (Tablet)', os: 'iOS' }
];

export const DeviceFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { viewMode, setViewMode } = useApp();

  // If in pure responsive mode, render full viewport without simulator bezel
  if (viewMode === 'RESPONSIVE') {
    return <div className="w-full min-h-screen bg-zinc-950 text-zinc-100">{children}</div>;
  }

  // Map legacy aliases if needed
  let normalizedMode = viewMode;
  if (viewMode === 'MOBILE_IPHONE') normalizedMode = 'MOBILE_IPHONE_PRO';
  if (viewMode === 'MOBILE_ANDROID') normalizedMode = 'MOBILE_ANDROID_LARGE';
  if (viewMode === 'TABLET') normalizedMode = 'TABLET_IPAD';

  const currentPreset = DEVICE_PRESETS.find(p => p.id === normalizedMode) || DEVICE_PRESETS[2]; // default to iPhone 16 Pro
  const isApple = currentPreset.os === 'iOS';

  return (
    <div className="w-full min-h-screen bg-zinc-950 flex flex-col items-center justify-start p-2 sm:p-6 overflow-x-auto">
      
      {/* Device Viewport Testing Controller Bar */}
      <div className="w-full max-w-4xl mb-4 bg-zinc-900/95 border border-amber-500/30 backdrop-blur-md px-3 sm:px-5 py-2.5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-amber-400">Viewport Simulator:</span>
          <span className="font-semibold text-zinc-100">{currentPreset.name}</span>
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
            {currentPreset.width}px × {currentPreset.height}px
          </span>
        </div>

        {/* Device Switcher Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {DEVICE_PRESETS.map(preset => {
            const isActive = preset.id === normalizedMode;
            return (
              <button
                key={preset.id}
                onClick={() => setViewMode(preset.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                }`}
                title={`Simulate ${preset.name} (${preset.width}x${preset.height})`}
              >
                {preset.name.split(' ')[0]} {preset.width}px
              </button>
            );
          })}

          <button
            onClick={() => setViewMode('RESPONSIVE')}
            className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px] border border-amber-500/30 transition-colors ml-1 cursor-pointer flex items-center gap-1"
            title="Switch to full screen responsive canvas"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full Responsive</span>
          </button>
        </div>
      </div>

      {/* Realistic Device Hardware Frame */}
      <div
        style={{
          width: `${currentPreset.width}px`,
          height: `${currentPreset.height}px`,
          maxWidth: '100%'
        }}
        className={`relative bg-zinc-950 border-4 border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] rounded-[40px] overflow-hidden flex flex-col transition-all duration-300 ring-1 ${
          isApple ? 'ring-amber-500/30' : 'ring-zinc-700'
        }`}
      >
        {/* Device Status Bar & Notch / Island */}
        <div className="h-8 bg-zinc-950 flex items-center justify-between px-6 shrink-0 text-zinc-400 text-[11px] font-medium select-none z-50 border-b border-zinc-900/60">
          <span className="font-semibold">{isApple ? '9:41' : '19:50'}</span>
          
          {/* Dynamic Island for iPhones, Punch-hole for Android */}
          {isApple ? (
            <div className="w-24 h-4 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700" />
            </div>
          ) : (
            <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 border border-zinc-700 mx-auto" />
          )}

          <div className="flex items-center gap-1.5 text-zinc-300">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Live Application Screen Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-zinc-950 flex flex-col">
          {children}
        </div>

        {/* iOS / Android Home Indicator Bar */}
        <div className="h-5 bg-zinc-950 flex items-center justify-center shrink-0 z-50 select-none">
          <div className="w-32 h-1 bg-zinc-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};
