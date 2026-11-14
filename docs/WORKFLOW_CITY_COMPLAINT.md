# UrbanFlow AI — n8n Workflow Setup Guide

This guide details how to import, configure, and test `WF_City_Complaint` in n8n.

## 1. Overview of `WF_City_Complaint`

- **Workflow Name:** `WF_City_Complaint`
- **Owner:** Member 2 (City Complaint Agent)
- **Role:** Handles civic complaint intake, validates input, categorizes into one of 7 municipal departments, assigns severity based on shared priority rules, persists to Supabase, forwards the event to `WF_City_Command`, and responds to the citizen.

---

## 2. Environment Variables Configuration

In your n8n environment (or `.env` file), configure the following variables:

```env
# Gemini API Key (for LLM categorization & enrichment)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Credentials (PostgreSQL data layer)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# n8n Orchestration
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=your_n8n_api_key
N8N_COMPLAINT_WEBHOOK_URL=http://localhost:5678/webhook/complaint-intake

# Sub-workflow reference
WF_CITY_COMMAND_ID=WF_City_Command
```

---

## 3. How to Import into n8n

1. Open your n8n web interface (typically `http://localhost:5678`).
2. Go to **Workflows** in the left sidebar.
3. Click the **...** (three dots) menu in the top right and select **Import from File**.
4. Select `workflows/WF_City_Complaint.json` from this repository.
5. Once imported, verify the node sequence:
   - `Webhook Intake` / `Sub-workflow Trigger`
   - `Validate & Normalize Input`
   - `Is Input Valid?`
     - False -> `Reject Invalid Input` (HTTP 400)
     - True -> `Classify & Assess Severity`
   - `Format Complaint Record`
   - `Save to Supabase`
   - `Forward to City Command Agent` (`WF_City_Command`)
   - `Respond to Citizen Caller` (HTTP 201)
6. Click **Save** and toggle the workflow to **Active**.

---

## 4. Webhook URL

- **Production URL:** `http://<n8n-host>:5678/webhook/complaint-intake`
- **Test URL:** `http://<n8n-host>:5678/webhook-test/complaint-intake`
- **HTTP Method:** `POST`
- **Content-Type:** `application/json`

---

## 5. End-to-End Integration Testing

### Test 1: Standard Valid Complaint (Waste Department)
```bash
curl -X POST http://localhost:5678/webhook/complaint-intake \
  -H "Content-Type: application/json" \
  -d '{
    "citizen_name": "Demo Citizen",
    "description": "Garbage bins are overflowing near Demo Market, Sector 1.",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "location_text": "Demo Market, Sector 1",
    "source": "citizen_complaint"
  }'
```
**Expected Response:** `HTTP 201 Created`
```json
{
  "success": true,
  "complaint_id": "...",
  "category": "waste",
  "assigned_department": "waste",
  "severity": "medium",
  "status": "submitted",
  "message": "Complaint received and classified successfully."
}
```

### Test 2: Validation Failure (Empty Description)
```bash
curl -X POST http://localhost:5678/webhook/complaint-intake \
  -H "Content-Type: application/json" \
  -d '{
    "citizen_name": "Demo Citizen",
    "description": "   ",
    "source": "citizen_complaint"
  }'
```
**Expected Response:** `HTTP 400 Bad Request`
```json
{
  "success": false,
  "error_code": "VALIDATION_ERROR",
  "message": "The complaint description cannot be empty.",
  "event_id": null
}
```

### Test 3: Complaint Without Coordinates
```bash
curl -X POST http://localhost:5678/webhook/complaint-intake \
  -H "Content-Type: application/json" \
  -d '{
    "citizen_name": "Anonymous Citizen",
    "description": "Traffic lights are malfunctioning at the central roundabout.",
    "source": "citizen_complaint"
  }'
```
**Expected Outcome:** Accepted with `latitude: null`, `longitude: null`, categorized as `traffic`, status `submitted`.
