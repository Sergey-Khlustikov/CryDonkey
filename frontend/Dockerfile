ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} as base
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .

FROM base as dev
EXPOSE 8080
CMD ["yarn", "dev"]

FROM base as build

RUN yarn build

FROM nginx:alpine as production

COPY --from=build /app/dist/spa /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
