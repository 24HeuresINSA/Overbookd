FROM node:16.14-alpine3.15 AS builder

WORKDIR /overbookd/backend

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:16.14-alpine3.15

WORKDIR /app

COPY --chown=node:node --from=builder /overbookd/backend/node_modules ./node_modules
COPY --chown=node:node --from=builder /overbookd/backend/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/main.js" ]
