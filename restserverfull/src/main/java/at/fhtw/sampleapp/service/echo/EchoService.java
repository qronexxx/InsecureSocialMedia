package at.fhtw.sampleapp.service.echo;

import at.fhtw.restserver.http.ContentType;
import at.fhtw.restserver.http.HttpStatus;
import at.fhtw.restserver.server.Request;
import at.fhtw.restserver.server.Response;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

public class EchoService implements HttpHandler {
    @Override
    public void handle(HttpExchange httpExchange) {
        httpExchange.getResponseHeaders().add("Cache-Control", "nocache");
        httpExchange.getResponseHeaders().add("Content-Type", ContentType.PLAIN_TEXT.type);

        try (httpExchange) {
            byte[] responseBody = ("Echo-" + IOUtils.toString(httpExchange.getRequestBody(), StandardCharsets.UTF_8)).getBytes(StandardCharsets.UTF_8);
            httpExchange.sendResponseHeaders(HttpStatus.OK.code, responseBody.length);
            httpExchange.getResponseBody().write(responseBody);
        } catch (IOException e) {
            throw new RuntimeException(e);
        };
    }
}
