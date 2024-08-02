# Build with:   docker build -t IMAGE_NAME .
# Run with:     docker run -p 3000:3000 --rm --name IMAGE_NAME IMAGE_NAME

FROM node:20-slim AS builder
WORKDIR /staging
COPY . /staging/
RUN corepack enable && \
  pnpm install --frozen-lockfile && \
  pnpm build && \
  pnpm prune --prod

FROM node:20-slim
ARG ORIGIN=http://localhost:3000
ENV ORIGIN=$ORIGIN
WORKDIR /app
COPY --from=builder /staging/package.json /staging/pnpm-lock.yaml  /app/
COPY --from=builder /staging/node_modules /app/node_modules
COPY --from=builder /staging/build /app/build

EXPOSE 3000
CMD ["node", "-r", "dotenv/config", "/app/build/index.js"]