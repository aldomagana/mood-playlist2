# Use a multi-stage build to produce a small image

FROM node:18-alpine AS builder
WORKDIR /app/server
# copy server package files and install dependencies in /app/server
COPY server/package*.json ./
RUN npm install --production || true

# copy full server source into /app/server
COPY server/ ./

# build client
FROM node:18-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

FROM node:18-alpine
WORKDIR /app
# copy server built content
COPY --from=builder /app ./
# copy client build into server public folder
COPY --from=client-builder /app/client/build ./server/public
WORKDIR /app/server
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "index.js"]
