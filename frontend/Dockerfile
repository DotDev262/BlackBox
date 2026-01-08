# Stage 1: Build the Expo web app
FROM oven/bun:latest as builder

WORKDIR /app

# Copy package manager files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the source code
COPY . .

# Build the web app
RUN bun run export

# Stage 2: Serve the web app with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
# I will create this file next
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built web files from the build stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
