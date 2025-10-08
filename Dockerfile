From node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .


COPY .env .env
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "dev"]