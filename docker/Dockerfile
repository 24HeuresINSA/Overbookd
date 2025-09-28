FROM node:22.20.0-alpine

COPY ./aliases /etc/profile.d/aliases.sh

RUN chmod +x /etc/profile.d/aliases.sh

RUN npm install -g pnpm@10.14.0

RUN apk update && apk add --no-cache \
  jq \
  openssl
