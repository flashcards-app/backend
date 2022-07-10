FROM node:12-alpine

RUN mkdir /app
WORKDIR /app
ADD package.json package-lock.json /app/
RUN npm i
ADD . /app

CMD ["npm","run", "start"]
