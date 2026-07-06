from fastapi.testclient import TestClient
from app.main import app
import os

client = TestClient(app)

def test_missing_facility():
    response = client.get("/api/v1/facilities/invalid_id")
    assert response.status_code == 404
    assert "Facility 'invalid_id' not found" in response.text
    print("test_missing_facility: passed")

def test_ask_without_api_key():
    os.environ.pop("GEMINI_API_KEY", None)
    response = client.post("/api/v1/ask", json={"message": "hello"})
    assert response.status_code == 503
    assert "is not configured" in response.text
    print("test_ask_without_api_key: passed")

def test_security_headers():
    response = client.get("/health")
    assert response.headers.get("X-Content-Type-Options") == "nosniff"
    assert response.headers.get("Strict-Transport-Security") == "max-age=31536000; includeSubDomains"
    print("test_security_headers: passed")

if __name__ == "__main__":
    test_missing_facility()
    test_ask_without_api_key()
    test_security_headers()
    print("All tests passed!")
