#!/bin/bash

# Build script for GCP Cloud Run deployment

set -e

echo "Building backend..."
cd backend
npm ci
npm run build
cd ..

echo "Building Docker image..."
docker build -t health-recommend:latest .

echo "Build complete!"
