FROM node

WORKDIR /app

COPY . /app

RUN npm install

cmd node index.js
