# Health Nutrition Recommendation App

A web application that analyzes product ingredients through photos or livestream to provide nutrition scores and health recommendations.

## Features

- 📸 **Photo Upload & Analytics**: Upload product packaging photos to analyze ingredients
- 🎥 **Livestream Support**: Real-time product analysis through device camera
- 🧬 **Nutrition Scoring**: Automatic nutrition score calculation with A/B/C grades and colors
- 💡 **AI Agent**: Intelligent nutrition advice and personalized recommendations
- 🤖 **Gemini Fast**: Powered by Google Gemini 1.5 Flash for fast, accurate analysis
- 📱 **Mobile-First**: Responsive design optimized for smartphones
- 🚀 **CI/CD**: Automated deployment to Cloud Run and Firebase

## Architecture

```
health_recommend/
├── frontend/          # React TypeScript web app (Firebase)
├── backend/           # Node.js Express server (Cloud Run)
├── .github/           # GitHub Actions CI/CD
├── deploy/            # GCP deployment configs
├── docs/              # Documentation
└── README.md
```

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite (Firebase Hosting)
- **Backend**: Node.js + Express (Google Cloud Run)
- **AI/ML**: Google Gemini 1.5 Flash API
- **AI Agent**: Custom nutrition assistant with personalized recommendations
- **Deployment**: GCP Cloud Run + Firebase Hosting
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

## Nutrition Scoring System

The app uses a comprehensive nutrition scoring system:

- **Grade A (80-100)**: 🟢 Green - Excellent nutritional value
- **Grade B (60-79)**: 🟡 Yellow - Good nutritional value with room for improvement  
- **Grade C (0-59)**: 🔴 Red - Poor nutritional value, high sugar content

Scores are calculated based on:
- Sugar content per serving
- Ingredient quality
- Nutritional balance
- Overall health impact

## AI Agent Features

The integrated AI agent provides:

- **Nutrition Advice**: Answer questions about healthy eating
- **Meal Analysis**: Analyze ingredient combinations for compatibility
- **Personalized Recommendations**: Custom advice based on user profile and analysis history

### API Endpoints

```
POST /api/ai/advice - Get nutrition advice
POST /api/ai/meal-analysis - Analyze meal combinations  
POST /api/ai/personalized - Get personalized recommendations
```

## Prerequisites

- Node.js 18+ (or 12+ for basic testing)
- npm or yarn
- GCP account with $300 free tier (for deployment)
- Google Cloud SDK (for deployment)
- Docker (for deployment)

## Quick Start - Run Locally

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd health_recommend
npm install
```

### 2. Setup Environment Files & HTTPS Certificates

**Generate self-signed HTTPS certificates** (for secure camera access on mobile):
```bash
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"
```
This creates `cert.pem` and `key.pem` in the project root. Both servers auto-detect and use them.

**Backend** (`backend/.env`):
```bash
cp .env.backend.example backend/.env
```
Edit and add your GEMINI_API_KEY

**Frontend** (`frontend/.env.local`):
```bash
cp .env.frontend.example frontend/.env.local
```

### 3. Start Backend Server

**Terminal 1:**
```bash
cd backend
node src/index.js
# Server runs on https://localhost:3000 (auto-detects HTTPS certs)
# Health check: https://localhost:3000/health
```

### 4. Start Frontend App

**Terminal 2:**
```bash
cd frontend
npm run dev
# App runs on https://localhost:5173
```

✅ Open **https://localhost:5173** in your browser (accept the self-signed certificate warning)!

### Testing the App

1. **Photo Upload Test:**
   - Click "📸 Upload Photo" tab
   - Select a product package image
   - Click "Analyze Product"
   - View analysis results

2. **Livestream Test:**
   - Click "🎥 Livestream" tab
   - Allow camera access when prompted
   - Point at a product package
   - Click "📸 Capture & Analyze"
   - View real-time analysis

## Reproducible Testing (for Judges)

Use the exact steps below to verify the project end-to-end.

### A) Install and configure

```bash
git clone <your-repo-url>
cd health_recommend
npm install
cp .env.backend.example backend/.env
cp .env.frontend.example frontend/.env.local
```

Set `GEMINI_API_KEY` in `backend/.env`.

### B) Start backend and frontend

Terminal 1:
```bash
cd backend
node src/index.js
```

Terminal 2:
```bash
cd frontend
npm run dev
```

### C) Verify backend is live

```bash
curl -k https://localhost:3000/health
```

Expected result contains:

```json
{"status":"ok"}
```

### D) Verify photo analysis flow

1. Open `https://localhost:5173`
2. Upload a product label image
3. Click **Analyze Product**
4. Confirm response shows:
   - ingredients list
   - sugar metrics
   - health score + grade
   - recommendations

### E) Verify livestream flow

1. Open **Livestream** tab
2. Allow camera permission
3. Capture a frame and analyze
4. Confirm the same structured analysis fields are returned

### Pass Criteria

- `/health` returns `status: ok`
- Photo upload analysis completes successfully
- Livestream capture analysis completes successfully
- Output includes ingredients, sugar values, health score, and recommendations

### Troubleshooting

