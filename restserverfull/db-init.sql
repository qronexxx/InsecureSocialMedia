-- Ausführung z.B.:
-- psql -h localhost -U postgres -f initialize.sql

-- 1) User/Rolle anlegen (Alias von CREATE ROLE mit LOGIN)
CREATE USER connectdb WITH PASSWORD 'connectdb';

-- 2) Datenbank mit Owner anlegen
CREATE DATABASE connectdb WITH OWNER connectdb;

-- 3) In die neue DB wechseln (psql-Metakommando)
\connect connectdb

-- 4) Tabellen erstellen
CREATE TABLE users (
                       username     VARCHAR(255) PRIMARY KEY,
                       email        VARCHAR(255) NOT NULL,
                       password     VARCHAR(255) NOT NULL,
                       created_at   TIMESTAMP DEFAULT NOW(),
                       is_admin     BOOLEAN DEFAULT FALSE
);

CREATE TABLE posts (
                       id               BIGSERIAL PRIMARY KEY,
                       content          TEXT,
                       likes_count      INT DEFAULT 0,
                       file_data        BYTEA,
                       file_name        VARCHAR(255),
                       posted_on        TIMESTAMP DEFAULT NOW(),
                       author_username  VARCHAR(255) REFERENCES users(username)
);

-- 5) Indizes für häufige Zugriffe
CREATE INDEX idx_users_email                  ON users (email);
CREATE INDEX idx_posts_author_username        ON posts (author_username);
CREATE INDEX idx_posts_posted_on              ON posts (posted_on);

-- 6) Seed-Daten (nur Demo)
INSERT INTO users (username, email, password, is_admin)
VALUES
    ('admin', 'admin@example.com', 'admin', TRUE),
    ('alice', 'alice@example.com', 'alice123', FALSE),
    ('bob',   'bob@example.com',   'bob123',   FALSE)
    ON CONFLICT (username) DO NOTHING;

INSERT INTO posts (content, likes_count, file_data, file_name, posted_on, author_username)
VALUES
    ('Hallo Welt!', 2, NULL, NULL, NOW() - INTERVAL '2 days', 'alice'),
    ('<script>alert("XSS")</script> Beitrag von Bob', 0, NULL, NULL, NOW() - INTERVAL '1 days', 'bob'),
    ('Bild-Post von Alice', 1, DECODE('89504E470D0A1A0A', 'hex'), 'demo.png', NOW(), 'alice')
    ON CONFLICT DO NOTHING;


