# Use official Node image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose the Vite (or React dev) port
EXPOSE 5173

# Start dev server
CMD ["npm", "run", "dev", "--", "--host"]
