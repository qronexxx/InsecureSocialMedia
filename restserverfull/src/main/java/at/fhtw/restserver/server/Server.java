package at.fhtw.restserver.server;

import at.fhtw.sampleapp.service.PostService;
import at.fhtw.sampleapp.service.UserService;
import at.fhtw.sampleapp.service.echo.EchoService;
import at.fhtw.sampleapp.service.weather.WeatherService;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;

public class Server {
    public void start() throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(10001), 10);

        server.createContext("/weather", new WeatherService());
        server.createContext("/echo", new EchoService());
        server.createContext("/users", new UserService());
        server.createContext("/posts", new PostService());

        server.start();
    }
}
