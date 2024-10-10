# Use the official Node.js image as a base image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install typescript

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Run Prisma Migrate and Generate Prisma Client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/index.js"]
