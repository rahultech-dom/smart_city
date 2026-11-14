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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E0D4] gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 font-mono tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
            AI Operations & Multi-Agent Telemetry
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time monitoring console for the 6 Departmental AI Agents and Central City Command Orchestrator
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-semibold">
          <Activity className="w-4 h-4 text-amber-700 animate-pulse" />
          <span>Multi-Agent Swarm Active</span>
        </div>
      </div>

      {/* City Command Agent Consolidated Command Console */}
      <div className="rounded-2xl border border-[#D6CEBE] bg-gradient-to-br from-[#FAF6EE] via-white to-[#F5EFE4] p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-[#E5E0D4] gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 shadow-2xs">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-stone-900 font-mono tracking-wide">
                  Central City Command Agent
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-mono uppercase tracking-wider font-bold">
                  Canonical: WF_City_Command
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Evaluates overall severity, synthesizes multi-agency recommendations & enforces human review
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="px-3 py-2 rounded-xl bg-white border border-[#E5E0D4] shadow-2xs">
              <span className="text-[10px] text-stone-500 uppercase block font-semibold">Coordination Status</span>
              <span className="text-emerald-700 font-bold">ACTIVE ARBITRATION</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-white border border-[#E5E0D4] shadow-2xs">
              <span className="text-[10px] text-stone-500 uppercase block font-semibold">Cross-Agency Tasks</span>
              <span className="text-amber-800 font-bold">{command.activeCrossAgencyIncidents} In Queue</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-white border border-[#E5E0D4] col-span-2 sm:col-span-1 shadow-2xs">
              <span className="text-[10px] text-stone-500 uppercase block font-semibold">Triage Latency</span>
              <span className="text-stone-800 font-bold">~{command.averageTriageLatencyMs} ms</span>
            </div>
          </div>
        </div>

        {/* Live Coordination Incident Details */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white border border-[#E5E0D4] space-y-2 shadow-2xs">
            <div className="flex items-center justify-between font-mono">
              <span className="text-stone-500 uppercase text-[10px] font-semibold">Active Coordinated Event:</span>
              <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Score: {command.latestCoordinationEvent.priority_score}/100
              </span>
            </div>
            <h4 className="text-sm font-bold text-stone-900 font-sans">
              {command.latestCoordinationEvent.title}
            </h4>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              {command.latestCoordinationEvent.summary}
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5 border-t border-[#E5E0D4]">
              {command.latestCoordinationEvent.departments.map((d, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-stone-100 border border-stone-200 text-stone-700 text-[10px] font-mono font-medium">
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E5E0D4] space-y-2 shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-stone-500 uppercase text-[10px] font-mono font-semibold block mb-1">
                Unified Action System Directives:
              </span>
              <ul className="space-y-1.5">
                {command.latestCoordinationEvent.directives.map((dir, i) => (
                  <li key={i} className="text-xs text-stone-700 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span>{dir}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2 border-t border-[#E5E0D4] flex items-center justify-between text-[11px] font-mono">
              <span className="text-stone-500">Authority Sign-off:</span>
              <span className="text-amber-800 font-bold">REQUIRED BEFORE FIELD DEPLOYMENT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs by Department Agent */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedAgentTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all shadow-xs ${
            selectedAgentTab === 'all'
              ? 'bg-stone-900 text-white font-bold'
              : 'bg-white border border-[#E5E0D4] text-stone-600 hover:text-stone-900 hover:bg-[#F2ECE1]'
          }`}
        >
          All 6 Department Agents
        </button>

        {agents.map((a) => (
          <button
            key={a.id}
            onClick={() => setSelectedAgentTab(a.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all shadow-xs ${
              selectedAgentTab === a.id
                ? 'bg-stone-900 text-white font-bold'
                : 'bg-white border border-[#E5E0D4] text-stone-600 hover:text-stone-900 hover:bg-[#F2ECE1]'
            }`}
          >
            {a.name}
          </button>
        ))}
      </div>

      {/* 6 Specialized Departmental AI Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => {
          const IconComponent = AGENT_ICON_MAP[agent.icon] || Cpu;

          return (
            <div
              key={agent.id}
              className="rounded-2xl border border-[#E5E0D4] bg-white p-6 shadow-xs flex flex-col justify-between space-y-5 hover:shadow-md transition-all duration-200"
            >
              <div>
                {/* Agent Header */}
                <div className="flex items-start justify-between pb-4 border-b border-[#E5E0D4]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shadow-2xs">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 font-mono tracking-wide">
                        {agent.name}
                      </h3>
                      <p className="text-[10px] font-mono text-stone-500">
                        {agent.workflowName}
                      </p>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" title="Agent Live in n8n Engine" />
                </div>

                {/* Purpose & Description */}
                <p className="text-xs text-stone-600 mt-3.5 leading-relaxed font-sans">
                  {agent.purpose}
                </p>

                {/* Telemetry Tools / APIs Connected */}
                <div className="mt-4 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-stone-500 font-semibold block">
                    Integrated Sensor Telemetry & APIs:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.telemetrySources.map((src, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5E0D4] text-[10px] font-mono text-stone-700">
                        {src}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Current Active Incident Case */}
                <div className="mt-4 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D4] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-stone-500 uppercase font-semibold">Active Work Order:</span>
                    <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Score: {agent.activeEvent.severity_score}/100
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-900 font-sans">
                    {agent.activeEvent.title}
                  </h4>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    "{agent.activeEvent.finding}"
                  </p>
                  <div className="pt-2 border-t border-[#E5E0D4] text-[11px] text-stone-800 font-medium">
                    <strong className="text-stone-900">Recommendation:</strong> {agent.activeEvent.recommendation}
                  </div>
                </div>
              </div>

              {/* Card Footer: Guardrail & Action */}
              <div className="pt-4 border-t border-[#E5E0D4] flex items-center justify-between text-xs font-mono">
                <span className="text-stone-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span className="text-[11px]">Human Sign-off</span>
                </span>
                <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready in n8n
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
