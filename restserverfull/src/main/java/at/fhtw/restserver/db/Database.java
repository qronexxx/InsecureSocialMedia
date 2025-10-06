package at.fhtw.restserver.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {
    private static final String HOST = System.getenv().getOrDefault("DB_HOST", "localhost");
    private static final int PORT = Integer.parseInt(System.getenv().getOrDefault("DB_PORT", "5432"));
    private static final String NAME = System.getenv().getOrDefault("DB_NAME", "connectdb");
    private static final String USER = System.getenv().getOrDefault("DB_USER", "connectdb");
    private static final String PASS = System.getenv().getOrDefault("DB_PASSWORD", "connectdb");

    public static Connection get() throws SQLException {
        String url = "jdbc:postgresql://" + HOST + ":" + PORT + "/" + NAME;
        return DriverManager.getConnection(url, USER, PASS);
    }
}
