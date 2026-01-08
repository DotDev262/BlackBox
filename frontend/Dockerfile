# Stage 1: Build the Expo web app
FROM node:20-alpine as builder

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json ./

# Install dependencies with npm
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the web app
RUN npx expo export -p web

# Stage 2: Serve the web app with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built web files from the build stage
# The output of 'expo export -p web' is in the 'dist' directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
