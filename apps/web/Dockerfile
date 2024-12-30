FROM node:22.12.0-alpine AS installer

WORKDIR /overbookd

RUN npm install -g pnpm@9.15.2
COPY pnpm-lock.yaml ./

RUN pnpm fetch

COPY pnpm-workspace.yaml ./
COPY package.json ./

COPY apps/web /overbookd/apps/web
COPY libraries /overbookd/libraries
COPY domains /overbookd/domains
COPY utils /overbookd/utils
COPY constants /overbookd/constants

RUN pnpm install --recursive --offline --filter '@overbookd/web...'

FROM installer AS builder

ARG BASE_URL
ARG OVERBOOKD_VERSION

ENV BASE_URL=$BASE_URL
ENV OVERBOOKD_VERSION=${OVERBOOKD_VERSION}

COPY tsconfig.cross-modules-import.json ./
COPY tsconfig.package.json ./
COPY tsconfig.build.json ./
COPY tsconfig.all-modules-import.json ./
RUN pnpm --filter '@overbookd/web...' run build:ci

FROM node:22.12.0-alpine

ARG WEB_VERSION

LABEL org.24heures.overbookd.image.title="Overbookd-web" \
  org.24heures.overbookd.image.documentation="https://gitlab.com/24-heures-insa/overbookd-mono/-/wikis/home" \
  org.24heures.overbookd.image.licenses="https://gitlab.com/24-heures-insa/overbookd-mono/-/blob/main/LICENSE" \
  org.24heures.overbookd.image.source="https://gitlab.com/24-heures-insa/overbookd-mono" \
  org.24heures.overbookd.image.authors="https://gitlab.com/24-heures-insa/overbookd-mono/-/graphs/main" \
  org.24heures.overbookd.image.version=${WEB_VERSION}

ENV NODE_ENV=production

WORKDIR /app

RUN chown -R node:node /app

USER node

COPY --chown=node:node --from=builder /overbookd/apps/web/.output ./output

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 CMD [ "wget", "-q", "-O", "-", "http://localhost:3000/"]

CMD [ "node", "output/server/index.mjs" ]
