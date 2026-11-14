"""
UrbanFlow AI — City Complaint Agent Logic and Contract Verification
Implements Member 2 specification for UrbanFlow AI (Section 5, Section 3).
"""
import uuid
import re
from datetime import datetime, timezone
from typing import Dict, Any, Optional, Tuple

ALLOWED_SEVERITIES = {"low", "medium", "high", "critical"}
ALLOWED_STATUSES = {"submitted", "under_review", "assigned", "in_progress", "resolved", "rejected"}
ALLOWED_DEPARTMENTS = {"traffic", "safety", "waste", "environment", "water", "energy", "general"}
ALLOWED_SOURCES = {"citizen_complaint", "simulated_sensor", "admin"}


def validate_complaint_input(raw: Dict[str, Any]) -> Tuple[bool, Optional[str], Optional[Dict[str, Any]]]:
    """
    Validate incoming complaint intake payload according to Section 3.3 and 5.2.
    """
    if not isinstance(raw, dict):
        return False, "Payload must be a JSON object.", None

    # Handle nested body wrapper if invoked from Webhook
    if "body" in raw and isinstance(raw["body"], dict):
        raw = raw["body"]

    description = raw.get("description")
    if description is None or not isinstance(description, str):
        return False, "The complaint description is required and must be text.", None

    trimmed_desc = description.strip()
    if not trimmed_desc:
        return False, "The complaint description cannot be empty.", None

    raw_source = raw.get("source", "citizen_complaint")
    if raw_source not in ALLOWED_SOURCES:
        return False, f"Invalid source '{raw_source}'. Allowed sources: {sorted(list(ALLOWED_SOURCES))}.", None

    # Handle coordinates (numbers or null; never infer location)
    lat = raw.get("latitude")
    lon = raw.get("longitude")
    try:
        lat = float(lat) if lat is not None else None
    except (ValueError, TypeError):
        lat = None
    try:
        lon = float(lon) if lon is not None else None
    except (ValueError, TypeError):
        lon = None

    has_coords = (lat is not None and lon is not None)
    location_text = raw.get("location_text") or (f"{lat}, {lon}" if has_coords else "Location unprovided")

    complaint_id = raw.get("complaint_id") or str(uuid.uuid4())
    event_id = raw.get("event_id") or str(uuid.uuid4())
    now_iso = datetime.now(timezone.utc).isoformat()

    normalized = {
        "valid": True,
        "complaint_id": complaint_id,
        "event_id": event_id,
        "citizen_name": raw.get("citizen_name") or "Demo Citizen",
        "contact": raw.get("contact"),
        "description": trimmed_desc,
        "category": raw.get("category"),
        "image_url": raw.get("image_url"),
        "latitude": lat,
        "longitude": lon,
        "has_coordinates": has_coords,
        "location_text": location_text,
        "source": raw_source,
        "created_at": now_iso,
        "updated_at": now_iso
    }
    return True, None, normalized


def classify_and_assess_severity(item: Dict[str, Any]) -> Dict[str, Any]:
    """
    Classify complaint into exactly one of 7 allowed departments and assign severity
    based on the shared priority rules (Section 4.3 and 5.2).
    """
    desc = item.get("description", "").lower()
    cat = item.get("category")
    if isinstance(cat, str):
        cat = cat.lower().strip()
    else:
        cat = None

    # 1. Classification
    if cat not in ALLOWED_DEPARTMENTS:
        if re.search(r"\b(active fire|life threat|explosion|theft|assault|crime|safety|harassment|vandalism|weapon|suspicious|violence|emergency|structural collapse)\b", desc):
            cat = "safety"
        elif re.search(r"\b(traffic|traffic jam|congestion|traffic lights?|traffic signals?|road block|pothole|car crash|accident|intersection|lane|speeding|pedestrian crossing)\b", desc):
            cat = "traffic"
        elif re.search(r"\b(water|pipe|leak|drain|drainage|waterlogging|flooding|supply|sewage|sewer|contamination|burst)\b", desc):
            cat = "water"
        elif re.search(r"\b(garbage|trash|bin|bins|waste|dump|rubbish|litter|sanitation|collection|recycling|debris)\b", desc):
            cat = "waste"
        elif re.search(r"\b(electricity|power|blackout|outage|street ?lights?|spark|wire|pole|transformer|voltage|short circuit)\b", desc):
            cat = "energy"
        elif re.search(r"\b(air quality|pollution|smoke|smog|aqi|noise|odor|odour|chemical|toxic|dust|tree falling|emission)\b", desc):
            cat = "environment"
        else:
            cat = "general"

    # 2. Priority Rules (Section 4.3):
    # - critical: explicit immediate threat to life or serious danger.
    # - high: significant public safety or infrastructure disruption.
    # - medium: service disruption or civic issue (fallback if uncertain).
    # - low: minor issue with no stated immediate risk.
    if re.search(r"\b(life threat|immediate danger|explosion|live wire touching|active fire|drowning|fatal|gas leak emergency|major collapse)\b", desc):
        severity = "critical"
    elif re.search(r"\b(major accident|broken water main|sparking transformer|severe flooding|hazardous waste|open manhole|high voltage wire)\b", desc):
        severity = "high"
    elif re.search(r"\b(overflow|leaking tap|flickering light|litter|pothole|delayed garbage|dirty road|illegal parking|congestion)\b", desc):
        severity = "medium"
    elif re.search(r"\b(cosmetic|faded paint|minor graffiti|mild smell|small puddle|routine query)\b", desc):
        severity = "low"
    else:
        severity = "medium"

    result = dict(item)
    result["category"] = cat
    result["assigned_department"] = cat
    result["severity"] = severity
    result["status"] = "submitted"
    return result


def format_complaint_and_event(item: Dict[str, Any]) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    """
    Produce the Complaint Record (Section 3.4) and Event Payload for City Command (Section 3.5).
    """
    complaint_record = {
        "complaint_id": item["complaint_id"],
        "citizen_name": item.get("citizen_name"),
        "contact": item.get("contact"),
        "description": item["description"],
        "category": item["category"],
        "severity": item["severity"],
        "status": "submitted",
        "assigned_department": item["assigned_department"],
        "image_url": item.get("image_url"),
        "latitude": item.get("latitude"),
        "longitude": item.get("longitude"),
        "location_text": item.get("location_text"),
        "source": item["source"],
        "created_at": item.get("created_at"),
        "updated_at": item.get("updated_at")
    }

    event_payload = {
        "event_id": item["event_id"],
        "complaint_id": item["complaint_id"],
        "source": item["source"],
        "department": item["assigned_department"],
        "category": item["category"],
        "description": item["description"],
        "location": {
            "latitude": item.get("latitude"),
            "longitude": item.get("longitude"),
            "location_text": item.get("location_text")
        },
        "severity": item["severity"],
        "status": "submitted",
        "citizen_name": item.get("citizen_name"),
        "created_at": item.get("created_at")
    }
    return complaint_record, event_payload


def build_caller_response(item: Dict[str, Any]) -> Dict[str, Any]:
    """
    Format standard response for the webhook caller (Section 5.2 Step 10).
    """
    return {
        "success": True,
        "complaint_id": item["complaint_id"],
        "category": item["category"],
        "assigned_department": item["assigned_department"],
        "severity": item["severity"],
        "status": item["status"],
        "created_at": item.get("created_at"),
        "message": "Complaint received and classified successfully."
    }


def build_error_response(error_code: str, message: str, event_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Format standard error response (Section 8.3).
    """
    return {
        "success": False,
        "error_code": error_code,
        "message": message,
        "event_id": event_id
    }
