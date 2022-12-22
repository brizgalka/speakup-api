FROM node:16-alpine3.16

COPY package*.json ./
COPY tsconfig.json ./

COPY src ./src

RUN ls -a

RUN npm run start

EXPOSE 6060 6061

CMD [ "node", "/dist/main.js" ]