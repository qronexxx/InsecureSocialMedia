package at.fhtw.sampleapp.dal.repository;

import at.fhtw.sampleapp.dal.DataAccessException;
import at.fhtw.sampleapp.dal.UnitOfWork;
import at.fhtw.sampleapp.model.Post;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Base64;

public class PostRepository {
    private UnitOfWork unitOfWork;

    public PostRepository(UnitOfWork unitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    public Collection<Post> findAllPosts() {
        try (Statement statement = this.unitOfWork.createStatement()) {
            String sql = "select * from posts ORDER BY posted_on DESC";
            boolean hasResultSet = statement.execute(sql);
            Collection<Post> postRows = new ArrayList<>();

            if (hasResultSet) {
                ResultSet resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    Post post = new Post(
                            resultSet.getLong(1),
                            resultSet.getString(2),
                            resultSet.getInt(3),
                            resultSet.getBytes(4),
                            resultSet.getString(5),
                            resultSet.getTimestamp(6),
                            resultSet.getString(7));
                    postRows.add(post);
                }
            }

            return postRows;
        } catch (SQLException e) {
            throw new DataAccessException("Select nicht erfolgreich", e);
        }
    }

    public Collection<Post> findPostById(String postId) {
        try (Statement statement = this.unitOfWork.createStatement()) {
            String sql = "select * from posts where id = '" + postId + "'";
            boolean hasResultSet = statement.execute(sql);
            Collection<Post> postRows = new ArrayList<>();

            if (hasResultSet) {
                ResultSet resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    Post post = new Post(
                            resultSet.getLong(1),
                            resultSet.getString(2),
                            resultSet.getInt(3),
                            resultSet.getBytes(4),
                            resultSet.getString(5),
                            resultSet.getTimestamp(6),
                            resultSet.getString(7));
                    postRows.add(post);
                }
            }

            return postRows;
        } catch (SQLException e) {
            throw new DataAccessException("Select nicht erfolgreich", e);
        }
    }

    public Collection<Post> findPostsByAuthor(String authorUsername) {
        try (Statement statement = this.unitOfWork.createStatement()) {
            String sql = "select * from posts where author_username = '" + authorUsername + "' ORDER BY posted_on DESC";
            boolean hasResultSet = statement.execute(sql);
            Collection<Post> postRows = new ArrayList<>();

            if (hasResultSet) {
                ResultSet resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    Post post = new Post(
                            resultSet.getLong(1),
                            resultSet.getString(2),
                            resultSet.getInt(3),
                            resultSet.getBytes(4),
                            resultSet.getString(5),
                            resultSet.getTimestamp(6),
                            resultSet.getString(7));
                    postRows.add(post);
                }
            }

            return postRows;
        } catch (SQLException e) {
            throw new DataAccessException("Select nicht erfolgreich", e);
        }
    }

    public void createPost(String content, String fileName, String fileDataBase64, String authorUsername) {
        try (Statement statement = this.unitOfWork.createStatement()) {
            String sql;
            if (fileName != null && fileDataBase64 != null) {
                // Mit File
                sql = "INSERT INTO posts (content, file_name, file_data, author_username) VALUES ('" +
                        content + "', '" + fileName + "', decode('" + fileDataBase64 + "', 'base64'), '" + authorUsername + "')";
            } else {
                // Ohne File
                sql = "INSERT INTO posts (content, author_username) VALUES ('" + content + "', '" + authorUsername + "')";
            }
            statement.execute(sql);
        } catch (SQLException e) {
            throw new DataAccessException("Insert nicht erfolgreich", e);
        }
    }

    public void updatePost(String postId, String content) {
        try (Statement statement = this.unitOfWork.createStatement()) {
            String sql = "UPDATE posts SET content = '" + content + "' WHERE id = '" + postId + "'";
            statement.execute(sql);
        } catch (SQLException e) {
            throw new DataAccessException("Update nicht erfolgreich", e);
        }
    }

    public void updateLikes(String postId, String likesCount) {
        try (Statement statement = this.unitOfWork.createStatement()) {
            String sql = "UPDATE posts SET likes_count = '" + likesCount + "' WHERE id = '" + postId + "'";
            statement.execute(sql);
        } catch (SQLException e) {
            throw new DataAccessException("Update nicht erfolgreich", e);
        }
    }

    public void deletePost(String postId) {
        try (Statement statement = this.unitOfWork.createStatement()) {
            String sql = "DELETE FROM posts WHERE id = '" + postId + "'";
            statement.execute(sql);
        } catch (SQLException e) {
            throw new DataAccessException("Delete nicht erfolgreich", e);
        }
    }
}
