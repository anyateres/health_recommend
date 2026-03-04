# Health Recommendation Backend

Node.js + Express API for health product analysis using Google Gemini AI.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Environment Variables

Create `.env`:

```
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGIN=http://localhost:5173
```

## API Endpoints

### POST /api/analyze/image
Analyze a product image uploaded as multipart form data.

**Request:**
- `image`: File (multipart/form-data)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "timestamp": "2026-02-28T...",
    "ingredients": [...],
    "totalSugar": 25,
    "sugarPerServing": 5,
    "healthScore": 65,
    "isHealthy": true,
    "recommendations": [...]
  }
}
```

### POST /api/analyze/livestream
Analyze a livestream frame (base64 image data).

**Request:**
```json
{
  "imageData": "data:image/jpeg;base64,..."
}
```

### GET /health
Health check endpoint.

## Project Structure

```
src/
├── routes/        # API routes
├── services/      # Business logic (Gemini integration)
├── middleware/    # Express middleware
├── types/         # TypeScript definitions
├── config/        # Configuration
└── index.ts       # Entry point
```

## Deployment

See root [README.md](../README.md) for GCP Cloud Run deployment instructions.
