# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy workspace files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies for the backend workspace
RUN npm ci --workspace=backend

# Copy source code
COPY backend/ ./backend/

# Build the backend
WORKDIR /app/backend
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy workspace files for production
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install only production dependencies
RUN npm ci --workspace=backend --omit=dev

# Copy built application
COPY --from=builder /app/backend/dist ./backend/dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "backend/dist/index.js"]
