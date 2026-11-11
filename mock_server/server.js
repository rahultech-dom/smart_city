// Zero-dependency Node.js HTTP Mock Server for Smart City Departmental AI Agents
const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 5050;

const commandAlerts = [];
const smsNotifications = [];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data, null, 2));
}

function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const parsed = body ? JSON.parse(body) : {};
      callback(null, parsed);
    } catch (e) {
      callback(e, null);
    }
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  const query = parsedUrl.query;

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);

  // Root Health
  if (pathname === '/' && method === 'GET') {
    return sendJson(res, 200, {
      status: 'online',
      service: 'Smart City Departmental AI Agents Mock Services',
      timestamp: new Date().toISOString(),
      endpoints: [
        'GET /api/v1/maps/traffic?lat=28.58&lng=77.16',
        'GET /api/v1/maps/directions',
        'GET /api/v1/weather?lat=28.58&lng=77.16',
        'GET /api/v1/environment/aqi?station_id=STN-03',
        'POST /api/v1/vision/analyze-waste',
        'GET /api/v1/energy/feeder-status?feeder_id=FDR-14',
        'GET /api/v1/database/nearby-complaints',
        'POST /api/v1/city-command/alert',
        'GET /api/v1/city-command/alerts',
        'POST /api/v1/notifications/sms'
      ]
    });
  }

  // 1. Traffic Data
  if (pathname === '/api/v1/maps/traffic' && method === 'GET') {
    return sendJson(res, 200, {
      location: { lat: parseFloat(query.lat) || 28.5828, lng: parseFloat(query.lng) || 77.1685 },
      road_name: 'Ring Road near Moti Bagh Flyover',
      current_speed_kmh: 6.5,
      typical_speed_kmh: 45.0,
      congestion_ratio: 0.14,
      congestion_status: 'SEVERE_JAM',
      active_incidents: [
        {
          type: 'ACCIDENT',
          description: 'Multi-vehicle collision blocking 2 eastbound lanes',
          reported_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        }
      ],
      delay_seconds: 1420
    });
  }

  // Traffic Directions (Alternatives)
  if (pathname === '/api/v1/maps/directions' && method === 'GET') {
    return sendJson(res, 200, {
      status: 'OK',
      routes: [
        {
          route_name: 'Bypass via Africa Avenue & Benito Juarez Marg',
          via_roads: ['Africa Avenue', 'Benito Juarez Marg', 'Rao Tula Ram Marg'],
          distance_km: 7.2,
          duration_mins: 14,
          delay_mins: 2,
          traffic_condition: 'CLEAR'
        },
        {
          route_name: 'Diversion via Shanti Path & Chanakyapuri Outer Route',
          via_roads: ['Shanti Path', 'Vinay Marg', 'Brigadier Hoshiar Singh Marg'],
          distance_km: 8.5,
          duration_mins: 18,
          delay_mins: 4,
          traffic_condition: 'MODERATE'
        }
      ]
    });
  }

  // 2. Weather & Precipitation
  if (pathname === '/api/v1/weather' && method === 'GET') {
    return sendJson(res, 200, {
      location: { lat: parseFloat(query.lat) || 28.5135, lng: parseFloat(query.lng) || 77.2882 },
      weather_condition: 'RAIN',
      precipitation_rate_mm_hr: 38.5,
      rainfall_past_3h_mm: 72.0,
      wind_speed_kmh: 18.2,
      temperature_c: 24.5,
      humidity_percent: 94,
      flood_advisory_active: true
    });
  }

  // 3. Environmental AQI
  if (pathname === '/api/v1/environment/aqi' && method === 'GET') {
    return sendJson(res, 200, {
      station_id: query.station_id || 'STN-ANAND-VIHAR-03',
      station_name: 'Anand Vihar Eco Monitoring Station',
      timestamp: new Date().toISOString(),
      aqi: 382,
      category: 'VERY_POOR',
      dominant_pollutant: 'PM2.5',
      pollutants: {
        pm25: { value: 245.8, unit: 'ug/m3', standard: 60 },
        pm10: { value: 395.2, unit: 'ug/m3', standard: 100 },
        no2: { value: 92.4, unit: 'ug/m3', standard: 80 },
        co: { value: 3.8, unit: 'mg/m3', standard: 2.0 },
        o3: { value: 48.0, unit: 'ug/m3', standard: 100 }
      },
      meteorological: {
        temperature_c: 19.2,
        humidity_percent: 88,
        wind_speed_kmh: 3.2,
        thermal_inversion_detected: true
      },
      grap_stage: 'STAGE_III_SEVERE_RESTRICTIONS'
    });
  }

  // 4. Waste Vision Analysis
  if (pathname === '/api/v1/vision/analyze-waste' && method === 'POST') {
    return parseBody(req, (err, body) => {
      sendJson(res, 200, {
        analysis_id: 'VIS-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        is_waste_present: true,
        bin_detected: true,
        overflow_percentage: 92,
        debris_classification: [
          { type: 'MUNICIPAL_SOLID_WASTE', confidence: 0.96 },
          { type: 'PLASTIC_PACKAGING', confidence: 0.89 },
          { type: 'ORGANIC_FOOD_WASTE', confidence: 0.84 }
        ],
        spillover_area_sq_meters: 14.8,
        footpath_blocked: true,
        sanitation_risk_score: 9.2,
        recommended_crew: 'Compactor Truck Team (3 sanitation workers)'
      });
    });
  }

  // 5. Energy Feeder Status
  if (pathname === '/api/v1/energy/feeder-status' && method === 'GET') {
    const feeder_id = query.feeder_id || 'FDR-MUNIRKA-15';
    return sendJson(res, 200, {
      feeder_id: feeder_id,
      substation: 'Munirka 66/11kV Substation',
      breaker_status: 'TRIPPED',
      last_trip_time: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
      voltage_line_to_ground_kv: 0.0,
      nominal_voltage_kv: 11.0,
      load_current_amps: 0.0,
      affected_streetlight_circuits: ['CKT-ORR-A', 'CKT-ORR-B'],
      estimated_outage_length_meters: 1600,
      suspected_fault: 'EARTH_FAULT_INTERMITTENT'
    });
  }

  // 6. Database Nearby Complaints
  if (pathname === '/api/v1/database/nearby-complaints' && method === 'GET') {
    const mockComplaints = [
      {
        id: 'HIST-01',
        category: query.category || 'water',
        description: 'Severe waterlogging underpass after moderate rain',
        reported_days_ago: 5,
        resolved: true
      },
      {
        id: 'HIST-02',
        category: query.category || 'water',
        description: 'Drain blocked with construction slurry and plastic bags',
        reported_days_ago: 12,
        resolved: false
      },
      {
        id: 'HIST-03',
        category: query.category || 'water',
        description: 'Inundation causing traffic stagnation up to 1.5km',
        reported_days_ago: 19,
        resolved: true
      }
    ];
    return sendJson(res, 200, {
      matched_count: mockComplaints.length,
      is_chronic_hotspot: mockComplaints.length >= 3,
      records: mockComplaints
    });
  }

  // 7. Public Safety SMS Alert
  if (pathname === '/api/v1/notifications/sms' && method === 'POST') {
    return parseBody(req, (err, body) => {
      const logEntry = {
        id: 'SMS-' + Date.now(),
        recipient: body.recipient || 'DUTY_OFFICER_DISPATCH',
        message: body.message || '',
        priority: body.priority || 'HIGH',
        sent_at: new Date().toISOString()
      };
      smsNotifications.push(logEntry);
      console.log(`[SMS ALERT SENT] to ${logEntry.recipient} | Priority: ${logEntry.priority}`);
      sendJson(res, 200, { success: true, dispatch_id: logEntry.id });
    });
  }

  // 8. City Command Agent Receiver Endpoint
  if (pathname === '/api/v1/city-command/alert' && method === 'POST') {
    return parseBody(req, (err, body) => {
      const alertRecord = {
        alert_id: 'CMD-ALT-' + Date.now(),
        source_agent: body.source_agent || 'unknown_departmental_agent',
        priority: body.priority || body.severity || 'HIGH',
        headline: body.command_alert_headline || body.headline || 'Departmental Incident Alert',
        payload: body,
        received_at: new Date().toISOString(),
        status: 'DISPATCHED_TO_UNIFIED_ACTION_SYSTEM'
      };
      commandAlerts.unshift(alertRecord);
      console.log(`================================================================`);
      console.log(`[CITY COMMAND AGENT ALERT RECEIVED]`);
      console.log(`From: ${alertRecord.source_agent} | Priority: ${alertRecord.priority}`);
      console.log(`Headline: ${alertRecord.headline}`);
      console.log(`Alert ID: ${alertRecord.alert_id}`);
      console.log(`================================================================`);
      sendJson(res, 200, {
        success: true,
        alert_id: alertRecord.alert_id,
        status: 'ACKNOWLEDGED_BY_CITY_COMMAND',
        unified_action_system_task_id: 'TASK-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        message: 'Incident coordinated by City Command Agent and assigned to Unified Action & Monitoring System.'
      });
    });
  }

  // Get alerts
  if (pathname === '/api/v1/city-command/alerts' && method === 'GET') {
    return sendJson(res, 200, {
      total: commandAlerts.length,
      alerts: commandAlerts
    });
  }

  // 404 Not Found
  return sendJson(res, 404, { error: 'Endpoint not found', path: pathname });
});

server.listen(PORT, () => {
  console.log(`Smart City Mock Server running on http://localhost:${PORT}`);
});
