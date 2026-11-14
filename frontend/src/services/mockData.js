/**
 * UrbanFlow AI — Demonstration & Fallback Mock Dataset
 * Strictly adheres to SPEC.md Section 3 and API_CONTRACT.md.
 * Used when Python FastAPI backend is offline or during prototype demonstrations.
 */

export const INITIAL_COMPLAINTS = [
  {
    complaint_id: "c4b8e219-5d2f-4a0b-93f8-62d08a54e991",
    citizen_name: "Demo Citizen",
    contact: null, // Private contact NEVER exposed in public dashboard
    description: "Garbage bins are overflowing near the market. Stray animals scattering waste onto road.",
    category: "waste",
    severity: "medium",
    status: "assigned",
    assigned_department: "waste",
    image_url: null,
    latitude: 28.6139,
    longitude: 77.2090,
    location_text: "Demo Market, Sector 1, Central Ward",
    source: "citizen_complaint",
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    agent_reports: [
      {
        agent: "waste",
        event_id: "808c10be-0985-4081-9fc5-21d4d3a017e8",
        complaint_id: "c4b8e219-5d2f-4a0b-93f8-62d08a54e991",
        issue: "Garbage overflow & bin saturation",
        department: "waste",
        severity: "medium",
        findings: [
          "The report describes overflowing community garbage bins near market perimeter.",
          "Visual analysis corroborates bin fill level exceeding 85% capacity.",
          "Commercial zone foot traffic indicates high accumulation rate before evening peak."
        ],
        recommendation: "Request human verification and schedule automated compactor truck collection route #4.",
        requires_human_approval: true,
        status: "recommendation_ready",
        confidence: 0.88,
        created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString()
      }
    ],
    command_decision: {
      agent: "city_command",
      event_id: "0a586c87-a162-49e8-b99c-ec1b75128f75",
      complaint_id: "c4b8e219-5d2f-4a0b-93f8-62d08a54e991",
      overall_severity: "medium",
      priority_reason: "The complaint reports a civic sanitation issue without a confirmed immediate safety threat.",
      departments_involved: ["waste"],
      agent_results: [
        {
          department: "waste",
          status: "success",
          summary: "Waste Management Agent issued routine collection advisory."
        }
      ],
      consolidated_recommendations: [
        "Request human verification of the reported location at Demo Market, Sector 1.",
        "[Waste] Schedule compactor crew dispatch for bin clearance upon authority approval."
      ],
      requires_human_approval: true,
      status: "awaiting_human_review",
      created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString()
    }
  },
  {
    complaint_id: "e81f13b4-82a1-424a-b51c-6b3a26fd54e2",
    citizen_name: "Sunita Rao",
    contact: null,
    description: "A live electric transmission pole has bent and wires are touching the fence right next to Government Boys Senior Secondary School gate.",
    category: "safety",
    severity: "critical",
    status: "under_review",
    assigned_department: "safety",
    image_url: null,
    latitude: 28.5672,
    longitude: 77.1789,
    location_text: "Main Road, Sector 4, R.K. Puram (Adjacent to School Gate)",
    source: "citizen_complaint",
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    agent_reports: [
      {
        agent: "safety",
        event_id: "evt-saf-0912",
        complaint_id: "e81f13b4-82a1-424a-b51c-6b3a26fd54e2",
        issue: "Imminent electrocution hazard near educational facility",
        department: "safety",
        severity: "critical",
        findings: [
          "Explicit high-voltage hazard identified within 15 meters of school boundary.",
          "Live conductor touching metallic boundary fence creating public shock perimeter.",
          "Active student movement expected at upcoming school dismissal hour."
        ],
        recommendation: "Immediate emergency cordon by traffic police and rapid SCADA line isolation by electricity board.",
        requires_human_approval: true,
        status: "recommendation_ready",
        confidence: 0.98,
        created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString()
      },
      {
        agent: "energy",
        event_id: "evt-eng-0912",
        complaint_id: "e81f13b4-82a1-424a-b51c-6b3a26fd54e2",
        issue: "Feeder 11kV line fault telemetry",
        department: "energy",
        severity: "critical",
        findings: [
          "Substation feeder FDR-RKP-04 indicates earth fault leakage current spike.",
          "Transformer pole #18 structural integrity compromised."
        ],
        recommendation: "Emergency human approval required to execute breaker de-energization on feeder FDR-RKP-04.",
        requires_human_approval: true,
        status: "recommendation_ready",
        confidence: 0.96,
        created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      }
    ],
    command_decision: {
      agent: "city_command",
      event_id: "cmd-dec-critical-01",
      complaint_id: "e81f13b4-82a1-424a-b51c-6b3a26fd54e2",
      overall_severity: "critical",
      priority_reason: "Immediate threat to life confirmed due to live high-voltage wires touching school fence.",
      departments_involved: ["safety", "energy", "traffic"],
      agent_results: [],
      consolidated_recommendations: [
        "[CRITICAL] Immediate manual authorization requested for electrical utility emergency breaker trip.",
        "Authorize local police cordon around Government Boys Senior Secondary School gate.",
        "Alert municipal traffic wardens to divert pedestrians 100 meters away from perimeter fence."
      ],
      requires_human_approval: true,
      status: "awaiting_human_review",
      created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString()
    }
  },
  {
    complaint_id: "9b4f7380-69ce-4bc1-9e6e-c56a8e329d71",
    citizen_name: "Rajesh Gupta",
    contact: null,
    description: "Severe waterlogging at Pul Prahladpur underpass. Water level is around 3 feet, multiple cars stalled causing complete arterial gridlock.",
    category: "water",
    severity: "high",
    status: "in_progress",
    assigned_department: "water",
    image_url: null,
    latitude: 28.5135,
    longitude: 77.2882,
    location_text: "Pul Prahladpur Underpass, Mehrauli-Badarpur Road",
    source: "citizen_complaint",
    created_at: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    agent_reports: [
      {
        agent: "water",
        event_id: "evt-wtr-4412",
        complaint_id: "9b4f7380-69ce-4bc1-9e6e-c56a8e329d71",
        issue: "Underpass flood level exceeds vehicular clearance",
        department: "water",
        severity: "high",
        findings: [
          "Precipitation sensor logged 38.5mm/hr in Badarpur catchment zone.",
          "Permanent sump drainage pump station #2 experiencing intake silt blockage.",
          "Standing water depth measured at approximately 90cm."
        ],
        recommendation: "Deploy high-capacity mobile diesel dewatering pump unit and dispatch drain jetting machine.",
        requires_human_approval: true,
        status: "recommendation_ready",
        confidence: 0.94,
        created_at: new Date(Date.now() - 110 * 60 * 1000).toISOString()
      },
      {
        agent: "traffic",
        event_id: "evt-trf-4412",
        complaint_id: "9b4f7380-69ce-4bc1-9e6e-c56a8e329d71",
        issue: "MB Road arterial blockage and 3.5km traffic tailback",
        department: "traffic",
        severity: "high",
        findings: [
          "Both eastbound carriageways obstructed by submerged vehicles.",
          "Average traffic speed dropped from 40 km/h to 3 km/h."
        ],
        recommendation: "Update digital variable message signs (VMS) at Badarpur border and redirect vehicles via Mathura Road.",
        requires_human_approval: true,
        status: "recommendation_ready",
        confidence: 0.91,
        created_at: new Date(Date.now() - 105 * 60 * 1000).toISOString()
      }
    ],
    command_decision: {
      agent: "city_command",
      event_id: "cmd-dec-wtr-trf-02",
      complaint_id: "9b4f7380-69ce-4bc1-9e6e-c56a8e329d71",
      overall_severity: "high",
      priority_reason: "Cross-departmental disruption involving arterial transit paralysis and flood inundation.",
      departments_involved: ["water", "traffic"],
      agent_results: [],
      consolidated_recommendations: [
        "[Human Approved] Authorize Water Dept dispatch of 500 GPM trailer-mounted pump.",
        "[Human Approved] Authorize Traffic Operations Centre to activate Mathura Road bypass signal plan."
      ],
      requires_human_approval: true,
      status: "in_progress",
      created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString()
    }
  },
  {
    complaint_id: "3d8b1c4e-5a7f-41e2-b903-8e421cd77a11",
    citizen_name: "Dr. Reena Mehta",
    contact: null,
    description: "Extremely thick acrid smoke and burning smell from illegal open waste burning site near industrial drain. AQI monitor nearby showing severe spike.",
    category: "environment",
    severity: "high",
    status: "submitted",
    assigned_department: "environment",
    image_url: null,
    latitude: 28.6469,
    longitude: 77.3160,
    location_text: "Anand Vihar Eco Corridor, Drain Sector 9",
    source: "citizen_complaint",
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    agent_reports: [
      {
        agent: "environment",
        event_id: "evt-env-1029",
        complaint_id: "3d8b1c4e-5a7f-41e2-b903-8e421cd77a11",
        issue: "Severe localized AQI breach from biomass combustion",
        department: "environment",
        severity: "high",
        findings: [
          "Anand Vihar monitoring station logged PM2.5 at 382 ug/m3 (Severe category).",
          "Thermal anomaly confirmed within 400 meters of industrial drain.",
          "GRAP Stage III emergency protocols currently in effect across city zone."
        ],
        recommendation: "Deploy truck-mounted anti-smog gun and issue inspection ticket to municipal pollution enforcement squad.",
        requires_human_approval: true,
        status: "recommendation_ready",
        confidence: 0.93,
        created_at: new Date(Date.now() - 22 * 60 * 1000).toISOString()
      }
    ],
    command_decision: {
      agent: "city_command",
      event_id: "cmd-dec-env-03",
      complaint_id: "3d8b1c4e-5a7f-41e2-b903-8e421cd77a11",
      overall_severity: "high",
      priority_reason: "High environmental and public health hazard during active GRAP Stage III restrictions.",
      departments_involved: ["environment", "waste"],
      agent_results: [],
      consolidated_recommendations: [
        "Request human verification from field patrol in Anand Vihar Eco Area.",
        "[Environment] Authorize dust suppression misting cannon deployment."
      ],
      requires_human_approval: true,
      status: "awaiting_human_review",
      created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString()
    }
  },
  {
    complaint_id: "7a2b91c0-43ef-4d69-8f3a-1290bb34e101",
    citizen_name: "Vikram Sen",
    contact: null,
    description: "Major collision between truck and bus blocking both lanes on Ring Road near Moti Bagh flyover. Traffic backed up 2km.",
    category: "traffic",
    severity: "high",
    status: "in_progress",
    assigned_department: "traffic",
    image_url: null,
    latitude: 28.5828,
    longitude: 77.1685,
    location_text: "Ring Road, Moti Bagh Flyover Eastbound",
    source: "citizen_complaint",
    created_at: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    agent_reports: [
      {
        agent: "traffic",
        event_id: "evt-trf-9981",
        complaint_id: "7a2b91c0-43ef-4d69-8f3a-1290bb34e101",
        issue: "Dual lane arterial blockage on Ring Road",
        department: "traffic",
        severity: "high",
        findings: [
          "Vehicle collision confirmed blocking 2 of 3 lanes on Moti Bagh flyover approach.",
          "Live telemetry records average speed reduction to 6.5 km/h.",
          "Estimated transit clearance time 45 minutes pending heavy wrecker arrival."
        ],
        recommendation: "Activate traffic diversion via Africa Avenue and adjust signal timing on Benito Juarez Marg.",
        requires_human_approval: true,
        status: "recommendation_ready",
        confidence: 0.95,
        created_at: new Date(Date.now() - 175 * 60 * 1000).toISOString()
      }
    ],
    command_decision: {
      agent: "city_command",
      event_id: "cmd-dec-trf-01",
      complaint_id: "7a2b91c0-43ef-4d69-8f3a-1290bb34e101",
      overall_severity: "high",
      priority_reason: "Critical arterial transit blockage impacting southern ring corridor.",
      departments_involved: ["traffic", "safety"],
      agent_results: [],
      consolidated_recommendations: [
        "[Human Authorized] Heavy recovery vehicle dispatched to clear wreckage.",
        "[Human Authorized] Dynamic route alerts broadcasted to navigation APIs."
      ],
      requires_human_approval: true,
      status: "in_progress",
      created_at: new Date(Date.now() - 170 * 60 * 1000).toISOString()
    }
  },
  {
    complaint_id: "1f8e43a9-7c21-4f56-9a3b-6e0123f89012",
    citizen_name: "Kavita Joshi",
    contact: null,
    description: "All streetlights along 1.5 km stretch of Outer Ring Road service lane are completely dark for the 4th consecutive night. High vulnerability for pedestrians.",
    category: "energy",
    severity: "medium",
    status: "assigned",
    assigned_department: "energy",
    image_url: null,
    latitude: 28.5583,
    longitude: 77.1706,
    location_text: "Outer Ring Road Service Lane, Munirka",
    source: "citizen_complaint",
    created_at: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    agent_reports: [
      {
        agent: "energy",
        event_id: "evt-eng-8821",
        complaint_id: "1f8e43a9-7c21-4f56-9a3b-6e0123f89012",
        issue: "Streetlight feeder circuit failure",
        department: "energy",
        severity: "medium",
        findings: [
          "Substation Munirka reports breaker circuit CKT-ORR-A in intermittent fault state.",
          "Dark corridor spans approximately 1,600 meters of pedestrian-dense access lane."
        ],
        recommendation: "Schedule daytime cable insulation test and dispatch municipal utility maintenance van.",
        requires_human_approval: true,
        status: "recommendation_ready",
        confidence: 0.89,
        created_at: new Date(Date.now() - 350 * 60 * 1000).toISOString()
      }
    ],
    command_decision: {
      agent: "city_command",
      event_id: "cmd-dec-eng-04",
      complaint_id: "1f8e43a9-7c21-4f56-9a3b-6e0123f89012",
      overall_severity: "medium",
      priority_reason: "Infrastructure disruption with pedestrian safety implications; assigned to electrical division.",
      departments_involved: ["energy", "safety"],
      agent_results: [],
      consolidated_recommendations: [
        "Request human verification of circuit breaker fault at Munirka substation.",
        "[Safety] Alert local police beat to increase evening patrol presence until repairs complete."
      ],
      requires_human_approval: true,
      status: "awaiting_human_review",
      created_at: new Date(Date.now() - 340 * 60 * 1000).toISOString()
    }
  },
  {
    complaint_id: "8c7d6e5f-1a2b-4c3d-8e9f-0123456789ab",
    citizen_name: "Aman Verma",
    contact: null,
    description: "Deep pothole on residential avenue after water pipe maintenance. Pothole filled and road repaved smoothly.",
    category: "traffic",
    severity: "low",
    status: "resolved",
    assigned_department: "traffic",
    image_url: null,
    latitude: 28.5700,
    longitude: 77.2435,
    location_text: "Avenue 4, Block C, Lajpat Nagar",
    source: "citizen_complaint",
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    agent_reports: [
      {
        agent: "traffic",
        event_id: "evt-trf-res-01",
        complaint_id: "8c7d6e5f-1a2b-4c3d-8e9f-0123456789ab",
        issue: "Secondary road surface defect",
        department: "traffic",
        severity: "low",
        findings: [
          "Pothole measured 0.4m diameter on 2-lane residential road.",
          "Surface repair completed by road maintenance squad with cold mix asphalt."
        ],
        recommendation: "Mark inspection complete after site photography validation.",
        requires_human_approval: true,
        status: "recommendation_ready",
        confidence: 0.92,
        created_at: new Date(Date.now() - 23 * 3600 * 1000).toISOString()
      }
    ],
    command_decision: {
      agent: "city_command",
      event_id: "cmd-dec-trf-res-01",
      complaint_id: "8c7d6e5f-1a2b-4c3d-8e9f-0123456789ab",
      overall_severity: "low",
      priority_reason: "Minor civic issue resolved following human authorization and contractor inspection.",
      departments_involved: ["traffic"],
      agent_results: [],
      consolidated_recommendations: [
        "[Human Verified] Physical road inspection confirmed surface restored to municipal standard.",
        "Complaint marked resolved."
      ],
      requires_human_approval: true,
      status: "resolved",
      created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
    }
  },
  {
    complaint_id: "4bf4ba97-4615-4fbd-afce-c455fea2181b",
    citizen_name: "Demo Citizen",
    contact: null,
    description: "Strange sound coming from pavement near park bench.",
    category: "general",
    severity: "low",
    status: "rejected",
    assigned_department: "general",
    image_url: null,
    latitude: null, // Test case without coordinates per SPEC.md
    longitude: null,
    location_text: "Unspecified park area",
    source: "citizen_complaint",
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    agent_reports: [],
    command_decision: {
      agent: "city_command",
      event_id: "cmd-dec-amb-01",
      complaint_id: "4bf4ba97-4615-4fbd-afce-c455fea2181b",
      overall_severity: "low",
      priority_reason: "Supplied information provides insufficient detail to confirm urgency or identify civic asset.",
      departments_involved: ["general"],
      agent_results: [],
      consolidated_recommendations: [
        "Request citizen provide specific park name and landmark details.",
        "[Human Reviewer] Complaint rejected due to unverifiable location details."
      ],
      requires_human_approval: true,
      status: "rejected",
      created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
    }
  }
];

