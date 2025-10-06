package at.fhtw.sampleapp.service;

import at.fhtw.restserver.http.ContentType;
import at.fhtw.restserver.http.HttpStatus;
import at.fhtw.restserver.http.Method;
import at.fhtw.restserver.server.Request;
import at.fhtw.restserver.server.Response;
import at.fhtw.sampleapp.controller.PostController;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class PostService implements HttpHandler {
    private final PostController postController;

    public PostService() {
        this.postController = new PostController();
    }

    @Override
    public void handle(HttpExchange httpExchange) {
        Request request = new Request(httpExchange.getRequestURI());

        Response response = null;

        if (httpExchange.getRequestMethod().equals(Method.GET.name()) &&
                request.getPathParts().size() > 2 &&
                request.getPathParts().get(1).equals("author")) {
            // GET /posts/author/:username
            response = this.postController.getPostsByAuthor(request.getPathParts().get(2));
        } else if (httpExchange.getRequestMethod().equals(Method.GET.name()) &&
                request.getPathParts().size() > 1) {
            // GET /posts/:id
            response = this.postController.getPost(request.getPathParts().get(1));
        } else if (httpExchange.getRequestMethod().equals(Method.GET.name())) {
            // GET /posts
            response = this.postController.getPosts();
        } else if (httpExchange.getRequestMethod().equals(Method.POST.name())) {
            // POST /posts - Create post
            try {
                String body = IOUtils.toString(httpExchange.getRequestBody(), StandardCharsets.UTF_8);

                // Simple text post for demo - no file upload
                response = this.postController.createPost("Test Post Content", null, null, "alice");
            } catch (IOException e) {
                response = new Response(
                        HttpStatus.BAD_REQUEST,
                        ContentType.JSON,
                        "{ \"message\" : \"Invalid request body\" }"
                );
            }
        } else if (httpExchange.getRequestMethod().equals(Method.PUT.name()) &&
                request.getPathParts().size() > 2 &&
                request.getPathParts().get(2).equals("likes")) {
            // PUT /posts/:id/likes
            response = this.postController.updatePostLikes(request.getPathParts().get(1), "999");
        } else if (httpExchange.getRequestMethod().equals(Method.PUT.name()) &&
                request.getPathParts().size() > 1) {
            // PUT /posts/:id
            response = this.postController.updatePost(request.getPathParts().get(1), "Updated content");
        } else if (httpExchange.getRequestMethod().equals(Method.DELETE.name()) &&
                request.getPathParts().size() > 1) {
            // DELETE /posts/:id
            response = this.postController.deletePost(request.getPathParts().get(1));
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
