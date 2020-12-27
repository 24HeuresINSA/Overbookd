FROM node:lts-alpine

WORKDIR /assomaker

COPY . .

RUN npm ci\
    && npm run build\
    && find . -maxdepth 1 ! -name 'dist' -type f -exec rm -r {} +\
    && find . -maxdepth 1 ! -name 'dist' ! -name '.' ! -name '..' -type d -exec rm -r {} +\
    && npm install serve


EXPOSE 1234

CMD ["./node_modules/.bin/serve", "--single", "--listen", "1234", "dist"]