export const DEPARTMENT_AGENTS_METADATA = [
  {
    id: "traffic",
    name: "Traffic Management Agent",
    workflowName: "WF_Department_Traffic",
    department: "traffic",
    icon: "Car",
    status: "nominal",
    activeIncidents: 4,
    avgConfidence: 0.93,
    latestAction: "Evaluated Ring Road Eastbound congestion diversion route",
    tools: ["Google Maps Traffic API", "Directions Route Optimizer", "Digital VMS Sign Dispatcher"],
    lastActivityTime: "8 mins ago",
    activeEvent: {
      issue: "Moti Bagh Flyover Congestion",
      severity: "high",
      findings: "Multi-vehicle collision blocking 2 eastbound lanes. Congestion ratio: 0.14.",
      recommendation: "Activate traffic diversion via Africa Avenue & Benito Juarez Marg.",
      requires_human_approval: true,
      timestamp: "Just now"
    }
  },
  {
    id: "safety",
    name: "Public Safety Agent",
    workflowName: "WF_Department_Safety",
    department: "safety",
    icon: "ShieldAlert",
    status: "alert",
    activeIncidents: 2,
    avgConfidence: 0.97,
    latestAction: "Calculated hazard cordon radius for high-voltage pole breach",
    tools: ["School/Hospital Proximity Database", "Sensitive Zone Risk Scorer", "SMS Dispatch Simulator"],
    lastActivityTime: "5 mins ago",
    activeEvent: {
      issue: "Live Electric Wire on School Perimeter",
      severity: "critical",
      findings: "Live 11kV conductor touching metal fence within 15m of school gate.",
      recommendation: "Immediate emergency police cordon and SCADA line isolation by electricity board.",
      requires_human_approval: true,
      timestamp: "5 mins ago"
    }
  },
  {
    id: "waste",
    name: "Waste Management Agent",
    workflowName: "WF_Department_Waste",
    department: "waste",
    icon: "Trash2",
    status: "nominal",
    activeIncidents: 6,
    avgConfidence: 0.90,
    latestAction: "Processed computer vision fill analysis for Demo Market bin cluster",
    tools: ["Computer Vision Bin Fill Model", "Ward Density Routing", "Fleet Dispatch Optimizer"],
    lastActivityTime: "12 mins ago",
    activeEvent: {
      issue: "Dumpster Overfill & Spillage",
      severity: "medium",
      findings: "Bin fill level 92%. Spillage area 14.8 sq meters on pedestrian walkway.",
      recommendation: "Dispatch Compactor Truck Team #3 for immediate mechanical collection.",
      requires_human_approval: true,
      timestamp: "12 mins ago"
    }
  },
  {
    id: "environment",
    name: "Environmental Monitoring Agent",
    workflowName: "WF_Department_Environment",
    department: "environment",
    icon: "Leaf",
    status: "nominal",
    activeIncidents: 3,
    avgConfidence: 0.94,
    latestAction: "Evaluated Anand Vihar AQI station hourly telemetry spike",
    tools: ["CPCB AQI Station Feed", "Open-Meteo Meteorological API", "GRAP Mitigation Engine"],
    lastActivityTime: "18 mins ago",
    activeEvent: {
      issue: "AQI Spike (382 - Severe)",
      severity: "high",
      findings: "Dominant pollutant PM2.5 at 245.8 ug/m3. Thermal inversion detected.",
      recommendation: "Deploy truck-mounted anti-smog gun and issue construction dust restriction.",
      requires_human_approval: true,
      timestamp: "18 mins ago"
    }
  },
  {
    id: "water",
    name: "Water Management Agent",
    workflowName: "WF_Department_Water",
    department: "water",
    icon: "Droplets",
    status: "nominal",
    activeIncidents: 5,
    avgConfidence: 0.92,
    latestAction: "Calculated storm drainage runoff rate for Pul Prahladpur basin",
    tools: ["Precipitation Radar Radar API", "Catchment Inundation DB", "Pumping Station Telemetry"],
    lastActivityTime: "24 mins ago",
    activeEvent: {
      issue: "Pul Prahladpur Underpass Waterlogging",
      severity: "high",
      findings: "Standing water depth ~90cm. Intake sump clogged by debris.",
      recommendation: "Deploy 500 GPM trailer pump and jetting machine to clear silt choke.",
      requires_human_approval: true,
      timestamp: "24 mins ago"
    }
  },
  {
    id: "energy",
    name: "Energy Management Agent",
    workflowName: "WF_Department_Energy",
    department: "energy",
    icon: "Zap",
    status: "nominal",
    activeIncidents: 3,
    avgConfidence: 0.91,
    latestAction: "Analyzed SCADA circuit trip logs on Munirka 66/11kV substation",
    tools: ["SCADA Feeder Telemetry API", "Streetlight Circuit Topology", "Transformer Risk DB"],
    lastActivityTime: "30 mins ago",
    activeEvent: {
      issue: "Feeder Circuit Trip & Dark Corridor",
      severity: "medium",
      findings: "Feeder FDR-RKP-04 tripped on earth fault. 1.6km streetlight corridor dark.",
      recommendation: "Dispatch lineman squad for daylight megger insulation test on cable run.",
      requires_human_approval: true,
      timestamp: "30 mins ago"
    }
  }
];

export const CITY_COMMAND_TELEMETRY = {
  agentName: "City Command Agent",
  workflowName: "WF_City_Command",
  status: "active",
  activeCrossAgencyIncidents: 2,
  humanReviewQueueCount: 4,
  averageTriageLatencyMs: 420,
  latestCoordinationEvent: {
    title: "Synchronized Public Safety & Energy Grid Response",
    complaintId: "e81f13b4-82a1-424a-b51c-6b3a26fd54e2",
    severity: "critical",
    departments: ["safety", "energy", "traffic"],
    summary: "Coordinated emergency perimeter cordon between Delhi Police and BSES Electricity Board. Human authorization requested for feeder isolation.",
    timestamp: "8 mins ago"
  }
};
