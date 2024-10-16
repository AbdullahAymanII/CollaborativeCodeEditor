FROM maven:3.8.5-openjdk-17 AS build

WORKDIR /editor

COPY /editor/pom.xml /editor/
RUN mvn dependency:go-offline

COPY /editor/src /editor/src/

RUN mvn clean install -DskipTests

# Stage 2: Run the application
FROM openjdk:17-jdk-slim

WORKDIR /editor

COPY --from=build /editor/target/editor-0.0.1-SNAPSHOT.jar /editor/editor.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/editor/editor.jar"]
