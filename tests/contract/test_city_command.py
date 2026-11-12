"""
Automated Contract and Acceptance Tests for WF_City_Command
Covers Section 4.5 Acceptance Criteria and Shared Contracts (Section 3).
"""
import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "workflows")))

from city_command_logic import (
    validate_event_input,
    determine_departments,
    evaluate_priority_and_consolidate,
    ALLOWED_SEVERITIES,
    ALLOWED_STATUSES,
    ALLOWED_DEPARTMENTS,
    ALLOWED_SOURCES
)


class TestCityCommandAgent(unittest.TestCase):

    def test_01_validation_rejects_empty_description(self):
        """Input validation rejects empty or missing description (Section 3.3, 4.2)."""
        valid, err, _ = validate_event_input({"description": ""})
        self.assertFalse(valid)
        self.assertIn("description is required", err)

        valid, err, _ = validate_event_input({"description": "   "})
        self.assertFalse(valid)

    def test_02_validation_rejects_invalid_enums(self):
        """Input validation rejects invalid source, severity, or department."""
        valid, err, _ = validate_event_input({
            "description": "Pothole on 1st avenue",
            "source": "unauthorized_bot"
        })
        self.assertFalse(valid)
        self.assertIn("Invalid source", err)

        valid, err, _ = validate_event_input({
            "description": "Pothole on 1st avenue",
            "severity": "extreme"
        })
        self.assertFalse(valid)
        self.assertIn("Invalid severity", err)

        valid, err, _ = validate_event_input({
            "description": "Pothole on 1st avenue",
            "category": "aviation"
        })
        self.assertFalse(valid)
        self.assertIn("Invalid category/department", err)

    def test_03_single_department_flow_waste(self):
        """Single department waste example matching Section 10 integration scenario."""
        payload = {
            "citizen_name": "Demo Citizen",
            "contact": None,
            "description": "Garbage bins are overflowing near the market.",
            "category": "waste",
            "latitude": 28.6139,
            "longitude": 77.2090,
            "location_text": "Demo Market, Sector 1",
            "source": "citizen_complaint"
        }
        valid, err, normalized = validate_event_input(payload)
        self.assertTrue(valid)
        self.assertIsNotNone(normalized["event_id"])
        self.assertIsNotNone(normalized["agent_run_id"])

        departments, reason = determine_departments(normalized)
        self.assertEqual(departments, ["waste"])

        # Simulated department agent output matching Section 3.6
        waste_output = {
            "agent": "waste",
            "event_id": normalized["event_id"],
            "complaint_id": None,
            "issue": "Garbage overflow",
            "department": "waste",
            "severity": "medium",
            "findings": ["The report describes overflowing garbage bins."],
            "recommendation": "Request inspection and schedule collection if verified.",
            "requires_human_approval": True,
            "status": "recommendation_ready",
            "confidence": 0.85,
            "created_at": "2026-11-11T12:00:00Z"
        }

        decision = evaluate_priority_and_consolidate(normalized, departments, reason, [waste_output])

        # Verify Command Agent output contract (Section 3.7)
        self.assertEqual(decision["agent"], "city_command")
        self.assertEqual(decision["overall_severity"], "medium")
        self.assertEqual(decision["departments_involved"], ["waste"])
        self.assertTrue(decision["requires_human_approval"])
        self.assertEqual(decision["status"], "awaiting_human_review")
        self.assertIn("Request human verification", decision["consolidated_recommendations"][0])
        self.assertIn("[Waste] Request inspection and schedule collection if verified.", decision["consolidated_recommendations"])

    def test_04_cross_department_flow(self):
        """Cross-department example involving waterlogging and traffic congestion."""
        payload = {
            "description": "Severe waterlogging on Main Highway causing massive traffic jam and road blockage.",
            "category": "traffic",
            "source": "citizen_complaint",
            "location": {"latitude": 28.61, "longitude": 77.21, "location_text": "Main Highway"}
        }
        valid, _, normalized = validate_event_input(payload)
        self.assertTrue(valid)

        departments, reason = determine_departments(normalized)
        self.assertIn("traffic", departments)
        self.assertIn("water", departments)
        self.assertIn("Cross-department", reason)

        decision = evaluate_priority_and_consolidate(normalized, departments, reason, [])
        self.assertEqual(decision["overall_severity"], "high")
        self.assertEqual(sorted(decision["departments_involved"]), ["traffic", "water"])
        self.assertTrue(decision["requires_human_approval"])

    def test_05_insufficient_information_flow(self):
        """Insufficient-information example defaults severity to medium with human verification notice."""
        payload = {
            "description": "Issue here",
            "source": "citizen_complaint"
        }
        valid, _, normalized = validate_event_input(payload)
        self.assertTrue(valid)

        departments, reason = determine_departments(normalized)
        self.assertEqual(departments, ["general"])

        decision = evaluate_priority_and_consolidate(normalized, departments, reason, [])
        self.assertEqual(decision["overall_severity"], "medium")
        self.assertIn("insufficient detail", decision["priority_reason"].lower())
        self.assertIn("human triage", decision["consolidated_recommendations"][1].lower())
        self.assertTrue(decision["requires_human_approval"])

    def test_06_department_workflow_failure_handling(self):
        """Handles a department workflow failure without fabricating a successful result."""
        payload = {
            "description": "Broken street light causing total blackout in lane 4",
            "category": "energy",
            "source": "citizen_complaint"
        }
        valid, _, normalized = validate_event_input(payload)
        self.assertTrue(valid)

        departments, reason = determine_departments(normalized)
        self.assertEqual(departments, ["energy"])

        # Simulated failure from sub-workflow
        failed_dept_output = {
            "department": "energy",
            "status": "failed",
            "error": "Timeout executing WF_Department_Energy"
        }

        decision = evaluate_priority_and_consolidate(normalized, departments, reason, [failed_dept_output])
        # Must not fabricate a successful result
        self.assertTrue(any("unavailable or returned an error" in rec for rec in decision["consolidated_recommendations"]))
        self.assertTrue(decision["requires_human_approval"])


if __name__ == "__main__":
    unittest.main()
