FROM node:20-alpine AS installer

WORKDIR /overbookd

RUN npm install -g pnpm
RUN pnpm --version
COPY pnpm-lock.yaml ./

RUN pnpm fetch

COPY pnpm-workspace.yaml ./
COPY package.json ./

RUN echo "node-linker=hoisted" >> .npmrc

WORKDIR /overbookd/apps/api
COPY apps/api/ ./

WORKDIR /overbookd/libraries
COPY libraries/ ./

WORKDIR /overbookd/domains
COPY domains/ ./

WORKDIR /overbookd
RUN pnpm install --recursive --offline --filter '@overbookd/api...'

FROM installer AS builder

COPY tsconfig.library-import.json ./
COPY tsconfig.build.json ./
COPY tsconfig.package.json ./
COPY tsconfig.json ./
RUN pnpm --recursive --filter '@overbookd/api...' run build:ci

FROM node:20-alpine

ARG API_VERSION
ARG OVERBOOKD_VERSION

LABEL org.24heures.overbookd.image.title="Overbookd-api" \
  org.24heures.overbookd.image.documentation="https://gitlab.com/24-heures-insa/overbookd-mono/-/wikis/home" \
  org.24heures.overbookd.image.licenses="https://gitlab.com/24-heures-insa/overbookd-mono/-/blob/main/LICENSE" \
  org.24heures.overbookd.image.source="https://gitlab.com/24-heures-insa/overbookd-mono" \
  org.24heures.overbookd.image.authors="https://gitlab.com/24-heures-insa/overbookd-mono/-/graphs/main" \
  org.24heures.overbookd.image.version=${API_VERSION}

ENV NODE_ENV production

RUN npm install -g pnpm
RUN pnpm --version

USER node

WORKDIR /overbookd

COPY --chown=node:node --from=builder /overbookd/node_modules /overbookd/apps/api/node_modules
COPY --chown=node:node --from=builder /overbookd/apps/api/dist/apps/api /overbookd/apps/api
COPY --chown=node:node --from=builder /overbookd/apps/api/prisma /overbookd/apps/api/prisma
COPY --chown=node:node --from=builder /overbookd/apps/api/node_modules/@overbookd /overbookd/apps/api/node_modules/@overbookd
COPY --chown=node:node --from=builder /overbookd/libraries /overbookd/libraries
COPY --chown=node:node --from=builder /overbookd/domains /overbookd/domains

EXPOSE 3000

WORKDIR /overbookd/apps/api

ENV OVERBOOKD_VERSION=${OVERBOOKD_VERSION}

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 CMD [ "wget", "-q", "-O", "-", "http://localhost:3000/"]

CMD [  "sh", "-c", "pnpm run start:migrate:prod" ]
