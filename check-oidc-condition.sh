#!/bin/bash

# Diagnostic script to check OIDC setup and attribute condition

set -euo pipefail

echo "🔍 OIDC Configuration Diagnostic"
echo "=================================="
echo

PROJECT_ID="${GCP_PROJECT_ID:-gen-lang-client-0192276417}"
POOL_ID="github-pool"
PROVIDER_ID="github-provider"

gcloud config set project "${PROJECT_ID}"

echo "✅ Project: $PROJECT_ID"
echo

# Check if provider exists
if ! gcloud iam workload-identity-pools providers describe "${PROVIDER_ID}" \
  --location="global" \
  --workload-identity-pool="${POOL_ID}" >/dev/null 2>&1; then
  echo "❌ Provider not found! Please run setup-gcp-oidc-for-github-actions.sh first"
  exit 1
fi

echo "✅ Workload Identity Provider found"
echo

# Get current attribute condition
echo "📋 Current attribute condition:"
gcloud iam workload-identity-pools providers describe "${PROVIDER_ID}" \
  --location="global" \
  --workload-identity-pool="${POOL_ID}" \
  --format='value(attributeCondition)'
echo

# Get attribute mapping
echo "📋 Current attribute mapping:"
gcloud iam workload-identity-pools providers describe "${PROVIDER_ID}" \
  --location="global" \
  --workload-identity-pool="${POOL_ID}" \
  --format='value(attributeMapping)'
echo

echo "🔧 To fix the attribute condition error, run one of these commands:"
echo
echo "Option 1: Remove branch restriction (allow any branch):"
echo "==========================================================="
echo "gcloud iam workload-identity-pools providers update-oidc ${PROVIDER_ID} \\"
echo "  --location=global \\"
echo "  --workload-identity-pool=${POOL_ID} \\"
echo "  --attribute-condition=\"attribute.repository == 'YOUR_GITHUB_OWNER/YOUR_REPO_NAME'\""
echo
echo "Option 2: Remove all restrictions (allow any repo):"
echo "====================================================="
echo "gcloud iam workload-identity-pools providers update-oidc ${PROVIDER_ID} \\"
echo "  --location=global \\"
echo "  --workload-identity-pool=${POOL_ID} \\"
echo "  --clear-attribute-condition"
echo
echo "How to find YOUR_GITHUB_OWNER/YOUR_REPO_NAME:"
echo "  Go to your GitHub repo → About → Full name (or Repository settings)"
echo "  Example: if your repo URL is github.com/myuser/myrepo, use 'myuser/myrepo'"
echo
