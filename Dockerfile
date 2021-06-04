FROM node:14-alpine

RUN mkdir -p /var/log/databox/
ENV NODE_ENV=production
ENV SERVICE=databox-example
ENV LOG_FILENAME=/var/log/databox/databox.log

WORKDIR /app

COPY package.json /app
RUN npm install --only=prod

COPY ./dist /app

CMD node index.js

