FROM node:10-alpine

LABEL maintainer "joshua.foster@tessella.com"

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./src/ /usr/src/app
COPY ./package* /usr/src/app/
COPY ./*.lock /usr/src/app/
RUN yarn install --silent --production && yarn cache clean

CMD ["node", "./main.js"]
