# Smart City Multi-Agent Architecture: 6 Departmental AI Agents

Production-ready implementation of the 6 specialized Departmental AI Agents for the municipal smart city architecture. Built for **n8n** with complete workflow JSONs, database schemas, prompt templates, mock API server, and automated test suite.

---

## 🏛️ Architecture Overview

The system mirrors the civic command hierarchy:
1. **Citizen Interface**: Citizens lodge complaints or view city advisories.
2. **City Complaint Agent**: Ingests, categorizes, and dispatches tickets to the appropriate department.
3. **6 Departmental AI Agents**:
   - 🚦 **Agent 3: Traffic Management Agent** (Congestion monitoring, alternative routes, signal timing)
   - 🛡️ **Agent 4: Public Safety Agent** (Hazards, school/hospital proximity scoring, emergency advisory)
   - 🗑️ **Agent 5: Waste Management Agent** (Photo vision inspection, overflow percentage, collection route)
   - 🍃 **Agent 6: Environmental Monitoring Agent** (Hourly AQI tracking, GRAP curbs, anti-smog guns)
   - 💧 **Agent 7: Water Management Agent** (Rainfall telemetry, drainage silt triage, dewatering pump deployment)
   - ⚡ **Agent 8: Energy Management Agent** (Power outages, dark road corridors, SCADA telemetry)
4. **City Command Agent**: Coordinates multi-agency response, deduplicates, and resolves conflicts.
5. **Unified Action & Monitoring System**: Issues work orders, tracks field units, and informs citizens.

---

## 📁 Repository Structure

```text
smart_city_ai_agents/
├── workflows/                                    # Ready-to-import n8n workflow JSONs
│   ├── 01_traffic_management_agent.json          # Agent 3: Traffic Management Agent
│   ├── 02_public_safety_agent.json              # Agent 4: Public Safety Agent
│   ├── 03_waste_management_agent.json              # Agent 5: Waste Management Agent
│   ├── 04_environmental_monitoring_agent.json   # Agent 6: Environmental Monitoring Agent
│   ├── 05_water_management_agent.json              # Agent 7: Water Management Agent
│   ├── 06_energy_management_agent.json             # Agent 8: Energy Management Agent
│   ├── city_command_mock_subworkflow.json        # Central City Command target sub-workflow
│   └── LANGCHAIN_N8N_AI_AGENT_TEMPLATE.json     # Native LangChain AI Agent sub-nodes template
├── database/                                     # Data Layer
│   ├── schema.sql                                # PostgreSQL / Supabase / SQLite schema
│   └── seed_data.sql                             # Realistic smart city seed complaints
├── prompts_and_schemas/                          # Prompts, Contracts & Guardrails
│   └── SYSTEM_PROMPTS_AND_SCHEMAS.md             # System prompts, JSON schemas, guardrails
├── test_payloads/                               # Sample inputs & test runners
│   ├── test_traffic.json                         # Sample road accident payload
│   ├── test_safety.json                          # Sample fallen pole near school payload
│   ├── test_waste.json                           # Sample overflowing dumpster payload
│   ├── test_environment.json                     # Sample high AQI telemetry payload
│   ├── test_water.json                           # Sample underpass waterlogging payload
│   ├── test_energy.json                          # Sample dark corridor outage payload
│   ├── run_all_tests.ps1                         # PowerShell test runner
│   └── run_all_tests.sh                          # Bash test runner
├── mock_server/                                  # Offline testing server
│   ├── package.json
│   └── server.js                                 # Zero-dependency Node.js mock API
└── docs/                                         # Technical documentation
    ├── ARCHITECTURE_OVERVIEW.md                  # System topology & operational matrix
    └── N8N_SETUP_AND_IMPORT_GUIDE.md             # Step-by-step import & config guide
```

---

## 🚀 Quick Start (Offline Testing in 2 Minutes)

### Step 1: Start the Mock API Server
```powershell
cd mock_server
node server.js
# Runs on http://localhost:5050 with mock Google Maps, AQI, Weather & SCADA APIs
```

### Step 2: Import into n8n
1. Open n8n (`http://localhost:5678`).
2. Go to **Workflows** -> **Import from File**.
3. Import `workflows/city_command_mock_subworkflow.json` first, then import the 6 departmental workflows:
   - `01_traffic_management_agent.json`
   - `02_public_safety_agent.json`
   - `03_waste_management_agent.json`
   - `04_environmental_monitoring_agent.json`
   - `05_water_management_agent.json`
   - `06_energy_management_agent.json`
4. Activate the workflows.

### Step 3: Run the Test Suite
```powershell
cd test_payloads
.\run_all_tests.ps1 -BaseUrl "http://localhost:5678/webhook"
```

All 6 departmental agents will process the complaints, invoke the necessary APIs and reasoning engines, formulate structured recommendations, and dispatch synchronized alerts to the City Command Agent.
