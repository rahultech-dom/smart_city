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
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-[#070C18]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-white font-mono tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF]" />
            {activeTabTitle}
          </h2>
        </div>
      </div>

      {/* Right: Data Mode, Telemetry Controls & Clock */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* UTC Clock */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-xs text-slate-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentTime || '00:00:00 UTC'}</span>
        </div>

        {/* Backend Connection / Mode Indicator */}
        <div className="flex items-center">
          {apiConnected && !isDemoMode ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden sm:inline">LIVE FASTAPI API</span>
            </div>
          ) : (
            <button
              onClick={onToggleDemoMode}
              title="Click to toggle between Synthetic Demo Data and Live API"
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-300 text-xs font-mono transition-colors"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>SYNTHETIC DEMO MODE</span>
            </button>
          )}
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* New Complaint Button */}
        <button
          onClick={onOpenNewComplaint}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>New Complaint</span>
        </button>
      </div>
    </header>
  );
}
