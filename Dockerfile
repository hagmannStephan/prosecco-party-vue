# Base image
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose the port used by `vite preview` (default is 4173)
EXPOSE 5173

# Run Vite's production preview server
CMD ["npm", "run", "preview", "--", "--host"]