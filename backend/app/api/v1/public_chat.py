from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_public_agent
from app.schemas.recommendation import AskRequest, AskResponse
from app.core.config import get_settings

router = APIRouter(prefix="/api/v1", tags=["public-chat"])


@router.post("/public-chat", response_model=AskResponse)
def public_chat(body: AskRequest, agent = Depends(get_public_agent)):
    settings = get_settings()
    if not settings.gemini_api_key:
        raise HTTPException(
            status_code=503,
            detail="Citizen Services are currently unavailable. GEMINI_API_KEY is not configured on the server."
        )
    return agent.ask(body.message)
