package at.fhtw.sampleapp.dal.repository;

import at.fhtw.sampleapp.dal.DataAccessException;
import at.fhtw.sampleapp.dal.UnitOfWork;
import at.fhtw.sampleapp.model.User;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collection;

public class UserRepository {
    private UnitOfWork unitOfWork;

    public UserRepository(UnitOfWork unitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    public Collection<User> findAllUsers() {
        try (Statement statement = this.unitOfWork.createStatement()) {
            String sql = "select * from users";
            boolean hasResultSet = statement.execute(sql);
            Collection<User> userRows = new ArrayList<>();

            if (hasResultSet) {
                ResultSet resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    User user = new User(
                            resultSet.getString(1),
                            resultSet.getString(2),
                            resultSet.getString(3),
                            resultSet.getTimestamp(4),
                            resultSet.getBoolean(5));
                    userRows.add(user);
                }
            }

            return userRows;
        } catch (SQLException e) {
            throw new DataAccessException("Select nicht erfolgreich", e);
        }
    }

    public Collection<User> findUserByUsername(String username) {
        try (Statement statement = this.unitOfWork.createStatement()) {
            String sql = "select * from users where username = '" + username + "'";
            boolean hasResultSet = statement.execute(sql);
            Collection<User> userRows = new ArrayList<>();

            if (hasResultSet) {
                ResultSet resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    User user = new User(
                            resultSet.getString(1),
                            resultSet.getString(2),
                            resultSet.getString(3),
                            resultSet.getTimestamp(4),
                            resultSet.getBoolean(5));
                    userRows.add(user);
                }
            }

            return userRows;
        } catch (SQLException e) {
            throw new DataAccessException("Select nicht erfolgreich", e);
        }
    }

    public Collection<User> findUserByEmail(String email) {
        try (Statement statement = this.unitOfWork.createStatement()) {
            String sql = "select * from users where email = '" + email + "'";
            boolean hasResultSet = statement.execute(sql);
            Collection<User> userRows = new ArrayList<>();

            if (hasResultSet) {
                ResultSet resultSet = statement.getResultSet();
                while (resultSet.next()) {
                    User user = new User(
                            resultSet.getString(1),
                            resultSet.getString(2),
                            resultSet.getString(3),
                            resultSet.getTimestamp(4),
                            resultSet.getBoolean(5));
                    userRows.add(user);
                }
            }

            return userRows;
        } catch (SQLException e) {
            throw new DataAccessException("Select nicht erfolgreich", e);
        }
    }

    public void createUser(String username, String email, String password, boolean isAdmin) {
        try (Statement statement = this.unitOfWork.createStatement()) {
            String sql = "INSERT INTO users (username, email, password, is_admin) VALUES ('" +
                    username + "', '" + email + "', '" + password + "', " + isAdmin + ")";
            statement.execute(sql);
        } catch (SQLException e) {
            throw new DataAccessException("Insert nicht erfolgreich", e);
        }
    }

    public void updateUser(String username, String email, String password, boolean isAdmin) {
        try (Statement statement = this.unitOfWork.createStatement()) {
            String sql = "UPDATE users SET email = '" + email + "', password = '" + password +
                    "', is_admin = " + isAdmin + " WHERE username = '" + username + "'";
            statement.execute(sql);
        } catch (SQLException e) {
            throw new DataAccessException("Update nicht erfolgreich", e);
        }
    }

    public void deleteUser(String username) {
        try (Statement statement = this.unitOfWork.createStatement()) {
            String sql = "DELETE FROM users WHERE username = '" + username + "'";
            statement.execute(sql);
        } catch (SQLException e) {
            throw new DataAccessException("Delete nicht erfolgreich", e);
        }
    }
}