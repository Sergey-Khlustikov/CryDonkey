FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${EXPRESS_SERVER_PORT}

RUN npm install -g nodemon

CMD ["npm", "run", "dev"]
