FROM node:18-alpine AS installer

WORKDIR /overbookd

RUN npm install -g pnpm
RUN pnpm --version
COPY pnpm-lock.yaml ./

RUN pnpm fetch

ADD pnpm-workspace.yaml ./
ADD package.json ./

RUN echo "node-linker=hoisted" >> .npmrc

WORKDIR /overbookd/apps/api
ADD apps/api/ ./

WORKDIR /overbookd/libraries
ADD libraries/ ./

WORKDIR /overbookd
RUN pnpm install --recursive --offline --filter '@overbookd/api...'

FROM installer AS builder

ADD tsconfig.json ./
RUN pnpm --filter '@overbookd/api' run build:ci

FROM node:18-alpine

ARG VERSION

LABEL org.24heures.overbookd.image.title="Overbookd-api" \
  org.24heures.overbookd.image.documentation="https://gitlab.com/24-heures-insa/overbookd-mono/-/wikis/home" \
  org.24heures.overbookd.image.licenses="https://gitlab.com/24-heures-insa/overbookd-mono/-/blob/main/LICENSE" \
  org.24heures.overbookd.image.source="https://gitlab.com/24-heures-insa/overbookd-mono" \
  org.24heures.overbookd.image.authors="https://gitlab.com/24-heures-insa/overbookd-mono/-/graphs/main" \
  org.24heures.overbookd.image.version=${VERSION}

ENV NODE_ENV production

RUN npm install -g pnpm
RUN pnpm --version

USER node

WORKDIR /app/dist

COPY --chown=node:node --from=builder /overbookd/apps/api/dist /app/dist
COPY --chown=node:node --from=builder /overbookd/node_modules ./node_modules
COPY --chown=node:node --from=builder /overbookd/apps/api/prisma ./prisma

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 CMD [ "wget", "-q", "-O", "-", "http://localhost:3000/"]

CMD [  "sh", "-c", "pnpm --recursive --filter '@overbookd/api' run start:migrate:prod" ]
