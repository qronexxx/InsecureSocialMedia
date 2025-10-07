package at.fhtw.restserver.server.handlers;

import at.fhtw.restserver.db.Database;
import at.fhtw.restserver.http.ContentType;
import at.fhtw.restserver.http.HttpStatus;
import at.fhtw.restserver.server.JsonUtil;
import at.fhtw.restserver.server.Response;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.*;

public class AdminPageHandler implements HttpHandler {

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
            JsonObject in = JsonUtil.gson().fromJson(body, JsonObject.class);
            String sql = in != null && in.has("sql") && !in.get("sql").isJsonNull() ? in.get("sql").getAsString() : null;

            if (sql == null || sql.trim().isEmpty()) {
                new Response(HttpStatus.BAD_REQUEST, ContentType.JSON, "{\"error\":\"Missing 'sql'\"}").send(ex);
                return;
            }

            try (Connection c = Database.get(); Statement st = c.createStatement()) {
                boolean hasResultSet = st.execute(sql);
                if (hasResultSet) {
                    try (ResultSet rs = st.getResultSet()) {
                        ResultSetMetaData md = rs.getMetaData();
                        int cols = md.getColumnCount();
                        JsonArray rows = new JsonArray();
                        int count = 0;

                        while (rs.next()) {
                            JsonObject row = new JsonObject();
                            for (int i = 1; i <= cols; i++) {
                                String colName = md.getColumnLabel(i);
                                Object val = rs.getObject(i);
                                JsonElement el = JsonUtil.gson().toJsonTree(val);
                                row.add(colName, el);
                            }
                            rows.add(row);
                            count++;
                        }

                        JsonObject out = new JsonObject();
                        out.add("rows", rows);
                        out.addProperty("rowCount", count);
                        new Response(HttpStatus.OK, ContentType.JSON, out.toString()).send(ex);
                    }
                } else {
                    int updated = st.getUpdateCount();
                    JsonObject out = new JsonObject();
                    out.addProperty("updateCount", updated);
                    new Response(HttpStatus.OK, ContentType.JSON, out.toString()).send(ex);
                }
            }
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