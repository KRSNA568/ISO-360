# syntax=docker/dockerfile:1
# ─────────────────────────────────────────────
#  Stage 1: deps
#  Install only production dependencies
# ─────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Install sharp dependencies (native bindings)
RUN apk add --no-cache \
    libc6-compat \
    vips-dev \
    fftw-dev \
    gcc \
    g++ \
    make \
    python3

COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

# ─────────────────────────────────────────────
#  Stage 2: runner
# ─────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache vips libgomp

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 expressjs

WORKDIR /app

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY src/ ./src/
COPY package.json ./

# Change ownership
RUN chown -R expressjs:nodejs /app

USER expressjs

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "src/server.js"]
