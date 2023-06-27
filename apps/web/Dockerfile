FROM node:16-alpine AS installer

WORKDIR /overbookd/frontend

COPY package*.json ./

RUN npm ci --silent

FROM installer AS builder

ARG BASE_URL

ENV BASE_URL=$BASE_URL

COPY . .

RUN npm run build:ci

FROM node:16-alpine

ARG VERSION

LABEL org.24heures.overbookd.image.title="Overbookd-frontend" \
  org.24heures.overbookd.image.documentation="https://gitlab.com/24-heures-insa/overbookd-mono/-/wikis/home" \
  org.24heures.overbookd.image.licenses="https://gitlab.com/24-heures-insa/overbookd-mono/-/blob/main/LICENSE" \
  org.24heures.overbookd.image.source="https://gitlab.com/24-heures-insa/overbookd-mono" \
  org.24heures.overbookd.image.authors="https://gitlab.com/24-heures-insa/overbookd-mono/-/graphs/main" \
  org.24heures.overbookd.image.version=${VERSION}

ENV NODE_ENV production

WORKDIR /app

RUN chown -R node:node /app

USER node

RUN npm install serve --silent

COPY --chown=node:node --from=builder /overbookd/frontend/dist ./dist

EXPOSE 1234

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 CMD [ "wget", "-q", "-O", "-", "http://localhost:1234/"]

CMD ["./node_modules/.bin/serve", "--single", "--listen", "1234", "dist"]
