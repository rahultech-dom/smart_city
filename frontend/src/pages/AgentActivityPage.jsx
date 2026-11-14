import React, { useState } from 'react';
import { 
  Cpu, 
  Network, 
  Car, 
  ShieldAlert, 
  Trash2, 
  Leaf, 
  Droplets, 
  Zap, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  Clock,
  Sparkles,
  ArrowRight,
  Layers
} from 'lucide-react';
import SeverityBadge from '../components/SeverityBadge';
import DepartmentBadge from '../components/DepartmentBadge';
import { DEPARTMENT_AGENTS_METADATA, CITY_COMMAND_TELEMETRY } from '../services/mockData';

const AGENT_ICON_MAP = {
  Car: Car,
  ShieldAlert: ShieldAlert,
  Trash2: Trash2,
  Leaf: Leaf,
  Droplets: Droplets,
  Zap: Zap,
};

export default function AgentActivityPage({ onSelectComplaint, complaints }) {
  const [selectedAgentTab, setSelectedAgentTab] = useState('all'); // all or specific dept

  const agents = DEPARTMENT_AGENTS_METADATA;
  const command = CITY_COMMAND_TELEMETRY;

  const filteredAgents = selectedAgentTab === 'all' 
    ? agents 
    : agents.filter(a => a.id === selectedAgentTab);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white font-mono tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_#A855F7]" />
            AI Operations & Multi-Agent Telemetry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time monitoring console for the 6 Departmental AI Agents and Central City Command Orchestrator
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
          <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Multi-Agent Swarm Active</span>
        </div>
      </div>

      {/* City Command Agent Consolidated Command Console */}
      <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-[#0B132B] via-[#0F1A3A] to-[#0B132B] p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-cyan-500/20 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-mono tracking-wide">
                  Central City Command Agent
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono uppercase tracking-wider font-bold">
                  Canonical: WF_City_Command
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Evaluates overall severity, synthesizes multi-agency recommendations & enforces human review
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Coordination Status</span>
              <span className="text-emerald-400 font-bold">ACTIVE ARBITRATION</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Cross-Agency Tasks</span>
              <span className="text-cyan-400 font-bold">{command.activeCrossAgencyIncidents} In Queue</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 uppercase block">Triage Latency</span>
              <span className="text-slate-300 font-bold">~{command.averageTriageLatencyMs} ms</span>
            </div>
          </div>
        </div>

        {/* Latest High-Priority Coordination Event */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Latest Consolidated Decision
              </span>
              <span className="text-slate-500">{command.latestCoordinationEvent.timestamp}</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-sans">
                  {command.latestCoordinationEvent.title}
                </h3>
                <SeverityBadge severity={command.latestCoordinationEvent.severity} />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {command.latestCoordinationEvent.summary}
              </p>

              <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Agencies Synchronized:</span>
                  {command.latestCoordinationEvent.departments.map(d => (
                    <DepartmentBadge key={d} department={d} />
                  ))}
                </div>

                {command.latestCoordinationEvent.complaintId && (
                  <button
                    onClick={() => {
                      const found = complaints.find(c => c.complaint_id === command.latestCoordinationEvent.complaintId);
                      if (found) onSelectComplaint(found);
                    }}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                  >
                    <span>Inspect Target Incident</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Operational Guardrail Card */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-mono font-bold uppercase">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Command Guardrail</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                City Command Agent generates consolidated action items for municipal directors. All cross-agency dispatches remain parked in <strong className="text-amber-300 font-mono">awaiting_human_review</strong> until an authorized supervisor approves.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-500/20 text-[11px] font-mono text-amber-400/90">
              Autonomous execution: DISABLED
            </div>
          </div>
        </div>

      </div>

      {/* Filter Tabs for 6 Departmental Agents */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedAgentTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              selectedAgentTab === 'all'
                ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)] font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All 6 Agents
          </button>
          {agents.map((ag) => (
            <button
              key={ag.id}
              onClick={() => setSelectedAgentTab(ag.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono capitalize transition-all ${
                selectedAgentTab === ag.id
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {ag.department} Agent
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-500 hidden sm:inline">
          Showing {filteredAgents.length} Agent Profiles
        </span>
      </div>

      {/* 6 Departmental AI Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((ag) => {
          const Icon = AGENT_ICON_MAP[ag.icon] || Cpu;
          const isAlert = ag.status === 'alert';

          return (
            <div
              key={ag.id}
              className={`rounded-2xl border ${
                isAlert ? 'border-rose-500/40 bg-[#0B132B]/90' : 'border-slate-800 bg-[#0B132B]/80'
              } backdrop-blur-md p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all group`}
            >
              <div>
                {/* Agent Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono">
                        {ag.name}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-500">
                        {ag.workflowName}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                    isAlert ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {ag.status}
                  </span>
                </div>

                {/* Agent Stats Bar */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block uppercase">Active Queue</span>
                    <span className="text-white font-bold">{ag.activeIncidents} Incidents</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block uppercase">Confidence</span>
                    <span className="text-cyan-400 font-bold">{Math.round(ag.avgConfidence * 100)}%</span>
                  </div>
                </div>

                {/* Latest Event & Findings */}
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 font-semibold truncate max-w-[180px]">
                      {ag.activeEvent.issue}
                    </span>
                    <SeverityBadge severity={ag.activeEvent.severity} size="sm" />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-300 space-y-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Findings:</span>
                      <p className="text-slate-300 text-xs leading-relaxed mt-0.5">
                        {ag.activeEvent.findings}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-900">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase block">Recommendation:</span>
                      <p className="text-slate-200 text-xs leading-relaxed mt-0.5">
                        {ag.activeEvent.recommendation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tools & APIs */}
                <div className="mt-3">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                    Specialized Tools & APIs:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ag.tools.map((tool, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-600" />
                  {ag.lastActivityTime}
                </span>
                <span className="text-amber-400/90 text-[10px]">
                  Approval Req: YES
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
