package at.fhtw.sampleapp.service.weather;

import at.fhtw.restserver.http.ContentType;
import at.fhtw.restserver.http.HttpStatus;
import at.fhtw.restserver.http.Method;
import at.fhtw.restserver.server.Request;
import at.fhtw.restserver.server.Response;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;

public class WeatherService implements HttpHandler {
    private final WeatherController weatherController;

    public WeatherService() {
        this.weatherController = new WeatherController();
    }

    @Override
    public void handle(HttpExchange httpExchange) {
        Request request = new Request(httpExchange.getRequestURI());

        Response response = null;

        if (httpExchange.getRequestMethod().equals(Method.GET.name()) &&
                request.getPathParts().size() > 1) {
            response = this.weatherController.getWeather(request.getPathParts().get(1));
        } else if (httpExchange.getRequestMethod().equals(Method.GET.name())) {
            response = this.weatherController.getWeather();
        } else {
            response = new Response(
                    HttpStatus.BAD_REQUEST,
                    ContentType.JSON,
                    "{ \"message\" : \"Method not supported\" }"
            );
        }

        response.send(httpExchange);
    }
}