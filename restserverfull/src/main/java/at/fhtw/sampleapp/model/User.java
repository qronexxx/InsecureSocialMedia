package at.fhtw.sampleapp.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class User {
    @JsonAlias({"username"})
    private String username;
    @JsonAlias({"email"})
    private String email;
    @JsonAlias({"password"})
    private String password;
    @JsonAlias({"created_at"})
    private Timestamp createdAt;
    @JsonAlias({"is_admin"})
    private Boolean isAdmin;

    // Jackson needs the default constructor
    public User() {
    }

    public User(String username, String email, String password, Timestamp createdAt, Boolean isAdmin) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.isAdmin = isAdmin;
    }
}