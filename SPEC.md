# UrbanFlow AI — Multi-Agent Smart City System
## Team implementation specification for Antigravity coding agents and n8n

**Document purpose:** This is the controlling implementation specification for all four team members. Give the relevant member section, together with the Shared Contract, to that member's Antigravity coding agent.

**Critical instruction:** The coding agent must implement only what is explicitly specified here. It must not invent features, change the architecture, add agents, choose alternative technologies, redesign workflows, or silently fill gaps with assumptions. If a required detail is missing or contradictory, it must STOP and ask the human team member. It may inspect the existing repository and report what it finds, but it must not modify unrelated modules.

---

# 1. Project overview

**Project name:** UrbanFlow AI — Multi-Agent Intelligent City Management System

UrbanFlow AI is a demonstration smart-city system. Citizens submit civic complaints. A Complaint Agent classifies and validates each complaint. A central City Command Agent prioritizes and coordinates the response. Department agents provide domain-specific assessments and recommended actions. A dashboard displays complaints, agent findings, decisions, and status.

This is a **prototype**. Use mock/sample data unless a real data source is explicitly configured by the team. Do not claim that simulated sensor readings are live city data. Do not autonomously contact emergency services, dispatch vehicles, change traffic lights, control utilities, or take other real-world actions. Any operational action must be represented as a recommendation and require human approval.

## 1.1 Fixed architecture

Use only this architecture:

1. **Frontend:** React
2. **Styling:** Tailwind CSS
3. **Backend/API:** Python FastAPI
4. **Agent workflow orchestration:** n8n
5. **LLM provider:** Gemini API, accessed through configuration/environment variables
6. **Shared database:** Supabase (PostgreSQL)
7. **Version control:** One shared GitHub repository

Do not add another framework, database, agent platform, message broker, vector database, or external service unless the human team explicitly approves it.

## 1.2 Four-member ownership

| Member | Owns | Must deliver |
|---|---|---|
| Member 1 | City Command Agent | Command workflow, prioritization, agent coordination, consolidated decision |
| Member 2 | City Complaint Agent | Complaint intake, validation, classification, routing request, citizen status |
| Member 3 | Department Agents | Traffic, public safety, waste, environment, water, and energy specialist workflows |
| Member 4 | Dashboard, API integration, database | React dashboard, FastAPI integration, Supabase schema/migrations, end-to-end integration |

Each member must work only in their assigned area and shared contract files. Do not edit another member's module without explicit permission.

---

# 2. Mandatory rules for every coding agent

Paste these rules into every member's coding-agent session.

1. Read this document before writing or editing code.
2. First inspect the existing repository and report its current structure. Do not overwrite existing work.
3. Implement only the member's assigned scope.
4. Do not create extra agents, pages, endpoints, tables, workflows, features, or dependencies.
5. Do not change the fixed architecture or technology choices.
6. Do not invent API routes, field names, database columns, workflow names, credentials, or business rules. Use the contracts in this document.
7. If something needed for implementation is not specified, ask the human member before proceeding.
8. Do not create fake credentials or commit secrets. Use `.env.example` with placeholder names only.
9. Do not put API keys, service-role keys, passwords, or tokens in source code, browser code, workflow exports, screenshots, or Git.
10. Do not run destructive database operations, delete files, reset branches, overwrite another member's work, or change shared configuration without approval.
11. Do not make real-world external actions. Return recommendations for human review only.
12. Do not use real personal data. Use synthetic demo citizens, locations, complaints, and sensor data.
13. Do not claim an integration works unless it has been tested. Mark untested integrations clearly.
14. Write tests for the assigned module and run them before reporting completion.
15. At the end, report: files created/changed, workflow created/changed, tests run and results, configuration still needed, and anything blocked.
16. If a task is already implemented, inspect and verify it instead of creating a duplicate.
17. Keep changes small and within the assigned module. Do not refactor unrelated code.

**Required first response from the coding agent:**  
“I have read the UrbanFlow AI specification. I will inspect the repository, identify my assigned scope, and report any missing information before making changes. I will not add or invent features outside the specification.”

---

# 3. Shared workflow and data contracts

These contracts are shared by all members. Do not rename fields or change their types without agreement from all four members.

## 3.1 Canonical n8n workflow names

Use these exact names:

