FROM node:20-alpine

COPY ./aliases /etc/profile.d/aliases.sh

RUN chmod +x /etc/profile.d/aliases.sh

RUN npm install -g pnpm
RUN pnpm --version
