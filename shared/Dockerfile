ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION}
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY shared/package.json ./shared/

RUN yarn install --frozen-lockfile

COPY shared ./shared
WORKDIR /usr/src/app/shared

CMD ["yarn", "build"]
