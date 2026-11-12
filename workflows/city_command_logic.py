"""
City Command Agent Logic and Contract Verification
Implements Member 1 specification for UrbanFlow AI.
"""
import uuid
import re
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Tuple

ALLOWED_SEVERITIES = {"low", "medium", "high", "critical"}
ALLOWED_STATUSES = {"submitted", "under_review", "assigned", "in_progress", "resolved", "rejected"}
ALLOWED_DEPARTMENTS = {"traffic", "safety", "waste", "environment", "water", "energy", "general"}
ALLOWED_SOURCES = {"citizen_complaint", "simulated_sensor", "admin"}

CANONICAL_DEPARTMENT_WORKFLOWS = {
    "traffic": "WF_Department_Traffic",
    "safety": "WF_Department_Safety",
    "waste": "WF_Department_Waste",
    "environment": "WF_Department_Environment",
    "water": "WF_Department_Water",
    "energy": "WF_Department_Energy"
}


def validate_event_input(payload: Dict[str, Any]) -> Tuple[bool, Optional[str], Dict[str, Any]]:
    """
    Validate incoming payload according to Section 3.3, 3.5, and 4.2.
    """
    if not isinstance(payload, dict):
        return False, "Payload must be a JSON object.", {}

    description = payload.get("description")
    if not description or not str(description).strip():
        return False, "The complaint description is required and cannot be empty.", {}

    source = payload.get("source")
    if source and source not in ALLOWED_SOURCES:
        return False, f"Invalid source '{source}'. Must be one of {sorted(list(ALLOWED_SOURCES))}.", {}

    severity = payload.get("severity")
    if severity and severity not in ALLOWED_SEVERITIES:
        return False, f"Invalid severity '{severity}'. Must be one of {sorted(list(ALLOWED_SEVERITIES))}.", {}

    category = payload.get("category") or payload.get("department")
    if category and category not in ALLOWED_DEPARTMENTS:
        return False, f"Invalid category/department '{category}'. Must be one of {sorted(list(ALLOWED_DEPARTMENTS))}.", {}

    # Extract or generate identifiers
    event_id = payload.get("event_id") or str(uuid.uuid4())
    complaint_id = payload.get("complaint_id")
    agent_run_id = str(uuid.uuid4())

    location = payload.get("location") or {}
    if not isinstance(location, dict):
        location = {
            "latitude": payload.get("latitude"),
            "longitude": payload.get("longitude"),
            "location_text": payload.get("location_text")
        }

    normalized = {
        "event_id": event_id,
        "complaint_id": complaint_id,
        "agent_run_id": agent_run_id,
        "source": source or "citizen_complaint",
        "description": str(description).strip(),
        "category": category,
        "severity": severity,
        "location": {
            "latitude": location.get("latitude") if location.get("latitude") is not None else payload.get("latitude"),
            "longitude": location.get("longitude") if location.get("longitude") is not None else payload.get("longitude"),
            "location_text": location.get("location_text") or payload.get("location_text")
        },
        "context": payload.get("context") or {}
    }
    return True, None, normalized


def determine_departments(normalized: Dict[str, Any]) -> Tuple[List[str], str]:
    """
    Determine target department(s) according to Section 4.2:
    - Determine relevant department using category/department.
    - If ambiguous, set department to 'general' and explain ambiguity; do not guess.
    - For cross-department cases, call only departments clearly implicated.
    """
    desc = normalized["description"].lower()
    cat = normalized.get("category")

    # Check for explicit multi-department or cross-department indications in description
    keywords = {
        "traffic": ["traffic", "congestion", "jam", "signals", "signal", "road blockage", "blocked road", "vehicle gridlock"],
        "safety": ["fire", "hazard", "threat", "danger", "violent", "accident", "emergency", "collapse", "structural damage"],
        "waste": ["garbage", "trash", "overflowing bin", "waste", "litter", "dump", "debris", "sanitation"],
        "environment": ["aqi", "air quality", "smog", "pollution", "toxic fumes", "noise", "smoke", "chemical odor"],
        "water": ["waterlogging", "water leak", "pipeline burst", "flooding", "sewage", "drainage", "water supply", "puddle"],
        "energy": ["power outage", "blackout", "street light", "wire hanging", "transformer", "electricity", "pole sparked"]
    }

    implicated = set()
    if cat and cat in ALLOWED_DEPARTMENTS and cat != "general":
        implicated.add(cat)

    # Check for clear cross-department implication
    for dept, terms in keywords.items():
        if any(re.search(r'\b' + re.escape(term) + r'\b', desc) for term in terms):
            # Only add if clearly mentioned
            implicated.add(dept)

    # If ambiguous or no department identified
    if not implicated:
        if cat == "general" or not cat:
            return ["general"], "Category is unspecified or ambiguous; no single specialized department clearly matches."
        return [cat], f"Routed based on explicitly supplied category '{cat}'."

    # If category was provided but description mentions an additional distinct civic domain
    departments = sorted(list(implicated))
    if len(departments) > 1:
        reason = f"Cross-department coordination required: incident implicates {', '.join(departments)}."
    else:
        reason = f"Single department identified: {departments[0]}."

    return departments, reason


