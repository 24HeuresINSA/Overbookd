FROM node:24.21.0-alpine

COPY ./aliases /etc/profile.d/aliases.sh

RUN chmod +x /etc/profile.d/aliases.sh

RUN npm install -g pnpm@12.10.1

RUN apk update && apk add --no-cache \
  jq \
  openssl
