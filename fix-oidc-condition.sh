#!/bin/bash

# Quick fix: Update attribute condition for OIDC

set -euo pipefail

PROJECT_ID="${1:-gen-lang-client-0192276417}"
GITHUB_REPO="${2:-anyateres/health_recommend}"
POOL_ID="github-pool"
PROVIDER_ID="github-provider"

if [ $# -lt 1 ] || [ "$1" = "--help" ]; then
  echo "Usage: $0 <PROJECT_ID> <GITHUB_OWNER/REPO_NAME>"
  echo "Example: $0 gen-lang-client-0192276417 anyateres/health_recommend"
  echo
  echo "This script updates the OIDC attribute condition to allow deployments from your GitHub repo"
  exit 0
fi

echo "🔧 Updating OIDC attribute condition..."
echo "Project: $PROJECT_ID"
echo "Repository: $GITHUB_REPO"
echo

gcloud config set project "${PROJECT_ID}"

# Update the attribute condition - allow any branch from the specified repo
gcloud iam workload-identity-pools providers update-oidc "${PROVIDER_ID}" \
  --location="global" \
  --workload-identity-pool="${POOL_ID}" \
  --attribute-condition="attribute.repository == '${GITHUB_REPO}'"

echo
echo "✅ Attribute condition updated!"
echo "Now allows deployments from any branch of: ${GITHUB_REPO}"
echo
echo "To restrict to only 'main' branch, run:"
echo "gcloud iam workload-identity-pools providers update-oidc ${PROVIDER_ID} \\"
echo "  --location=global \\"
echo "  --workload-identity-pool=${POOL_ID} \\"
echo "  --attribute-condition=\"attribute.repository == '${GITHUB_REPO}' && attribute.ref == 'refs/heads/main'\""
