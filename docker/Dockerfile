FROM node:20.11.1-alpine

COPY ./aliases /etc/profile.d/aliases.sh

RUN chmod +x /etc/profile.d/aliases.sh

RUN npm install -g pnpm@8.15.5

RUN apk update && apk add --no-cache \
  jq
