package at.fhtw.restserver.server;

import at.fhtw.restserver.http.ContentType;
import at.fhtw.restserver.http.HttpStatus;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class Response {
    private final int status;
    private final String contentType;
    private final String content;

    public Response(HttpStatus httpStatus, ContentType contentType, String content) {
        this.status = httpStatus.code;
        this.contentType = contentType.type;
        this.content = content;
    }

    public void send(HttpExchange httpExchange) {
        httpExchange.getResponseHeaders().add("Cache-Control", "no-cache");
        httpExchange.getResponseHeaders().add("Content-Type", contentType + "; charset=utf-8");
        httpExchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        httpExchange.getResponseHeaders().add("Access-Control-Allow-Headers", "*, Content-Type, Authorization");
        httpExchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

        try (httpExchange) {
            byte[] responseBody = content.getBytes(StandardCharsets.UTF_8);
            httpExchange.sendResponseHeaders(status, responseBody.length);
            httpExchange.getResponseBody().write(responseBody);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static void sendNoContent(HttpExchange ex) {
        ex.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        ex.getResponseHeaders().add("Access-Control-Allow-Headers", "*, Content-Type, Authorization");
        ex.getResponseHeaders().add("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        try (ex) {
            ex.sendResponseHeaders(204, -1);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
