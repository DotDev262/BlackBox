# Stage 1: Build the Flutter web app
# Use a specific Flutter version from the ghcr.io/cirruslabs registry
FROM ghcr.io/cirruslabs/flutter:latest as builder

# Create and switch to a new user to avoid running as root
RUN useradd -ms /bin/bash flutter
# Give the new user ownership of the Flutter SDK directory
RUN chown -R flutter:flutter /sdks/flutter
USER flutter
WORKDIR /home/flutter/app

# Fix for "dubious ownership" error
RUN git config --global --add safe.directory /sdks/flutter

# Copy pubspec files first to leverage Docker cache for dependencies
COPY --chown=flutter:flutter pubspec.* ./

# Get dependencies
RUN flutter pub get

# Copy the rest of the application code
COPY --chown=flutter:flutter . .

# Build the Flutter web application
RUN flutter build web --release

# Stage 2: Create the production image with Nginx on Alpine
# Use a lightweight alpine-based nginx image for a small final image size
FROM nginx:alpine

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove the default Nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy the built web app from the builder stage
COPY --from=builder /home/flutter/app/build/web /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