def evaluate_priority_and_consolidate(
    normalized: Dict[str, Any],
    departments: List[str],
    dept_reason: str,
    agent_results: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Consolidate findings and evaluate priority according to Section 4.3 and 3.7.
    Priority Rules (Section 4.3):
    - critical: supplied info explicitly indicates immediate threat to life or serious danger.
    - high: significant public safety or infrastructure concern, but no confirmed immediate life threat.
    - medium: service disruption or civic issue requiring timely attention.
    - low: minor issue with no stated immediate risk.
    - insufficient evidence: use 'medium' and state severity needs human verification.
    """
    desc = normalized["description"].lower()
    
    # Priority evaluation
    critical_triggers = ["immediate threat to life", "serious danger", "life-threatening", "active fire", "building collapse", "live high-voltage wire in water", "electrocution risk"]
    high_triggers = ["severe waterlogging", "massive traffic jam", "power outage affecting hospital", "blocked emergency access", "toxic leak", "major road collapse"]
    low_triggers = ["graffiti", "cosmetic", "flickering bulb in daylight", "minor litter", "mild annoyance"]

    insufficient_info = False
    if len(desc.split()) < 4 and not normalized.get("category"):
        insufficient_info = True

    # Check explicit triggers without guessing or fabricating
    if any(trigger in desc for trigger in critical_triggers):
        overall_severity = "critical"
        priority_reason = "Supplied information explicitly indicates an immediate threat to life or serious danger requiring urgent escalation."
    elif any(trigger in desc for trigger in high_triggers) or any(r.get("severity") == "high" for r in agent_results if isinstance(r, dict)):
        overall_severity = "high"
        priority_reason = "Significant public safety or infrastructure disruption indicated; timely intervention recommended."
    elif insufficient_info or departments == ["general"]:
        overall_severity = "medium"
        priority_reason = "Supplied information provides insufficient detail to confirm urgency; severity defaults to medium and requires human verification."
    elif any(trigger in desc for trigger in low_triggers) or normalized.get("severity") == "low":
        overall_severity = "low"
        priority_reason = "Minor civic issue with no stated immediate risk to public safety or core infrastructure."
    else:
        overall_severity = normalized.get("severity") or "medium"
        priority_reason = f"The complaint reports a civic {departments[0] if departments != ['general'] else 'general'} issue without a confirmed immediate threat."

    # Build consolidated recommendations
    consolidated_recommendations = []
    
    # Check if location is missing
    loc = normalized.get("location") or {}
    if loc.get("latitude") is None and not loc.get("location_text"):
        consolidated_recommendations.append("Request human verification of the reported location as precise coordinates/location text are missing.")
    else:
        consolidated_recommendations.append("Request human verification of the reported location.")

    # Department-specific recommendations
    if departments == ["general"]:
        consolidated_recommendations.append("Conduct human triage to classify the ambiguous complaint into the appropriate municipal department.")
    else:
        for dept in departments:
            # Check agent results if available
            dept_res = next((r for r in agent_results if isinstance(r, dict) and r.get("department") == dept), None)
            if dept_res:
                if dept_res.get("status") == "failed" or "error" in dept_res:
                    consolidated_recommendations.append(f"Department assessment for {dept} was unavailable or returned an error; require manual inspection by {dept} supervisor.")
                elif dept_res.get("recommendation"):
                    consolidated_recommendations.append(f"[{dept.capitalize()}] {dept_res['recommendation']}")
            else:
                consolidated_recommendations.append(f"Assign the verified complaint to the municipal {dept} team for operational review.")

    now_iso = datetime.now(timezone.utc).isoformat()

    return {
        "agent": "city_command",
        "event_id": normalized["event_id"],
        "complaint_id": normalized.get("complaint_id"),
        "overall_severity": overall_severity,
        "priority_reason": priority_reason,
        "departments_involved": departments,
        "agent_results": agent_results,
        "consolidated_recommendations": consolidated_recommendations,
        "requires_human_approval": True,
        "status": "awaiting_human_review",
        "created_at": now_iso
    }
