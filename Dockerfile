FROM node:10-alpine

RUN apk update

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

COPY src ./src

RUN ls -a

RUN npm install
RUN npm run build

EXPOSE 6060 6061

CMD [ "node", "./dist/main.js" ]