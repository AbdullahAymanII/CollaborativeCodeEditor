## Stage 1: Build the application
#FROM maven:3.8.5-openjdk-17 AS build
#
## Set working directory
#WORKDIR /editor
#
## Copy the pom.xml and source code
#COPY pom.xml /editor/
#COPY src /editor/src/
#
## Build the application, skipping tests to speed up the process
#RUN mvn clean package -DskipTests
#
## Stage 2: Run the application
#FROM openjdk:17-jdk-oracle
#
## Set working directory
#WORKDIR /editor
#
## Ensure the JAR file is correctly named and copied
#COPY --from=build /editor/target/editor-0.0.1-SNAPSHOT.jar /editor/editor.jar
#
## Expose the application port
#EXPOSE 8080:8080
#
## Run the JAR file
#ENTRYPOINT ["java", "-jar", "/editor/editor.jar"]



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
FROM openjdk:17-jdk-oracle

# Set working directory
WORKDIR /editor

# Copy the JAR file
COPY --from=build /editor/target/editor-0.0.1-SNAPSHOT.jar /editor/editor.jar

# Expose port 8080 for the Spring Boot app
EXPOSE 8080

# Run the Spring Boot app with DevTools enabled
ENTRYPOINT ["java", "-jar", "/editor/editor.jar", "-Dspring.devtools.restart.enabled=true"]
