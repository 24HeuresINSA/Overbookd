FROM node

WORKDIR /assomaker

COPY . .

RUN npm install

EXPOSE 1234

CMD ["nmp", "run", "serve"]