**Port already in use?**
```bash
# Free port 3000 (backend)
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Free port 5173 (frontend)
lsof -ti:5173 | xargs kill -9 2>/dev/null
```

### Access from a Phone

To open the app on a smartphone while developing locally:

1. Make sure your phone and development machine are on the **same Wi‑Fi network**.
2. Find your computer's local IP address (e.g. `192.168.0.115`) using `ip addr` or `ifconfig`.
3. Start backend and frontend as described above.
4. On your phone's browser, visit `http://<YOUR_IP>:5173` (e.g. `http://192.168.0.115:5173`).
   - The frontend will call the backend at `http://<YOUR_IP>:3000/api`.
   - Ensure `VITE_API_BASE_URL` in `frontend/.env.local` uses this IP if necessary.

> **Note:** browsers may block camera access over HTTP on mobile. For full camera functionality
> consider deploying to HTTPS (Cloud Run) or use a secure tunnel (ngrok).

Alternatively, once deployed to Cloud Run or any public host, just open the
service URL in your phone's browser (e.g. `https://health-recommend-xyz.a.run.app`).

## HTTPS Locally

Since camera access often requires HTTPS on mobile, you'll want to serve the
frontend over TLS during development. Here are two simple options:

### 1. Use **mkcert** (self-signed trusted certs)

```bash
# install mkcert (macOS/linux)
# https://github.com/FiloSottile/mkcert

mkcert -install
mkcert localhost 127.0.0.1 ::1
```
This generates `localhost.pem` and `localhost-key.pem` in the current
directory. Then run Vite with those certs:

```bash
export HTTPS_KEY=./localhost-key.pem
export HTTPS_CERT=./localhost.pem
cd frontend
npm run dev
```

Now browse to `https://localhost:5173` and you’ll have a valid TLS connection.

### 2. Use **ngrok** (secure tunnel to your local server)

```bash
npm install -g ngrok
# start your servers normally (without TLS)
ngrok http 5173
```

ngrok will display a public `https://` URL that forwards to your local app —
use that URL on your phone or in any browser and camera access will work.

> Tip: update `VITE_API_BASE_URL` to match the ngrok URL if you test API calls
> through it (e.g. `https://xxxxxx.ngrok.io/api`).


**API connection error?**
- Verify backend is running: `curl http://localhost:3000/health`
- Check `CORS_ORIGIN=http://localhost:5173` in `backend/.env`
- Check `VITE_API_BASE_URL=http://localhost:3000/api` in `frontend/.env.local`

**Camera not working?**
- Must use HTTPS in production (localhost works)
- Check browser camera permissions
- Try a different browser

## CI/CD Deployment

The app uses GitHub Actions for automated deployment:

### Prerequisites

1. **GCP Setup**:
   - Create a GCP project
   - Enable Cloud Run API
   - Enable Container Registry API
   - Create a service account with necessary permissions
   - Generate a service account key (JSON)

2. **Firebase Setup**:
   - Create a Firebase project
   - Enable Firebase Hosting
   - Generate a Firebase service account key

3. **GitHub Secrets** (Settings > Secrets and variables > Actions):
   ```
   GCP_PROJECT_ID: your-gcp-project-id
   GCP_SA_KEY: your-service-account-json
   GEMINI_API_KEY: your-gemini-api-key
   FIREBASE_PROJECT_ID: your-firebase-project-id
   FIREBASE_SERVICE_ACCOUNT: your-firebase-service-account-json
   VITE_API_URL: your-cloud-run-url
   ```

### Automated Deployment

Push to `main` branch to trigger automatic deployment:
- **Backend**: Deployed to Google Cloud Run
- **Frontend**: Deployed to Firebase Hosting

### Manual Deployment

#### Backend (Cloud Run)
```bash
# Build and push Docker image
docker build -t gcr.io/YOUR_PROJECT_ID/health-recommend:latest .
docker push gcr.io/YOUR_PROJECT_ID/health-recommend:latest

# Deploy to Cloud Run
gcloud run deploy health-recommend \
  --image gcr.io/YOUR_PROJECT_ID/health-recommend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key
```

#### Frontend (Firebase)
```bash
cd frontend
npm run build
firebase deploy --project YOUR_PROJECT_ID
```

## API Endpoints

### Analysis Endpoints
- `POST /api/analyze/image` - Analyze product image
- `POST /api/analyze/livestream` - Analyze livestream frame

### AI Agent Endpoints
- `POST /api/ai/advice` - Get nutrition advice
- `POST /api/ai/meal-analysis` - Analyze meal combinations
- `POST /api/ai/personalized` - Get personalized recommendations

### Health Endpoints
- `GET /health` - Health check

## Budget Optimization for GCP

- **Cloud Run**: Pay only for execution (cold start: ~$0.0000025 per request)
- **Cloud Storage**: Free tier includes 5GB
- **Gemini API**: Pricing-based access, built into GCP

Estimated monthly cost with 1000 requests/day: **< $10-20/month**

## Project Structure

See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for detailed folder organization.

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Resources

- [Gemini Live Agent Challenge](https://geminiliveagentchallenge.devpost.com/)
- [GCP Documentation](https://cloud.google.com/docs)
- [Google Gemini API](https://ai.google.dev/)
