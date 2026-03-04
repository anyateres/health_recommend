# GCP Cloud Run Deployment Guide

## Prerequisites

1. GCP Account with billing enabled
2. Google Cloud SDK installed
3. Docker installed

## Setup

### 1. Set Environment Variables

```bash
export GCP_PROJECT_ID="your-gcp-project-id"
export GEMINI_API_KEY="your-gemini-api-key"
export SERVICE_ACCOUNT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
```

### 2. Enable Required APIs

```bash
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudaicompanion.googleapis.com
```

### 3. Create Service Account (Optional)

```bash
gcloud iam service-accounts create health-recommend \
  --display-name="Health Recommendation App"

gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
  --role="roles/run.invoker"
```

## Deployment

### Option 1: Automated Deployment (Recommended)

```bash
bash deploy/deploy.sh
```

### Option 2: Manual Deployment

```bash
# Build backend
cd backend
npm ci
npm run build
cd ..

# Build Docker image
docker build -t gcr.io/$GCP_PROJECT_ID/health-recommend:latest .

# Push to Container Registry
docker push gcr.io/$GCP_PROJECT_ID/health-recommend:latest

# Deploy to Cloud Run
gcloud run deploy health-recommend \
  --image gcr.io/$GCP_PROJECT_ID/health-recommend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "GEMINI_API_KEY=$GEMINI_API_KEY" \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60
```

## Frontend Deployment (Cloud Storage + CDN)

### 1. Create Cloud Storage Bucket

```bash
gsutil mb -p $GCP_PROJECT_ID -l US gs://health-recommend-frontend/
```

### 2. Build Frontend

```bash
cd frontend
npm ci
npm run build
```

### 3. Upload to Cloud Storage

```bash
gsutil -m cp -r dist/* gs://health-recommend-frontend/
```

### 4. Set Public Access

```bash
gsutil iam ch allUsers:objectViewer gs://health-recommend-frontend
```

### 5. Enable Static Website Hosting

```bash
gsutil web set -m index.html -e 404.html gs://health-recommend-frontend/
```

## Cost Optimization

- **Cloud Run**: Billed by CPU-seconds and requests (~$0.0000025 per request)
- **Container Registry**: Free for first 50GB/month
- **Cloud Storage**: Free for first 5GB/month
- **Gemini API**: Pricing-based, included in GCP quota

**Estimated monthly cost**: $5-20 for 1000 requests/day

## Monitoring

```bash
# View logs
gcloud run services logs read health-recommend

# View metrics
gcloud monitoring metrics-descriptors list --filter="metric.service.labels.service_name=health-recommend"

# Set up alerts in Cloud Console
```

## Cleanup

```bash
# Delete Cloud Run service
gcloud run services delete health-recommend

# Delete Container Registry image
gcloud container images delete gcr.io/$GCP_PROJECT_ID/health-recommend

# Delete Cloud Storage bucket
gsutil -m rm -r gs://health-recommend-frontend/
```
