# syntax=docker/dockerfile:1

FROM node:20-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
# Prisma detects its engine target partly via the openssl CLI; without it
# the build falls back to the openssl-1.1.x engines, which then mismatch
# the openssl-3.0.x runtime. Install openssl in every stage that runs
# prisma's install/generate detection.
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json* ./
RUN npm ci || npm install

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    NPM_CONFIG_CACHE=/tmp/.npm \
    DATABASE_URL="postgresql://ephemeral:ephemeral@db:5432/ephemeral"
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# Prisma 6's CLI loads hoisted deps (e.g. 'effect') from the package root,
# so copy the full node_modules rather than a selective subset. Copied
# after the standalone bundle so its files win.
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/prisma ./prisma

USER node
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