- `WF_City_Complaint`
- `WF_City_Command`
- `WF_Department_Traffic`
- `WF_Department_Safety`
- `WF_Department_Waste`
- `WF_Department_Environment`
- `WF_Department_Water`
- `WF_Department_Energy`
- `WF_Dashboard_Integration` (only if Member 4 needs a dedicated workflow; otherwise Member 4 integrates through FastAPI and Supabase)

Do not create similarly named duplicates. Each workflow must have a clear trigger, input validation, processing steps, error path, and structured output.

## 3.2 Common identifiers and enumerations

- `complaint_id`: UUID string
- `event_id`: UUID string
- `agent_run_id`: UUID string
- `created_at`, `updated_at`: ISO 8601 timestamp in UTC
- `latitude`, `longitude`: numeric values or `null`
- `severity`: one of `low`, `medium`, `high`, `critical`
- `status`: one of `submitted`, `under_review`, `assigned`, `in_progress`, `resolved`, `rejected`
- `department`: one of `traffic`, `safety`, `waste`, `environment`, `water`, `energy`, `general`
- `source`: one of `citizen_complaint`, `simulated_sensor`, `admin`

Never create new enum values without approval.

## 3.3 Complaint input contract

The complaint intake module must accept this JSON shape:

```json
{
  "citizen_name": "Demo Citizen",
  "contact": null,
  "description": "Garbage bins are overflowing near the market.",
  "category": null,
  "image_url": null,
  "latitude": 28.6139,
  "longitude": 77.2090,
  "location_text": "Demo Market, Sector 1",
  "source": "citizen_complaint"
}
```

Rules:
- `description` is required and must not be empty.
- `citizen_name`, `contact`, `category`, `image_url`, coordinates, and `location_text` may be null unless the UI requires a location for a specific demo.
- `source` must be one of the allowed values.
- Do not store uploaded image bytes in a database text column. Store a permitted URL/reference only.
- Do not infer a precise location from an image. Use user-provided location or mark it missing.
- Do not expose `contact` in public dashboard views.

## 3.4 Complaint record contract

After validation, the system stores and returns a complaint record:

```json
{
  "complaint_id": "UUID",
  "citizen_name": "Demo Citizen",
  "description": "Garbage bins are overflowing near the market.",
  "category": "waste",
  "severity": "medium",
  "status": "submitted",
  "assigned_department": "waste",
  "image_url": null,
  "latitude": 28.6139,
  "longitude": 77.2090,
  "location_text": "Demo Market, Sector 1",
  "source": "citizen_complaint",
  "created_at": "ISO-8601 UTC timestamp",
  "updated_at": "ISO-8601 UTC timestamp"
}
```

Use actual UUIDs and timestamps at runtime. The values above are examples, not fixed data.

## 3.5 Standard department-agent input

```json
{
  "event_id": "UUID",
  "complaint_id": "UUID or null",
  "source": "citizen_complaint",
  "department": "waste",
  "description": "Garbage bins are overflowing near the market.",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "location_text": "Demo Market, Sector 1"
  },
  "severity": "medium",
  "context": {}
}
```

## 3.6 Standard department-agent output

Every department agent must return this exact structure:

```json
{
  "agent": "waste",
  "event_id": "UUID",
  "complaint_id": "UUID or null",
  "issue": "Garbage overflow",
  "department": "waste",
  "severity": "medium",
  "findings": [
    "The report describes overflowing garbage bins."
  ],
  "recommendation": "Request inspection and schedule collection if verified.",
  "requires_human_approval": true,
  "status": "recommendation_ready",
  "confidence": 0.85,
  "created_at": "ISO-8601 UTC timestamp"
}
```

Rules:
- `confidence` must be a number from `0` to `1`.
- `findings` must be an array of strings.
- `recommendation` is advisory, not an instruction to execute a real-world action.
- `requires_human_approval` must be `true` for any operational recommendation.
- If information is insufficient, say so in `findings`; do not fabricate facts.

## 3.7 Command Agent output contract

```json
{
  "agent": "city_command",
  "event_id": "UUID",
  "complaint_id": "UUID or null",
  "overall_severity": "medium",
  "priority_reason": "The complaint reports a civic sanitation issue without a confirmed immediate threat.",
  "departments_involved": ["waste"],
  "agent_results": [],
  "consolidated_recommendations": [
    "Request human verification of the reported location.",
    "If verified, assign the complaint to the municipal waste team."
  ],
  "requires_human_approval": true,
  "status": "awaiting_human_review",
  "created_at": "ISO-8601 UTC timestamp"
}
```

The Command Agent must not invent department results. It must use received outputs and explicitly identify missing information.

---

