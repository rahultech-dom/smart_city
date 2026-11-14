"""
Automated Contract and Acceptance Tests for WF_City_Complaint
Covers Section 5.5 Acceptance Criteria and Shared Contracts (Section 3).
"""
import sys
import os
import unittest
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "workflows")))

from city_complaint_logic import (
    validate_complaint_input,
    classify_and_assess_severity,
    format_complaint_and_event,
    build_caller_response,
    build_error_response,
    ALLOWED_SEVERITIES,
    ALLOWED_STATUSES,
    ALLOWED_DEPARTMENTS,
    ALLOWED_SOURCES
)


class TestCityComplaintAgent(unittest.TestCase):

    def test_01_workflow_file_integrity(self):
        """Workflow file exists, is valid JSON, and has canonical name WF_City_Complaint."""
        wf_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "workflows", "WF_City_Complaint.json"))
        self.assertTrue(os.path.exists(wf_path), f"Workflow file not found at {wf_path}")
        with open(wf_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.assertEqual(data.get("name"), "WF_City_Complaint")
        node_names = [n["name"] for n in data.get("nodes", [])]
        self.assertIn("Webhook Intake", node_names)
        self.assertIn("Sub-workflow Trigger", node_names)
        self.assertIn("Validate & Normalize Input", node_names)
        self.assertIn("Is Input Valid?", node_names)
        self.assertIn("Reject Invalid Input", node_names)
        self.assertIn("Classify & Assess Severity", node_names)
        self.assertIn("Format Complaint Record", node_names)
        self.assertIn("Save to Supabase", node_names)
        self.assertIn("Forward to City Command Agent", node_names)
        self.assertIn("Respond to Citizen Caller", node_names)

    def test_02_validation_rejects_empty_description(self):
        """Rejects missing, empty, or whitespace-only descriptions (Section 3.3, 5.2)."""
        valid, err, _ = validate_complaint_input({"description": ""})
        self.assertFalse(valid)
        self.assertIn("empty", err)

        valid, err, _ = validate_complaint_input({"description": "   \n\t  "})
        self.assertFalse(valid)
        self.assertIn("empty", err)

        valid, err, _ = validate_complaint_input({})
        self.assertFalse(valid)
        self.assertIn("required", err)

    def test_03_validation_rejects_disallowed_source(self):
        """Rejects sources outside allowed set: citizen_complaint, simulated_sensor, admin."""
        valid, err, _ = validate_complaint_input({
            "description": "Garbage dump near road",
            "source": "unauthorized_crawler"
        })
        self.assertFalse(valid)
        self.assertIn("Invalid source", err)

    def test_04_all_seven_departments_supported(self):
        """Verifies all 7 allowed departments can be classified."""
        examples = [
            ("Traffic lights are malfunctioning at the central roundabout.", "traffic"),
            ("Active fire and structural collapse emergency!", "safety"),
            ("Garbage bins are overflowing near Demo Market, Sector 1.", "waste"),
            ("Heavy toxic smoke and chemical emissions near factory.", "environment"),
            ("Underground water pipe burst causing road waterlogging.", "water"),
            ("Total power blackout and street lights not working.", "energy"),
            ("General question regarding municipal office visiting hours.", "general")
        ]
        for desc, expected_dept in examples:
            valid, _, norm = validate_complaint_input({"description": desc})
            self.assertTrue(valid)
            classified = classify_and_assess_severity(norm)
            self.assertEqual(classified["category"], expected_dept, f"Failed on '{desc}'")
            self.assertEqual(classified["assigned_department"], expected_dept)
            self.assertIn(classified["assigned_department"], ALLOWED_DEPARTMENTS)

    def test_05_shared_priority_rules(self):
        """Severity is assigned according to shared priority rules (critical, high, medium, low)."""
        critical_case = classify_and_assess_severity({"description": "Active fire and live wire touching water puddle, life threat emergency!"})
        self.assertEqual(critical_case["severity"], "critical")

        high_case = classify_and_assess_severity({"description": "Broken water main and severe flooding across highway."})
        self.assertEqual(high_case["severity"], "high")

        medium_case = classify_and_assess_severity({"description": "Garbage bins are overflowing near the market."})
        self.assertEqual(medium_case["severity"], "medium")

        low_case = classify_and_assess_severity({"description": "Minor cosmetic graffiti on park bench."})
        self.assertEqual(low_case["severity"], "low")

        fallback_case = classify_and_assess_severity({"description": "Something seems odd on the sidewalk."})
        self.assertEqual(fallback_case["severity"], "medium")

    def test_06_initial_status_strictly_submitted(self):
        """Initial status must always be 'submitted' (Section 5.2, 5.3)."""
        valid, _, norm = validate_complaint_input({"description": "Pothole in sector 4"})
        classified = classify_and_assess_severity(norm)
        self.assertEqual(classified["status"], "submitted")

    def test_07_coordinates_optional_handling(self):
        """Complaint without coordinates is accepted with latitude and longitude as null."""
        valid, _, norm = validate_complaint_input({
            "description": "Streetlight outage",
            "latitude": None,
            "longitude": None
        })
        self.assertTrue(valid)
        self.assertFalse(norm["has_coordinates"])
        self.assertIsNone(norm["latitude"])
        self.assertIsNone(norm["longitude"])

    def test_08_idempotency_preserves_complaint_id(self):
        """Provided complaint_id is preserved, otherwise new UUID generated."""
        fixed_id = "11111111-2222-3333-4444-555555555555"
        valid, _, norm = validate_complaint_input({
            "complaint_id": fixed_id,
            "description": "Water logging"
        })
        self.assertTrue(valid)
        self.assertEqual(norm["complaint_id"], fixed_id)

    def test_09_contracts_and_caller_response(self):
        """Record and event payload match shared contracts (Section 3.4, 3.5, 5.2)."""
        valid, _, norm = validate_complaint_input({
            "citizen_name": "Demo Citizen",
            "description": "Garbage bins are overflowing near the market.",
            "source": "citizen_complaint"
        })
        classified = classify_and_assess_severity(norm)
        record, event = format_complaint_and_event(classified)

        # Check complaint record
        self.assertEqual(record["assigned_department"], "waste")
        self.assertEqual(record["status"], "submitted")
        self.assertIn("complaint_id", record)

        # Check event payload for WF_City_Command
        self.assertEqual(event["department"], "waste")
        self.assertEqual(event["source"], "citizen_complaint")
        self.assertIn("event_id", event)

        # Check caller response
        resp = build_caller_response(classified)
        self.assertTrue(resp["success"])
        self.assertEqual(resp["category"], "waste")
        self.assertEqual(resp["status"], "submitted")


if __name__ == "__main__":
    unittest.main()
