# Multi-stage build — mirrors the mentor reference repo's pattern.
FROM python:3.12-slim AS builder

WORKDIR /build
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

FROM python:3.12-slim

RUN groupadd -r swasthyagrid && useradd -r -g swasthyagrid -u 1001 swasthyagrid

WORKDIR /app
COPY --from=builder /install /usr/local
COPY app ./app
COPY data ./data

USER 1001
EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
