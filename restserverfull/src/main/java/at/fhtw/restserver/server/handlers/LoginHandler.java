package at.fhtw.restserver.server.handlers;

import at.fhtw.restserver.db.Database;
import at.fhtw.restserver.http.ContentType;
import at.fhtw.restserver.http.HttpStatus;
import at.fhtw.restserver.server.JsonUtil;
import at.fhtw.restserver.server.Response;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class LoginHandler implements HttpHandler {

    private static String S(String v) {
        if (v == null) return "''";
        return "'" + v.replace("'", "''") + "'";
    }

    @Override
    public void handle(HttpExchange ex) throws IOException {
        String method = ex.getRequestMethod();
        if ("OPTIONS".equalsIgnoreCase(method)) { Response.sendNoContent(ex); return; }
        if (!"POST".equalsIgnoreCase(method)) {
            new Response(HttpStatus.NOT_IMPLEMENTED, ContentType.JSON, "{\"error\":\"Not Implemented\"}").send(ex);
            return;
        }
        try {
            String body = readBody(ex);
            JsonObject o = JsonUtil.gson().fromJson(body, JsonObject.class);
            String username = o.has("username") && !o.get("username").isJsonNull() ? o.get("username").getAsString() : null;
            String email    = o.has("email")    && !o.get("email").isJsonNull()    ? o.get("email").getAsString()    : null;
            String password = o.get("password").getAsString();

            String sql = "SELECT username FROM users WHERE (username = " + S(username) + " OR email = " + S(email) + ") AND password = " + S(password) + " LIMIT 1";
            try (Connection c = Database.get(); Statement st = c.createStatement(); ResultSet rs = st.executeQuery(sql)) {
                if (rs.next()) {
                    String uname = rs.getString("username");
                    JsonObject resp = new JsonObject();
                    resp.addProperty("token", "dummy-token");
                    resp.addProperty("username", uname);
                    new Response(HttpStatus.OK, ContentType.JSON, resp.toString()).send(ex);
                    return;
                }
            }
            new Response(HttpStatus.UNAUTHORIZED, ContentType.JSON, "{\"error\":\"Invalid credentials\"}").send(ex);
        } catch (Exception e) {
            e.printStackTrace();
            new Response(HttpStatus.INTERNAL_SERVER_ERROR, ContentType.JSON, "{\"error\":\"Server error\"}").send(ex);
        }
    }

    private static String readBody(HttpExchange ex) throws IOException {
        try (InputStream in = ex.getRequestBody()) {
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        }
    }
}
