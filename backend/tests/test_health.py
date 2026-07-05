from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_recommendations_are_pending_by_default():
    res = client.get("/api/v1/recommendations")
    assert res.status_code == 200
    recs = res.json()["recommendations"]
    assert all(r["status"] == "pending" for r in recs)


def test_ask_falls_back_without_key():
    res = client.post("/api/v1/ask", json={"message": "hello"})
    assert res.status_code == 200
    assert "answer" in res.json()
