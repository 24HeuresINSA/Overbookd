FROM node:20.10.0-alpine AS installer

WORKDIR /overbookd

RUN npm install -g pnpm@8.12.1
COPY pnpm-lock.yaml ./

RUN pnpm fetch

COPY pnpm-workspace.yaml ./
COPY package.json ./

WORKDIR /overbookd/apps/api
COPY apps/api/ ./

WORKDIR /overbookd/libraries
COPY libraries/ ./

WORKDIR /overbookd/domains
COPY domains/ ./

WORKDIR /overbookd/utils
COPY utils/ ./

WORKDIR /overbookd
RUN pnpm install --recursive --offline --filter '@overbookd/api...'

FROM installer AS builder

COPY tsconfig.cross-modules-import.json ./
COPY tsconfig.build.json ./
COPY tsconfig.package.json ./
COPY tsconfig.all-modules-import.json ./
COPY tsconfig.json ./
RUN pnpm --recursive --filter '@overbookd/api...' run build:ci

RUN pnpm install --prod --recursive --offline --filter '@overbookd/api...'

FROM node:20.10.0-alpine

ARG API_VERSION
ARG OVERBOOKD_VERSION

LABEL org.24heures.overbookd.image.title="Overbookd-api" \
  org.24heures.overbookd.image.documentation="https://gitlab.com/24-heures-insa/overbookd-mono/-/wikis/home" \
  org.24heures.overbookd.image.licenses="https://gitlab.com/24-heures-insa/overbookd-mono/-/blob/main/LICENSE" \
  org.24heures.overbookd.image.source="https://gitlab.com/24-heures-insa/overbookd-mono" \
  org.24heures.overbookd.image.authors="https://gitlab.com/24-heures-insa/overbookd-mono/-/graphs/main" \
  org.24heures.overbookd.image.version=${API_VERSION}

ENV NODE_ENV production

RUN npm install -g pnpm@8.12.1

USER node

WORKDIR /overbookd

COPY --chown=node:node --from=builder /overbookd/node_modules /overbookd/node_modules
COPY --chown=node:node --from=builder /overbookd/apps/api/dist/apps/api /overbookd/apps/api
COPY --chown=node:node --from=builder /overbookd/apps/api/package.json /overbookd/apps/api/package.json
COPY --chown=node:node --from=builder /overbookd/apps/api/prisma /overbookd/apps/api/prisma
COPY --chown=node:node --from=builder /overbookd/apps/api/node_modules /overbookd/apps/api/node_modules
COPY --chown=node:node --from=builder /overbookd/libraries /overbookd/libraries
COPY --chown=node:node --from=builder /overbookd/domains /overbookd/domains
COPY --chown=node:node --from=builder /overbookd/utils /overbookd/utils

EXPOSE 3000

WORKDIR /overbookd/apps/api

ENV OVERBOOKD_VERSION=${OVERBOOKD_VERSION}

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 CMD [ "wget", "-q", "-O", "-", "http://localhost:3000/"]

CMD [  "sh", "-c", "pnpm run start:migrate:prod" ]
