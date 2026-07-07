"""
Smart Health AI Platform — Gemini Tool: Emergency Guidance

Provides first-aid steps, emergency contacts, and referral guidance.

IMPORTANT: This tool provides general first-aid information only.
It CANNOT replace professional medical advice or emergency services.
Always direct users to call 108 (National Emergency) for life-threatening situations.
"""

from __future__ import annotations

from app.core.logging import get_logger

logger = get_logger(__name__)

# Emergency conditions and their guidance
EMERGENCY_GUIDANCE_DB: dict[str, dict] = {
    "chest_pain": {
        "condition": "Chest Pain / Suspected Heart Attack",
        "severity": "CRITICAL",
        "immediate_actions": [
            "🚨 Call 108 (National Emergency) IMMEDIATELY",
            "Keep the person calm and in a comfortable sitting or lying position",
            "Loosen tight clothing around the neck and chest",
            "Do NOT give food or water",
            "If person is unconscious and not breathing, start CPR if trained",
            "Chew 325mg Aspirin if not allergic and doctor advises",
        ],
        "do_not": [
            "Do NOT leave the person alone",
            "Do NOT give any medication without doctor's advice",
            "Do NOT delay — every minute counts in a heart attack",
        ],
        "nearest_resource": "Go to the nearest District Hospital with a Cardiac ICU",
        "helpline": "108 (Ambulance) | 112 (Emergency)",
    },
    "breathing_difficulty": {
        "condition": "Difficulty Breathing / Respiratory Distress",
        "severity": "CRITICAL",
        "immediate_actions": [
            "🚨 Call 108 immediately for severe breathing difficulty",
            "Help the person sit upright to ease breathing",
            "Loosen any tight clothing",
            "If they have an inhaler (asthma), help them use it",
            "Stay calm and reassure the person",
        ],
        "do_not": [
            "Do NOT make the person lie flat",
            "Do NOT leave them alone",
        ],
        "nearest_resource": "Nearest hospital with oxygen and emergency department",
        "helpline": "108 (Ambulance)",
    },
    "snake_bite": {
        "condition": "Snake Bite",
        "severity": "CRITICAL",
        "immediate_actions": [
            "🚨 Rush to the nearest hospital with anti-venom IMMEDIATELY",
            "Keep the person calm and still — movement speeds venom spread",
            "Immobilise the bitten limb below heart level",
            "Remove rings, watches, tight clothing near the bite",
            "Mark the time of the bite",
            "Note the snake's appearance if safe to do so (do NOT catch it)",
        ],
        "do_not": [
            "Do NOT cut and suck the wound",
            "Do NOT apply a tourniquet",
            "Do NOT apply ice",
            "Do NOT give alcohol or traditional remedies",
        ],
        "nearest_resource": "Government hospitals have anti-snake venom (ASV). Go immediately.",
        "helpline": "108 (Ambulance) | Poison Control: 1800-11-6117",
    },
    "fever": {
        "condition": "High Fever (above 104°F / 40°C)",
        "severity": "WARNING",
        "immediate_actions": [
            "Give Paracetamol (500mg for adults) — do NOT give Aspirin to children",
            "Apply lukewarm (not cold) wet cloth on forehead",
            "Ensure good hydration — ORS / water / coconut water",
            "Loosen clothing",
            "If fever lasts more than 3 days or is above 104°F, visit the PHC",
        ],
        "do_not": [
            "Do NOT give ice-cold water bath",
            "Do NOT self-medicate with antibiotics",
        ],
        "nearest_resource": "Visit your nearest PHC for diagnosis (malaria, dengue, typhoid test)",
        "helpline": "PHC helpline | 104 (State Health Helpline)",
    },
    "dehydration": {
        "condition": "Severe Dehydration / Diarrhea",
        "severity": "WARNING",
        "immediate_actions": [
            "Start ORS (Oral Rehydration Solution) immediately",
            "Give small sips every few minutes — 200ml after each loose stool",
            "ORS preparation: 1 litre water + 6 tsp sugar + 1/2 tsp salt",
            "Continue breastfeeding for infants",
            "Visit PHC if: not improving in 4 hours, blood in stool, or high fever",
        ],
        "do_not": [
            "Do NOT give carbonated drinks or fruit juice",
            "Do NOT stop eating — eat small, bland meals",
        ],
        "nearest_resource": "PHC provides free ORS packets and IV fluids if needed",
        "helpline": "104 (Health Helpline)",
    },
    "road_accident": {
        "condition": "Road Traffic Accident / Trauma",
        "severity": "CRITICAL",
        "immediate_actions": [
            "🚨 Call 108 (Ambulance) and 100 (Police) IMMEDIATELY",
            "Do NOT move the person if spinal injury is suspected",
            "Stop severe bleeding by applying firm pressure with clean cloth",
            "Keep the person conscious by talking to them",
            "The Golden Hour: hospital treatment within 60 minutes saves lives",
        ],
        "do_not": [
            "Do NOT remove objects pierced in the body",
            "Do NOT give food or water if surgery is likely",
        ],
        "nearest_resource": "Nearest trauma centre or District Hospital",
        "helpline": "108 (Ambulance) | 100 (Police) | 112 (Emergency)",
    },
}

