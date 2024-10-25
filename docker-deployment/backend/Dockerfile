# Base image for running the backend
FROM openjdk:17-jdk-slim

RUN apt-get update && apt-get install -y docker.io

WORKDIR /editor

EXPOSE 8080

CMD ["java", "-jar", "/editor/editor.jar"]




