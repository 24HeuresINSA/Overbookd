FROM node:16.14-alpine3.15 AS builder

WORKDIR /overbookd/frontend
ARG BASE_URL

ENV BASE_URL=$BASE_URL

COPY package*.json ./

RUN npm ci 

COPY . .

RUN npm run build

FROM node:16.14-alpine3.15

WORKDIR /app

RUN npm install serve

COPY --from=builder /overbookd/frontend/dist ./dist

EXPOSE 1234

CMD ["./node_modules/.bin/serve", "--single", "--listen", "1234", "dist"]
