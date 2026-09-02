# Use the official Node 18 Alpine image to keep the image small
FROM node:18-alpine AS deps

# Create app directory
WORKDIR /app

# Copy package.json first and install production deps
COPY admin/package.json admin/package-lock.json* ./

# Install production dependencies if package-lock present otherwise fallback to npm install
RUN if [ -f package-lock.json ]; then npm ci --production; else npm install --production; fi

# Builder stage (install dev deps and build)
FROM node:18-alpine AS builder
WORKDIR /app
COPY admin/package.json admin/package-lock.json* ./
RUN npm install

# Copy application source
COPY admin .

# Build the Next.js app
RUN npm run build

# Runner stage
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built assets and package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Install only production dependencies
RUN if [ -f package-lock.json ]; then npm ci --production; else npm install --production; fi

EXPOSE 3000

# Use next start to run the Next.js production server
CMD ["npm", "start"]
