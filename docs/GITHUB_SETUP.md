# GitHub Setup Guide

## 1. Create Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Health Recommendation App"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/health_recommend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 2. Configure Secrets (for GitHub Actions)

Go to your repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:
- `GCP_PROJECT_ID`: Your GCP project ID
- `GCP_SA_KEY`: Your GCP service account JSON key (base64 encoded)
- `GEMINI_API_KEY`: Your Gemini API key

## 3. GitHub Actions Setup

The workflow file is pre-configured at `.github/workflows/deploy.yml`

To enable automated deployment:
1. Push code to main branch
2. GitHub Actions will automatically build and deploy to Cloud Run

## 4. Branch Protection Rules (Optional)

1. Go to Settings → Branches
2. Add rule for `main`
3. Require pull request reviews
4. Dismiss stale PR approvals
5. Require status checks to pass

## 5. Collaboration

### For team members:

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/health_recommend.git
cd health_recommend

# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: describe your changes"

# Push to GitHub
git push origin feature/your-feature

# Create Pull Request on GitHub
```

## 6. Release Management

Create a release after testing:

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## CI/CD Pipeline

The GitHub Actions workflow:
1. Triggers on push to `main` or pull requests
2. Builds backend code
3. Builds Docker image
4. Pushes to Google Container Registry
5. Deploys to Cloud Run

View workflow status: GitHub → Actions tab
