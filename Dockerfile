FROM node:latest
WORKDIR /code
COPY package*.json ./
RUN npm --silent install
COPY . .
CMD npm run start