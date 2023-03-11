FROM node:16-alpine AS installer

WORKDIR /overbookd/backend

COPY package*.json ./

RUN npm ci --silent

FROM installer AS builder

COPY . .

RUN npx prisma generate

RUN npm run build

RUN npm prune --production

FROM node:16-alpine

ARG VERSION

LABEL org.24heures.overbookd.image.title="Overbookd-backend" \
  org.24heures.overbookd.image.documentation="https://gitlab.com/24-heures-insa/overbookd-mono/-/wikis/home" \
  org.24heures.overbookd.image.licenses="https://gitlab.com/24-heures-insa/overbookd-mono/-/blob/main/LICENSE" \
  org.24heures.overbookd.image.source="https://gitlab.com/24-heures-insa/overbookd-mono" \
  org.24heures.overbookd.image.authors="https://gitlab.com/24-heures-insa/overbookd-mono/-/graphs/main" \
  org.24heures.overbookd.image.version=${VERSION}

ENV NODE_ENV production

USER node

WORKDIR /app/dist

COPY --chown=node:node --from=builder /overbookd/backend/dist /app/dist
COPY --chown=node:node --from=builder /overbookd/backend/node_modules ./node_modules
COPY --chown=node:node --from=builder /overbookd/backend/prisma ./prisma

EXPOSE 3000

CMD [  "npm", "run", "start:migrate:prod" ]
