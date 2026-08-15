FROM oven/bun:1 AS api-deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1 AS web-build
WORKDIR /web
COPY web/package.json web/bun.lock* ./
RUN bun install --frozen-lockfile
COPY web/ ./
RUN bun run build

FROM oven/bun:1
WORKDIR /app
COPY --from=api-deps /app/node_modules ./node_modules
COPY package.json bun.lock ./
COPY src ./src
COPY --from=web-build /web/build ./web-build
ENV PORT=8080
EXPOSE 8080
CMD ["bun", "src/server.ts"]
