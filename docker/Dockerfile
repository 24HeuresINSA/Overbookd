FROM node:22.16.0-alpine

COPY ./aliases /etc/profile.d/aliases.sh

RUN chmod +x /etc/profile.d/aliases.sh

RUN npm install -g pnpm@10.12.2

RUN apk update && apk add --no-cache \
  jq \
  openssl
