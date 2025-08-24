ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} as base
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY frontend/package.json ./frontend/
COPY shared/package.json ./shared/

RUN yarn install --frozen-lockfile

COPY frontend ./frontend
COPY shared ./shared

FROM base as dev
WORKDIR /usr/src/app/frontend
EXPOSE 8080
CMD ["yarn", "dev"]

FROM base as build
# Build shared module first
WORKDIR /usr/src/app/shared
RUN yarn clean && yarn build

# Then build frontend
WORKDIR /usr/src/app/frontend
RUN yarn build

FROM nginx:alpine as production
COPY --from=build /usr/src/app/frontend/dist/spa /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
