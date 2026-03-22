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

# Copy backend source code
COPY backend ./backend

# Generate Prisma Client
RUN cd backend && npx prisma generate

# Build backend
RUN cd backend && pnpm run build

# Production image
FROM node:22-slim AS runner
WORKDIR /app
RUN npm install -g pnpm

COPY --from=base /app/backend/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/backend/package.json ./package.json
COPY --from=base /app/backend/prisma ./prisma

EXPOSE 4001

CMD ["node", "dist/app.js"]
