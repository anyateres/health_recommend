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

# Build the backend (no actual build needed for JS)
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

# Copy source files (no dist directory for JS backend)
COPY backend/ ./backend/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const p=process.env.PORT||8080;require('http').get('http://localhost:'+p+'/health',(r)=>{if(r.statusCode!==200) throw new Error(r.statusCode)})"

CMD ["node", "backend/src/index.js"]
