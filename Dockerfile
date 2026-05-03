FROM node:20-alpine AS base
WORKDIR /app

# Copy workspace manifests for dependency caching
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY packages/shared/package.json ./packages/shared/

RUN npm ci --workspaces --include-workspace-root

# ── Backend production image ──────────────────────────────────────────────────
FROM base AS backend
COPY packages/shared ./packages/shared
COPY backend ./backend

ENV NODE_ENV=production

EXPOSE 5000
CMD ["node", "backend/src/server.js"]

# ── Frontend build ────────────────────────────────────────────────────────────
FROM base AS frontend-build
COPY packages/shared ./packages/shared
COPY frontend ./frontend

RUN npm run build --workspace=frontend

# ── Frontend serve ────────────────────────────────────────────────────────────
FROM node:20-alpine AS frontend
WORKDIR /app
RUN npm install -g serve
COPY --from=frontend-build /app/frontend/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
