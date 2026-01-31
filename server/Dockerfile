# server/Dockerfile
FROM oven/bun:1.2.4 AS deps
WORKDIR /app

# Copy root manifests first
COPY package.json bun.lock turbo.json tsconfig.json ./

# Copy workspace manifests (so bun can resolve workspaces)
COPY server/package.json ./server/package.json
COPY shared/package.json ./shared/package.json
COPY client/package.json ./client/package.json

# If your server/shared tsconfigs are referenced during install/build tooling, copy them too
COPY server/tsconfig.json ./server/tsconfig.json
COPY shared/tsconfig.json ./shared/tsconfig.json
COPY client/tsconfig.json ./client/tsconfig.json
COPY client/tsconfig.app.json ./client/tsconfig.app.json
COPY client/tsconfig.node.json ./client/tsconfig.node.json

# Install all workspace deps (from root)
# without running root postinstall
RUN bun install --frozen-lockfile --ignore-scripts

FROM oven/bun:1.2.4 AS build
WORKDIR /app

# Reuse deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/bun.lock ./bun.lock
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/turbo.json ./turbo.json
COPY --from=deps /app/tsconfig.json ./tsconfig.json

# Copy source
COPY server ./server
COPY shared ./shared
COPY client ./client

# Build shared + server
RUN bunx turbo build --filter=shared --filter=server

FROM oven/bun:1.2.4 AS runner
WORKDIR /app
ENV NODE_ENV=production

# Only what we need at runtime
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/package.json ./server/package.json

# Run from the server workspace so bun definitely reads server/package.json
WORKDIR /app/server

EXPOSE 3000
CMD ["bun", "run", "start"]
