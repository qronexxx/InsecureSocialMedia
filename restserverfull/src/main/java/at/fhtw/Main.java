package at.fhtw;

import at.fhtw.restserver.server.Server;

import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            new Server().start();
            System.out.println("Server started on port 10001");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
