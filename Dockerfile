# =========================
# Build stage
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies (needed for native modules)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN SKIP_ENV_VALIDATION=true npx prisma generate

# Build NestJS application
RUN npm run build


# =========================
# Runtime stage
# =========================
FROM node:22-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy node_modules (including generated Prisma client)
COPY --from=builder /app/node_modules ./node_modules

# Copy compiled app
COPY --from=builder /app/dist ./dist

# Copy Prisma schema (if needed for migrations/runtime)
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/src/main.js"]
