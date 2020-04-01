FROM node:latest
WORKDIR /code
COPY package*.json ./
RUN npm --silent install
COPY . .
RUN npm run build

CMD npm run start