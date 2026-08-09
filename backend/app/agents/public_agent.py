"""Public Agent for Citizen Services.

Agent loop: user message -> Gemini decides which tool(s) to call -> tools
execute -> results fed back -> final natural-language answer.
Max 5 iterations with a graceful fallback.

Uses the `google-genai` SDK.
"""

import logging

from app.core.config import Settings
from app.prompts.system_prompt import SYSTEM_PROMPT
from app.tools.emergency_tool import get_emergency_guidance
from app.tools.maps_tool import find_nearby_phc

logger = logging.getLogger(__name__)

MAX_TOOL_ITERATIONS = 5

FALLBACK_MESSAGE = (
    "Citizen Services are currently unavailable. No GEMINI_API_KEY is configured "
    "or the Gemini API could not be reached."
)


class PublicAgent:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.tools = [get_emergency_guidance, find_nearby_phc]
        self._client = None

        if settings.gemini_api_key:
            try:
                from google import genai

                self._client = genai.Client(api_key=settings.gemini_api_key)
            except Exception:
                logger.exception("Failed to initialize Gemini client for PublicAgent")
                self._client = None

    def ask(self, message: str) -> dict:
        if self._client is None:
            return {"answer": FALLBACK_MESSAGE, "tool_calls": [], "confidence": None}

        try:
            from google.genai import types

            # Adjust system instruction for citizens
            citizen_instruction = (
                SYSTEM_PROMPT + "\n\nYou are talking to a citizen or patient. "
                "Provide direct, helpful, and compassionate answers. If they ask "
                "about emergencies, always direct them to 108. If they ask about "
                "nearby hospitals, use your tools to find one."
            )

            chat = self._client.chats.create(
                model=self.settings.gemini_model,
                config=types.GenerateContentConfig(
                    system_instruction=citizen_instruction,
                    tools=self.tools,
                ),
            )
            response = chat.send_message(message)
            tool_calls = [
                part.function_call.name
                for content in chat.get_history()
                for part in (content.parts or [])
                if getattr(part, "function_call", None)
            ][:MAX_TOOL_ITERATIONS]
            return {
                "answer": response.text,
                "tool_calls": tool_calls,
                "confidence": 90 if tool_calls else 70,
            }
        except Exception:
            logger.exception("Gemini agent loop failed in PublicAgent")
            return {"answer": FALLBACK_MESSAGE, "tool_calls": [], "confidence": None}
