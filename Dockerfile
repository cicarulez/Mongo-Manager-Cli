# Dockerfile

# Use Node.js LTS as base image
FROM node:22-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY index.js .

# Default command to run the script
CMD ["node", "index.js"]