# 4. Member 1 — City Command Agent

## 4.1 Objective

Build the central coordination workflow that receives validated complaints and department-agent results, determines priority, requests relevant department assessments, and returns one consolidated recommendation for human review.

## 4.2 Exact n8n workflow

**Workflow name:** `WF_City_Command`

**Trigger:** n8n Execute Sub-workflow Trigger. It receives a validated event from `WF_City_Complaint` or an approved internal event source.

**Required sequence:**

1. Receive the event payload.
2. Validate required fields and allowed enum values.
3. Create or retain `event_id` and `agent_run_id`.
4. Determine the relevant department using the supplied `category`/`department`. If ambiguous, set department to `general` and explain the ambiguity; do not guess.
5. Call only the relevant department workflow(s) through Execute Sub-workflow.
6. For cross-department cases, call only the departments clearly implicated by the supplied information.
7. Collect and validate department outputs against the standard output contract.
8. Consolidate findings, severity, and recommendations.
9. Set `requires_human_approval` to `true`.
10. Save the command result through the agreed backend/database integration.
11. Return the Command Agent output contract.

## 4.3 Priority rules

Use these rules exactly:

- `critical`: supplied information explicitly indicates an immediate threat to life or serious danger. Do not infer this solely from dramatic wording.
- `high`: significant public safety or infrastructure concern, but no confirmed immediate life-threatening situation.
- `medium`: service disruption or civic issue requiring timely attention.
- `low`: minor issue with no stated immediate risk.
- If evidence is insufficient, use `medium` and state that severity needs human verification.

The LLM may summarize and classify the supplied text, but it must not fabricate observations or claim that a sensor/CCTV source confirmed something unless that data is actually present.

## 4.4 Scope boundaries

Member 1 must not:
- Build the citizen complaint UI.
- Build the dashboard.
- Implement the internal logic of each department agent.
- Create additional agents.
- Dispatch emergency services or municipal teams.
- Change complaint records directly from `submitted` to `resolved`.

## 4.5 Acceptance criteria

- [ ] Workflow has the exact name `WF_City_Command`.
- [ ] Workflow validates its input.
- [ ] It calls only relevant department workflows.
- [ ] It handles a department workflow failure without fabricating a successful result.
- [ ] It returns the exact Command Agent output contract.
- [ ] It always requires human approval for operational recommendations.
- [ ] It has a tested single-department example.
- [ ] It has a tested cross-department example.
- [ ] It has a tested insufficient-information example.

---

# 5. Member 2 — City Complaint Agent

## 5.1 Objective

Build the citizen complaint intake and classification workflow. It accepts a complaint, validates it, categorizes it, creates a complaint record, and forwards a structured event to the City Command Agent.

## 5.2 Exact n8n workflow

**Workflow name:** `WF_City_Complaint`

**Trigger:** Webhook or an explicitly agreed FastAPI-to-n8n trigger. Use one trigger method consistently; ask the team if it has not been selected.

**Required sequence:**

1. Receive the complaint input contract.
2. Validate the required description and allowed source.
3. Normalize whitespace and reject an empty description.
4. Classify the complaint into exactly one allowed department:
   - `traffic`
   - `safety`
   - `waste`
   - `environment`
   - `water`
   - `energy`
   - `general`
5. Set severity using the shared priority rules. If uncertain, use `medium`.
6. Generate a UUID `complaint_id` if one has not already been created by the backend.
7. Save the complaint using the shared database contract.
8. Set initial status to `submitted`.
9. Forward the validated complaint/event to `WF_City_Command`.
10. Return the complaint ID, category, severity, and current status to the caller.

## 5.3 Citizen-facing status rules

Use only these statuses:

- `submitted`: complaint received and saved.
- `under_review`: complaint is being assessed.
- `assigned`: a department has been selected.
- `in_progress`: a human-authorized department action is underway.
- `resolved`: a human-authorized user has confirmed resolution.
- `rejected`: a human reviewer has rejected the complaint with a reason.

Do not automatically mark a complaint `in_progress` or `resolved` just because an AI agent produced a recommendation.

## 5.4 Scope boundaries

Member 2 must not:
- Build the City Command Agent's coordination logic.
- Implement department-specific analysis.
- Build the full administrator dashboard.
- Automatically contact authorities or emergency services.
- Invent citizen identity, contact details, or complaint location.

## 5.5 Acceptance criteria

