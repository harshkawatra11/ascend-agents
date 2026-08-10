import type { AgentTraceResponse } from "@/lib/agentTrace";

/**
 * A real captured run of GET /api/v1/agents/trace against the bundled seed
 * data, recorded on 2026-08-10 (see backend/app/services/recommendation_service.py
 * for the code that produced it). Used as the zero-backend fallback so the
 * agent console still shows genuine computation, clearly labelled as a
 * recording, when the API is unreachable.
 */
export const sampleTrace: AgentTraceResponse = {
  "steps": [
    {
      "seq": 1,
      "agent": "monitor",
      "kind": "scan",
      "message": "Scanning 8 facilities for medicine stock risk",
      "elapsed_us": 27,
      "detail": {
        "facility_count": 8
      },
      "facility_id": null,
      "facility_name": null,
      "subject": null
    },
    {
      "seq": 2,
      "agent": "monitor",
      "kind": "skip",
      "message": "Paracetamol at PHC Rural-14: 3.3 days remaining, risk=medium",
      "elapsed_us": 81,
      "detail": {
        "days_remaining": 3.3,
        "risk": "medium"
      },
      "facility_id": "phc_18",
      "facility_name": "PHC Rural-14",
      "subject": "Paracetamol"
    },
    {
      "seq": 3,
      "agent": "monitor",
      "kind": "detect",
      "message": "ORS at PHC Rural-14: 2.0 days remaining, HIGH RISK",
      "elapsed_us": 21,
      "detail": {
        "units_remaining": 40,
        "days_remaining": 2.0,
        "risk": "high"
      },
      "facility_id": "phc_18",
      "facility_name": "PHC Rural-14",
      "subject": "ORS"
    },
    {
      "seq": 4,
      "agent": "reason",
      "kind": "reject",
      "message": "PHC Sector-12: no ORS stock",
      "elapsed_us": 23,
      "detail": null,
      "facility_id": "phc_12",
      "facility_name": "PHC Sector-12",
      "subject": "ORS"
    },
    {
      "seq": 5,
      "agent": "reason",
      "kind": "reject",
      "message": "CHC East: no ORS stock",
      "elapsed_us": 16,
      "detail": null,
      "facility_id": "chc_east",
      "facility_name": "CHC East",
      "subject": "ORS"
    },
    {
      "seq": 6,
      "agent": "reason",
      "kind": "reject",
      "message": "PHC Nindar: no ORS stock",
      "elapsed_us": 13,
      "detail": null,
      "facility_id": "phc_09",
      "facility_name": "PHC Nindar",
      "subject": "ORS"
    },
    {
      "seq": 7,
      "agent": "reason",
      "kind": "candidate",
      "message": "PHC Bassi: 1025 units surplus, 9 km away",
      "elapsed_us": 74,
      "detail": {
        "surplus": 1025,
        "distance_km": 9.3
      },
      "facility_id": "phc_04",
      "facility_name": "PHC Bassi",
      "subject": "ORS"
    },
    {
      "seq": 8,
      "agent": "reason",
      "kind": "reject",
      "message": "PHC Chaksu: no ORS stock",
      "elapsed_us": 16,
      "detail": null,
      "facility_id": "phc_21",
      "facility_name": "PHC Chaksu",
      "subject": "ORS"
    },
    {
      "seq": 9,
      "agent": "reason",
      "kind": "reject",
      "message": "CHC North: no ORS stock",
      "elapsed_us": 11,
      "detail": null,
      "facility_id": "chc_north",
      "facility_name": "CHC North",
      "subject": "ORS"
    },
    {
      "seq": 10,
      "agent": "reason",
      "kind": "reject",
      "message": "PHC Phagi: no ORS stock",
      "elapsed_us": 10,
      "detail": null,
      "facility_id": "phc_27",
      "facility_name": "PHC Phagi",
      "subject": "ORS"
    },
    {
      "seq": 11,
      "agent": "reason",
      "kind": "rank",
      "message": "Ranked by (distance asc, surplus desc): PHC Bassi wins among 1 candidate(s)",
      "elapsed_us": 14,
      "detail": {
        "candidate_count": 1
      },
      "facility_id": "phc_04",
      "facility_name": "PHC Bassi",
      "subject": "ORS"
    },
    {
      "seq": 12,
      "agent": "reason",
      "kind": "score",
      "message": "confidence = 90x0.4 + 30 + 11 + 10 = 87",
      "elapsed_us": 28,
      "detail": {
        "forecast_conf": 90,
        "factor_score": 30,
        "logistics_score": 10.7,
        "safety_margin_score": 10,
        "confidence": 87
      },
      "facility_id": "phc_18",
      "facility_name": "PHC Rural-14",
      "subject": "ORS"
    },
    {
      "seq": 13,
      "agent": "act",
      "kind": "propose",
      "message": "Propose stock_transfer: 60 units ORS, PHC Bassi -> PHC Rural-14, confidence 87",
      "elapsed_us": 28,
      "detail": {
        "quantity": 60,
        "confidence": 87
      },
      "facility_id": "phc_18",
      "facility_name": "PHC Rural-14",
      "subject": "ORS"
    },
    {
      "seq": 14,
      "agent": "monitor",
      "kind": "detect",
      "message": "Adrenaline (Epinephrine) at PHC Rural-14: 2.5 days remaining, HIGH RISK",
      "elapsed_us": 11,
      "detail": {
        "units_remaining": 5,
        "days_remaining": 2.5,
        "risk": "high"
      },
      "facility_id": "phc_18",
      "facility_name": "PHC Rural-14",
      "subject": "Adrenaline (Epinephrine)"
    },
    {
      "seq": 15,
      "agent": "reason",
      "kind": "reject",
      "message": "PHC Sector-12: no Adrenaline (Epinephrine) stock",
      "elapsed_us": 13,
      "detail": null,
      "facility_id": "phc_12",
      "facility_name": "PHC Sector-12",
      "subject": "Adrenaline (Epinephrine)"
    },
    {
      "seq": 16,
      "agent": "reason",
      "kind": "reject",
      "message": "CHC East: no Adrenaline (Epinephrine) stock",
      "elapsed_us": 10,
      "detail": null,
      "facility_id": "chc_east",
      "facility_name": "CHC East",
      "subject": "Adrenaline (Epinephrine)"
    },
    {
      "seq": 17,
      "agent": "reason",
      "kind": "reject",
      "message": "PHC Nindar: no Adrenaline (Epinephrine) stock",
      "elapsed_us": 10,
      "detail": null,
      "facility_id": "phc_09",
      "facility_name": "PHC Nindar",
      "subject": "Adrenaline (Epinephrine)"
    },
    {
      "seq": 18,
      "agent": "reason",
      "kind": "reject",
      "message": "PHC Bassi: no Adrenaline (Epinephrine) stock",
      "elapsed_us": 9,
      "detail": null,
      "facility_id": "phc_04",
      "facility_name": "PHC Bassi",
      "subject": "Adrenaline (Epinephrine)"
    },
    {
      "seq": 19,
      "agent": "reason",
      "kind": "reject",
      "message": "PHC Chaksu: no Adrenaline (Epinephrine) stock",
      "elapsed_us": 9,
      "detail": null,
      "facility_id": "phc_21",
      "facility_name": "PHC Chaksu",
      "subject": "Adrenaline (Epinephrine)"
    },
    {
      "seq": 20,
      "agent": "reason",
      "kind": "reject",
      "message": "CHC North: no Adrenaline (Epinephrine) stock",
      "elapsed_us": 9,
      "detail": null,
      "facility_id": "chc_north",
      "facility_name": "CHC North",
      "subject": "Adrenaline (Epinephrine)"
    },
    {
      "seq": 21,
      "agent": "reason",
      "kind": "reject",
      "message": "PHC Phagi: no Adrenaline (Epinephrine) stock",
      "elapsed_us": 9,
      "detail": null,
      "facility_id": "phc_27",
      "facility_name": "PHC Phagi",
      "subject": "Adrenaline (Epinephrine)"
    },
    {
      "seq": 22,
      "agent": "reason",
      "kind": "reject",
      "message": "No facility has usable Adrenaline (Epinephrine) surplus for PHC Rural-14",
      "elapsed_us": 6,
      "detail": null,
      "facility_id": "phc_18",
      "facility_name": "PHC Rural-14",
      "subject": "Adrenaline (Epinephrine)"
    },
    {
      "seq": 23,
      "agent": "monitor",
      "kind": "skip",
      "message": "Paracetamol at PHC Sector-12: 54.2 days remaining, risk=low",
      "elapsed_us": 34,
      "detail": {
        "days_remaining": 54.2,
        "risk": "low"
      },
      "facility_id": "phc_12",
      "facility_name": "PHC Sector-12",
      "subject": "Paracetamol"
    },
    {
      "seq": 24,
      "agent": "monitor",
      "kind": "skip",
      "message": "Tetanus Toxoid (TT) at PHC Sector-12: 13.6 days remaining, risk=low",
      "elapsed_us": 9,
      "detail": {
        "days_remaining": 13.6,
        "risk": "low"
      },
      "facility_id": "phc_12",
      "facility_name": "PHC Sector-12",
      "subject": "Tetanus Toxoid (TT)"
    },
    {
      "seq": 25,
      "agent": "monitor",
      "kind": "skip",
      "message": "Anti-Rabies Vaccine (ARV) at CHC East: 50.0 days remaining, risk=low",
      "elapsed_us": 24,
      "detail": {
        "days_remaining": 50.0,
        "risk": "low"
      },
      "facility_id": "chc_east",
      "facility_name": "CHC East",
      "subject": "Anti-Rabies Vaccine (ARV)"
    },
    {
      "seq": 26,
      "agent": "monitor",
      "kind": "skip",
      "message": "Oxytocin at CHC East: 44.0 days remaining, risk=low",
      "elapsed_us": 8,
      "detail": {
        "days_remaining": 44.0,
        "risk": "low"
      },
      "facility_id": "chc_east",
      "facility_name": "CHC East",
      "subject": "Oxytocin"
    },
    {
      "seq": 27,
      "agent": "monitor",
      "kind": "skip",
      "message": "Paracetamol at PHC Nindar: 14.3 days remaining, risk=low",
      "elapsed_us": 22,
      "detail": {
        "days_remaining": 14.3,
        "risk": "low"
      },
      "facility_id": "phc_09",
      "facility_name": "PHC Nindar",
      "subject": "Paracetamol"
    },
    {
      "seq": 28,
      "agent": "monitor",
      "kind": "skip",
      "message": "Oxytocin at PHC Nindar: 3.8 days remaining, risk=medium",
      "elapsed_us": 8,
      "detail": {
        "days_remaining": 3.8,
        "risk": "medium"
      },
      "facility_id": "phc_09",
      "facility_name": "PHC Nindar",
      "subject": "Oxytocin"
    },
    {
      "seq": 29,
      "agent": "monitor",
      "kind": "skip",
      "message": "ORS at PHC Bassi: 73.3 days remaining, risk=low",
      "elapsed_us": 22,
      "detail": {
        "days_remaining": 73.3,
        "risk": "low"
      },
      "facility_id": "phc_04",
      "facility_name": "PHC Bassi",
      "subject": "ORS"
    },
    {
      "seq": 30,
      "agent": "monitor",
      "kind": "skip",
      "message": "Tetanus Toxoid (TT) at PHC Bassi: 23.3 days remaining, risk=low",
      "elapsed_us": 7,
      "detail": {
        "days_remaining": 23.3,
        "risk": "low"
      },
      "facility_id": "phc_04",
      "facility_name": "PHC Bassi",
      "subject": "Tetanus Toxoid (TT)"
    },
    {
      "seq": 31,
      "agent": "monitor",
      "kind": "skip",
      "message": "Anti-Rabies Vaccine (ARV) at PHC Chaksu: 4.0 days remaining, risk=medium",
      "elapsed_us": 16,
      "detail": {
        "days_remaining": 4.0,
        "risk": "medium"
      },
      "facility_id": "phc_21",
      "facility_name": "PHC Chaksu",
      "subject": "Anti-Rabies Vaccine (ARV)"
    },
    {
      "seq": 32,
      "agent": "monitor",
      "kind": "skip",
      "message": "Anti-Snake Venom (ASV) at CHC North: 26.7 days remaining, risk=low",
      "elapsed_us": 20,
      "detail": {
        "days_remaining": 26.7,
        "risk": "low"
      },
      "facility_id": "chc_north",
      "facility_name": "CHC North",
      "subject": "Anti-Snake Venom (ASV)"
    },
    {
      "seq": 33,
      "agent": "monitor",
      "kind": "skip",
      "message": "Tetanus Toxoid (TT) at CHC North: 26.2 days remaining, risk=low",
      "elapsed_us": 6,
      "detail": {
        "days_remaining": 26.2,
        "risk": "low"
      },
      "facility_id": "chc_north",
      "facility_name": "CHC North",
      "subject": "Tetanus Toxoid (TT)"
    },
    {
      "seq": 34,
      "agent": "monitor",
      "kind": "skip",
      "message": "Paracetamol at PHC Phagi: 11.2 days remaining, risk=low",
      "elapsed_us": 19,
      "detail": {
        "days_remaining": 11.2,
        "risk": "low"
      },
      "facility_id": "phc_27",
      "facility_name": "PHC Phagi",
      "subject": "Paracetamol"
    },
    {
      "seq": 35,
      "agent": "monitor",
      "kind": "detect",
      "message": "Anti-Snake Venom (ASV) at PHC Phagi: 2.0 days remaining, HIGH RISK",
      "elapsed_us": 7,
      "detail": {
        "units_remaining": 4,
        "days_remaining": 2.0,
        "risk": "high"
      },
      "facility_id": "phc_27",
      "facility_name": "PHC Phagi",
      "subject": "Anti-Snake Venom (ASV)"
    },
    {
      "seq": 36,
      "agent": "reason",
      "kind": "reject",
      "message": "PHC Rural-14: no Anti-Snake Venom (ASV) stock",
      "elapsed_us": 13,
      "detail": null,
      "facility_id": "phc_18",
      "facility_name": "PHC Rural-14",
      "subject": "Anti-Snake Venom (ASV)"
    },
    {
      "seq": 37,
      "agent": "reason",
      "kind": "reject",
      "message": "PHC Sector-12: no Anti-Snake Venom (ASV) stock",
      "elapsed_us": 9,
      "detail": null,
      "facility_id": "phc_12",
      "facility_name": "PHC Sector-12",
      "subject": "Anti-Snake Venom (ASV)"
    },
    {
      "seq": 38,
      "agent": "reason",
      "kind": "reject",
      "message": "CHC East: no Anti-Snake Venom (ASV) stock",
      "elapsed_us": 9,
      "detail": null,
      "facility_id": "chc_east",
      "facility_name": "CHC East",
      "subject": "Anti-Snake Venom (ASV)"
    },
    {
      "seq": 39,
      "agent": "reason",
      "kind": "reject",
      "message": "PHC Nindar: no Anti-Snake Venom (ASV) stock",
      "elapsed_us": 45,
      "detail": null,
      "facility_id": "phc_09",
      "facility_name": "PHC Nindar",
      "subject": "Anti-Snake Venom (ASV)"
    },
    {
      "seq": 40,
      "agent": "reason",
      "kind": "reject",
      "message": "PHC Bassi: no Anti-Snake Venom (ASV) stock",
      "elapsed_us": 9,
      "detail": null,
      "facility_id": "phc_04",
      "facility_name": "PHC Bassi",
      "subject": "Anti-Snake Venom (ASV)"
    },
    {
      "seq": 41,
      "agent": "reason",
      "kind": "reject",
      "message": "PHC Chaksu: no Anti-Snake Venom (ASV) stock",
      "elapsed_us": 8,
      "detail": null,
      "facility_id": "phc_21",
      "facility_name": "PHC Chaksu",
      "subject": "Anti-Snake Venom (ASV)"
    },
    {
      "seq": 42,
      "agent": "reason",
      "kind": "candidate",
      "message": "CHC North: 65 units surplus, 48 km away",
      "elapsed_us": 35,
      "detail": {
        "surplus": 65,
        "distance_km": 47.5
      },
      "facility_id": "chc_north",
      "facility_name": "CHC North",
      "subject": "Anti-Snake Venom (ASV)"
    },
    {
      "seq": 43,
      "agent": "reason",
      "kind": "rank",
      "message": "Ranked by (distance asc, surplus desc): CHC North wins among 1 candidate(s)",
      "elapsed_us": 20,
      "detail": {
        "candidate_count": 1
      },
      "facility_id": "chc_north",
      "facility_name": "CHC North",
      "subject": "Anti-Snake Venom (ASV)"
    },
    {
      "seq": 44,
      "agent": "reason",
      "kind": "score",
      "message": "confidence = 80x0.4 + 10 + 0 + 10 = 52",
      "elapsed_us": 30,
      "detail": {
        "forecast_conf": 80,
        "factor_score": 10,
        "logistics_score": 0,
        "safety_margin_score": 10,
        "confidence": 52
      },
      "facility_id": "phc_27",
      "facility_name": "PHC Phagi",
      "subject": "Anti-Snake Venom (ASV)"
    },
    {
      "seq": 45,
      "agent": "act",
      "kind": "propose",
      "message": "Propose stock_transfer: 6 units Anti-Snake Venom (ASV), CHC North -> PHC Phagi, confidence 52",
      "elapsed_us": 35,
      "detail": {
        "quantity": 6,
        "confidence": 52
      },
      "facility_id": "phc_27",
      "facility_name": "PHC Phagi",
      "subject": "Anti-Snake Venom (ASV)"
    },
    {
      "seq": 46,
      "agent": "monitor",
      "kind": "scan",
      "message": "Scanning 4 bed forecasts for occupancy risk",
      "elapsed_us": 38,
      "detail": {
        "bed_count": 4
      },
      "facility_id": null,
      "facility_name": null,
      "subject": null
    },
    {
      "seq": 47,
      "agent": "monitor",
      "kind": "detect",
      "message": "Bed occupancy at phc_18: 97% next week, HIGH RISK",
      "elapsed_us": 10,
      "detail": {
        "predicted_pct": 97
      },
      "facility_id": "phc_18",
      "facility_name": null,
      "subject": null
    },
    {
      "seq": 48,
      "agent": "reason",
      "kind": "rank",
      "message": "CHC East selected among 2 CHC candidate(s)",
      "elapsed_us": 12,
      "detail": {
        "candidate_count": 2
      },
      "facility_id": "chc_east",
      "facility_name": "CHC East",
      "subject": null
    },
    {
      "seq": 49,
      "agent": "act",
      "kind": "propose",
      "message": "Propose bed_redirect: maternity admissions, phc_18 -> CHC East, confidence 88",
      "elapsed_us": 11,
      "detail": {
        "confidence": 88
      },
      "facility_id": "chc_east",
      "facility_name": "CHC East",
      "subject": "Maternity Cases"
    },
    {
      "seq": 50,
      "agent": "monitor",
      "kind": "detect",
      "message": "Bed occupancy at phc_09: 96% next week, HIGH RISK",
      "elapsed_us": 18,
      "detail": {
        "predicted_pct": 96
      },
      "facility_id": "phc_09",
      "facility_name": null,
      "subject": null
    },
    {
      "seq": 51,
      "agent": "reason",
      "kind": "rank",
      "message": "CHC East selected among 2 CHC candidate(s)",
      "elapsed_us": 12,
      "detail": {
        "candidate_count": 2
      },
      "facility_id": "chc_east",
      "facility_name": "CHC East",
      "subject": null
    },
    {
      "seq": 52,
      "agent": "act",
      "kind": "propose",
      "message": "Propose bed_redirect: maternity admissions, phc_09 -> CHC East, confidence 88",
      "elapsed_us": 10,
      "detail": {
        "confidence": 88
      },
      "facility_id": "chc_east",
      "facility_name": "CHC East",
      "subject": "Maternity Cases"
    },
    {
      "seq": 53,
      "agent": "monitor",
      "kind": "skip",
      "message": "Bed occupancy at chc_east: 60% next week, within threshold",
      "elapsed_us": 6,
      "detail": {
        "predicted_pct": 60
      },
      "facility_id": "chc_east",
      "facility_name": null,
      "subject": null
    },
    {
      "seq": 54,
      "agent": "monitor",
      "kind": "skip",
      "message": "Bed occupancy at phc_12: 50% next week, within threshold",
      "elapsed_us": 14,
      "detail": {
        "predicted_pct": 50
      },
      "facility_id": "phc_12",
      "facility_name": null,
      "subject": null
    },
    {
      "seq": 55,
      "agent": "monitor",
      "kind": "scan",
      "message": "Scanning 2 doctor attendance records",
      "elapsed_us": 10,
      "detail": {
        "doctor_count": 2
      },
      "facility_id": null,
      "facility_name": null,
      "subject": null
    },
    {
      "seq": 56,
      "agent": "monitor",
      "kind": "detect",
      "message": "Dr. Meera Singh at phc_27: absent 5 consecutive Mondays, HIGH RISK",
      "elapsed_us": 10,
      "detail": {
        "absence_pattern": "5 consecutive Mondays",
        "patient_delay_pct": 38
      },
      "facility_id": "phc_27",
      "facility_name": null,
      "subject": "Dr. Meera Singh"
    },
    {
      "seq": 57,
      "agent": "reason",
      "kind": "rank",
      "message": "PHC Rural-14 selected among 7 candidate(s)",
      "elapsed_us": 12,
      "detail": {
        "candidate_count": 7
      },
      "facility_id": "phc_18",
      "facility_name": "PHC Rural-14",
      "subject": "Dr. Meera Singh"
    },
    {
      "seq": 58,
      "agent": "act",
      "kind": "propose",
      "message": "Propose staff_transfer: Dr. Meera Singh, PHC Rural-14 -> phc_27, confidence 81",
      "elapsed_us": 13,
      "detail": {
        "confidence": 81
      },
      "facility_id": "phc_27",
      "facility_name": null,
      "subject": "Dr. Meera Singh"
    },
    {
      "seq": 59,
      "agent": "monitor",
      "kind": "skip",
      "message": "Dr. Arvind Rao at chc_north: risk=low",
      "elapsed_us": 7,
      "detail": {
        "risk_level": "low"
      },
      "facility_id": "chc_north",
      "facility_name": null,
      "subject": "Dr. Arvind Rao"
    },
    {
      "seq": 60,
      "agent": "act",
      "kind": "summary",
      "message": "Cycle complete: 6 risk(s) detected, 2 candidate(s) examined, 20 rejected, 5 proposal(s) emitted",
      "elapsed_us": 78,
      "detail": {
        "facilities_scanned": 8,
        "risks_detected": 6,
        "candidates_examined": 2,
        "candidates_rejected": 20,
        "proposals_emitted": 5
      },
      "facility_id": null,
      "facility_name": null,
      "subject": null
    }
  ],
  "proposals": [
    {
      "id": "rec_006",
      "type": "stock_transfer",
      "source_facility_id": "phc_04",
      "target_facility_id": "phc_18",
      "subject": "ORS",
      "quantity_or_detail": "60 units",
      "confidence": 87,
      "reasons": [
        "Projected stock depletion in 2.0 days",
        "Rain forecast increasing fever cases districtwide",
        "Recent dengue cluster trend near PHC Rural-14",
        "Projected heatwave next 5 days (+72% demand)",
        "PHC Bassi has surplus, 9 km away"
      ],
      "status": "pending",
      "live_id": "rec_001",
      "live_status": "pending"
    },
    {
      "id": "rec_007",
      "type": "stock_transfer",
      "source_facility_id": "chc_north",
      "target_facility_id": "phc_27",
      "subject": "Anti-Snake Venom (ASV)",
      "quantity_or_detail": "6 units",
      "confidence": 52,
      "reasons": [
        "Projected stock depletion in 2.0 days",
        "Historical consumption trend",
        "CHC North has surplus, 48 km away"
      ],
      "status": "pending",
      "live_id": "rec_002",
      "live_status": "pending"
    },
    {
      "id": "rec_008",
      "type": "bed_redirect",
      "source_facility_id": "phc_18",
      "target_facility_id": "chc_east",
      "subject": "Maternity Cases",
      "quantity_or_detail": "Redirect new admissions",
      "confidence": 88,
      "reasons": [
        "Bed occupancy forecast: 97% next week",
        "CHC East has available maternity capacity"
      ],
      "status": "pending",
      "live_id": "rec_003",
      "live_status": "pending"
    },
    {
      "id": "rec_009",
      "type": "bed_redirect",
      "source_facility_id": "phc_09",
      "target_facility_id": "chc_east",
      "subject": "Maternity Cases",
      "quantity_or_detail": "Redirect new admissions",
      "confidence": 88,
      "reasons": [
        "Bed occupancy forecast: 96% next week",
        "CHC East has available maternity capacity"
      ],
      "status": "pending",
      "live_id": "rec_004",
      "live_status": "pending"
    },
    {
      "id": "rec_010",
      "type": "staff_transfer",
      "source_facility_id": "phc_18",
      "target_facility_id": "phc_27",
      "subject": "Dr. Meera Singh (General Physician)",
      "quantity_or_detail": "Temporary 2-week transfer",
      "confidence": 81,
      "reasons": [
        "Doctor absent 5 consecutive Mondays",
        "Projected patient delay of 38% if unresolved",
        "PHC Rural-14 has attendance slack this cycle"
      ],
      "status": "pending",
      "live_id": "rec_005",
      "live_status": "pending"
    }
  ],
  "summary": {
    "facilities_scanned": 8,
    "risks_detected": 6,
    "candidates_examined": 2,
    "candidates_rejected": 20,
    "proposals_emitted": 5,
    "total_duration_us": 1124
  },
  "data_source": "seed",
  "data_version": 0
} as AgentTraceResponse;
