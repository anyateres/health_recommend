# Firebase Setup for Frontend Deployment

The Firebase deployment step is currently commented out in the GitHub Actions workflow. To enable it, follow these steps:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Firebase Hosting for your project

## 2. Generate Service Account Key

1. In Firebase Console, go to **Project Settings** → **Service Accounts**
2. Click **Generate New Private Key**
3. Download the JSON file (keep it secure!)

## 3. Add GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and Variables → Actions):

- `FIREBASE_SERVICE_ACCOUNT`: Paste the entire contents of the downloaded JSON file
- `FIREBASE_PROJECT_ID`: Your Firebase project ID (found in Firebase Console)
- `VITE_API_URL`: Your Cloud Run backend URL (e.g., `https://health-recommend-xxxxx-uc.a.run.app`)

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

## 5. Uncomment Firebase Deployment in Workflow

Edit `.github/workflows/deploy.yml` and uncomment the Firebase deployment step:

```yaml
- name: Deploy to Firebase
  uses: FirebaseExtended/action-hosting-deploy@v0
  with:
    repoToken: '${{ secrets.GITHUB_TOKEN }}'
    firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
    channelId: live
    projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
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
⚠️ Frontend builds successfully but deployment is disabled (waiting for Firebase configuration)

Once Firebase is configured, your frontend will be available at `https://your-project-id.web.app` or your custom domain.
