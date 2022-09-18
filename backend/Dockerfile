FROM node:16.14-alpine3.15 AS builder

WORKDIR /overbookd/backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:16.14-alpine3.15

WORKDIR /app

RUN npm install serve
COPY --from=builder /overbookd/backend/dist ./dist

EXPOSE 2424

CMD ["./node_modules/.bin/serve", "--single", "--listen", "2424", "dist"]
