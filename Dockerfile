# Stage 1: Base & Build
FROM node:22-alpine AS build
# Manually install pnpm to avoid corepack network issues
RUN npm install -g pnpm
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Stage 2: Production Dependencies
FROM node:22-alpine AS prod-deps
RUN npm install -g pnpm
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --prod --frozen-lockfile

# Stage 3: Final Production Image
FROM node:22-alpine
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "dist/index.js" ]