- [ ] Workflow has the exact name `WF_City_Complaint`.
- [ ] Empty descriptions are rejected with a clear validation error.
- [ ] All seven allowed department categories are supported.
- [ ] A complaint is assigned a unique ID.
- [ ] The complaint is stored with status `submitted`.
- [ ] A valid event is forwarded to the Command Agent.
- [ ] The caller receives a structured response.
- [ ] Duplicate submissions are handled safely if an idempotency key is provided.
- [ ] A complaint without coordinates is accepted and marked as lacking coordinates.

---

# 6. Member 3 — Department Agents

## 6.1 Objective

Build the six specialist department workflows. Each workflow receives a standard department-agent input and returns the standard department-agent output. Agents analyze only their own domain.

## 6.2 Exact workflow names

Create exactly these six workflows:

1. `WF_Department_Traffic`
2. `WF_Department_Safety`
3. `WF_Department_Waste`
4. `WF_Department_Environment`
5. `WF_Department_Water`
6. `WF_Department_Energy`

Each workflow must use Execute Sub-workflow Trigger and return the common department-agent output contract.

## 6.3 Responsibilities

### Traffic Agent
- Identify traffic-related issues described in the input.
- Summarize reported congestion, road blockage, or traffic signal problems.
- Recommend human verification and possible traffic-management steps.
- Do not claim live traffic conditions without a configured live data source.

### Public Safety Agent
- Identify reported public-safety concerns.
- Highlight whether the supplied information explicitly indicates immediate danger.
- Recommend human review and appropriate escalation.
- Do not identify people, accuse individuals, or make unsupported claims from images.

### Waste Agent
- Identify garbage overflow, missed collection, or waste-disposal issues.
- Recommend inspection, collection planning, or sanitation review.
- Do not claim a bin sensor is reporting unless sensor data is supplied.

### Environment Agent
- Identify reported pollution, air-quality, noise, or environmental concerns.
- Summarize supplied AQI/weather/sensor values only.
- Do not invent AQI readings or weather conditions.

### Water Agent
- Identify water leakage, waterlogging, drainage, or supply issues.
- Recommend inspection and human verification.
- Do not claim a leak or blockage is sensor-confirmed unless data is supplied.

### Energy Agent
- Identify electricity outage, street-light, or energy-infrastructure concerns.
- Recommend inspection by authorized personnel.
- Do not operate or control electrical infrastructure.

## 6.4 Common implementation rules

- Every workflow accepts only its own `department` value.
- If a workflow receives the wrong department, return a structured validation error.
- Every output must conform to the shared department-agent output contract.
- Use the same Gemini configuration pattern across all six agents.
- Keep prompts focused on the relevant department.
- Use sample data only when the input explicitly indicates a simulation.
- No agent may perform a real-world action.
- All operational recommendations require human approval.

## 6.5 Scope boundaries

Member 3 must not:
- Build the City Command Agent.
- Build complaint intake or citizen-facing status logic.
- Build the dashboard.
- Create additional department workflows.
- Add unapproved live data integrations.

## 6.6 Acceptance criteria

- [ ] All six exact workflow names exist.
- [ ] Each workflow validates its department.
- [ ] Each workflow accepts the shared input contract.
- [ ] Each workflow returns the shared output contract.
- [ ] Each workflow handles missing information without fabrication.
- [ ] Each workflow sets `requires_human_approval` to `true`.
- [ ] One valid and one invalid-input test are run for every workflow.

---

# 7. Member 4 — Dashboard, Backend and Database

## 7.1 Objective

Build the shared data layer, FastAPI endpoints, and React dashboard. This member owns integration and presentation, not agent reasoning.

## 7.2 Database

Use Supabase PostgreSQL. Create only these tables unless the team approves an additional table:

### `complaints`

- `complaint_id` UUID primary key
- `citizen_name` text nullable
- `contact` text nullable
- `description` text not null
- `category` text
- `severity` text
- `status` text not null
- `assigned_department` text
- `image_url` text nullable
- `latitude` numeric nullable
- `longitude` numeric nullable
- `location_text` text nullable
- `source` text not null
- `created_at` timestamptz
- `updated_at` timestamptz

### `agent_reports`

- `agent_run_id` UUID primary key
- `event_id` UUID
- `complaint_id` UUID nullable
- `agent` text
- `department` text nullable
- `severity` text nullable
- `findings` JSONB
- `recommendation` text
- `requires_human_approval` boolean
- `status` text
- `confidence` numeric nullable
- `created_at` timestamptz

### `command_decisions`

