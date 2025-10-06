package at.fhtw.sampleapp.controller;

import at.fhtw.restserver.http.ContentType;
import at.fhtw.restserver.http.HttpStatus;
import at.fhtw.restserver.server.Response;
import at.fhtw.sampleapp.dal.UnitOfWork;
import at.fhtw.sampleapp.dal.repository.UserRepository;
import at.fhtw.sampleapp.model.User;

import java.util.Collection;

public class UserController extends Controller {

    public UserController() {
        // Repository pattern wird verwendet
    }

    // GET /users/:username
    public Response getUser(String username) {
        UnitOfWork unitOfWork = new UnitOfWork();
        try (unitOfWork) {
            Collection<User> userData = new UserRepository(unitOfWork).findUserByUsername(username);

            if (userData.isEmpty()) {
                unitOfWork.commitTransaction();
                return new Response(
                        HttpStatus.NOT_FOUND,
                        ContentType.JSON,
                        "{ \"message\" : \"User not found\" }"
                );
            }

            String userJSON = this.getObjectMapper().writeValueAsString(userData);
            unitOfWork.commitTransaction();
            return new Response(
                    HttpStatus.OK,
                    ContentType.JSON,
                    userJSON
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

    // GET /users
    public Response getUsers() {
        UnitOfWork unitOfWork = new UnitOfWork();
        try (unitOfWork) {
            Collection<User> userData = new UserRepository(unitOfWork).findAllUsers();

            String userDataJSON = this.getObjectMapper().writeValueAsString(userData);
            unitOfWork.commitTransaction();
            return new Response(
                    HttpStatus.OK,
                    ContentType.JSON,
                    userDataJSON
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

    // POST /users
    public Response createUser(String username, String email, String password, boolean isAdmin) {
        UnitOfWork unitOfWork = new UnitOfWork();
        try (unitOfWork) {
            new UserRepository(unitOfWork).createUser(username, email, password, isAdmin);

            unitOfWork.commitTransaction();
            return new Response(
                    HttpStatus.CREATED,
                    ContentType.JSON,
                    "{ \"message\" : \"User created successfully\" }"
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

    // PUT /users/:username
    public Response updateUser(String username, String email, String password, boolean isAdmin) {
        UnitOfWork unitOfWork = new UnitOfWork();
        try (unitOfWork) {
            new UserRepository(unitOfWork).updateUser(username, email, password, isAdmin);

            unitOfWork.commitTransaction();
            return new Response(
                    HttpStatus.OK,
                    ContentType.JSON,
                    "{ \"message\" : \"User updated successfully\" }"
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

    // DELETE /users/:username
    public Response deleteUser(String username) {
        UnitOfWork unitOfWork = new UnitOfWork();
        try (unitOfWork) {
            new UserRepository(unitOfWork).deleteUser(username);

            unitOfWork.commitTransaction();
            return new Response(
                    HttpStatus.OK,
                    ContentType.JSON,
                    "{ \"message\" : \"User deleted successfully\" }"
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