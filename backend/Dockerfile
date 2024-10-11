ARG NODE_VERSION=20

FROM node:${NODE_VERSION} as base

WORKDIR /usr/src/app

EXPOSE 3001

# Сначала копируем только package.json и yarn.lock
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile

# Затем копируем остальные файлы
COPY . .

# Этап разработки
FROM base as dev
CMD ["yarn", "dev"]

# Этап продакшна
FROM base as production
RUN yarn build
CMD ["yarn", "start"]
