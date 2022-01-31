FROM node:16.13-alpine-3.14 AS builder

WORKDIR /overbookd/backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16.13-alpine-3.14

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY --from=builder /overbookd/backend/dist ./dist

EXPOSE 2424

CMD ["npm", "start"]
