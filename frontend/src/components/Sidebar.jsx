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
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 flex-shrink-0 flex flex-col justify-between border-r border-[#E5E0D4] bg-[#FAF8F5] transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-[#E5E0D4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300/80 p-0.5 shadow-sm flex items-center justify-center">
              <Activity className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-wider text-stone-900 font-mono flex items-center gap-1.5">
                URBANFLOW <span className="text-amber-700">AI</span>
              </h1>
              <p className="text-[11px] font-mono uppercase text-stone-500 tracking-wider">
                Multi-Agent Smart City
              </p>
            </div>
          </div>

          <div className="mt-4 px-3 py-2 rounded-lg bg-white border border-[#E5E0D4] flex items-center justify-between text-xs font-mono shadow-xs">
            <span className="text-stone-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Command Grid
            </span>
            <span className="text-emerald-700 font-semibold">ONLINE</span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
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
                    ? 'bg-white border border-[#D6CEBE] text-stone-950 shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-[#F2ECE1] border border-transparent'
                }`}
              >
                <div
                  className={`p-2 rounded-lg border transition-colors ${
                    isActive
                      ? 'bg-amber-50 border-amber-200 text-amber-800'
                      : 'bg-white border-[#E5E0D4] text-stone-500 group-hover:text-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold tracking-wide font-sans">
                    {item.label}
                  </div>
                  <div className="text-[10px] font-mono text-stone-500">
                    {item.subtitle}
                  </div>
                </div>
                {isActive && (
                  <span className="w-1.5 h-6 rounded-full bg-amber-600" />
                )}
              </button>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
            System Topology
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#E5E0D4] text-xs text-stone-700 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-stone-500">Department Agents</span>
              <span className="text-amber-800 font-semibold">6 Active</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-stone-500">Orchestrator</span>
              <span className="text-blue-800 font-semibold">n8n Engine</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-stone-500">LLM Reasoning</span>
              <span className="text-purple-800 font-semibold">Gemini Flash</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-stone-500">Database</span>
              <span className="text-emerald-800 font-semibold">Supabase PG</span>
            </div>
          </div>
        </div>

        {/* Operational Safety Notice Footer */}
        <div className="p-4 border-t border-[#E5E0D4] bg-[#FAF8F5]">
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-3">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-amber-900 font-mono">
                  OPERATIONAL SAFETY
                </p>
                <p className="text-[10px] text-amber-800 mt-0.5 leading-relaxed">
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
