FROM node:20-alpine AS installer

WORKDIR /overbookd

RUN npm install -g pnpm@8.7.4
COPY pnpm-lock.yaml ./

RUN pnpm fetch

COPY pnpm-workspace.yaml ./
COPY package.json ./

WORKDIR /overbookd/apps/web
COPY apps/web/ ./

WORKDIR /overbookd/libraries
COPY libraries/ ./

WORKDIR /overbookd/domains
COPY domains/ ./

WORKDIR /overbookd
RUN pnpm install --recursive --offline --filter '@overbookd/web...'

FROM installer AS builder

ARG BASE_URL
ARG OVERBOOKD_VERSION

ENV BASE_URL=$BASE_URL
ENV OVERBOOKD_VERSION=${OVERBOOKD_VERSION}

COPY tsconfig.library-import.json ./
COPY tsconfig.package.json ./
COPY tsconfig.build.json ./
RUN pnpm --filter '@overbookd/web...' run build:ci

FROM node:20-alpine

ARG WEB_VERSION

LABEL org.24heures.overbookd.image.title="Overbookd-web" \
  org.24heures.overbookd.image.documentation="https://gitlab.com/24-heures-insa/overbookd-mono/-/wikis/home" \
  org.24heures.overbookd.image.licenses="https://gitlab.com/24-heures-insa/overbookd-mono/-/blob/main/LICENSE" \
  org.24heures.overbookd.image.source="https://gitlab.com/24-heures-insa/overbookd-mono" \
  org.24heures.overbookd.image.authors="https://gitlab.com/24-heures-insa/overbookd-mono/-/graphs/main" \
  org.24heures.overbookd.image.version=${WEB_VERSION}

ENV NODE_ENV production

WORKDIR /app

RUN chown -R node:node /app

USER node

RUN npm install serve --silent

COPY --chown=node:node --from=builder /overbookd/apps/web/dist ./dist

EXPOSE 1234

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 CMD [ "wget", "-q", "-O", "-", "http://localhost:1234/"]

CMD ["./node_modules/.bin/serve", "--single", "--listen", "1234", "dist"]
