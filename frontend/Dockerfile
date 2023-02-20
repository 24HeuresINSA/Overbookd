FROM node:19-alpine AS installer

WORKDIR /overbookd/frontend

COPY package*.json ./

RUN npm ci --silent

FROM installer AS builder

ARG BASE_URL

ENV BASE_URL=$BASE_URL

COPY . .

RUN npm run build:ci

FROM node:19-alpine

ENV NODE_ENV production

WORKDIR /app

RUN chown -R node:node /app

USER node

RUN npm install serve --silent

COPY --chown=node:node --from=builder /overbookd/frontend/dist ./dist

EXPOSE 1234

CMD ["./node_modules/.bin/serve", "--single", "--listen", "1234", "dist"]
