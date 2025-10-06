package at.fhtw.restserver.server.handlers;

import at.fhtw.restserver.db.Database;
import at.fhtw.restserver.http.ContentType;
import at.fhtw.restserver.http.HttpStatus;
import at.fhtw.restserver.model.Post;
import at.fhtw.restserver.server.JsonUtil;
import at.fhtw.restserver.server.Response;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.time.ZoneOffset;
import java.util.*;
import java.util.Base64;

public class PostsHandler implements HttpHandler {

    private static String S(String v) { return v == null ? "NULL" : "'" + v.replace("'", "''") + "'"; }

    @Override
    public void handle(HttpExchange ex) throws IOException {
        String method = ex.getRequestMethod();
        if ("OPTIONS".equalsIgnoreCase(method)) { Response.sendNoContent(ex); return; }

        String path = ex.getRequestURI().getPath();

        try {
            if ("/api/posts".equals(path)) {
                switch (method) {
                    case "GET" -> listPosts(ex);
                    case "POST" -> createPost(ex);
                    default -> new Response(HttpStatus.NOT_IMPLEMENTED, ContentType.JSON, "{\"error\":\"Not Implemented\"}").send(ex);
                }
                return;
            }

            String[] parts = path.split("/");
            if (parts.length >= 5 && "api".equals(parts[1]) && "posts".equals(parts[2])) {
                long id = Long.parseLong(parts[3]);
                String action = parts[4];

                switch (action) {
                    case "like" -> { if ("POST".equals(method)) { toggleLike(ex, id); return; } }
                    case "comment" -> { if ("POST".equals(method)) { addComment(ex, id); return; } }
                    case "comments" -> { if ("GET".equals(method)) { listComments(ex, id); return; } }
                    case "bookmark" -> { if ("POST".equals(method)) { toggleBookmark(ex, id); return; } }
                }
            }

            new Response(HttpStatus.NOT_FOUND, ContentType.JSON, "{\"error\":\"Not Found\"}").send(ex);
        } catch (Exception e) {
            e.printStackTrace();
            new Response(HttpStatus.INTERNAL_SERVER_ERROR, ContentType.JSON, "{\"error\":\"Server error\"}").send(ex);
        }
    }

    private static Map<String,String> parseQuery(String q) throws IOException {
        Map<String,String> m = new HashMap<>();
        if (q == null || q.isEmpty()) return m;
        for (String p : q.split("&")) {
            int i = p.indexOf('=');
            if (i < 0) continue;
            String k = URLDecoder.decode(p.substring(0, i), StandardCharsets.UTF_8);
            String v = URLDecoder.decode(p.substring(i+1), StandardCharsets.UTF_8);
            m.put(k, v);
        }
        return m;
    }

