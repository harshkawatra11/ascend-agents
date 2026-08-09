from dataclasses import dataclass

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


@dataclass
class _NoKeySettings:
    gemini_api_key: str | None = None


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_recommendations_are_pending_by_default():
    res = client.get("/api/v1/recommendations")
    assert res.status_code == 200
    recs = res.json()["recommendations"]
    assert all(r["status"] == "pending" for r in recs)


def test_ask_returns_503_without_key(monkeypatch):
    # Route reads get_settings() directly rather than via Depends(), so it
    # isn't reachable through app.dependency_overrides; patch it at the
    # import site instead. This keeps the test's outcome independent of
    # whatever GEMINI_API_KEY happens to be set in the developer's shell.
    monkeypatch.setattr("app.api.v1.chat.get_settings", lambda: _NoKeySettings())
    res = client.post("/api/v1/ask", json={"message": "hello"})
    assert res.status_code == 503
    assert "GEMINI_API_KEY" in res.json()["detail"]