- `event_id` UUID primary key
- `complaint_id` UUID nullable
- `overall_severity` text
- `priority_reason` text
- `departments_involved` JSONB
- `agent_results` JSONB
- `consolidated_recommendations` JSONB
- `requires_human_approval` boolean
- `status` text
- `created_at` timestamptz

Add appropriate constraints and indexes only where needed. Keep schema changes in version-controlled SQL migration files. Do not expose Supabase service-role credentials to the React frontend.

## 7.3 FastAPI responsibilities

Create only these API operations:

- `POST /api/complaints` — submit a complaint to the complaint workflow.
- `GET /api/complaints` — list complaints with optional filters for status, severity, and department.
- `GET /api/complaints/{complaint_id}` — fetch one complaint and its associated reports/decision.
- `GET /api/dashboard/summary` — return counts grouped by complaint status, severity, and department.
- `GET /api/health` — health check.

If the existing repository already has an agreed API prefix or route structure, report the conflict and ask before changing it.

FastAPI must validate request/response models. Never return private citizen contact information in public dashboard responses.

## 7.4 React dashboard responsibilities

Build only these views:

1. **Overview:** complaint totals, open/resolved counts, severity summary, department summary.
2. **Complaints:** searchable/filterable complaint list.
3. **Complaint detail:** description, location if provided, status history if available, agent findings, command recommendation.
4. **Agent activity:** latest department reports and command decisions.

Use synthetic demo records if no data exists. Clearly label simulated/demo data. Do not imply a map, chart, sensor feed, or status is live unless it is connected to a real configured source.

## 7.5 Human approval

Display AI recommendations as recommendations. Do not create an action button that dispatches a real team or controls infrastructure. If an approval UI is included, it must only record a human review decision in the application; it must not trigger external operational action.

## 7.6 Scope boundaries

Member 4 must not:
- Rewrite agent prompts or agent logic.
- Create extra agent workflows.
- change shared JSON contracts independently.
- expose credentials in frontend code.
- build real-world dispatch or infrastructure controls.

## 7.7 Acceptance criteria

- [ ] SQL migrations create the three agreed tables.
- [ ] FastAPI exposes the five agreed API operations.
- [ ] API validates incoming data and handles errors.
- [ ] React has the four agreed views.
- [ ] Dashboard displays stored data and labels simulated data.
- [ ] Contact details are not exposed in public views.
- [ ] Agent reports and command decisions are linked to complaints where applicable.
- [ ] The frontend uses backend APIs; it does not use privileged database credentials.
- [ ] The app works with an empty database and with sample records.

---

# 8. Integration agreement

## 8.1 Workflow communication

Use n8n Execute Sub-workflow / Execute Sub-workflow Trigger for workflow-to-workflow calls. Use the selected FastAPI-to-n8n trigger for frontend complaint submission. Do not introduce a second orchestration mechanism.

The human team must configure:
- n8n instance URL and credentials
- Gemini API key
- Supabase URL
- Supabase anon/public key where appropriate
- Supabase service-role key only on the trusted server side
- n8n webhook or workflow execution credentials

Keep secrets in environment variables or n8n credentials.

## 8.2 Environment variable names

Use these names consistently. Do not commit actual values.

```env
GEMINI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
N8N_BASE_URL=
N8N_API_KEY=
N8N_COMPLAINT_WEBHOOK_URL=
```

The frontend must never receive `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, or `N8N_API_KEY`.

## 8.3 Error handling

Every workflow and API must return a clear error object. Use this shape:

```json
{
  "success": false,
  "error_code": "VALIDATION_ERROR",
  "message": "The complaint description is required.",
  "event_id": null
}
```

Do not swallow errors or return fabricated successful results. Log technical details securely; do not expose secrets or stack traces to citizens.

## 8.4 Idempotency and duplicates

Where an incoming request has a stable request ID/idempotency key, use it to avoid creating duplicate complaints or duplicate agent reports. Do not invent a client-side key format; ask the team if one is required but not yet defined.

---

# 9. Shared repository structure

Use this structure unless the repository already has an established equivalent. If it does, report it and ask before restructuring.

```text
urbanflow-ai/
├── README.md
├── SPEC.md
├── .gitignore
├── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── services/
│   └── requirements.txt
├── workflows/
│   ├── WF_City_Complaint.json
│   ├── WF_City_Command.json
│   ├── WF_Department_Traffic.json
│   ├── WF_Department_Safety.json
│   ├── WF_Department_Waste.json
│   ├── WF_Department_Environment.json
│   ├── WF_Department_Water.json
│   └── WF_Department_Energy.json
├── database/
│   └── migrations/
├── tests/
│   ├── contract/
│   └── integration/
└── docs/
    ├── API_CONTRACT.md
    └── WORKFLOW_SETUP.md