# Keyword mapping to conditions
KEYWORD_MAP = {
    "chest pain": "chest_pain",
    "heart attack": "chest_pain",
    "cardiac": "chest_pain",
    "breathing": "breathing_difficulty",
    "breathless": "breathing_difficulty",
    "asthma": "breathing_difficulty",
    "snake": "snake_bite",
    "snakebite": "snake_bite",
    "fever": "fever",
    "high temperature": "fever",
    "diarrhea": "dehydration",
    "diarrhoea": "dehydration",
    "vomiting": "dehydration",
    "dehydration": "dehydration",
    "accident": "road_accident",
    "trauma": "road_accident",
    "injury": "road_accident",
}


def get_emergency_guidance(condition: str) -> dict:
    """
    Provide first-aid guidance and emergency referral information.

    Args:
        condition: Description of the emergency condition.

    Returns:
        dict with guidance, immediate_actions, and helplines.
    """
    condition_lower = condition.lower()

    # Try to match the condition to known emergency types
    matched_key = None
    for keyword, key in KEYWORD_MAP.items():
        if keyword in condition_lower:
            matched_key = key
            break

    if matched_key and matched_key in EMERGENCY_GUIDANCE_DB:
        guidance = EMERGENCY_GUIDANCE_DB[matched_key]
        logger.info("Emergency guidance provided", condition=condition, matched=matched_key)
        return {
            "condition": guidance["condition"],
            "severity": guidance["severity"],
            "immediate_actions": guidance["immediate_actions"],
            "do_not": guidance.get("do_not", []),
            "nearest_resource": guidance["nearest_resource"],
            "helpline": guidance["helpline"],
            "disclaimer": (
                "⚕️ This is general first-aid guidance. "
                "Always seek professional medical help immediately."
            ),
        }

    # Generic emergency response
    logger.info("Generic emergency guidance provided", condition=condition)
    return {
        "condition": f"Medical Emergency: {condition}",
        "severity": "UNKNOWN",
        "immediate_actions": [
            "🚨 Call 108 (National Ambulance) immediately for emergencies",
            "Keep the person calm and still",
            "Do NOT administer medications without medical advice",
            "Go to the nearest hospital emergency department",
        ],
        "do_not": ["Do NOT delay seeking medical care"],
        "nearest_resource": "Nearest hospital with emergency department",
        "helpline": "108 (Ambulance) | 112 (Emergency) | 104 (Health Helpline)",
        "disclaimer": (
            "⚕️ This is general guidance only. Please call emergency services immediately."
        ),
    }


EMERGENCY_TOOL_DECLARATION = {
    "name": "get_emergency_guidance",
    "description": (
        "Get first-aid guidance and emergency referral information for medical emergencies. "
        "Use when the user describes symptoms that could be life-threatening or asks about "
        "emergency procedures. Always direct life-threatening cases to call 108."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "condition": {
                "type": "string",
                "description": "Description of the emergency condition or symptoms.",
            },
        },
        "required": ["condition"],
    },
}
