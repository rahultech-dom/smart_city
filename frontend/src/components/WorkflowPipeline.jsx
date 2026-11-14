import React from 'react';
import { UserCheck, Bot, Cpu, Network, CheckCircle, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

export default function WorkflowPipeline({ complaint }) {
  if (!complaint) return null;

  const status = complaint.status || 'submitted';
  const category = complaint.category || 'general';

  // Determine stage progress
  // 1: Submitted -> 2: Complaint Agent -> 3: Dept Agent -> 4: Command Agent -> 5: Unified Action
  let currentStep = 2;
  if (status === 'submitted') currentStep = 2;
  else if (status === 'under_review') currentStep = 3;
  else if (status === 'assigned') currentStep = 3;
  else if (status === 'in_progress') currentStep = 4;
  else if (status === 'resolved') currentStep = 5;
  else if (status === 'rejected') currentStep = 2;

  const hasReports = complaint.agent_reports && complaint.agent_reports.length > 0;
  const hasDecision = !!complaint.command_decision;

  const stages = [
    {
      num: 1,
      title: '1. Citizen Intake',
      agent: 'Citizen Gateway',
      icon: UserCheck,
      desc: complaint.location_text || (complaint.latitude ? `${complaint.latitude}, ${complaint.longitude}` : 'Direct Portal Ingestion'),
      time: complaint.created_at ? new Date(complaint.created_at).toLocaleTimeString() : 'Recorded',
      status: 'completed',
    },
    {
      num: 2,
      title: '2. City Complaint Agent',
      agent: 'WF_City_Complaint',
      icon: Bot,
      desc: `NLP classification: "${category.toUpperCase()}" • Severity: ${complaint.severity?.toUpperCase()}`,
      time: 'Classified & Validated',
      status: currentStep >= 2 ? (status === 'rejected' ? 'rejected' : 'completed') : 'pending',
    },
    {
      num: 3,
      title: '3. Departmental AI Agent',
      agent: `WF_Department_${category.charAt(0).toUpperCase() + category.slice(1)}`,
      icon: Cpu,
      desc: hasReports 
        ? `${complaint.agent_reports[0].findings?.[0]?.slice(0, 75)}...` 
        : `Domain analysis for ${category} sector`,
      time: hasReports ? 'Assessment Formulated' : (currentStep >= 3 ? 'Evaluating telemetry' : 'Queued'),
      status: currentStep >= 3 ? 'completed' : (currentStep === 2 ? 'processing' : 'pending'),
    },
    {
      num: 4,
      title: '4. City Command Agent',
      agent: 'WF_City_Command',
      icon: Network,
      desc: hasDecision 
        ? complaint.command_decision.priority_reason?.slice(0, 85) + '...'
        : 'Cross-agency prioritization & conflict resolution',
      time: hasDecision ? 'Decision Ready' : (currentStep >= 4 ? 'Consolidating' : 'Pending'),
      status: currentStep >= 4 ? 'completed' : (currentStep === 3 ? 'processing' : 'pending'),
    },
    {
      num: 5,
      title: '5. Unified Action & Monitoring',
      agent: 'Municipal Human Authority',
      icon: ShieldCheck,
      desc: status === 'resolved' 
        ? 'Resolution verified by municipal supervisor. Incident normalized.' 
        : 'Human authorization required for field crew dispatch.',
      time: status === 'resolved' ? 'Resolved' : 'Human Approval Required',
      status: status === 'resolved' ? 'completed' : (currentStep >= 4 ? 'awaiting_approval' : 'pending'),
    },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0B132B]/70 backdrop-blur-md p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800/80 gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide uppercase font-mono flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            Multi-Agent Execution Pipeline Flow
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time audit trail from citizen submission through n8n multi-agent coordination
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Agentic Mesh Sync Active
          </span>
        </div>
      </div>

      <div className="relative mt-6">
        {/* Connection Line */}
        <div className="hidden lg:block absolute top-7 left-8 right-8 h-0.5 bg-slate-800 -z-0" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isCompleted = stage.status === 'completed';
            const isProcessing = stage.status === 'processing';
            const isAwaiting = stage.status === 'awaiting_approval';
            const isRejected = stage.status === 'rejected';

            let borderClass = 'border-slate-800 bg-slate-900/60';
            let iconClass = 'bg-slate-800 text-slate-400 border-slate-700';

            if (isCompleted) {
              borderClass = 'border-emerald-500/40 bg-emerald-950/20';
              iconClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
            } else if (isProcessing) {
              borderClass = 'border-cyan-500/50 bg-cyan-950/20 shadow-[0_0_15px_rgba(0,240,255,0.15)]';
              iconClass = 'bg-cyan-500/20 text-cyan-400 border-cyan-500/60 animate-pulse';
            } else if (isAwaiting) {
              borderClass = 'border-amber-500/50 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]';
              iconClass = 'bg-amber-500/20 text-amber-400 border-amber-500/60 animate-bounce';
            } else if (isRejected) {
              borderClass = 'border-rose-500/40 bg-rose-950/20';
              iconClass = 'bg-rose-500/20 text-rose-400 border-rose-500/50';
            }

            return (
              <div
                key={stage.num}
                className={`flex flex-col justify-between rounded-lg border p-4 transition-all duration-200 ${borderClass}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${iconClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-400">
                      Step {stage.num}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-100 font-sans tracking-wide">
                    {stage.title}
                  </h4>
                  <p className="text-[11px] font-mono text-cyan-400/90 mt-0.5">
                    {stage.agent}
                  </p>
                  <p className="text-xs text-slate-300/80 mt-2 line-clamp-3 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {stage.time}
                  </span>
                  {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  {isProcessing && <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />}
                  {isAwaiting && <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
