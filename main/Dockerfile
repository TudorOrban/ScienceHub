# Node runtime
FROM node:18-alpine

# Define environment variables so that they are available at build-time
# for Next.js SSG
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Set environment variables
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Working directory
WORKDIR /app

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

# Run the Next.js app
CMD ["npm", "start"]
