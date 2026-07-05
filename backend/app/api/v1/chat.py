from fastapi import APIRouter, Depends

from app.api.deps import get_health_agent
from app.agents.health_agent import HealthAgent
from app.schemas.recommendation import AskRequest, AskResponse

router = APIRouter(prefix="/api/v1", tags=["ask"])


@router.post("/ask", response_model=AskResponse)
def ask(body: AskRequest, agent: HealthAgent = Depends(get_health_agent)):
    return agent.ask(body.message)
