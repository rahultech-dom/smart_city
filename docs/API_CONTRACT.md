# UrbanFlow AI — API & Data Contracts

This document specifies the shared data structures and communication contracts for UrbanFlow AI, with a particular focus on the Complaint Intake and Routing subsystem (`WF_City_Complaint`).

## 1. Allowed Enumerations

- **`severity`**: `"low"`, `"medium"`, `"high"`, `"critical"`
- **`status`**: `"submitted"`, `"under_review"`, `"assigned"`, `"in_progress"`, `"resolved"`, `"rejected"`
- **`department`**: `"traffic"`, `"safety"`, `"waste"`, `"environment"`, `"water"`, `"energy"`, `"general"`
- **`source`**: `"citizen_complaint"`, `"simulated_sensor"`, `"admin"`

---

## 2. Complaint Input Contract

Endpoint / Webhook payload submitted by citizens, sensors, or admins:

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

### Validation Rules:
1. `description` is required, must be a string, and cannot be empty after trimming whitespace.
2. `source` is required and must be one of `citizen_complaint`, `simulated_sensor`, `admin`.
3. `latitude` and `longitude` are numeric or `null`. If missing or invalid, both are recorded as `null`.
4. `contact` is nullable and must not be exposed in public dashboard views.

---

## 3. Complaint Record Contract (Database & Internal Representation)

Stored in Supabase `complaints` table:

```json
{
  "complaint_id": "c4b8e219-5d2f-4a0b-93f8-62d08a54e991",
  "citizen_name": "Demo Citizen",
  "contact": null,
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
  "created_at": "2026-11-14T04:45:00.000Z",
  "updated_at": "2026-11-14T04:45:00.000Z"
}
```

---

## 4. City Command Event Forwarding Contract

Sent by `WF_City_Complaint` to `WF_City_Command`:

```json
{
  "event_id": "e81f13b4-82a1-424a-b51c-6b3a26fd54e2",
  "complaint_id": "c4b8e219-5d2f-4a0b-93f8-62d08a54e991",
  "source": "citizen_complaint",
  "department": "waste",
  "category": "waste",
  "description": "Garbage bins are overflowing near the market.",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "location_text": "Demo Market, Sector 1"
  },
  "severity": "medium",
  "status": "submitted",
  "citizen_name": "Demo Citizen",
  "created_at": "2026-11-14T04:45:00.000Z"
}
```

---

## 5. Webhook Caller Response Contract

Returned synchronously to the client on successful submission (`HTTP 201 Created`):

```json
{
  "success": true,
  "complaint_id": "c4b8e219-5d2f-4a0b-93f8-62d08a54e991",
  "category": "waste",
  "assigned_department": "waste",
  "severity": "medium",
  "status": "submitted",
  "created_at": "2026-11-14T04:45:00.000Z",
  "message": "Complaint received and classified successfully."
}
```

---

## 6. Standard Error Response Contract

Returned on validation or execution failures (`HTTP 400 Bad Request` or `HTTP 500`):

```json
{
  "success": false,
  "error_code": "VALIDATION_ERROR",
  "message": "The complaint description is required and cannot be empty.",
  "event_id": null
}
```
