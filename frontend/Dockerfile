FROM node:16.13-alpine3.14 AS builder

WORKDIR /overbookd/frontend
ARG BASE_URL_KEYCLOAK
ARG BASE_URL

ENV BASE_URL=$BASE_URL
ENV BASE_URL_KEYCLOAK=$BASE_URL_KEYCLOAK

COPY . .

RUN npm ci\
    && npm run build

FROM node:16.13-alpine-3.14

WORKDIR /app

RUN npm install serve

COPY --from=builder /overbookd/frontend/dist ./dist

EXPOSE 1234

CMD ["./node_modules/.bin/serve", "--single", "--listen", "1234", "dist"]
