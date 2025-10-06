package at.fhtw.restserver.server.handlers;

import at.fhtw.restserver.db.Database;
import at.fhtw.restserver.http.ContentType;
import at.fhtw.restserver.http.HttpStatus;
import at.fhtw.restserver.model.Post;
import at.fhtw.restserver.model.User;
import at.fhtw.restserver.server.JsonUtil;
import at.fhtw.restserver.server.Response;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

public class UsersHandler implements HttpHandler {

    private static String S(String v) { return v == null ? "NULL" : "'" + v.replace("'", "''") + "'"; }

    @Override
    public void handle(HttpExchange ex) throws IOException {
        String method = ex.getRequestMethod();
        if ("OPTIONS".equalsIgnoreCase(method)) { Response.sendNoContent(ex); return; }

        String path = ex.getRequestURI().getPath();
        try {
            if (path.equals("/api/users")) {
                switch (method) {
                    case "GET"  -> listUsers(ex);
                    case "POST" -> createUser(ex);
                    default -> new Response(HttpStatus.NOT_IMPLEMENTED, ContentType.JSON, "{\"error\":\"Not Implemented\"}").send(ex);
                }
                return;
            }

            String[] parts = path.split("/");
            if (parts.length == 5 && "api".equals(parts[1]) && "users".equals(parts[2]) && "bookmarks".equals(parts[4]) && "GET".equals(method)) {
                String uname = parts[3];
                listBookmarks(ex, uname);
                return;
            }

            new Response(HttpStatus.NOT_FOUND, ContentType.JSON, "{\"error\":\"Not Found\"}").send(ex);
        } catch (Exception e) {
            e.printStackTrace();
            new Response(HttpStatus.INTERNAL_SERVER_ERROR, ContentType.JSON, "{\"error\":\"Server error\"}").send(ex);
        }
    }

    private void listUsers(HttpExchange ex) throws Exception {
        List<User> users = new ArrayList<>();
        try (Connection c = Database.get(); Statement st = c.createStatement(); ResultSet rs = st.executeQuery(
                "SELECT username,email,password,created_at,is_admin FROM users ORDER BY created_at ASC")) {
            while (rs.next()) {
                User u = new User();
                u.username = rs.getString("username");
                u.email = rs.getString("email");
                u.password = rs.getString("password");
                Timestamp ts = rs.getTimestamp("created_at");
                if (ts != null) u.createdAt = ts.toInstant().atOffset(ZoneOffset.UTC);
                u.isAdmin = rs.getBoolean("is_admin");
                users.add(u);
            }
        }
        String json = JsonUtil.gson().toJson(users);
        new Response(HttpStatus.OK, ContentType.JSON, json).send(ex);
    }

    private void createUser(HttpExchange ex) throws Exception {
        String body = readBody(ex);
        JsonObject obj = JsonUtil.gson().fromJson(body, JsonObject.class);
        String username = obj.get("username").getAsString();
        String email = obj.get("email").getAsString();
        String password = obj.get("password").getAsString();

        String sql = "INSERT INTO users (username,email,password,is_admin) VALUES (" + S(username) + "," + S(email) + "," + S(password) + ",FALSE)";
        try (Connection c = Database.get(); Statement st = c.createStatement()) { st.executeUpdate(sql); }

        JsonObject ok = new JsonObject();
        ok.addProperty("status", "created");
        ok.addProperty("username", username);
        new Response(HttpStatus.CREATED, ContentType.JSON, ok.toString()).send(ex);
    }

    private void listBookmarks(HttpExchange ex, String username) throws Exception {
        List<Post> posts = new ArrayList<>();
        String sql = "SELECT p.id, p.content, p.likes_count, p.file_data, p.file_name, p.posted_on, p.author_username, " +
                "(SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count, " +
                "TRUE AS bookmarked, " +
                "EXISTS (SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.username = " + S(username) + ") AS liked " +
                "FROM posts p JOIN bookmarks b ON b.post_id = p.id " +
                "WHERE b.username = " + S(username) + " " +
                "ORDER BY b.created_at DESC LIMIT 200";
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
                if (data != null && data.length > 0) p.fileBase64 = Base64.getEncoder().encodeToString(data);
                p.bookmarked = true;
                p.liked = rs.getBoolean("liked");
                posts.add(p);
            }
        }
        new Response(HttpStatus.OK, ContentType.JSON, JsonUtil.gson().toJson(posts)).send(ex);
    }

    private static String readBody(HttpExchange ex) throws IOException {
        try (InputStream in = ex.getRequestBody()) { return new String(in.readAllBytes(), StandardCharsets.UTF_8); }
    }
}
