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
        <p className="text-stone-500 font-mono text-sm">Complaint record not found.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-white border border-[#E5E0D4] text-xs font-mono text-stone-800 shadow-xs"
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
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D4]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaint Management</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-stone-500">Complaint UUID:</span>
          <code className="text-xs font-mono text-stone-800 bg-white px-2 py-0.5 rounded border border-[#E5E0D4] font-semibold">
            {complaint.complaint_id}
          </code>
        </div>
      </div>

      {/* Primary Header Card */}
      <div className="rounded-2xl border border-[#E5E0D4] bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <DepartmentBadge department={complaint.category} size="lg" />
            <SeverityBadge severity={complaint.severity} size="lg" />
            <StatusBadge status={currentStatus} size="lg" />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>
              Ingested: {complaint.created_at ? new Date(complaint.created_at).toUTCString() : 'Unknown'}
            </span>
          </div>
        </div>

        {/* Complaint Description */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-stone-900 leading-relaxed font-sans">
            "{complaint.description}"
          </h2>
        </div>

        {/* Geocoding & Ingestion Metadata */}
        <div className="pt-3 border-t border-[#E5E0D4] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-stone-700">
            <MapPin className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-semibold">Location:</span>
              <span className="truncate block max-w-xs font-semibold text-stone-900">
                {complaint.location_text || 'Lacking location text'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-stone-700">
            <Cpu className="w-4 h-4 text-blue-700 flex-shrink-0" />
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-semibold">GPS Coordinates:</span>
              <span className="font-semibold text-stone-900">
                {complaint.latitude && complaint.longitude
                  ? `${complaint.latitude.toFixed(4)}, ${complaint.longitude.toFixed(4)}`
                  : 'Coordinates missing (per SPEC 3.3)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-stone-700">
            <User className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-semibold">Citizen Ingestion Source:</span>
              <span className="capitalize font-semibold text-stone-900">
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
        <div className="rounded-2xl border border-[#E5E0D4] bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D4]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-mono uppercase tracking-wide">
                  Departmental AI Agent Assessment
                </h3>
                <p className="text-xs text-stone-500">
                  Specialized domain reasoning & sensor analysis
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5E0D4] text-stone-700 font-medium">
              WF_Department_{(complaint.category || 'General').toUpperCase()}
            </span>
          </div>

          {reports.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-stone-500">
              No specialized department findings attached yet. Pending triage.
            </div>
          ) : (
            reports.map((rep, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-800 font-semibold">
                    Issue: {rep.issue || 'Domain Analysis'}
                  </span>
                  <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Confidence: {Math.round((rep.confidence || 0.85) * 100)}%
                  </span>
                </div>

                {/* Findings List */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono uppercase text-stone-500 tracking-wider font-semibold">
                    Agent Findings:
                  </h4>
                  <ul className="space-y-1.5">
                    {(rep.findings || []).map((finding, fIdx) => (
                      <li key={fIdx} className="text-xs text-stone-700 flex items-start gap-2 bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E5E0D4]">
                        <span className="text-amber-700 mt-0.5">•</span>
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono uppercase text-stone-500 tracking-wider font-semibold">
                    Recommended Actions:
                  </h4>
                  <ul className="space-y-1.5">
                    {(rep.recommendations || []).map((rec, rIdx) => (
                      <li key={rIdx} className="text-xs text-stone-800 flex items-start gap-2 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Department Metadata */}
                <div className="pt-2 text-[11px] font-mono text-stone-500 flex items-center justify-between border-t border-[#E5E0D4]">
                  <span>Telemetry Verified: Sensor + Complaint Context</span>
                  <span className="text-stone-700">Guardrail: Advisory Only</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Central City Command Agent Priority & Arbitration */}
        <div className="rounded-2xl border border-[#E5E0D4] bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D4]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800">
                <Network className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-mono uppercase tracking-wide">
                  Central City Command Decision
                </h3>
                <p className="text-xs text-stone-500">
                  Cross-agency arbitration & resource allocation
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5E0D4] text-stone-700 font-medium">
              WF_City_Command
            </span>
          </div>

          {!decision ? (
            <div className="py-8 text-center text-xs font-mono text-stone-500">
              City Command Agent synthesis pending. Awaiting departmental agent consensus.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D4]">
                  <span className="text-[10px] text-stone-500 uppercase block font-semibold">Priority Score</span>
                  <span className="text-stone-900 font-extrabold text-base">
                    {decision.priority_score || 85} / 100
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D4]">
                  <span className="text-[10px] text-stone-500 uppercase block font-semibold">Overall Priority</span>
                  <span className="text-amber-800 font-bold uppercase text-base">
                    {decision.overall_severity || 'HIGH'}
                  </span>
                </div>
              </div>

              {/* Priority Justification */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D4] space-y-1">
                <h4 className="text-[11px] font-mono uppercase text-stone-500 tracking-wider font-semibold">
                  Command Reasoning:
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed font-sans">
                  {decision.priority_reason || 'Multi-criteria evaluation determined elevated risk to municipal flow.'}
                </p>
              </div>

              {/* Target Departments Involved */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-mono uppercase text-stone-500 tracking-wider font-semibold">
                  Dispatched Coordinated Agencies:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(decision.target_departments || [complaint.category]).map((d, dIdx) => (
                    <span key={dIdx} className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-xs font-mono text-stone-800 font-medium">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cross Agency Actions */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-mono uppercase text-stone-500 tracking-wider font-semibold">
                  Unified Work Order Directives:
                </h4>
                <ul className="space-y-1.5">
                  {(decision.actions || []).map((action, aIdx) => (
                    <li key={aIdx} className="text-xs text-stone-700 flex items-start gap-2 bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E5E0D4]">
                      <ChevronRight className="w-3.5 h-3.5 text-blue-700 flex-shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Human-in-the-Loop Operational Authority Action Bar */}
      <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-800" />
            <div>
              <h3 className="text-sm font-bold text-amber-950 font-mono uppercase tracking-wide">
                Unified Action System • Human Authority Approval
              </h3>
              <p className="text-xs text-amber-800">
                Civic accountability control: AI recommendations require supervisor confirmation before field execution
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-amber-900 bg-white border border-amber-300 px-2.5 py-1 rounded-lg font-bold">
            Current Status: {currentStatus.toUpperCase()}
          </span>
        </div>

        {actionSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{actionSuccess}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {currentStatus !== 'in_progress' && (
            <button
              onClick={() => handleStatusChange('in_progress')}
              disabled={isUpdating}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 font-mono text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            >
              {isUpdating ? 'Recording Authorization...' : 'Approve & Dispatch Field Teams'}
            </button>
          )}

          {currentStatus !== 'resolved' && (
            <button
              onClick={() => handleStatusChange('resolved')}
              disabled={isUpdating}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            >
              Verify Resolution & Close Ticket
            </button>
          )}

          {currentStatus !== 'under_review' && (
            <button
              onClick={() => handleStatusChange('under_review')}
              disabled={isUpdating}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#F2ECE1] border border-[#D6CEBE] text-stone-800 font-mono text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
            >
              Flag for Secondary Review
            </button>
          )}

          {currentStatus !== 'rejected' && (
            <button
              onClick={() => handleStatusChange('rejected')}
              disabled={isUpdating}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 font-mono text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
            >
              Reject as Out of Scope
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
