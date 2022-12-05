FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm run start
CMD ["node", "dist/main.js"]
EXPOSE 3000