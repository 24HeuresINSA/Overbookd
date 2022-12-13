FROM node:16.17.1-alpine3.16 AS builder

WORKDIR /overbookd/backend

COPY package*.json ./

RUN npm ci --silent

COPY . .

RUN npx prisma generate

RUN npm run build

RUN npm prune --production

FROM node:16.17.1-alpine3.16

ENV NODE_ENV production

USER node

WORKDIR /app/dist

COPY --chown=node:node --from=builder /overbookd/backend/dist /app/dist

COPY --chown=node:node --from=builder /overbookd/backend/node_modules ./node_modules
COPY --chown=node:node --from=builder /overbookd/backend/prisma ./prisma

EXPOSE 3000

CMD [  "npm", "run", "start:migrate:prod" ]
