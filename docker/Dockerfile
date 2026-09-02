FROM node:24.19.0-alpine

COPY ./aliases /etc/profile.d/aliases.sh

RUN chmod +x /etc/profile.d/aliases.sh

RUN npm install -g pnpm@11.25.0

RUN apk update && apk add --no-cache \
  jq \
  openssl
