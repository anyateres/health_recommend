# Health Nutrition Recommendation App

A web application that analyzes product ingredients through photos or livestream to provide health recommendations for people with insulin resistance.

## Features

- 📸 **Photo Upload & Analytics**: Upload product packaging photos to analyze ingredients
- 🎥 **Livestream Support**: Real-time product analysis through device camera
- 🧬 **Sugar Analysis**: Automatic sugar content detection and calculation
- 💡 **Personalized Recommendations**: AI-powered health insights for insulin resistance
- 📱 **Mobile-First**: Responsive design optimized for smartphones
- 🤖 **AI-Powered**: Powered by Google Gemini API for ingredient recognition

## Architecture

```
health_recommend/
├── frontend/          # React TypeScript web app
├── backend/           # Node.js Express server
├── deploy/            # GCP deployment configs (Cloud Run, Docker)
├── docs/              # Documentation
└── README.md
```

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **AI/ML**: Google Gemini API
- **Deployment**: GCP Cloud Run (serverless)
- **Containerization**: Docker
- **Database**: Firebase/Firestore (optional)

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

## Deployment on GCP Cloud Run

### 1. Build Docker Image
```bash
docker build -t health-recommend-backend:latest ./backend
docker tag health-recommend-backend:latest gcr.io/YOUR_PROJECT_ID/health-recommend:latest
docker push gcr.io/YOUR_PROJECT_ID/health-recommend:latest
```

### 2. Deploy to Cloud Run
```bash
gcloud run deploy health-recommend \
  --image gcr.io/YOUR_PROJECT_ID/health-recommend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key
```

### 3. Deploy Frontend to Cloud Storage + CDN
See [deploy/README.md](deploy/README.md) for detailed instructions.

## API Endpoints

- `POST /api/analyze/image` - Analyze product image
- `POST /api/analyze/livestream` - Analyze livestream frame
- `GET /api/recommendations/:userId` - Get personalized recommendations
- `POST /api/health-profile` - Save user health profile

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
