FROM node:20.10.0-alpine

COPY ./aliases /etc/profile.d/aliases.sh

RUN chmod +x /etc/profile.d/aliases.sh

RUN npm install -g pnpm@8.12.1

RUN apk update && apk add --no-cache \
  jq
