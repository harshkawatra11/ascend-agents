from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/ready")
def ready():
    return {"status": "ready"}


@router.get("/metrics")
def metrics():
    return {"uptime": "ok", "service": "swasthyagrid-api"}
