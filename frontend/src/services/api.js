/**
 * UrbanFlow AI — API Service Layer
 * Fully integrates with Python FastAPI endpoints specified in SPEC.md Section 7.3:
 * - GET /api/health
 * - GET /api/dashboard/summary
 * - GET /api/complaints
 * - GET /api/complaints/{complaint_id}
 * - POST /api/complaints
 *
 * Implements resilient fallback to synthetic demo data when backend is unreachable.
 */

import { INITIAL_COMPLAINTS, DEPARTMENT_AGENTS_METADATA, CITY_COMMAND_TELEMETRY } from './mockData.js';

const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:8000';

// In-memory demo store initialized with canonical mock data
let localDemoComplaints = [...INITIAL_COMPLAINTS];

/**
 * Health Check: GET /api/health
 */
export async function checkApiHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${BASE_URL}/api/health`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { connected: true, data, error: null };
    }
    return { connected: false, data: null, error: `HTTP ${res.status}` };
  } catch (err) {
    return { connected: false, data: null, error: err.message };
  }
}

/**
 * Dashboard Summary: GET /api/dashboard/summary
 */
export async function fetchDashboardSummary(forceDemo = false) {
  if (!forceDemo) {
    try {
      const res = await fetch(`${BASE_URL}/api/dashboard/summary`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, isDemo: false, data };
      }
    } catch {
      // Backend unavailable; fallback gracefully to simulated calculation
    }
  }

  // Generate synthetic summary computed from current local demo complaints
  const complaints = localDemoComplaints;
  const total = complaints.length;
  const open = complaints.filter(c => ['submitted', 'under_review', 'assigned', 'in_progress'].includes(c.status)).length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  const criticalHigh = complaints.filter(c => ['critical', 'high'].includes(c.severity)).length;

  const byDepartment = {
    traffic: complaints.filter(c => c.category === 'traffic').length,
    safety: complaints.filter(c => c.category === 'safety').length,
    waste: complaints.filter(c => c.category === 'waste').length,
    environment: complaints.filter(c => c.category === 'environment').length,
    water: complaints.filter(c => c.category === 'water').length,
    energy: complaints.filter(c => c.category === 'energy').length,
    general: complaints.filter(c => c.category === 'general').length,
  };

  const byStatus = {
    submitted: complaints.filter(c => c.status === 'submitted').length,
    under_review: complaints.filter(c => c.status === 'under_review').length,
    assigned: complaints.filter(c => c.status === 'assigned').length,
    in_progress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    rejected: complaints.filter(c => c.status === 'rejected').length,
  };

  const bySeverity = {
    critical: complaints.filter(c => c.severity === 'critical').length,
    high: complaints.filter(c => c.severity === 'high').length,
    medium: complaints.filter(c => c.severity === 'medium').length,
    low: complaints.filter(c => c.severity === 'low').length,
  };

  return {
    success: true,
    isDemo: true,
    data: {
      total_complaints: total,
      open_complaints: open,
      resolved_complaints: resolved,
      critical_high_complaints: criticalHigh,
      by_department: byDepartment,
      by_status: byStatus,
      by_severity: bySeverity,
      recent_complaints: complaints.slice(0, 5),
      department_agents: DEPARTMENT_AGENTS_METADATA,
      city_command: CITY_COMMAND_TELEMETRY
    }
  };
}

/**
 * List Complaints: GET /api/complaints
 * Filters: status, severity, department
 */
export async function fetchComplaints(filters = {}, forceDemo = false) {
  const { status, severity, department } = filters;
  
  if (!forceDemo) {
    try {
      const params = new URLSearchParams();
      if (status && status !== 'all') params.append('status', status);
      if (severity && severity !== 'all') params.append('severity', severity);
      if (department && department !== 'all') params.append('department', department);

      const url = `${BASE_URL}/api/complaints${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      
      if (res.ok) {
        const raw = await res.json();
        const list = Array.isArray(raw) ? raw : (raw.complaints || []);
        // Sanitize: never expose private citizen contact in dashboard views (SPEC.md 3.3)
        const sanitized = list.map(c => ({ ...c, contact: null }));
        return { success: true, isDemo: false, data: sanitized };
      }
    } catch {
      // Fallback to local demo data
    }
  }

  // Filter local demo complaints
  let filtered = [...localDemoComplaints];
  if (status && status !== 'all') {
    filtered = filtered.filter(c => c.status === status);
  }
  if (severity && severity !== 'all') {
    filtered = filtered.filter(c => c.severity === severity);
  }
  if (department && department !== 'all') {
    filtered = filtered.filter(c => c.category === department);
  }

  // Sanitize: ensure contact is null per contract
  const sanitized = filtered.map(c => ({ ...c, contact: null }));
  return { success: true, isDemo: true, data: sanitized };
}

/**
 * Single Complaint Detail: GET /api/complaints/{complaint_id}
 */
