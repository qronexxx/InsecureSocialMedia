package at.fhtw.restserver.model;

import java.time.OffsetDateTime;

public class User {
    public String username;
    public String email;
    public String password;
    public OffsetDateTime createdAt;
    public boolean isAdmin;
}
