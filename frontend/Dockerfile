FROM node:22 AS base

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy all workspace manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install dependencies for the whole workspace
RUN pnpm install --frozen-lockfile

# Copy frontend source code
COPY frontend ./frontend

# Build application
RUN cd frontend && pnpm run build

# Production image
FROM node:22-slim AS runner
WORKDIR /app
RUN npm install -g pnpm

COPY --from=base /app/frontend/public ./public
COPY --from=base /app/frontend/.next ./frontend/.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/frontend/package.json ./package.json

EXPOSE 3000

# Start from the frontend directory
WORKDIR /app/frontend
CMD ["pnpm", "start"]
