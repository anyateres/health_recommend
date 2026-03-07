# GitHub Actions Secrets Configuration

Update your GitHub repository secrets at: **Settings → Secrets and variables → Actions**

## Required OIDC Secrets (GCP)

Add these three OIDC-based secrets:

| Secret Name | Value | Where to get |
|------------|-------|--------------|
| `GCP_PROJECT_ID` | `gen-lang-client-0192276417` | From your GCP project |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `projects/680528118082/locations/global/workloadIdentityPools/github-pool/providers/github-provider` | From OIDC setup output |
| `GCP_SERVICE_ACCOUNT` | `github-deploy@gen-lang-client-0192276417.iam.gserviceaccount.com` | From OIDC setup output |

## Required API Keys

| Secret Name | Value | Where to get |
|------------|-------|--------------|
| `GEMINI_API_KEY` | Your Gemini API Key | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `VITE_API_URL` | Cloud Run backend URL | After first deployment (e.g., `https://health-recommend-xxxxx-uc.a.run.app`) |

## Required Firebase Secrets

| Secret Name | Value | Where to get |
|------------|-------|--------------|
| `FIREBASE_PROJECT_ID` | Your Firebase project ID | Firebase Console → Project Settings |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON | Firebase Console → Project Settings → Service Accounts → Generate Private Key (full JSON) |

## How to Set Up OIDC

The OIDC setup is already configured via `setup-gcp-oidc-for-github-actions.sh`. Your credentials are:

```bash
PROJECT_ID=gen-lang-client-0192276417
WORKLOAD_IDENTITY_PROVIDER=projects/680528118082/locations/global/workloadIdentityPools/github-pool/providers/github-provider
SERVICE_ACCOUNT=github-deploy@gen-lang-client-0192276417.iam.gserviceaccount.com
```

## Testing

You can test the workflow by pushing to the `main` branch:

```bash
git push origin main
```

Monitor the deployment at: **GitHub Actions** tab in your repository

## Security Notes

✅ **OIDC is more secure than service account keys** because:
- No long-lived credentials stored in secrets
- GitHub Actions creates short-lived tokens
- Tokens are bound to your specific repository and branch
- Easier to rotate and manage

❌ **Do NOT commit credentials** to the repository

✅ **Always use GitHub Secrets** for sensitive data
