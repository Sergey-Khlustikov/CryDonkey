ARG NODE_VERSION=20

FROM node:${NODE_VERSION} as base

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

FROM base as dev
CMD ["yarn", "start:dev"]

FROM base as production
RUN yarn build
CMD ["yarn", "start:prod"]
