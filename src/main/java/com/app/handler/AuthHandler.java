package com.app.handler;

import com.app.dao.UserDao;
import com.app.model.User;
import com.app.util.*;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

public class AuthHandler implements HttpHandler {
    private final UserDao userDao;
    public record LoginRequest(String username, String password) {}

    public AuthHandler(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (!exchange.getRequestMethod().equals("POST")) {
            exchange.sendResponseHeaders(404, -1);
            return;
        }

        Optional<LoginRequest> loginRequestOpt = JsonUtil.fromJson(exchange.getRequestBody(), LoginRequest.class);
        if (loginRequestOpt.isEmpty()) {
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(403, 0);
            JsonUtil.writeJson(exchange.getResponseBody(), Map.of("error", "Invalid username or password"));
            exchange.close();
            return;
        }

        LoginRequest loginRequest = loginRequestOpt.get();
        Optional<User> userOpt = userDao.findByUsername(loginRequest.username);
        if (userOpt.isEmpty()) {
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(403, 0);
            JsonUtil.writeJson(exchange.getResponseBody(), Map.of("error", "Invalid username or password"));
            exchange.close();
            return;
        }

        User user = userOpt.get();
        if (Objects.equals(user.passwordHash(), "") || !PasswordUtil.verify(loginRequest.password, user.passwordHash())) {
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(403, 0);
            JsonUtil.writeJson(exchange.getResponseBody(), Map.of("error", "Invalid username or password"));
            exchange.close();
            return;
        }

        String accessToken = JwtUtil.createToken(user.id(), user.username(), user.role());
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(200, 0);
        JsonUtil.writeJson(exchange.getResponseBody(), Map.of(
            "accessToken", accessToken,
            "role", user.role()
        ));

        exchange.close();
    }
}
