# Copilot Instructions for Health Recommendation App

## Project Overview
Health nutrition recommendation app with photo/livestream analysis focused on nutrition score.

## Technology Stack
- Frontend: React 18 + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- AI: Google Gemini API
- Deployment: GCP Cloud Run
- Containerization: Docker

## Development Guidelines

### Frontend Development
- Location: `/frontend`
- Use React hooks and functional components
- TypeScript for type safety
- Mobile-first responsive design
- Use Vite for faster development

### Backend Development
- Location: `/backend`
- Express.js REST API
- TypeScript for type safety
- Gemini API integration for image analysis
- Cloud Run compatible (stateless design)

### Deployment
- Use Cloud Run for serverless backend
- Docker for containerization
- Cloud Storage for frontend (if needed)
- Keep under $300/month GCP budget

## Key Features to Implement
1. Photo upload and analysis
2. Livestream camera support
3. Ingredient extraction using Gemini
4. Sugar content calculation
5. Health recommendations based on nutrition score
6. User health profile management
7. Mobile-responsive UI

## Important Notes
- All API calls should be stateless for Cloud Run
- Set environment variables for sensitive data
- Use Cloud IAM for secure access
- Monitor costs in GCP Console
- Test locally before deploying
