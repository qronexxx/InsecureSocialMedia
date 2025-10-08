# --- Frontend build ---
FROM node:20-alpine AS fe
WORKDIR /fe
COPY connectu-app/package*.json ./
RUN npm ci
COPY connectu-app ./
# API-Basis für das Frontend konfigurierbar (default: http://localhost:10001)
ARG VITE_API_URL=http://localhost:10001
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# --- Backend build ---
FROM maven:3.9-eclipse-temurin-21 AS be
WORKDIR /be
COPY restserverfull/pom.xml ./
RUN mvn -q -DskipTests dependency:go-offline
COPY restserverfull/src ./src
RUN mvn -q -DskipTests -Dmaven.test.skip=true package

# --- Runtime: Postgres + Java + Nginx + Supervisor ---
FROM postgres:16
RUN apt-get update && apt-get install -y --no-install-recommends \
    openjdk-21-jre-headless nginx supervisor && \
    rm -rf /var/lib/apt/lists/*

# Entferne Debian-Default-Site, um Port-Konflikte zu vermeiden
RUN rm -f /etc/nginx/sites-enabled/default

WORKDIR /app
# Backend
COPY --from=be /be/target/restserverfull-1.0.0-shaded.jar /app/app.jar
# Frontend statisch unter Nginx
COPY --from=fe /fe/dist /usr/share/nginx/html
# DB-Init
COPY restserverfull/db-init.sql /docker-entrypoint-initdb.d/01-db-init.sql
# Nginx + Supervisor Konfig (eigene Conf unter anderem Namen ablegen)
COPY deploy/nginx/default.conf /etc/nginx/conf.d/app.conf
COPY deploy/supervisor/supervisord.conf /etc/supervisor/supervisord.conf

# Ports: 80 = Frontend, 10001 = Backend-API
EXPOSE 80 10001

# DB- und App-Umgebungen
ENV POSTGRES_USER=connectdb \
    POSTGRES_PASSWORD=connectdb \
    POSTGRES_DB=connectdb \
    DB_HOST=127.0.0.1 \
    DB_PORT=5432 \
    DB_NAME=connectdb \
    DB_USER=connectdb \
    DB_PASSWORD=connectdb

ENTRYPOINT ["/usr/bin/supervisord","-c","/etc/supervisor/supervisord.conf"]