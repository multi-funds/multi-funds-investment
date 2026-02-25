# Dockerfile

# Use a multi-stage build to optimize the final image size

# Stage 1: Build the application
FROM node:16 AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application
FROM node:16 AS runner
WORKDIR /app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD [ "npm", "start" ]