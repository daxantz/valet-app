FROM node:22-alpine

WORKDIR /usr/src/app

# Copy package files first
COPY package*.json ./

# Clear any old dependencies and reinstall
RUN rm -rf node_modules && npm install

# Copy rest of the app source
COPY . .

# Copy env file (only if needed inside container)
COPY .env .env

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
