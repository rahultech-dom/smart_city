# n8n Setup and Import Guide

This guide details how to import and run the **6 Departmental AI Agent Workflows** in your n8n workspace (Cloud, Docker, or Desktop).

---

## 1. Quick Start with the Mock API Server

The project includes a zero-dependency mock API server that simulates Google Maps, OpenWeather, CPCB AQI, SCADA Electricity Feeder, and City Command webhooks so you can test all workflows immediately without external API keys.

To run the mock server:
```powershell
# Open terminal in the mock_server folder
cd C:\Users\RAHUL\.gemini\antigravity\scratch\smart_city_ai_agents\mock_server
node server.js
```
The mock server starts on `http://localhost:5050`.

---

## 2. Importing Workflows into n8n

Follow these steps for each JSON file located in `workflows/`:

1. Open your n8n instance in your browser (`http://localhost:5678` or your n8n Cloud URL).
2. Click **Workflows** in the left navigation sidebar.
3. In the top right corner, click the **...** (three dots) menu and select **Import from File...** (or press `Ctrl + O` / `Cmd + O`).
4. Select the desired workflow JSON:
   - `city_command_mock_subworkflow.json` (Import first so sub-workflow references resolve)
   - `01_traffic_management_agent.json`
   - `02_public_safety_agent.json`
   - `03_waste_management_agent.json`
   - `04_environmental_monitoring_agent.json`
   - `05_water_management_agent.json`
   - `06_energy_management_agent.json`
5. Click **Save** and toggle the workflow from **Inactive** to **Active** (in the top right corner).

---

## 3. Webhook Endpoints Reference

Once activated, each departmental agent is exposed on its dedicated webhook path:

| Workflow | Webhook Path | Method | Sample Payload |
|---|---|---|---|
| **Traffic Management** | `/webhook/traffic-agent` | `POST` | `test_payloads/test_traffic.json` |
| **Public Safety** | `/webhook/public-safety-agent` | `POST` | `test_payloads/test_safety.json` |
| **Waste Management** | `/webhook/waste-agent` | `POST` | `test_payloads/test_waste.json` |
| **Environmental Monitoring** | `/webhook/environment-agent` | `POST` | `test_payloads/test_environment.json` |
| **Water Management** | `/webhook/water-agent` | `POST` | `test_payloads/test_water.json` |
| **Energy Management** | `/webhook/energy-agent` | `POST` | `test_payloads/test_energy.json` |

> **Note for Testing**: When testing inside the n8n canvas using "Listen for Test Event", replace `/webhook/` with `/webhook-test/`.

---

## 4. Running the Automated Test Suite

To test all 6 workflows simultaneously:

### On Windows (PowerShell):
```powershell
cd C:\Users\RAHUL\.gemini\antigravity\scratch\smart_city_ai_agents\test_payloads
.\run_all_tests.ps1 -BaseUrl "http://localhost:5678/webhook"
```

### On Linux / macOS (Bash):
```bash
cd test_payloads
chmod +x run_all_tests.sh
./run_all_tests.sh "http://localhost:5678/webhook"
```

---

## 5. Connecting Real Production APIs (Optional)

When moving from local testing to production:

### A. Google Maps API
In `01_traffic_management_agent` and `03_waste_management_agent`:
- Replace `http://localhost:5050/api/v1/maps/traffic` with:
  `https://routes.googleapis.com/directions/v2:computeRoutes`
- Add Header: `X-Goog-Api-Key: YOUR_GOOGLE_MAPS_KEY`

### B. OpenWeather / Open-Meteo API
In `04_environmental_monitoring_agent` and `05_water_management_agent`:
- Replace with: `https://air-quality-api.open-meteo.com/v1/air-quality?latitude={{ $json.lat }}&longitude={{ $json.lng }}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone`

### C. Live Vision Model (OpenAI GPT-4o or Gemini Flash)
In `03_waste_management_agent`:
- Replace node `Vision AI: Analyze Photo` with an OpenAI or Google Gemini node passing the photo URL or binary file buffer with the prompt:
  *"Analyze this image for municipal waste overflow, estimate fill percentage (0-100), classify debris (plastic, organic, debris), and report health hazards."*

### D. Native LangChain AI Sub-nodes
Refer to `workflows/LANGCHAIN_N8N_AI_AGENT_TEMPLATE.json` for wiring `@n8n/n8n-nodes-langchain.agent` with OpenAI or Gemini Chat Models and Structured Output Parsers.
