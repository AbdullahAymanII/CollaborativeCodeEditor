# Stage 1: Build the application
FROM maven:3.8.5-openjdk-17 AS build

WORKDIR /editor
COPY pom.xml /editor/

RUN mvn dependency:go-offline

COPY src /editor/src/

RUN mvn clean install -DskipTests

# Stage 2: Run the application
FROM openjdk:17-jdk-slim

# Install Docker CLI for running Docker commands from within the container
RUN apt-get update && apt-get install -y docker.io

# Set working directory
WORKDIR /editor

# Copy the JAR file from the build stage
COPY --from=build //target/editor-0.0.1-SNAPSHOT.jar /editor/editor.jar

# Expose port 8080 for the Spring Boot app
EXPOSE 8080

# Run the Spring Boot app with DevTools enabled
ENTRYPOINT ["java", "-jar", "/editor/editor.jar", "-Dspring.devtools.restart.enabled=true"]
