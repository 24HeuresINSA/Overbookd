FROM node:16.14-alpine-3.15 AS builder

WORKDIR /overbookd/backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16.14-alpine3.15

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY --from=builder /overbookd/backend/dist ./dist

EXPOSE 2424

CMD ["npm", "start"]
