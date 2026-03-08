# Firebase Setup for Frontend Deployment

This project uses keyless OIDC authentication in GitHub Actions for Firebase deployment.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Firebase Hosting for your project

## 2. Grant Required Roles to GitHub Service Account

In Google Cloud IAM, grant your GitHub Actions service account (the same one used for Cloud Run deploy) these roles for the Firebase project:

- `Firebase Hosting Admin`
- `Firebase Admin SDK Administrator Service Agent` (if required by your org setup)
- `Viewer` (optional, for diagnostics)

## 3. Add GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and Variables → Actions):

- `FIREBASE_PROJECT_ID`: Your Firebase project ID (found in Firebase Console)
- `VITE_API_URL`: Your Cloud Run backend URL (e.g., `https://health-recommend-xxxxx-uc.a.run.app`)
- `GCP_WORKLOAD_IDENTITY_PROVIDER`: Existing OIDC provider for your repo
- `GCP_SERVICE_ACCOUNT`: Existing deploy service account email

## 4. Initialize Firebase in Your Project (Optional, if not already done)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting
```

When prompted:
- Select your Firebase project
- Set public directory to: `frontend/dist`
- Configure as single-page app: Yes
- Automatic builds with GitHub: No (we're using GitHub Actions)

## 5. Firebase Deployment in Workflow

The workflow deploy step uses keyless auth and `firebase-tools`:

```yaml
- name: Deploy to Firebase
  run: npx firebase-tools@latest deploy --only hosting --project "$FIREBASE_PROJECT_ID" --non-interactive
```

## 6. Configure Firebase Hosting (firebase.json)

Create or verify `firebase.json` in the project root:

```json
{
  "hosting": {
    "public": "frontend/dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## 7. Push Changes

Commit and push your changes. The next workflow run will deploy your frontend to Firebase Hosting.

## Current Workflow Status

✅ Backend deploys to Cloud Run successfully  
✅ Frontend builds and deploys to Firebase Hosting with OIDC (no key file)

Once Firebase is configured, your frontend will be available at `https://your-project-id.web.app` or your custom domain.
