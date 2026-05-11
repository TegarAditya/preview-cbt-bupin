# Stage 1
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

RUN corepack prepare pnpm@11 --activate

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# Stage 2
FROM gcr.io/distroless/nodejs22-debian12 AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.output ./.output

CMD [".output/server/index.mjs"]