    private void listPosts(HttpExchange ex) throws Exception {
        String query = ex.getRequestURI().getQuery();
        String username = parseQuery(query).get("username");

        String base = "SELECT p.id, p.content, p.likes_count, p.file_data, p.file_name, p.posted_on, p.author_username, " +
                "(SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count";
        if (username != null && !username.isEmpty()) {
            base += ", EXISTS (SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.username = " + S(username) + ") AS liked";
            base += ", EXISTS (SELECT 1 FROM bookmarks b WHERE b.post_id = p.id AND b.username = " + S(username) + ") AS bookmarked";
        }
        String sql = base + " FROM posts p ORDER BY posted_on DESC LIMIT 100";

        List<Post> posts = new ArrayList<>();
        try (Connection c = Database.get(); Statement st = c.createStatement(); ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                Post p = new Post();
                p.id = rs.getLong("id");
                p.content = rs.getString("content");
                p.likesCount = rs.getInt("likes_count");
                p.commentCount = rs.getInt("comment_count");
                p.fileName = rs.getString("file_name");
                Timestamp ts = rs.getTimestamp("posted_on");
                if (ts != null) p.postedOn = ts.toInstant().atOffset(ZoneOffset.UTC);
                p.authorUsername = rs.getString("author_username");
                byte[] data = rs.getBytes("file_data");
                if (data != null && data.length > 0) {
                    p.fileBase64 = Base64.getEncoder().encodeToString(data);
                }
                if (hasColumn(rs, "liked"))      p.liked = rs.getBoolean("liked");
                if (hasColumn(rs, "bookmarked")) p.bookmarked = rs.getBoolean("bookmarked");
                posts.add(p);
            }
        }
        new Response(HttpStatus.OK, ContentType.JSON, JsonUtil.gson().toJson(posts)).send(ex);
    }

    private static boolean hasColumn(ResultSet rs, String name) throws SQLException {
        try {
            rs.findColumn(name);
            return true;
        } catch (SQLException ignored) { return false; }
    }

    private void createPost(HttpExchange ex) throws Exception {
        String body = readBody(ex);
        JsonObject o = JsonUtil.gson().fromJson(body, JsonObject.class);

        String content   = o.has("content") ? (o.get("content").isJsonNull() ? null : o.get("content").getAsString()) : null;
        String author    = o.has("authorUsername") ? (o.get("authorUsername").isJsonNull() ? null : o.get("authorUsername").getAsString()) : "alice";
        String fileName  = o.has("fileName") ? (o.get("fileName").isJsonNull() ? null : o.get("fileName").getAsString()) : null;
        String fileBase64= o.has("fileBase64") ? (o.get("fileBase64").isJsonNull() ? null : o.get("fileBase64").getAsString()) : null;

        String fileExpr = (fileBase64 != null && !fileBase64.isEmpty())
                ? "DECODE(" + S(fileBase64) + ",'base64')" : "NULL";

        String sql = "INSERT INTO posts (content, likes_count, file_data, file_name, posted_on, author_username) " +
                "VALUES (" + S(content) + ", 0, " + fileExpr + ", " + S(fileName) + ", NOW(), " + S(author) + ") RETURNING id, posted_on";

        long id;
        Timestamp postedOn;
        try (Connection c = Database.get(); Statement st = c.createStatement(); ResultSet rs = st.executeQuery(sql)) {
            rs.next();
            id = rs.getLong("id");
            postedOn = rs.getTimestamp("posted_on");
        }

        JsonObject resp = new JsonObject();
        resp.addProperty("status", "created");
        resp.addProperty("id", id);
        new Response(HttpStatus.CREATED, ContentType.JSON, resp.toString()).send(ex);
    }

    private void toggleLike(HttpExchange ex, long postId) throws Exception {
        String body = readBody(ex);
        JsonObject o = JsonUtil.gson().fromJson(body, JsonObject.class);
        String username = o.get("username").getAsString();

        try (Connection c = Database.get(); Statement st = c.createStatement()) {
            String existsSql = "SELECT 1 FROM likes WHERE post_id = " + postId + " AND username = " + S(username) + " LIMIT 1";
            boolean exists;
            try (ResultSet rs = st.executeQuery(existsSql)) { exists = rs.next(); }
            if (exists) {
                st.executeUpdate("DELETE FROM likes WHERE post_id = " + postId + " AND username = " + S(username));
            } else {
                st.executeUpdate("INSERT INTO likes (post_id, username) VALUES (" + postId + ", " + S(username) + ")");
            }
            int count = 0;
            try (ResultSet rs = st.executeQuery("SELECT COUNT(*) AS c FROM likes WHERE post_id = " + postId)) {
                if (rs.next()) count = rs.getInt("c");
            }
            st.executeUpdate("UPDATE posts SET likes_count = " + count + " WHERE id = " + postId);

            JsonObject resp = new JsonObject();
            resp.addProperty("liked", !exists);
            resp.addProperty("likesCount", count);
            new Response(HttpStatus.OK, ContentType.JSON, resp.toString()).send(ex);
        }
    }

    private void addComment(HttpExchange ex, long postId) throws Exception {
        String body = readBody(ex);
        JsonObject o = JsonUtil.gson().fromJson(body, JsonObject.class);
        String username = o.get("username").getAsString();
        String content  = o.get("content").getAsString();

        try (Connection c = Database.get(); Statement st = c.createStatement()) {
            st.executeUpdate("INSERT INTO comments (post_id, username, content) VALUES (" + postId + ", " + S(username) + ", " + S(content) + ")");
            int count = 0;
            try (ResultSet rs = st.executeQuery("SELECT COUNT(*) AS c FROM comments WHERE post_id = " + postId)) {
                if (rs.next()) count = rs.getInt("c");
            }
            JsonObject resp = new JsonObject();
            resp.addProperty("status", "created");
            resp.addProperty("commentCount", count);
            new Response(HttpStatus.CREATED, ContentType.JSON, resp.toString()).send(ex);
        }
    }

    private void listComments(HttpExchange ex, long postId) throws Exception {
        String sql = "SELECT id, username, content, created_at FROM comments WHERE post_id = " + postId + " ORDER BY created_at ASC LIMIT 200";
        List<JsonObject> arr = new ArrayList<>();
        try (Connection c = Database.get(); Statement st = c.createStatement(); ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                JsonObject o = new JsonObject();
                o.addProperty("id", rs.getLong("id"));
                o.addProperty("username", rs.getString("username"));
                o.addProperty("content", rs.getString("content"));
                Timestamp ts = rs.getTimestamp("created_at");
                o.addProperty("createdAt", ts != null ? ts.toInstant().atOffset(ZoneOffset.UTC).toString() : null);
                arr.add(o);
            }
        }
        new Response(HttpStatus.OK, ContentType.JSON, JsonUtil.gson().toJson(arr)).send(ex);
    }

    private void toggleBookmark(HttpExchange ex, long postId) throws Exception {
        String body = readBody(ex);
        JsonObject o = JsonUtil.gson().fromJson(body, JsonObject.class);
        String username = o.get("username").getAsString();

        try (Connection c = Database.get(); Statement st = c.createStatement()) {
            String existsSql = "SELECT 1 FROM bookmarks WHERE post_id = " + postId + " AND username = " + S(username) + " LIMIT 1";
            boolean exists;
            try (ResultSet rs = st.executeQuery(existsSql)) { exists = rs.next(); }
            if (exists) {
                st.executeUpdate("DELETE FROM bookmarks WHERE post_id = " + postId + " AND username = " + S(username));
            } else {
                st.executeUpdate("INSERT INTO bookmarks (username, post_id) VALUES (" + S(username) + ", " + postId + ")");
            }
            JsonObject resp = new JsonObject();
            resp.addProperty("bookmarked", !exists);
            new Response(HttpStatus.OK, ContentType.JSON, resp.toString()).send(ex);
        }
    }

    private static String readBody(HttpExchange ex) throws IOException {
        try (InputStream in = ex.getRequestBody()) { return new String(in.readAllBytes(), StandardCharsets.UTF_8); }
    }
}
