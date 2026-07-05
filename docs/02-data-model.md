# 02 — Data Model

One demo district, ~10 facilities (PHCs + CHCs), seeded as `backend/data/seed_district.json`.

## Entities

### District
```
id, name, state, population, facility_ids[]
```

### Facility (PHC/CHC)
```
id, name, type ("PHC" | "CHC"), lat, lng, address,
capacity: { beds_total },
performance_score: { overall, inventory, attendance, diagnostics, patient_wait, forecast_accuracy },
risk_level: "healthy" | "monitor" | "stress" | "critical"
```

### Medicine Stock (per facility)
```
facility_id, medicine_name, units_remaining, avg_daily_consumption,
days_remaining (derived), risk ("low"|"medium"|"high"),
reorder_threshold
```

### Footfall Record (per facility, daily + forecast)
```
facility_id, date, actual_count (nullable if forecast),
predicted_count, confidence, breakdown: { children, women, elderly, emergency, general }
```

### Bed Status (per facility, current + forecast)
```
facility_id, date, occupied, total, occupancy_pct (derived),
predicted_occupancy_pct (tomorrow / next_week)
```

### Doctor Attendance
```
facility_id, doctor_id, doctor_name, specialty,
attendance_log: [{ date, present: bool }],
absence_pattern (derived, e.g. "5 consecutive Mondays"),
risk_level, patient_delay_pct
```

### Diagnostic Availability
```
facility_id, test_name ("Blood Test" | "X-Ray" | ...),
status: "available" | "unavailable" | "machine_failure",
nearest_alternative_facility_id, distance_km
```

### AI Recommendation
```
id, type: "stock_transfer" | "staff_transfer" | "bed_redirect" | "diagnostic_redirect",
source_facility_id, target_facility_id,
subject (e.g. medicine name / doctor / department),
quantity_or_detail,
confidence (0-100),
reasons: string[],           # explainability factors
status: "pending" | "approved" | "rejected" | "modified",
created_at, resolved_at, resolved_by
```

### Alert
```
id, facility_id, severity: "info"|"warning"|"critical",
title, detail, related_recommendation_id, created_at
```

### Analytics Causal Chain
```
facility_id, headline (e.g. "Why medicines increased"),
chain: string[]   # e.g. ["Rainfall", "Dengue cluster", "School reopening", "Higher fever cases"]
```

## Notes
- All "predicted" fields carry a paired `confidence` (0–100) and a `factors[]` explaining the prediction — this is a first-class contract, not an afterthought, per the Core AI Principle in [00-vision.md](00-vision.md).
- `risk_level` on Facility is derived server-side from the worst of its inventory/attendance/bed/diagnostic risk states, and drives the map + heatmap colors defined in [08-design-system.md](08-design-system.md).
