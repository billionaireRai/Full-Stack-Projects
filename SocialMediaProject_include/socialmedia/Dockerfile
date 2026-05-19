# Base image
FROM node:20-alpine AS base

# Dependencies stage => installs all the required dependencies to run this project...
FROM base AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install

# Builder stage => builds optimized production ready files...
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production stage => creates lightweight final production container...
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]

