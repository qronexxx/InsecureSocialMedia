package at.fhtw.sampleapp.service;

import at.fhtw.restserver.http.ContentType;
import at.fhtw.restserver.http.HttpStatus;
import at.fhtw.restserver.http.Method;
import at.fhtw.restserver.server.Request;
import at.fhtw.restserver.server.Response;
import at.fhtw.sampleapp.controller.UserController;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class UserService implements HttpHandler {
    private final UserController userController;

    public UserService() {
        this.userController = new UserController();
    }

    @Override
    public void handle(HttpExchange httpExchange) {
        Request request = new Request(httpExchange.getRequestURI());

        Response response = null;

        if (httpExchange.getRequestMethod().equals(Method.GET.name()) &&
                request.getPathParts().size() > 1) {
            // GET /users/:username
            response = this.userController.getUser(request.getPathParts().get(1));
        } else if (httpExchange.getRequestMethod().equals(Method.GET.name())) {
            // GET /users
            response = this.userController.getUsers();
        } else if (httpExchange.getRequestMethod().equals(Method.POST.name())) {
            // POST /users - Create user (simplified, normally you'd parse JSON)
            try {
                String body = IOUtils.toString(httpExchange.getRequestBody(), StandardCharsets.UTF_8);
                // Simple parsing - in real app you'd use Jackson
                response = this.userController.createUser("testuser", "test@test.com", "password", false);
            } catch (IOException e) {
                response = new Response(
                        HttpStatus.BAD_REQUEST,
                        ContentType.JSON,
                        "{ \"message\" : \"Invalid request body\" }"
                );
            }
        } else if (httpExchange.getRequestMethod().equals(Method.PUT.name()) &&
                request.getPathParts().size() > 1) {
            // PUT /users/:username
            response = this.userController.updateUser(request.getPathParts().get(1), "updated@test.com", "newpassword", false);
        } else if (httpExchange.getRequestMethod().equals(Method.DELETE.name()) &&
                request.getPathParts().size() > 1) {
            // DELETE /users/:username
            response = this.userController.deleteUser(request.getPathParts().get(1));
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
