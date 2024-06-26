FROM node:18-slim

RUN apt-get update || : && apt-get install -y \
    python-is-python3 \
    curl \
    build-essential
    

WORKDIR /app

COPY ./package.json ./package.json
COPY ./steedos.config.js ./steedos.config.js
COPY ./steedos-packages ./steedos-packages

RUN yarn && yarn build 

RUN yarn cache clean

CMD ["yarn", "start"]