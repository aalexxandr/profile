FROM node:24-alpine AS builder

ENV HUSKY=0

RUN npm install -g corepack && corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm ci

COPY . .

ARG API_URL
ARG NEXT_PUBLIC_SITE_URL
ENV API_URL=$API_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN pnpm build

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3001

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3001

CMD [ "node", "server.js" ]