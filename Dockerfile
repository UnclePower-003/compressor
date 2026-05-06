# Use a small Node image
FROM node:20-alpine

# App directory
WORKDIR /app

# Install deps first (better caching)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Start dev server
CMD ["npm", "run","dev"]