/**
 * Frontend Contract & Validation Test Suite
 * Tests frontend API integration contracts, mock telemetry shapes,
 * privacy requirements, and operational safety rules from SPEC.md.
 */

import assert from 'node:assert';
import { 
  INITIAL_COMPLAINTS, 
  DEPARTMENT_AGENTS_METADATA, 
  CITY_COMMAND_TELEMETRY 
} from '../src/services/mockData.js';
import { 
  fetchDashboardSummary, 
  fetchComplaints, 
  fetchComplaintDetail, 
  submitComplaint, 
  updateComplaintStatus 
} from '../src/services/api.js';

const ALLOWED_SEVERITIES = new Set(['low', 'medium', 'high', 'critical']);
const ALLOWED_STATUSES = new Set(['submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'rejected']);
const ALLOWED_DEPARTMENTS = new Set(['traffic', 'safety', 'waste', 'environment', 'water', 'energy', 'general']);

async function runTests() {
  console.log('🧪 Starting UrbanFlow AI Frontend Contract Tests...\n');

  // Test 1: Privacy rule - Citizen contact MUST NEVER be exposed in dashboard views
  console.log('Test 1: Privacy Compliance (Citizen contact must be null or omitted)');
  for (const c of INITIAL_COMPLAINTS) {
    assert.strictEqual(c.contact, null, `Contact must be null in complaint ${c.complaint_id}`);
  }
  const complaintList = await fetchComplaints({}, true);
  for (const c of complaintList.data) {
    assert.strictEqual(c.contact, null, `Fetched complaint ${c.complaint_id} must have null contact`);
  }
  console.log('  ✅ Passed: No private citizen contact information is exposed.\n');

  // Test 2: Enumeration compliance
  console.log('Test 2: Allowed Enumeration Compliance (SPEC.md Section 3.2)');
  for (const c of INITIAL_COMPLAINTS) {
    assert.ok(ALLOWED_DEPARTMENTS.has(c.category), `Category ${c.category} not in allowed departments`);
    assert.ok(ALLOWED_SEVERITIES.has(c.severity), `Severity ${c.severity} not in allowed severities`);
    assert.ok(ALLOWED_STATUSES.has(c.status), `Status ${c.status} not in allowed statuses`);
  }
  console.log('  ✅ Passed: All complaints adhere to canonical enum contracts.\n');

  // Test 3: Dashboard Summary Contract (SPEC.md Section 7.3 & 7.4)
  console.log('Test 3: Dashboard Summary Telemetry Contract');
  const summaryRes = await fetchDashboardSummary(true);
  assert.strictEqual(summaryRes.success, true);
  const s = summaryRes.data;
  assert.ok(typeof s.total_complaints === 'number', 'total_complaints must be a number');
  assert.ok(typeof s.open_complaints === 'number', 'open_complaints must be a number');
  assert.ok(typeof s.resolved_complaints === 'number', 'resolved_complaints must be a number');
  assert.ok(typeof s.critical_high_complaints === 'number', 'critical_high_complaints must be a number');
  
  // Department breakdown checks
  for (const dept of ['traffic', 'safety', 'waste', 'environment', 'water', 'energy']) {
    assert.ok(typeof s.by_department[dept] === 'number', `by_department must include ${dept}`);
  }
  console.log('  ✅ Passed: Dashboard summary adheres to expected schema.\n');

  // Test 4: Department AI Agents (All 6 canonical agents present)
  console.log('Test 4: 6 Specialized Departmental AI Agents Verification');
  assert.strictEqual(DEPARTMENT_AGENTS_METADATA.length, 6, 'Must have exactly 6 departmental agents');
  const expectedDepts = ['traffic', 'safety', 'waste', 'environment', 'water', 'energy'];
  const agentDepts = DEPARTMENT_AGENTS_METADATA.map(a => a.department);
  for (const exp of expectedDepts) {
    assert.ok(agentDepts.includes(exp), `Agent for department ${exp} must exist`);
  }
  for (const a of DEPARTMENT_AGENTS_METADATA) {
    assert.ok(a.workflowName.startsWith('WF_Department_'), `Workflow name must be canonical: ${a.workflowName}`);
    assert.ok(a.activeEvent.requires_human_approval === true, 'All agent recommendations must require human approval');
  }
  console.log('  ✅ Passed: All 6 Departmental AI Agents configured with required human approval guardrail.\n');

  // Test 5: City Command Agent Telemetry
  console.log('Test 5: Central City Command Agent Coordination Telemetry');
  assert.strictEqual(CITY_COMMAND_TELEMETRY.workflowName, 'WF_City_Command');
  assert.ok(CITY_COMMAND_TELEMETRY.latestCoordinationEvent.departments.length >= 2, 'Must support cross-agency coordination');
  console.log('  ✅ Passed: City Command Agent coordination verified.\n');

  // Test 6: Complaint Submission (POST /api/complaints simulation)
  console.log('Test 6: Complaint Ingestion Contract');
  const newPayload = {
    description: 'High voltage wire sparking on street near shopping center',
    location_text: 'Sector 5 Market',
    latitude: 28.6139,
    longitude: 77.2090
  };
  const submitRes = await submitComplaint(newPayload, true);
  assert.strictEqual(submitRes.success, true);
  assert.ok(submitRes.data.complaint_id, 'Must return assigned complaint_id');
  assert.strictEqual(submitRes.data.status, 'submitted', 'Initial status must be submitted');
  console.log(`  ✅ Passed: Ingested complaint #${submitRes.data.complaint_id.slice(0, 8)} with status "submitted".\n`);

  // Test 7: Human in the loop status transition
  console.log('Test 7: Operational Safety & Human Approval Status Transition');
  const detailRes = await fetchComplaintDetail(submitRes.data.complaint_id, true);
  assert.strictEqual(detailRes.success, true);
  
  // Transition to in_progress
  await updateComplaintStatus(submitRes.data.complaint_id, 'in_progress');
  const updatedDetail = await fetchComplaintDetail(submitRes.data.complaint_id, true);
  assert.strictEqual(updatedDetail.data.status, 'in_progress');
  console.log('  ✅ Passed: Human review action transitioned status safely without external execution.\n');

  console.log('🎉 ALL 7 FRONTEND CONTRACT TESTS PASSED PERFECTLY!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
