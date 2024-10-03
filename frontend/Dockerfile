## Use the official Node.js image as a base image
#FROM node:18
#
## Set the working directory in the container
#WORKDIR /app
#
## Copy package.json and yarn.lock to install dependencies
#COPY package.json package-lock.json ./
#
## Install all dependencies
#RUN yarn install
#
## Copy the entire frontend project to the working directory in the container
#COPY . .
#
## Build the React application for production
#RUN yarn build
#
## Expose port 3000 for the React app
#EXPOSE 3000
#
## Start the application
#CMD ["yarn", "start"]




# Use the official Node.js image as a base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN yarn install

# Install nodemon for live reloading
RUN yarn add --dev nodemon

# Copy the entire frontend project to the working directory in the container
COPY . .

# Expose port 3000 for the React app
EXPOSE 3000

# Use nodemon for live reload
CMD ["yarn", "start"]
