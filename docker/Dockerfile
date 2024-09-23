FROM node:20.17.0-alpine

COPY ./aliases /etc/profile.d/aliases.sh

RUN chmod +x /etc/profile.d/aliases.sh

RUN npm install -g pnpm@9.11.0

RUN apk update && apk add --no-cache \
  jq
