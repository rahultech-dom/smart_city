-- =====================================================================
-- SMART CITY MULTI-AGENT ARCHITECTURE: UNIFIED DATABASE SCHEMA
-- Compatible with PostgreSQL, Supabase, and SQLite (via standard types)
-- =====================================================================

-- 1. Main Citizen Complaints & Ingestion Table (From City Complaint Agent)
CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(64) PRIMARY KEY,
    citizen_name VARCHAR(128),
    citizen_contact VARCHAR(64),
    category VARCHAR(64) NOT NULL, -- traffic, safety, waste, environment, water, energy
    description TEXT NOT NULL,
    image_url TEXT,
    address TEXT,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    ward_id VARCHAR(32),
    status VARCHAR(32) DEFAULT 'PENDING_TRIAGE', -- PENDING_TRIAGE, ROUTED, IN_PROGRESS, RESOLVED, ESCALATED
    assigned_agent VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Agent 3: Traffic Incidents & Congestion Reports
CREATE TABLE IF NOT EXISTS traffic_incidents (
    incident_id VARCHAR(64) PRIMARY KEY,
    complaint_id VARCHAR(64) REFERENCES complaints(id),
    road_name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    congestion_level VARCHAR(32), -- LOW, MODERATE, SEVERE, STANDSTILL
    speed_kmh INT,
    incident_type VARCHAR(64), -- ACCIDENT, ROAD_WORK, WATERLOGGING, PROTEST, VEHICLE_BREAKDOWN
    affected_radius_meters INT DEFAULT 500,
    alternative_routes JSONB, -- list of suggested bypass roads
    recommendations TEXT,
    escalate_to_command BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Agent 4: Public Safety Incidents
CREATE TABLE IF NOT EXISTS safety_incidents (
    incident_id VARCHAR(64) PRIMARY KEY,
    complaint_id VARCHAR(64) REFERENCES complaints(id),
    title VARCHAR(255) NOT NULL,
    risk_level VARCHAR(32) NOT NULL, -- CRITICAL, HIGH, MEDIUM, LOW
    hazard_type VARCHAR(64), -- FALLEN_ELECTRIC_POLE, GAS_LEAK, OPEN_MANHOLE, FIRE, BUILDING_CRACK, CROWD_SURGE
    location_description TEXT,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    near_sensitive_zone BOOLEAN DEFAULT FALSE, -- near school, hospital, petrol pump
    sensitive_zone_details TEXT,
    recommended_safety_measures TEXT,
    target_departments JSONB, -- ["Electricity Board", "City Police", "Fire Dept"]
    escalation_status VARCHAR(64),
    sms_alert_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Agent 5: Waste Management Incidents
CREATE TABLE IF NOT EXISTS waste_incidents (
    incident_id VARCHAR(64) PRIMARY KEY,
    complaint_id VARCHAR(64) REFERENCES complaints(id),
    location_address TEXT,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    ward_id VARCHAR(32),
    waste_type VARCHAR(64), -- MUNICIPAL_SOLID_WASTE, CONSTRUCTION_DEBRIS, HAZARDOUS, OVERFLOWING_BIN
    bin_overflow_percentage INT, -- 0 to 100%
    is_chronic_dumping_zone BOOLEAN DEFAULT FALSE,
    visual_analysis_summary TEXT,
    severity VARCHAR(32), -- ROUTINE, MODERATE, URGENT
    recommended_action TEXT,
    recommended_vehicle_type VARCHAR(64), -- COMPACTOR, TIPPER_TRUCK, MANUAL_CREW
    status VARCHAR(32) DEFAULT 'DISPATCH_REQUESTED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Agent 6: Environmental & AQI Telemetry & Alerts
CREATE TABLE IF NOT EXISTS environmental_readings (
    reading_id VARCHAR(64) PRIMARY KEY,
    station_id VARCHAR(64) NOT NULL,
    station_name VARCHAR(128),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    aqi INT NOT NULL,
    pm25 DECIMAL(6, 2),
    pm10 DECIMAL(6, 2),
    no2 DECIMAL(6, 2),
    co DECIMAL(6, 2),
    o3 DECIMAL(6, 2),
    category VARCHAR(32), -- GOOD, MODERATE, UNHEALTHY, VERY_UNHEALTHY, SEVERE
    weather_summary TEXT, -- wind speed, humidity, temp
    risk_assessment TEXT,
    recommended_mitigation TEXT, -- Anti-smog gun deployment, traffic curb, dust suppression
    escalate_to_command BOOLEAN DEFAULT FALSE,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Agent 7: Water & Drainage Incidents
CREATE TABLE IF NOT EXISTS water_incidents (
    incident_id VARCHAR(64) PRIMARY KEY,
    complaint_id VARCHAR(64) REFERENCES complaints(id),
    category VARCHAR(64) NOT NULL, -- WATERLOGGING, PIPELINE_LEAK, DRAINAGE_BLOCKAGE, CONTAMINATION, SUPPLY_OUTAGE
    location_description TEXT,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    rainfall_rate_mm_hr DECIMAL(5, 2),
    nearby_complaints_count INT DEFAULT 0,
    is_chronic_flood_zone BOOLEAN DEFAULT FALSE,
    severity VARCHAR(32), -- CRITICAL, HIGH, MEDIUM, LOW
    possible_cause TEXT,
    recommended_action TEXT, -- Deploy portable pump, Jetting machine, Valve cutoff
    assigned_subdivision VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Agent 8: Energy & Grid Incidents
CREATE TABLE IF NOT EXISTS energy_incidents (
    incident_id VARCHAR(64) PRIMARY KEY,
    complaint_id VARCHAR(64) REFERENCES complaints(id),
    issue_type VARCHAR(64) NOT NULL, -- POWER_OUTAGE, STREETLIGHT_FAILURE, TRANSFORMER_SPARK, CABLE_DAMAGE
    feeder_id VARCHAR(64),
    substation_name VARCHAR(128),
    affected_area TEXT,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    dark_corridor_safety_risk BOOLEAN DEFAULT FALSE,
    grid_sensor_status VARCHAR(64),
    priority VARCHAR(32), -- CRITICAL, HIGH, MEDIUM, LOW
    maintenance_recommendations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. City Command Agent Alerts (Unified Target for All 6 Agents)
CREATE TABLE IF NOT EXISTS command_agent_alerts (
    alert_id VARCHAR(64) PRIMARY KEY,
    source_agent VARCHAR(64) NOT NULL, -- traffic_agent, safety_agent, waste_agent, environment_agent, water_agent, energy_agent
    incident_reference_id VARCHAR(64) NOT NULL,
    priority_level VARCHAR(32) NOT NULL, -- CRITICAL, HIGH, MEDIUM, LOW
    headline VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(32) DEFAULT 'PENDING_COORDINATION', -- PENDING_COORDINATION, DISPATCHED_TO_UNIFIED_SYSTEM, ACKNOWLEDGED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Unified Action & Monitoring System Tasks
CREATE TABLE IF NOT EXISTS unified_tasks (
    task_id VARCHAR(64) PRIMARY KEY,
    command_alert_id VARCHAR(64) REFERENCES command_agent_alerts(alert_id),
    assigned_agency VARCHAR(128) NOT NULL,
    task_details TEXT NOT NULL,
    authority_approval_required BOOLEAN DEFAULT FALSE,
    approved_by VARCHAR(128),
    approved_at TIMESTAMP,
    execution_status VARCHAR(32) DEFAULT 'QUEUED', -- QUEUED, IN_PROGRESS, RESOLVED, VERIFIED
    citizen_notified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
