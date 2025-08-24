ARG NODE_VERSION=20

FROM node:${NODE_VERSION} as base

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/

RUN yarn install --frozen-lockfile

COPY backend ./backend
COPY shared ./shared

FROM base as dev

WORKDIR /usr/src/app/backend
CMD ["yarn", "start:dev"]

FROM base as production

WORKDIR /usr/src/app/shared
RUN yarn build

WORKDIR /usr/src/app/backend
RUN yarn build

CMD ["yarn", "start:prod"]
