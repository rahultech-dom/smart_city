import React from 'react';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  BarChart3, 
  Network 
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import DepartmentBadge from '../components/DepartmentBadge';

export default function OverviewPage({
  summary,
  complaints,
  onSelectComplaint,
  onNavigateComplaints,
  onNavigateAgents,
}) {
  const data = summary || {};
  const totalComplaints = data.total_complaints || complaints.length || 0;
  const openComplaints = data.open_complaints || complaints.filter(c => ['submitted', 'under_review', 'assigned', 'in_progress'].includes(c.status)).length || 0;
  const resolvedComplaints = data.resolved_complaints || complaints.filter(c => c.status === 'resolved').length || 0;
  const criticalHighCount = data.critical_high_complaints || complaints.filter(c => ['critical', 'high'].includes(c.severity)).length || 0;

  const byDept = data.by_department || {
    traffic: complaints.filter(c => c.category === 'traffic').length,
    safety: complaints.filter(c => c.category === 'safety').length,
    waste: complaints.filter(c => c.category === 'waste').length,
    environment: complaints.filter(c => c.category === 'environment').length,
    water: complaints.filter(c => c.category === 'water').length,
    energy: complaints.filter(c => c.category === 'energy').length,
    general: complaints.filter(c => c.category === 'general').length,
  };

  const byStatus = data.by_status || {
    submitted: complaints.filter(c => c.status === 'submitted').length,
    under_review: complaints.filter(c => c.status === 'under_review').length,
    assigned: complaints.filter(c => c.status === 'assigned').length,
    in_progress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    rejected: complaints.filter(c => c.status === 'rejected').length,
  };

  const recentList = complaints.slice(0, 5);

  const departmentsList = [
    { key: 'traffic', name: 'Traffic Management', count: byDept.traffic || 0, color: 'bg-orange-600' },
    { key: 'safety', name: 'Public Safety', count: byDept.safety || 0, color: 'bg-red-600' },
    { key: 'waste', name: 'Waste Management', count: byDept.waste || 0, color: 'bg-emerald-600' },
    { key: 'environment', name: 'Environmental Monitoring', count: byDept.environment || 0, color: 'bg-teal-600' },
    { key: 'water', name: 'Water Management', count: byDept.water || 0, color: 'bg-sky-600' },
    { key: 'energy', name: 'Energy Management', count: byDept.energy || 0, color: 'bg-amber-600' },
    { key: 'general', name: 'General Triage', count: byDept.general || 0, color: 'bg-stone-500' },
  ];

  const maxDeptCount = Math.max(...departmentsList.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      
      {/* Operations Banner */}
      <div className="rounded-2xl border border-[#E0D8C8] bg-gradient-to-r from-[#F5F0E6] via-[#FAF6EE] to-[#F5F0E6] p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-mono uppercase tracking-wider font-semibold">
                Executive Command Center
              </span>
              <span className="text-xs text-stone-600 font-mono">
                • Municipal Grid Status: Nominal
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-mono tracking-tight">
              UrbanFlow AI Multi-Agent Overview
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Consolidated intelligence aggregating citizen intake, 6 specialized departmental AI reasoning agents, and central City Command arbitration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateAgents}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#F2ECE1] border border-[#D6CEBE] text-xs font-mono text-stone-800 transition-all shadow-xs"
            >
              <Cpu className="w-4 h-4 text-amber-700" />
              <span>Inspect AI Agents</span>
            </button>
            <button
              onClick={onNavigateComplaints}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 font-bold text-xs font-mono transition-all shadow-sm"
            >
              <span>Manage Complaints</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Complaints Received"
          value={totalComplaints}
          subtitle="All-time ingested reports"
          icon={Inbox}
          accentColor="indigo"
          onClick={onNavigateComplaints}
        />
        <MetricCard
          title="Open Complaints"
          value={openComplaints}
          subtitle="Awaiting resolution or triage"
          icon={Clock}
          accentColor="cyan"
          onClick={onNavigateComplaints}
        />
        <MetricCard
          title="Resolved Incidents"
          value={resolvedComplaints}
          subtitle="Verified by human authority"
          icon={CheckCircle2}
          accentColor="emerald"
          onClick={onNavigateComplaints}
        />
        <MetricCard
          title="High & Critical Severity"
          value={criticalHighCount}
          subtitle="Prioritized emergency alerts"
          icon={AlertTriangle}
          accentColor="rose"
          onClick={onNavigateComplaints}
        />
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Workload Breakdown */}
        <div className="lg:col-span-2 rounded-2xl border border-[#E5E0D4] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D4]">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-mono tracking-wide uppercase flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-700" />
                Complaints by Department Sector
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Distribution of civic incidents across the 6 departmental AI agent domains
              </p>
            </div>
            <span className="text-xs font-mono text-amber-800 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 font-medium">
              6 Specialist Agents
            </span>
          </div>

          <div className="mt-5 space-y-3.5">
            {departmentsList.map((dept) => {
              const pct = Math.round((dept.count / maxDeptCount) * 100);
              return (
                <div key={dept.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-stone-700 font-medium capitalize flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dept.color}`} />
                      {dept.name}
                    </span>
                    <span className="text-stone-500">
                      <strong className="text-stone-900">{dept.count}</strong> incidents ({totalComplaints > 0 ? Math.round((dept.count / totalComplaints) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden border border-stone-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${dept.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Complaint Status & Lifecycle Distribution */}
        <div className="rounded-2xl border border-[#E5E0D4] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-[#E5E0D4]">
              <h3 className="text-sm font-bold text-stone-900 font-mono tracking-wide uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-700" />
                Lifecycle Status Distribution
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Current triage stage of municipal work orders
              </p>
            </div>

            <div className="mt-5 space-y-2.5">
              {[
                { key: 'submitted', label: 'Submitted (Intake)', count: byStatus.submitted || 0, color: 'text-sky-800', bg: 'bg-sky-50 border-sky-200' },
                { key: 'under_review', label: 'Under Review', count: byStatus.under_review || 0, color: 'text-amber-800', bg: 'bg-amber-50 border-amber-200' },
                { key: 'assigned', label: 'Assigned to Agent', count: byStatus.assigned || 0, color: 'text-indigo-800', bg: 'bg-indigo-50 border-indigo-200' },
                { key: 'in_progress', label: 'In Progress (Field)', count: byStatus.in_progress || 0, color: 'text-teal-800', bg: 'bg-teal-50 border-teal-200' },
                { key: 'resolved', label: 'Resolved (Verified)', count: byStatus.resolved || 0, color: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200' },
                { key: 'rejected', label: 'Rejected / Invalid', count: byStatus.rejected || 0, color: 'text-rose-800', bg: 'bg-rose-50 border-rose-200' },
              ].map((s) => (
                <div key={s.key} className={`flex items-center justify-between p-2.5 rounded-xl border ${s.bg}`}>
                  <span className="text-xs font-mono text-stone-700 font-medium">
                    {s.label}
                  </span>
                  <span className={`text-xs font-mono font-bold ${s.color}`}>
                    {s.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5E0D4] text-[11px] font-mono text-stone-500 flex items-center justify-between">
            <span>Human In-The-Loop:</span>
            <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Active Guardrail</span>
          </div>
        </div>

      </div>

      {/* Two Column Section: Recent Complaints & Municipal Coordination */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Complaint Activity */}
        <div className="rounded-2xl border border-[#E5E0D4] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D4]">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-mono tracking-wide uppercase flex items-center gap-2">
                <Inbox className="w-4 h-4 text-amber-700" />
                Recent Citizen Complaints
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Latest incoming civic issues queued for agent assessment
              </p>
            </div>
            <button
              onClick={onNavigateComplaints}
              className="text-xs font-mono text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 divide-y divide-[#EAE5D9]">
            {recentList.map((c) => (
              <div
                key={c.complaint_id}
                onClick={() => onSelectComplaint(c)}
                className="py-3 px-2 -mx-2 rounded-xl hover:bg-[#FAF7F2] cursor-pointer transition-colors flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-stone-600 group-hover:text-amber-800 transition-colors">
                      #{c.complaint_id?.slice(0, 8)}
                    </span>
                    <DepartmentBadge department={c.category} />
                    <SeverityBadge severity={c.severity} />
                  </div>
                  <p className="text-xs text-stone-700 line-clamp-1 leading-relaxed font-sans">
                    {c.description}
                  </p>
                  <div className="text-[11px] font-mono text-stone-500 flex items-center gap-2">
                    <span>📍 {c.location_text || 'GPS Coordinates Stored'}</span>
                    <span>•</span>
                    <span>{c.created_at ? new Date(c.created_at).toLocaleTimeString() : 'Recent'}</span>
                  </div>
                </div>

                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Agent Architectural Overview */}
        <div className="rounded-2xl border border-[#E5E0D4] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-[#E5E0D4]">
              <h3 className="text-sm font-bold text-stone-900 font-mono tracking-wide uppercase flex items-center gap-2">
                <Network className="w-4 h-4 text-blue-700" />
                Multi-Agent Coordination Topology
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Autonomous triage pipeline with human-in-the-loop escalation
              </p>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3.5 rounded-xl border border-[#E5E0D4] bg-[#FAF8F5] space-y-1">
                <div className="flex items-center justify-between font-mono font-bold text-stone-900">
                  <span>1. City Complaint Agent (WF_City_Complaint)</span>
                  <span className="text-emerald-700 text-[11px]">NLP Intake</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Ingests raw citizen submissions, removes PII, validates coordinate constraints, and routes to the correct department agent.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#E5E0D4] bg-[#FAF8F5] space-y-1">
                <div className="flex items-center justify-between font-mono font-bold text-stone-900">
                  <span>2. 6 Departmental AI Agents</span>
                  <span className="text-amber-800 text-[11px]">Domain AI</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Traffic, Public Safety, Waste, Environment, Water, and Energy agents assess domain telemetry and formulate work orders.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#E5E0D4] bg-[#FAF8F5] space-y-1">
                <div className="flex items-center justify-between font-mono font-bold text-stone-900">
                  <span>3. Central City Command Agent (WF_City_Command)</span>
                  <span className="text-blue-800 text-[11px]">Arbitration</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Deduplicates cross-department collisions, computes city-wide priority, and presents actions for municipal authority sign-off.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5E0D4] flex items-center justify-between">
            <span className="text-xs font-mono text-stone-500">Autonomous Execution:</span>
            <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">RESTRICTED TO ADVISORY</span>
          </div>
        </div>

      </div>

    </div>
  );
}
