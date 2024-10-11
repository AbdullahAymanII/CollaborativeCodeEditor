# Stage 1: Build the application
FROM maven:3.8.5-openjdk-17 AS build

# Set working directory
WORKDIR /editor

# Copy the pom.xml and install dependencies
COPY pom.xml /editor/
RUN mvn dependency:go-offline

# Copy the source code
COPY src /editor/src/

# Install Spring Boot DevTools for live reload
RUN mvn clean install -DskipTests

# Stage 2: Run the application
FROM openjdk:17-jdk-slim

# Install Docker CLI for running Docker commands from within the container
RUN apt-get update && apt-get install -y docker.io

# Set working directory
WORKDIR /editor

# Copy the JAR file from the build stage
COPY --from=build /editor/target/editor-0.0.1-SNAPSHOT.jar /editor/editor.jar

# Expose port 8080 for the Spring Boot app
EXPOSE 8080

# Run the Spring Boot app with DevTools enabled
ENTRYPOINT ["java", "-jar", "/editor/editor.jar", "-Dspring.devtools.restart.enabled=true"]
