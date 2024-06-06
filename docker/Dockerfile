FROM node:14-slim

RUN apt-get update || : && apt-get install -y \
    python \
    curl \
    build-essential
    
# RUN npm install -g typescript ts-node

WORKDIR /app

COPY ./docker-package.json ./package.json
COPY ./docker-steedos.config.js ./steedos.config.js
# COPY ../yarn.lock .
COPY ./steedos-packages ./steedos-packages

RUN yarn && yarn build 

RUN yarn cache clean

CMD ["yarn", "start"]