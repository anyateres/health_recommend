# Quick Start Guide

## Local Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd health_recommend

# Install all dependencies
npm install
```

### 2. Setup Environment Variables

**Backend** (`backend/.env`):
```bash
cp .env.backend.example backend/.env
# Edit backend/.env and add your GEMINI_API_KEY
```

**Frontend** (`frontend/.env.local`):
```bash
cp .env.frontend.example frontend/.env.local
# Leave as-is for local development (uses http://localhost:3000/api)
```

### 3. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to `backend/.env` as `GEMINI_API_KEY`

### 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server will run on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App will run on http://localhost:5173
```

Open http://localhost:5173 in your browser!

## Testing the App

1. **Photo Upload Test:**
   - Take a photo of a food package
   - Upload via the "Upload Photo" tab
   - See analysis results

2. **Livestream Test:**
   - Click "Livestream" tab
   - Allow camera access
   - Point at a product package
   - Click "Capture & Analyze"

## Production Build

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build

# Build Docker image
docker build -t health-recommend:latest .

# Run Docker container
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_key \
  -e CORS_ORIGIN=http://localhost:5173 \
  health-recommend:latest
```

## Deployment to GCP

See [deploy/README.md](../deploy/README.md) for complete deployment instructions.

### Quick Deploy:
```bash
export GCP_PROJECT_ID="your-project-id"
export GEMINI_API_KEY="your-key"
bash deploy/deploy.sh
```

## Troubleshooting

### "Cannot access camera"
- Check browser camera permissions
- Use HTTPS in production (required for camera access)
- Try a different browser

### "Gemini API Error"
- Verify API key is correctly set
- Check API key has access to Gemini
- Ensure sufficient GCP quota

### "CORS Error"
- Frontend and backend running?
- Check `CORS_ORIGIN` in backend/.env
- Ensure frontend URL matches CORS origin

### "Port already in use"
- Backend: `kill -9 $(lsof -t -i:3000)`
- Frontend: `kill -9 $(lsof -t -i:5173)`

## Project Structure

```
health_recommend/
├── frontend/        # React app
├── backend/         # Express API
├── deploy/          # GCP deployment
├── docs/            # Documentation
└── Dockerfile       # Container
```

See [docs/PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed structure.

## Next Steps

1. ✅ Run locally
2. ✅ Test with sample products
3. 📤 Setup GitHub repository
4. 🚀 Deploy to GCP Cloud Run
5. 🎯 Submit to Gemini Live Agent Challenge

## Support

- Documentation: [README.md](../README.md)
- Deployment: [deploy/README.md](../deploy/README.md)
- GitHub Setup: [docs/GITHUB_SETUP.md](GITHUB_SETUP.md)
