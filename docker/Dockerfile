FROM node:24.18.0-alpine

COPY ./aliases /etc/profile.d/aliases.sh

RUN chmod +x /etc/profile.d/aliases.sh

RUN npm install -g pnpm@11.15.1

RUN apk update && apk add --no-cache \
  jq \
  openssl
