# Use Node.js base image
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your backend code
COPY . .

# Expose port
EXPOSE 3000

# Start Next.js in dev mode (or use `start` for production)
CMD ["npm", "run", "dev"]
