# Use Node.js LTS as base image
FROM node:lts-alpine

# Set working directory
WORKDIR /usr/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --verbose

# Copy application source code
COPY src/ src/.

# Default command to run the script
CMD ["npm", "run", "start:prod"]