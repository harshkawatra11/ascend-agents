# 10 — Demo Script

Do not open with "here is our dashboard." Open with a story.

## The Narrative (2–3 minutes)

1. **Setup**: "PHC-18, a rural facility, uploads its daily inventory and attendance data — as it does every morning."
2. **Detection**: "SwasthyaGrid's AI detects that its Paracetamol stock will run out in 3.4 days — and cross-references a weather forecast showing rain, which historically drives up dengue-related footfall in this district."
3. **Search**: "It scans the district and finds PHC-12, six kilometers away, sitting on a surplus of 650 strips."
4. **Recommendation**: "It proposes transferring 250 strips — not silently, but as a recommendation card with a 96% confidence score and the four reasons behind it."
5. **Human governance**: "The district administrator reviews it, adjusts the quantity if needed, and clicks Approve."
6. **Feedback loop**: "The district map updates immediately — PHC-18's risk marker drops from red to green. The Resource Transfers log records the action."
7. **Payoff**: "The analytics panel shows the counterfactual: early intervention avoided a stock-out and an estimated 38% reduction in patient wait times."
8. **Close**: "This is Google Maps for district healthcare operations — except instead of routing cars, it's routing medicine, doctors, and beds across 50+ health centres, with AI as a copilot, never the driver."

## What to Show Live
1. District Overview + Map (visual "wow", risk colors legible at a glance).
2. One AI Recommendation card — zoom in on confidence + reasons.
3. Click Approve → show the map/log update live.
4. Open "Ask SwasthyaGrid" → ask a real question, get a grounded answer.
5. Performance Score panel — "the admin instantly knows which PHCs need help."

## Judge Talking Points
- Predictive, prescriptive, explainable, human-governed — say this framing explicitly.
- Every AI number on screen has a confidence score and a reason list — point at one.
- This is a decision-support system for how public health administrators actually work, not an autonomous agent making unilateral calls.
- Architecture is designed to plug into real GCP services (Firestore, Vertex AI, BigQuery) without a rewrite — this is a prototype of a real system, not a demo-only mockup.
