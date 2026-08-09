from pydantic import BaseModel


class RecommendationResolveRequest(BaseModel):
    quantity_override: str | None = None
    reason: str | None = None
    resolved_by: str | None = None


class AskRequest(BaseModel):
    message: str


class AskResponse(BaseModel):
    answer: str
    tool_calls: list[str] = []
    confidence: int | None = None
