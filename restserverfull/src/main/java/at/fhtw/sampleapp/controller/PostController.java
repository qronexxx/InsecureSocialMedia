package at.fhtw.sampleapp.controller;

import at.fhtw.restserver.http.ContentType;
import at.fhtw.restserver.http.HttpStatus;
import at.fhtw.restserver.server.Response;
import at.fhtw.sampleapp.controller.Controller;
import at.fhtw.sampleapp.dal.UnitOfWork;
import at.fhtw.sampleapp.dal.repository.PostRepository;
import at.fhtw.sampleapp.model.Post;

import java.util.Collection;

public class PostController extends Controller {

    public PostController() {
        // Repository pattern wird verwendet
    }

    // GET /posts/:id
    public Response getPost(String postId) {
        UnitOfWork unitOfWork = new UnitOfWork();
        try (unitOfWork) {
            Collection<Post> postData = new PostRepository(unitOfWork).findPostById(postId);

            if (postData.isEmpty()) {
                unitOfWork.commitTransaction();
                return new Response(
                        HttpStatus.NOT_FOUND,
                        ContentType.JSON,
                        "{ \"message\" : \"Post not found\" }"
                );
            }

            String postJSON = this.getObjectMapper().writeValueAsString(postData);
            unitOfWork.commitTransaction();
            return new Response(
                    HttpStatus.OK,
                    ContentType.JSON,
                    postJSON
            );
        } catch (Exception e) {
            e.printStackTrace();

            unitOfWork.rollbackTransaction();
            return new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    ContentType.JSON,
                    "{ \"message\" : \"Internal Server Error\" }"
            );
        }
    }

    // GET /posts
    public Response getPosts() {
        UnitOfWork unitOfWork = new UnitOfWork();
        try (unitOfWork) {
            Collection<Post> postData = new PostRepository(unitOfWork).findAllPosts();

            String postDataJSON = this.getObjectMapper().writeValueAsString(postData);
            unitOfWork.commitTransaction();
            return new Response(
                    HttpStatus.OK,
                    ContentType.JSON,
                    postDataJSON
            );
        } catch (Exception e) {
            e.printStackTrace();

            unitOfWork.rollbackTransaction();
            return new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    ContentType.JSON,
                    "{ \"message\" : \"Internal Server Error\" }"
            );
        }
    }

    // GET /posts/author/:username
    public Response getPostsByAuthor(String authorUsername) {
        UnitOfWork unitOfWork = new UnitOfWork();
        try (unitOfWork) {
            Collection<Post> postData = new PostRepository(unitOfWork).findPostsByAuthor(authorUsername);

            String postDataJSON = this.getObjectMapper().writeValueAsString(postData);
            unitOfWork.commitTransaction();
            return new Response(
                    HttpStatus.OK,
                    ContentType.JSON,
                    postDataJSON
            );
        } catch (Exception e) {
            e.printStackTrace();

            unitOfWork.rollbackTransaction();
            return new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    ContentType.JSON,
                    "{ \"message\" : \"Internal Server Error\" }"
            );
        }
    }

    // POST /posts
    public Response createPost(String content, String fileName, String fileDataBase64, String authorUsername) {
        UnitOfWork unitOfWork = new UnitOfWork();
        try (unitOfWork) {
            new PostRepository(unitOfWork).createPost(content, fileName, fileDataBase64, authorUsername);

            unitOfWork.commitTransaction();
            return new Response(
                    HttpStatus.CREATED,
                    ContentType.JSON,
                    "{ \"message\" : \"Post created successfully\" }"
            );
        } catch (Exception e) {
            e.printStackTrace();

            unitOfWork.rollbackTransaction();
            return new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    ContentType.JSON,
                    "{ \"message\" : \"Internal Server Error\" }"
            );
        }
    }

    // PUT /posts/:id
    public Response updatePost(String postId, String content) {
        UnitOfWork unitOfWork = new UnitOfWork();
        try (unitOfWork) {
            new PostRepository(unitOfWork).updatePost(postId, content);

            unitOfWork.commitTransaction();
            return new Response(
                    HttpStatus.OK,
                    ContentType.JSON,
                    "{ \"message\" : \"Post updated successfully\" }"
            );
        } catch (Exception e) {
            e.printStackTrace();

            unitOfWork.rollbackTransaction();
            return new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    ContentType.JSON,
                    "{ \"message\" : \"Internal Server Error\" }"
            );
        }
    }

    // PUT /posts/:id/likes
    public Response updatePostLikes(String postId, String likesCount) {
        UnitOfWork unitOfWork = new UnitOfWork();
        try (unitOfWork) {
            new PostRepository(unitOfWork).updateLikes(postId, likesCount);

            unitOfWork.commitTransaction();
            return new Response(
                    HttpStatus.OK,
                    ContentType.JSON,
                    "{ \"message\" : \"Post likes updated successfully\" }"
            );
        } catch (Exception e) {
            e.printStackTrace();

            unitOfWork.rollbackTransaction();
            return new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    ContentType.JSON,
                    "{ \"message\" : \"Internal Server Error\" }"
            );
        }
    }

    // DELETE /posts/:id
    public Response deletePost(String postId) {
        UnitOfWork unitOfWork = new UnitOfWork();
        try (unitOfWork) {
            new PostRepository(unitOfWork).deletePost(postId);

            unitOfWork.commitTransaction();
            return new Response(
                    HttpStatus.OK,
                    ContentType.JSON,
                    "{ \"message\" : \"Post deleted successfully\" }"
            );
        } catch (Exception e) {
            e.printStackTrace();

            unitOfWork.rollbackTransaction();
            return new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    ContentType.JSON,
                    "{ \"message\" : \"Internal Server Error\" }"
            );
        }
    }
}