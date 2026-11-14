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
    { key: 'traffic', name: 'Traffic Management', count: byDept.traffic || 0, color: 'bg-orange-500' },
    { key: 'safety', name: 'Public Safety', count: byDept.safety || 0, color: 'bg-red-500' },
    { key: 'waste', name: 'Waste Management', count: byDept.waste || 0, color: 'bg-emerald-500' },
    { key: 'environment', name: 'Environmental Monitoring', count: byDept.environment || 0, color: 'bg-teal-500' },
    { key: 'water', name: 'Water Management', count: byDept.water || 0, color: 'bg-sky-500' },
    { key: 'energy', name: 'Energy Management', count: byDept.energy || 0, color: 'bg-yellow-500' },
    { key: 'general', name: 'General Triage', count: byDept.general || 0, color: 'bg-slate-500' },
  ];

  const maxDeptCount = Math.max(...departmentsList.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      
      {/* Operations Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-command-900 via-command-850 to-command-900 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[11px] font-mono uppercase tracking-wider">
                Executive Command Center
              </span>
              <span className="text-xs text-slate-400 font-mono">
                • Municipal Grid Status: Nominal
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight">
              UrbanFlow AI Multi-Agent Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Consolidated intelligence aggregating citizen intake, 6 specialized departmental AI reasoning agents, and central City Command arbitration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateAgents}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 hover:text-white transition-all shadow"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Inspect AI Agents</span>
            </button>
            <button
              onClick={onNavigateComplaints}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)]"
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
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#0B132B]/80 backdrop-blur-md p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div>
              <h3 className="text-sm font-bold text-white font-mono tracking-wide uppercase flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Complaints by Department Sector
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Distribution of civic incidents across the 6 departmental AI agent domains
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800">
              6 Specialist Agents
            </span>
          </div>

          <div className="mt-5 space-y-3.5">
            {departmentsList.map((dept) => {
              const pct = Math.round((dept.count / maxDeptCount) * 100);
              return (
                <div key={dept.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 font-medium capitalize flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dept.color}`} />
                      {dept.name}
                    </span>
                    <span className="text-slate-400">
                      <strong className="text-white">{dept.count}</strong> incidents ({totalComplaints > 0 ? Math.round((dept.count / totalComplaints) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800/80">
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
        <div className="rounded-2xl border border-slate-800 bg-[#0B132B]/80 backdrop-blur-md p-6 flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-800/80">
              <h3 className="text-sm font-bold text-white font-mono tracking-wide uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Lifecycle Status Distribution
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Current triage stage of municipal work orders
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { key: 'submitted', label: 'Submitted (Intake)', count: byStatus.submitted || 0, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { key: 'under_review', label: 'Under Review', count: byStatus.under_review || 0, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                { key: 'assigned', label: 'Assigned to Agent', count: byStatus.assigned || 0, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                { key: 'in_progress', label: 'In Progress (Field)', count: byStatus.in_progress || 0, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                { key: 'resolved', label: 'Resolved (Verified)', count: byStatus.resolved || 0, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { key: 'rejected', label: 'Rejected / Invalid', count: byStatus.rejected || 0, color: 'text-rose-400', bg: 'bg-rose-500/10' },
              ].map((s) => (
                <div key={s.key} className={`flex items-center justify-between p-2.5 rounded-xl border border-slate-800/80 ${s.bg}`}>
                  <span className="text-xs font-mono text-slate-300">
                    {s.label}
                  </span>
                  <span className={`text-xs font-mono font-bold ${s.color}`}>
                    {s.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Human In-The-Loop:</span>
            <span className="text-amber-400 font-semibold">Active Guardrail</span>
          </div>
        </div>

      </div>

      {/* Two Column Section: Recent Complaints & Recent AI Agent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Complaint Activity */}
        <div className="rounded-2xl border border-slate-800 bg-[#0B132B]/80 backdrop-blur-md p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div>
              <h3 className="text-sm font-bold text-white font-mono tracking-wide uppercase flex items-center gap-2">
                <Inbox className="w-4 h-4 text-cyan-400" />
                Recent Citizen Complaints
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Latest incoming civic issues queued for agent assessment
              </p>
            </div>
            <button
              onClick={onNavigateComplaints}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              View All ({complaints.length})
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-800/60">
            {recentList.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-slate-500">
                No recent complaints found.
              </div>
            ) : (
              recentList.map((c) => (
                <div
                  key={c.complaint_id}
                  onClick={() => onSelectComplaint(c)}
                  className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3 cursor-pointer group hover:bg-slate-900/40 px-2 rounded-lg transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-cyan-400 transition-colors">
                        #{c.complaint_id?.slice(0, 8)}
                      </span>
                      <DepartmentBadge department={c.category} />
                      <SeverityBadge severity={c.severity} />
                    </div>
                    <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 font-mono">
                      📍 {c.location_text || (c.latitude ? `${c.latitude}, ${c.longitude}` : 'Location unprovided')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <StatusBadge status={c.status} />
                    <span className="text-[10px] font-mono text-slate-500">
                      {c.created_at ? new Date(c.created_at).toLocaleTimeString() : 'Recent'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent AI Agent Activity & City Command Arbitration */}
        <div className="rounded-2xl border border-slate-800 bg-[#0B132B]/80 backdrop-blur-md p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div>
              <h3 className="text-sm font-bold text-white font-mono tracking-wide uppercase flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                Recent AI Agent Operations
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Telemetry and recommendations from specialized departmental nodes
              </p>
            </div>
            <button
              onClick={onNavigateAgents}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Monitor Agents
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {/* City Command Consolidated Log */}
            <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20">
              <div className="flex items-center justify-between mb-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300">
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  City Command Agent (WF_City_Command)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Awaiting Review
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Coordinated multi-agency alert for live high-voltage breach near school gate. Required immediate cross-dispatch between BSES Power Grid and City Police.
              </p>
              <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>Inter-Agency: Safety + Energy + Traffic</span>
                <span>8 mins ago</span>
              </div>
            </div>

            {/* Department Agent 1 */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-semibold text-orange-400">
                  Traffic Management Agent (WF_Department_Traffic)
                </span>
                <span className="text-[10px] font-mono text-slate-400">14 mins ago</span>
              </div>
              <p className="text-xs text-slate-300">
                Formulated Ring Road eastbound traffic diversion via Africa Avenue following 2-lane blockage. Alternative route travel time calculated at 14 mins.
              </p>
            </div>

            {/* Department Agent 2 */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-semibold text-emerald-400">
                  Waste Management Agent (WF_Department_Waste)
                </span>
                <span className="text-[10px] font-mono text-slate-400">28 mins ago</span>
              </div>
              <p className="text-xs text-slate-300">
                Computer vision assessment verified 92% bin overflow spillage at Demo Market. Compactor truck crew #3 route generated for human confirmation.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
