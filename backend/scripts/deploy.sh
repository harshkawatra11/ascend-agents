#!/usr/bin/env bash
# Build and deploy the SwasthyaGrid AI backend to Cloud Run.
# Prototype uses scale-to-zero Cloud Run to conserve credits — see docs/09-gcp-deployment.md.
set -euo pipefail

: "${GCP_PROJECT_ID:?Set GCP_PROJECT_ID before running this script}"
REGION="${GCP_REGION:-asia-south1}"
SERVICE="swasthyagrid-api"
IMAGE="gcr.io/${GCP_PROJECT_ID}/${SERVICE}"

echo "Building image ${IMAGE}..."
gcloud builds submit --tag "${IMAGE}" .

echo "Deploying to Cloud Run (${REGION})..."
gcloud run deploy "${SERVICE}" \
  --image "${IMAGE}" \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 3 \
  --set-secrets "GEMINI_API_KEY=gemini-api-key:latest"

echo "Deployed. Fetch the URL with: gcloud run services describe ${SERVICE} --region ${REGION} --format='value(status.url)'"
