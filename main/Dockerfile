# Use an official Node runtime as a parent image
FROM node:18-alpine

# Define build-time environment variables
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Set environment variables
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json before other files
# Utilize Docker cache to save re-installing dependencies if unchanged
COPY package*.json ./

# Install Python, g++, make, and necessary libraries for 'canvas'
RUN apk add --no-cache python3 g++ make \
    pkgconf \
    pixman-dev \
    cairo-dev \
    pango-dev \
    libjpeg-turbo-dev \
    giflib-dev

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the current directory contents into the container at /app
COPY . .

# Build the Next.js app
RUN npm run build

# Run next start to start your app
CMD ["npm", "start"]
