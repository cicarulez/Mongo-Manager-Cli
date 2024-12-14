# Use Node.js LTS as base image
FROM node:lts-alpine

# Set working directory
WORKDIR /usr/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY src/ src/.

# Default command to run the script
CMD ["npm", "run", "start:prod"]