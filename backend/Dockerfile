ARG NODE_VERSION=20

FROM node:${NODE_VERSION} as base

WORKDIR /usr/src/app

EXPOSE 3002

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

FROM base as dev
CMD ["yarn", "dev"]

FROM base as production
RUN yarn build
CMD ["yarn", "start"]
