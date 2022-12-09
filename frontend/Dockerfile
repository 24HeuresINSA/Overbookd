FROM node:16.17.1-alpine3.16 AS builder

WORKDIR /overbookd/frontend
ARG BASE_URL

ENV BASE_URL=$BASE_URL

COPY package*.json ./

RUN npm ci 

COPY . .

RUN npm run build:ci

FROM node:16.17.1-alpine3.16

ENV NODE_ENV production

WORKDIR /app

RUN chown -R node:node /app

USER node

RUN npm install serve

COPY --chown=node:node --from=builder /overbookd/frontend/dist ./dist

EXPOSE 1234

CMD ["./node_modules/.bin/serve", "--single", "--listen", "1234", "dist"]
