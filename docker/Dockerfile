FROM node:22.13.1-alpine

COPY ./aliases /etc/profile.d/aliases.sh

RUN chmod +x /etc/profile.d/aliases.sh

RUN npm install -g pnpm@9.15.4

RUN apk update && apk add --no-cache \
  jq \
  openssl
