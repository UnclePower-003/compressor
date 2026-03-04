# Use a small Node image
FROM node:20-alpine

# App directory
WORKDIR /app

# Install deps first (better caching)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# React dev server runs on 3000 inside container
EXPOSE 3000

# Make dev server reachable from outside container
ENV HOST=0.0.0.0

# Start dev server
CMD ["npm", "run","dev"]