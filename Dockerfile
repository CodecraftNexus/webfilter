FROM node:18

WORKDIR /app

COPY package*.json ./
COPY dist ./dist


RUN npm install --production

CMD ["node", "dist/app.js"]







