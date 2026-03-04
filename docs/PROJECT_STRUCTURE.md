# Project Structure Documentation

## Directory Organization

```
health_recommend/
├── frontend/                 # React TypeScript web app
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── PhotoUpload.tsx
│   │   │   ├── LivestreamCamera.tsx
│   │   │   └── AnalysisResult.tsx
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions (API client, etc)
│   │   ├── types/           # TypeScript type definitions
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── public/              # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md
│
├── backend/                 # Node.js Express server
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   │   └── analyze.ts   # Image/livestream analysis
│   │   ├── services/        # Business logic
│   │   │   └── gemini.service.ts
│   │   ├── middleware/      # Express middleware
│   │   ├── types/           # TypeScript definitions
│   │   ├── config/          # Configuration
│   │   └── index.ts         # Entry point
│   ├── dist/                # Compiled output (gitignored)
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── deploy/                  # Deployment configuration
│   ├── Dockerfile           # Docker build file
│   ├── deploy.sh            # Deployment script
│   ├── build.sh             # Build script
│   └── README.md            # Deployment guide
│
├── docs/                    # Documentation
│   └── PROJECT_STRUCTURE.md # This file
│
├── .github/
│   ├── copilot-instructions.md
│   └── workflows/           # GitHub Actions (optional)
│
├── .env.backend.example     # Backend env template
├── .env.frontend.example    # Frontend env template
├── .gitignore
├── .dockerignore
├── Dockerfile               # Multi-stage Docker build
├── package.json             # Root workspace config
├── README.md                # Main project README
└── LICENSE
```

## Key Files

### Frontend Entry
- `frontend/src/main.tsx` - React app bootstrap
- `frontend/index.html` - HTML template

### Backend Entry
- `backend/src/index.ts` - Express server entry

### Configuration
- `frontend/.env.local` - Frontend environment (add to .gitignore)
- `backend/.env` - Backend environment (add to .gitignore)
- `deploy/Dockerfile` - Backend containerization

## Development Workflow

1. **Frontend** runs on http://localhost:5173 (Vite dev server)
2. **Backend** runs on http://localhost:3000 (Express server)
3. Frontend calls backend APIs at `http://localhost:3000/api`

## Deployment Workflow

1. Build backend: `npm run build` in backend/
2. Build Docker image: `docker build -t health-recommend:latest .`
3. Push to Registry: `docker push gcr.io/PROJECT_ID/health-recommend:latest`
4. Deploy to Cloud Run: See `deploy/README.md`

## File Naming Conventions

- **Components**: PascalCase (e.g., `PhotoUpload.tsx`)
- **Utils**: camelCase (e.g., `apiClient.ts`)
- **Styles**: Same name as component (e.g., `PhotoUpload.css`)
- **Types**: Index files in `types/` folder

## API Structure

All APIs prefixed with `/api`:
- `POST /api/analyze/image` - Analyze product image
- `POST /api/analyze/livestream` - Analyze livestream frame
- `GET /health` - Health check

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `GEMINI_API_KEY` - Google Gemini API key
- `GCP_PROJECT_ID` - GCP project ID
- `CORS_ORIGIN` - CORS allowed origin

### Frontend (.env.local)
- `VITE_API_BASE_URL` - Backend API URL