export async function fetchComplaintDetail(complaintId, forceDemo = false) {
  if (!forceDemo) {
    try {
      const res = await fetch(`${BASE_URL}/api/complaints/${encodeURIComponent(complaintId)}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const raw = await res.json();
        const data = raw.complaint ? raw.complaint : raw;
        // Strip contact details
        data.contact = null;
        return { success: true, isDemo: false, data };
      }
    } catch {
      // Fallback
    }
  }

  const found = localDemoComplaints.find(c => c.complaint_id === complaintId);
  if (found) {
    return { success: true, isDemo: true, data: { ...found, contact: null } };
  }
  return { success: false, isDemo: true, error: 'Complaint not found.' };
}

/**
 * Submit New Complaint: POST /api/complaints
 * Payload shape: SPEC.md Section 3.3
 */
export async function submitComplaint(payload, forceDemo = false) {
  const requestBody = {
    citizen_name: payload.citizen_name || "Demo Citizen",
    contact: null, // do not transmit unneeded citizen private contact
    description: payload.description.trim(),
    category: payload.category || null,
    image_url: payload.image_url || null,
    latitude: payload.latitude !== undefined && payload.latitude !== '' ? parseFloat(payload.latitude) : null,
    longitude: payload.longitude !== undefined && payload.longitude !== '' ? parseFloat(payload.longitude) : null,
    location_text: payload.location_text || null,
    source: payload.source || "citizen_complaint"
  };

  if (!forceDemo) {
    try {
      const res = await fetch(`${BASE_URL}/api/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, isDemo: false, data };
      }
    } catch {
      // Fallback to local demo ingestion
    }
  }

  // Fallback demo simulation matching City Complaint Agent classification logic
  const newId = `demo-${Date.now()}`;
  const now = new Date().toISOString();
  
  // Intelligent classification fallback
  const category = payload.category || detectCategoryFromText(payload.description);
  const severity = payload.severity || detectSeverityFromText(payload.description);

  const newRecord = {
    complaint_id: newId,
    citizen_name: requestBody.citizen_name,
    contact: null,
    description: requestBody.description,
    category: category,
    severity: severity,
    status: "submitted",
    assigned_department: category,
    image_url: null,
    latitude: requestBody.latitude,
    longitude: requestBody.longitude,
    location_text: requestBody.location_text || (requestBody.latitude ? `${requestBody.latitude}, ${requestBody.longitude}` : "Location unprovided"),
    source: requestBody.source,
    created_at: now,
    updated_at: now,
    agent_reports: [
      {
        agent: category,
        event_id: `evt-${Date.now()}`,
        complaint_id: newId,
        issue: `${category.toUpperCase()} Assessment from Citizen Intake`,
        department: category,
        severity: severity,
        findings: [
          `Classified as ${category.toUpperCase()} with 96.4% confidence by City Complaint Agent NLP model.`,
          `Report describes: "${requestBody.description.slice(0, 80)}..."`,
          requestBody.latitude ? "Geographical coordinates verified within municipal grid." : "Notice: Incident reported without explicit GPS coordinates; requiring human location verification."
        ],
        recommendation: `Schedule human inspection and assess required departmental resource allocation for ${category}.`,
        requires_human_approval: true,
        status: "recommendation_ready",
        confidence: 0.94,
        created_at: now
      }
    ],
    command_decision: {
      agent: "city_command",
      event_id: `cmd-dec-${Date.now()}`,
      complaint_id: newId,
      overall_severity: severity,
      priority_reason: `Evaluated priority as ${severity.toUpperCase()} under municipal response criteria.`,
      departments_involved: [category],
      agent_results: [],
      consolidated_recommendations: [
        "Request human verification of the reported location.",
        `[${category.toUpperCase()}] Department assessment complete; ready for human authority review.`
      ],
      requires_human_approval: true,
      status: "awaiting_human_review",
      created_at: now
    }
  };

  localDemoComplaints.unshift(newRecord);
  return {
    success: true,
    isDemo: true,
    data: {
      success: true,
      complaint_id: newId,
      category: category,
      assigned_department: category,
      severity: severity,
      status: "submitted",
      created_at: now,
      message: "Complaint simulated and processed by City Complaint Agent successfully."
    }
  };
}

/**
 * Safe Prototype Status Transition (Human Approval Simulation)
 * In accordance with Section 8: All operational actions require human approval.
 */
export async function updateComplaintStatus(complaintId, newStatus) {
  localDemoComplaints = localDemoComplaints.map(c => {
    if (c.complaint_id === complaintId) {
      return {
        ...c,
        status: newStatus,
        updated_at: new Date().toISOString()
      };
    }
    return c;
  });
  return { success: true };
}

// Helpers for fallback classification
function detectCategoryFromText(text) {
  const lower = text.toLowerCase();
  if (/fire|hazard|danger|shock|threat|collapse|violent|police/i.test(lower)) return 'safety';
  if (/traffic|jam|congestion|light|signal|gridlock|car|accident/i.test(lower)) return 'traffic';
  if (/water|leak|flood|drain|drainage|inundation|pipe/i.test(lower)) return 'water';
  if (/garbage|trash|bin|waste|dump|litter|sanitation/i.test(lower)) return 'waste';
  if (/power|electric|blackout|outage|light|pole|feeder|volt/i.test(lower)) return 'energy';
  if (/smoke|aqi|air|pollution|smog|dust|odor/i.test(lower)) return 'environment';
  return 'general';
}

function detectSeverityFromText(text) {
  const lower = text.toLowerCase();
  if (/immediate threat|life threat|active fire|collapse|electrocution|explosion/i.test(lower)) return 'critical';
  if (/severe|massive|major|urgent|broken|blocked road|jam|dark/i.test(lower)) return 'high';
  if (/moderate|overflow|repair|pothole|delayed/i.test(lower)) return 'medium';
  return 'low';
}
