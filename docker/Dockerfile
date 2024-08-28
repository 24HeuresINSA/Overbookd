FROM node:20.16.0-alpine

COPY ./aliases /etc/profile.d/aliases.sh

RUN chmod +x /etc/profile.d/aliases.sh

RUN npm install -g pnpm@9.9.0

RUN apk update && apk add --no-cache \
  jq
