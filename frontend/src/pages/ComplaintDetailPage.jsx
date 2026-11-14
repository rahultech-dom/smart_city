import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Cpu, 
  Network, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText,
  User,
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import DepartmentBadge from '../components/DepartmentBadge';
import WorkflowPipeline from '../components/WorkflowPipeline';
import { updateComplaintStatus } from '../services/api';

export default function ComplaintDetailPage({
  complaint,
  onBack,
  onStatusUpdated,
}) {
  const [currentStatus, setCurrentStatus] = useState(complaint?.status || 'submitted');
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionNotes, setActionNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  if (!complaint) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-400 font-mono text-sm">Complaint record not found.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400"
        >
          Return to Complaints
        </button>
      </div>
    );
  }

  const reports = complaint.agent_reports || [];
  const decision = complaint.command_decision;

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    setActionSuccess('');
    try {
      await updateComplaintStatus(complaint.complaint_id, newStatus);
      setCurrentStatus(newStatus);
      setActionSuccess(`Status transitioned to ${newStatus.toUpperCase()} recorded by municipal authority.`);
      if (onStatusUpdated) {
        onStatusUpdated(complaint.complaint_id, newStatus);
      }
    } catch {
      //
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaint Management</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500">Complaint UUID:</span>
          <code className="text-xs font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {complaint.complaint_id}
          </code>
        </div>
      </div>

      {/* Primary Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B132B]/90 backdrop-blur-md p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <DepartmentBadge department={complaint.category} size="lg" />
            <SeverityBadge severity={complaint.severity} size="lg" />
            <StatusBadge status={currentStatus} size="lg" />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>
              Ingested: {complaint.created_at ? new Date(complaint.created_at).toUTCString() : 'Unknown'}
            </span>
          </div>
        </div>

        {/* Complaint Description */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed font-sans">
            "{complaint.description}"
          </h2>
        </div>

        {/* Geocoding & Ingestion Metadata */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Location:</span>
              <span className="truncate block max-w-xs font-semibold">
                {complaint.location_text || 'Lacking location text'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Cpu className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">GPS Coordinates:</span>
              <span>
                {complaint.latitude && complaint.longitude
                  ? `${complaint.latitude.toFixed(4)}, ${complaint.longitude.toFixed(4)}`
                  : 'Coordinates missing (per SPEC 3.3)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <User className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Citizen Ingestion Source:</span>
              <span className="capitalize">
                {complaint.source || 'citizen_complaint'} (Demo Citizen)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Multi-Agent Flow Pipeline */}
      <WorkflowPipeline complaint={{ ...complaint, status: currentStatus }} />

      {/* Two Column Section: Department Agent Findings vs City Command Decision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Departmental AI Agent Findings & Recommendation */}
        <div className="rounded-2xl border border-slate-800 bg-[#0B132B]/80 backdrop-blur-md p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                  Departmental AI Agent Assessment
                </h3>
                <p className="text-xs text-slate-400">
                  Specialized domain reasoning & sensor analysis
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
              WF_Department_{(complaint.category || 'General').toUpperCase()}
            </span>
          </div>

          {reports.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-slate-500">
              No specialized department findings attached yet. Pending triage.
            </div>
          ) : (
            reports.map((rep, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold">
                    Issue: {rep.issue || 'Domain Analysis'}
                  </span>
                  <span className="text-cyan-400 font-semibold">
                    Confidence: {Math.round((rep.confidence || 0.85) * 100)}%
                  </span>
                </div>

                {/* Findings List */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                    Agent Findings:
                  </h4>
                  <ul className="space-y-1.5">
                    {(rep.findings || []).map((finding, fIdx) => (
                      <li key={fIdx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-900">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Agent Recommendation */}
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4">
                  <h4 className="text-xs font-bold text-indigo-300 font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Specialist AI Recommendation:
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {rep.recommendation}
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-indigo-300/80 flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-indigo-400" />
                    <span>Requires Human Approval: YES</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* City Command Agent Decision */}
        <div className="rounded-2xl border border-slate-800 bg-[#0B132B]/80 backdrop-blur-md p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Network className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                  City Command Agent Decision
                </h3>
                <p className="text-xs text-slate-400">
                  Central coordination, priority evaluation & synthesis
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
              WF_City_Command
            </span>
          </div>

          {!decision ? (
            <div className="py-8 text-center text-xs font-mono text-slate-500">
              Awaiting consolidated command arbitration.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Overall Severity & Rationale */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Overall Evaluated Severity:</span>
                  <SeverityBadge severity={decision.overall_severity} />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-500 uppercase block mb-1">
                    Priority Evaluation Rationale:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {decision.priority_reason}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Departments Involved:</span>
                  <span className="text-cyan-400 capitalize">
                    {(decision.departments_involved || []).join(', ')}
                  </span>
                </div>
              </div>

              {/* Consolidated Recommendations */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                  Consolidated Multi-Agency Action Plan:
                </h4>
                <div className="space-y-2">
                  {(decision.consolidated_recommendations || []).map((rec, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-3 rounded-lg border border-cyan-500/30 bg-cyan-950/15 text-xs text-slate-200 flex items-start gap-2.5 leading-relaxed"
                    >
                      <ChevronRight className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Coordination Status:</span>
                <span className="text-amber-400 font-semibold uppercase">
                  {decision.status || 'AWAITING_HUMAN_REVIEW'}
                </span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Operational Human Approval & Triage Action Station */}
      <div className="rounded-2xl border border-amber-500/30 bg-[#0B132B]/90 backdrop-blur-md p-6 space-y-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-300 font-mono uppercase tracking-wide">
              Municipal Human Authority Review & Action Station
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              OPERATIONAL SAFETY NOTICE: AI recommendations are strictly advisory. Operational actions require authorized human approval. This prototype console records municipal decisions without triggering autonomous field dispatch.
            </p>
          </div>
        </div>

        {actionSuccess && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionSuccess}</span>
          </div>
        )}

        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Current Recorded Status:</span>
            <StatusBadge status={currentStatus} />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleStatusChange('under_review')}
              disabled={isUpdating || currentStatus === 'under_review'}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 hover:text-amber-300 text-xs font-mono disabled:opacity-40"
            >
              Move to Under Review
            </button>
            <button
              onClick={() => handleStatusChange('assigned')}
              disabled={isUpdating || currentStatus === 'assigned'}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-400 hover:text-indigo-300 text-xs font-mono disabled:opacity-40"
            >
              Assign to Field Team
            </button>
            <button
              onClick={() => handleStatusChange('in_progress')}
              disabled={isUpdating || currentStatus === 'in_progress'}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:text-cyan-300 text-xs font-mono disabled:opacity-40"
            >
              Authorize In-Progress
            </button>
            <button
              onClick={() => handleStatusChange('resolved')}
              disabled={isUpdating || currentStatus === 'resolved'}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold disabled:opacity-40"
            >
              Confirm Resolved
            </button>
            <button
              onClick={() => handleStatusChange('rejected')}
              disabled={isUpdating || currentStatus === 'rejected'}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-mono disabled:opacity-40"
            >
              Reject Complaint
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