```

Each member must only create or modify files within their ownership area, except for shared documentation or contracts that require team approval.

---

# 10. Team integration and handoff checklist

Before merging a member's work, require the following:

- [ ] Exact workflow/module names are used.
- [ ] Input and output match the shared JSON contracts.
- [ ] No unapproved features or dependencies were added.
- [ ] No credentials or personal data were committed.
- [ ] Error paths have been tested.
- [ ] The member has supplied sample input and actual output.
- [ ] Setup instructions are documented.
- [ ] The module has been tested independently.
- [ ] The member has listed any manual n8n/Supabase configuration still required.

## End-to-end demo scenario

Use this one scenario for integration testing:

**Citizen report:** “Garbage bins are overflowing near Demo Market, Sector 1.”

Expected flow:

1. Citizen submits the complaint through the app.
2. `WF_City_Complaint` validates it, classifies it as `waste`, assigns a complaint ID, saves it as `submitted`, and forwards it.
3. `WF_City_Command` receives the event and calls `WF_Department_Waste`.
4. `WF_Department_Waste` returns a structured assessment and a recommendation requiring human approval.
5. `WF_City_Command` stores and returns a consolidated decision with status `awaiting_human_review`.
6. Dashboard displays the complaint, Waste Agent findings, command recommendation, and approval-required indicator.
7. Complaint remains `submitted` or `under_review` until a human changes its status. It must not become `resolved` automatically.

Also test:
- A complaint with no coordinates.
- A complaint with an ambiguous category.
- A department workflow error.
- A complaint explicitly indicating a serious safety risk.
- An empty complaint description.

---

# 11. Copy-paste member instructions

Give each member the **Mandatory rules** in Section 2, the **Shared contracts** in Section 3, and only their own member section.

## Prompt for Member 1

“You are the coding agent for Member 1 of UrbanFlow AI. Read Sections 2, 3, 4, 8, and 10 of SPEC.md. Your only task is to implement `WF_City_Command` exactly as specified. Inspect the repository first. Do not create or edit the Complaint Agent, Department Agents, dashboard, database schema, or unrelated files. Do not invent nodes, fields, priorities, or actions. If a required detail is missing, stop and ask me. Return your workflow export, test inputs/outputs, and a list of remaining configuration steps.”

## Prompt for Member 2

“You are the coding agent for Member 2 of UrbanFlow AI. Read Sections 2, 3, 5, 8, and 10 of SPEC.md. Your only task is to implement `WF_City_Complaint` exactly as specified. Inspect the repository first. Do not create or edit the City Command Agent, Department Agents, dashboard, database schema, or unrelated files. Do not invent fields, categories, statuses, or routing rules. If a required detail is missing, stop and ask me. Return your workflow export, test inputs/outputs, and a list of remaining configuration steps.”

## Prompt for Member 3

“You are the coding agent for Member 3 of UrbanFlow AI. Read Sections 2, 3, 6, 8, and 10 of SPEC.md. Your only task is to implement the six specified Department Agent workflows and no others. Inspect the repository first. Do not create or edit the City Command Agent, Complaint Agent, dashboard, database schema, or unrelated files. Do not invent agents, data sources, fields, or real-world actions. If a required detail is missing, stop and ask me. Return all six workflow exports, test inputs/outputs for each, and a list of remaining configuration steps.”

## Prompt for Member 4

“You are the coding agent for Member 4 of UrbanFlow AI. Read Sections 2, 3, 7, 8, 9, and 10 of SPEC.md. Your only task is to implement the agreed Supabase migrations, FastAPI operations, and four React dashboard views. Inspect the repository first. Do not create or edit agent prompts or n8n agent workflows. Do not invent API routes, tables, columns, or features. Do not expose privileged credentials in the frontend. If a required detail is missing, stop and ask me. Return migration files, API tests, frontend implementation, setup instructions, and a list of remaining configuration steps.”

---

# 12. Final rule

**The specification is the source of truth.** The coding agent is an implementer, not the project architect. It must not decide what the project should become. If implementation requires a decision not covered here, it must pause and ask the assigned human member. Any change to shared contracts or architecture requires agreement from all four members before implementation.
