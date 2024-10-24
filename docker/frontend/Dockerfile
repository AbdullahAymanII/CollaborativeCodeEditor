#FROM node:18
#
#WORKDIR /app
#
#COPY /frontend/package.json package-lock.json ./
#
#RUN yarn install
#
#COPY . ./frontend
#
#EXPOSE 3000
#
#CMD ["yarn", "start"]


# Base image for running the frontend
FROM node:18-slim

WORKDIR /app

EXPOSE 3000

CMD ["yarn", "start"]
