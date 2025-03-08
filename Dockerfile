# Build with:   docker build -t IMAGE_NAME .
# Run with:     docker run -p 3000:3000 --rm --name IMAGE_NAME IMAGE_NAME

FROM oven/bun:1 AS builder
WORKDIR /staging

# Install necessary build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first for better caching
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Generate Drizzle models first, then build
RUN bun run generate-migrations:postgres && \
    bun run generate-migrations:mysql && \
    bun run build

FROM oven/bun:1-slim
ARG ORIGIN=http://localhost:3000
ENV ORIGIN=$ORIGIN
WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /staging/package.json ./
COPY --from=builder /staging/node_modules ./node_modules
COPY --from=builder /staging/build ./build

EXPOSE 3000
CMD ["bun", "run", "./build/index.js"]