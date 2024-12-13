# Dockerfile

# Use Node.js LTS as base image
FROM node:lts-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY src/package*.json ./
RUN npm install

# Copy application source code
COPY src/index.js .

# Default command to run the script
CMD ["node", "index.js"]