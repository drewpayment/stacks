FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ARG ORIGIN=http://localhost:3000
ENV ORIGIN=$ORIGIN
RUN corepack enable

# install dependencies 
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# RUN npm install -g pnpm

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM base 
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app .

EXPOSE 3000
CMD ["node", "-r", "dotenv/config", "./build"]