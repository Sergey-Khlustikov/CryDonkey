FROM node:20

WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Установка всех зависимостей
RUN npm install

# Установка nodemon и ts-node глобально
RUN npm install -g nodemon ts-node

# Копируем остальные файлы приложения
COPY . .

# Установка TypeScript и компиляция проекта
RUN npm install --save-dev typescript @types/node @types/express
RUN npx tsc

# Экспортируем порт
EXPOSE ${EXPRESS_SERVER_PORT}

# Команда для запуска приложения
CMD ["npm", "run", "dev"]
