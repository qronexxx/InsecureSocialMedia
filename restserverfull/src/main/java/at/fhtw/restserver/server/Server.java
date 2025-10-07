package at.fhtw.restserver.server;

import at.fhtw.restserver.http.ContentType;
import at.fhtw.restserver.http.HttpStatus;
import at.fhtw.restserver.server.handlers.LoginHandler;
import at.fhtw.restserver.server.handlers.PostsHandler;
import at.fhtw.restserver.server.handlers.UsersHandler;
import at.fhtw.restserver.server.handlers.AdminPageHandler; // NEU
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;

public class Server {
    public void start() throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(10001), 10);

        server.createContext("/api/health", exchange -> {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                Response.sendNoContent(exchange);
                return;
            }
            String ok = "{\"status\":\"ok\"}";
            new Response(HttpStatus.OK, ContentType.JSON, ok).send(exchange);
        });

        server.createContext("/api/users", new UsersHandler());
        server.createContext("/api/login", new LoginHandler());
        server.createContext("/api/posts", new PostsHandler());
        server.createContext("/api/admin/sql", new AdminPageHandler()); // NEU

        server.createContext("/", (HttpExchange ex) -> {
            if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) {
                Response.sendNoContent(ex);
                return;
            }
            String msg = "{\"error\":\"Not Found\"}";
            new Response(HttpStatus.NOT_FOUND, ContentType.JSON, msg).send(ex);
        });

        server.start();
    }
}
