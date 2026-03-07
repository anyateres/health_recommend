#!/bin/bash

set -euo pipefail

PROJECT_ID="***"
REGION="us-central1"

REPO_OWNER="***"
REPO_NAME="***"

SA_ID="github-deploy"
POOL_ID="github-pool"
PROVIDER_ID="github-provider"

gcloud config set project "${PROJECT_ID}"

# Enable APIs needed for Cloud Run deploy-from-source and impersonation
gcloud services enable iamcredentials.googleapis.com iam.googleapis.com run.googleapis.com cloudbuild.googleapis.com

PROJECT_NUMBER="$(gcloud projects describe "${PROJECT_ID}" --format='value(projectNumber)')"

# Service account
if ! gcloud iam service-accounts describe "${SA_ID}@${PROJECT_ID}.iam.gserviceaccount.com" >/dev/null 2>&1; then
  gcloud iam service-accounts create "${SA_ID}" --display-name="GitHub Actions deployer"
fi
SA_EMAIL="${SA_ID}@${PROJECT_ID}.iam.gserviceaccount.com"

# Workload Identity Pool
if ! gcloud iam workload-identity-pools describe "${POOL_ID}" --location="global" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools create "${POOL_ID}" \
    --location="global" \
    --display-name="GitHub Actions Pool"
fi

# Workload Identity Provider (restricted to this repo + main branch)
if ! gcloud iam workload-identity-pools providers describe "${PROVIDER_ID}" \
  --location="global" \
  --workload-identity-pool="${POOL_ID}" >/dev/null 2>&1; then

  gcloud iam workload-identity-pools providers create-oidc "${PROVIDER_ID}" \
    --location="global" \
    --workload-identity-pool="${POOL_ID}" \
    --display-name="GitHub Actions Provider" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref,attribute.actor=assertion.actor" \
    --attribute-condition="attribute.repository == '${REPO_OWNER}/${REPO_NAME}' && attribute.ref == 'refs/heads/main'"
fi

# Allow pool identities (as constrained by provider condition) to impersonate SA
gcloud iam service-accounts add-iam-policy-binding "${SA_EMAIL}" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/*"

# Permissions for Cloud Run deploy
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser"

# Deploy --source uses Cloud Build
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/cloudbuild.builds.editor"

# Output what to paste into GitHub Secrets
WIF_PROVIDER="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/providers/${PROVIDER_ID}"

echo
echo "Set these GitHub Secrets (repo -> Settings -> Secrets and variables -> Actions -> Secrets):"
echo "GCP_WORKLOAD_IDENTITY_PROVIDER=${WIF_PROVIDER}"
echo "GCP_SERVICE_ACCOUNT=${SA_EMAIL}"
echo "GCP_PROJECT_ID=${PROJECT_ID}"
echo
echo "Optional GitHub Variable:"
echo "GCP_REGION=${REGION}"
