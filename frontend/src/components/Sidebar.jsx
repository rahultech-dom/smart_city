import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Layers, 
  ExternalLink,
  Info
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab, isMobileOpen, onCloseMobile }) {
  const navItems = [
    {
      id: 'overview',
      label: 'Overview Operations',
      subtitle: 'Executive Telemetry',
      icon: LayoutDashboard,
    },
    {
      id: 'complaints',
      label: 'Complaint Management',
      subtitle: 'Triage & Resolution',
      icon: FileText,
    },
    {
      id: 'agents',
      label: 'AI Agent Activity',
      subtitle: '6 Depts + City Command',
      icon: Cpu,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 flex-shrink-0 flex flex-col justify-between border-r border-slate-800/80 bg-[#070C18] transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 p-0.5 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <div className="w-full h-full bg-[#070C18] rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-wider text-white font-mono flex items-center gap-1.5">
                URBANFLOW <span className="text-cyan-400">AI</span>
              </h1>
              <p className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                Multi-Agent Smart City
              </p>
            </div>
          </div>

          <div className="mt-4 px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Command Grid
            </span>
            <span className="text-emerald-400 font-semibold">ONLINE</span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Operations Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 via-blue-600/10 to-transparent border border-cyan-500/40 text-white shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div
                  className={`p-2 rounded-lg border transition-colors ${
                    isActive
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold tracking-wide font-sans">
                    {item.label}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {item.subtitle}
                  </div>
                </div>
                {isActive && (
                  <span className="w-1.5 h-6 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF]" />
                )}
              </button>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            System Topology
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Department Agents</span>
              <span className="text-cyan-400 font-semibold">6 Active</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Orchestrator</span>
              <span className="text-indigo-400 font-semibold">n8n Engine</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">LLM Reasoning</span>
              <span className="text-purple-400 font-semibold">Gemini Flash</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Database</span>
              <span className="text-emerald-400 font-semibold">Supabase PG</span>
            </div>
          </div>
        </div>

        {/* Operational Safety Notice Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-amber-300 font-mono">
                  OPERATIONAL SAFETY
                </p>
                <p className="text-[10px] text-amber-200/70 mt-0.5 leading-relaxed">
                  Prototype environment. All AI actions are recommendations requiring human municipal authority approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
