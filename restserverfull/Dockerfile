FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline

COPY src ./src
RUN mvn -q -DskipTests -Dmaven.test.skip=true package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /build/target/restserverfull-1.0.0-shaded.jar /app/app.jar

EXPOSE 10001
ENV DB_HOST=localhost \
    DB_PORT=5432 \
    DB_NAME=connectdb \
    DB_USER=connectdb \
    DB_PASSWORD=connectdb

ENTRYPOINT ["java","-jar","/app/app.jar"]
