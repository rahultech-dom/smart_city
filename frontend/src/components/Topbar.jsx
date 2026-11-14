import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  RotateCw, 
  PlusCircle, 
  Wifi, 
  WifiOff, 
  ShieldAlert, 
  Clock, 
  Database,
  Radio
} from 'lucide-react';

export default function Topbar({
  activeTabTitle,
  isDemoMode,
  apiConnected,
  isRefreshing,
  onRefresh,
  onOpenNewComplaint,
  onToggleDemoMode,
  onOpenMobileSidebar,
}) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[#E5E0D4] bg-[#FDFCF9]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg bg-white border border-[#E5E0D4] text-stone-700 hover:text-stone-950 shadow-xs"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-stone-900 font-mono tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shadow-xs" />
            {activeTabTitle}
          </h2>
        </div>
      </div>

      {/* Right: Data Mode, Telemetry Controls & Clock */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* UTC Clock */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E5E0D4] font-mono text-xs text-stone-700 shadow-xs">
          <Clock className="w-3.5 h-3.5 text-amber-700" />
          <span>{currentTime || '00:00:00 UTC'}</span>
        </div>

        {/* API / Demo Mode Indicator */}
        <button
          onClick={onToggleDemoMode}
          title="Click to toggle between Live Backend and Synthetic Demo Telemetry"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all shadow-xs ${
            isDemoMode
              ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
              : apiConnected
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
              : 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100'
          }`}
        >
          {isDemoMode ? (
            <>
              <Radio className="w-3.5 h-3.5 animate-pulse text-amber-700" />
              <span className="font-semibold">SYNTHETIC DEMO</span>
            </>
          ) : apiConnected ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-700" />
              <span className="font-semibold">API CONNECTED</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-rose-700" />
              <span className="font-semibold">API OFFLINE</span>
            </>
          )}
        </button>

        {/* Refresh Heartbeat Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Force telemetry refresh"
          className="p-2 rounded-lg bg-white border border-[#E5E0D4] text-stone-600 hover:text-stone-900 hover:bg-[#F2ECE1] transition-all shadow-xs disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-700' : ''}`} />
        </button>

        {/* Submit Complaint Button */}
        <button
          onClick={onOpenNewComplaint}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 font-bold text-xs font-mono shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4 text-amber-400 stroke-[2.5]" />
          <span className="hidden sm:inline">New Complaint</span>
          <span className="sm:hidden">Intake</span>
        </button>
      </div>
    </header>
  );
}
