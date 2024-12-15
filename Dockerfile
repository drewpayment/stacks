# Build with:   docker build -t IMAGE_NAME .
# Run with:     docker run -p 3000:3000 --rm --name IMAGE_NAME IMAGE_NAME

FROM node:20-slim AS builder
WORKDIR /staging

# Install necessary build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

# Enable corepack and install dependencies
RUN corepack enable && \
    pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Generate Drizzle models first, then build
RUN pnpm drizzle-kit generate:mysql && \
    pnpm build && \
    pnpm prune --prod

FROM node:20-slim
ARG ORIGIN=http://localhost:3000
ENV ORIGIN=$ORIGIN
WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /staging/package.json /staging/pnpm-lock.yaml ./
COPY --from=builder /staging/node_modules ./node_modules
COPY --from=builder /staging/build ./build
COPY --from=builder /staging/drizzle ./drizzle

EXPOSE 3000
CMD ["node", "-r", "dotenv/config", "./build/index.js"]