-- =====================================================================
-- SMART CITY MULTI-AGENT ARCHITECTURE: SEED DATA FOR TESTING
-- =====================================================================

INSERT INTO complaints (id, citizen_name, citizen_contact, category, description, address, latitude, longitude, ward_id, status)
VALUES
('CMP-TRF-001', 'Vikram Sen', '+91-9876543210', 'traffic', 'Major collision between truck and bus blocking both lanes on Ring Road near Moti Bagh flyover. Traffic backed up 2km.', 'Ring Road, Moti Bagh, New Delhi', 28.5828, 77.1685, 'WARD-14', 'ROUTED'),
('CMP-SAF-002', 'Sunita Rao', '+91-9811223344', 'safety', 'A live electric transmission pole has bent and wires are touching the fence right next to Government Boys Senior Secondary School gate.', 'Main Road, Sector 4, R.K. Puram', 28.5672, 77.1789, 'WARD-22', 'ROUTED'),
('CMP-WST-003', 'Aman Verma', '+91-9988776655', 'waste', 'Community dumpsters are overflowing onto the footpath since 3 days. Stray cattle and dogs scattering garbage on the road.', 'Market Road, Block B, Lajpat Nagar', 28.5700, 77.2435, 'WARD-08', 'ROUTED'),
('CMP-ENV-004', 'Dr. Reena Mehta', '+91-9765432109', 'environment', 'Extremely thick acrid smoke and burning smell from open waste burning site near industrial drain.', 'Anand Vihar Eco Area', 28.6469, 77.3160, 'WARD-03', 'ROUTED'),
('CMP-WTR-005', 'Rajesh Gupta', '+91-9123456780', 'water', 'Severe waterlogging at Pul Prahladpur underpass. Water level is around 3 feet, multiple cars stalled.', 'Pul Prahladpur Underpass, MB Road', 28.5135, 77.2882, 'WARD-19', 'ROUTED'),
('CMP-ENG-006', 'Kavita Joshi', '+91-9845012345', 'energy', 'All streetlights along 1.5 km stretch of Outer Ring Road service lane are completely dark for the 4th consecutive night.', 'Outer Ring Road Service Lane, Munirka', 28.5583, 77.1706, 'WARD-15', 'ROUTED')
ON CONFLICT (id) DO NOTHING;
