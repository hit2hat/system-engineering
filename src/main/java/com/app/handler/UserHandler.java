package com.app.handler;

import com.app.dao.UserDao;
import com.app.model.User;
import com.app.util.*;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class UserHandler implements HttpHandler {
    private final UserDao userDao;
    public record UserCreateRequest(String username, String password, String role) {}
    public record UserDeleteRequest(int id) {}

    public UserHandler(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String auth = exchange.getRequestHeaders().getFirst("authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            exchange.sendResponseHeaders(401, 0);
            exchange.close();
            return;
        }

        Optional<JwtUtil.UserClaims> claimsOpt = JwtUtil.validateAndExtract(auth.substring(7));
        if (claimsOpt.isEmpty()) {
            exchange.sendResponseHeaders(403, 0);
            exchange.close();
            return;
        }

        JwtUtil.UserClaims user = claimsOpt.get();
        if (!user.role().equals("ADMIN")) {
            exchange.sendResponseHeaders(403, 0);
            exchange.close();
            return;
        }

        switch (exchange.getRequestMethod()) {
            case "GET": {
                List<User> users = userDao.findAll();
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, 0);
                JsonUtil.writeJson(exchange.getResponseBody(), users);
                break;
            }

            case "POST": {
                Optional<UserCreateRequest> reqOpt = JsonUtil.fromJson(exchange.getRequestBody(), UserCreateRequest.class);
                if (reqOpt.isEmpty()) {
                    exchange.sendResponseHeaders(400, -1);
                    break;
                }

                UserCreateRequest req = reqOpt.get();
                if (!req.role().equals("ADMIN") && !req.role().equals("USER")) {
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(400, 0);
                    JsonUtil.writeJson(exchange.getResponseBody(), Map.of("error", "Unknown user role"));
                    break;
                }

                if (req.username().length() < 3) {
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(400, 0);
                    JsonUtil.writeJson(exchange.getResponseBody(), Map.of("error", "Username too short"));
                    break;
                }

                if (req.password().length() < 8 || req.password().length() > 64) {
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(400, 0);
                    JsonUtil.writeJson(exchange.getResponseBody(), Map.of("error", "Password too weak"));
                    break;
                }

                Optional<User> existsUser = userDao.findByUsername(req.username());
                if (existsUser.isPresent()) {
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(400, 0);
                    JsonUtil.writeJson(exchange.getResponseBody(), Map.of("error", "User was exists"));
                    break;
                }

                try {
                    userDao.create(req.username(), PasswordUtil.hashPassword(req.password()), req.role());
                    exchange.sendResponseHeaders(200, -1);
                } catch (Exception e) {
                    exchange.sendResponseHeaders(500, -1);
                }

                break;
            }

            case "DELETE": {
                Optional<UserDeleteRequest> reqOpt = JsonUtil.fromJson(exchange.getRequestBody(), UserDeleteRequest.class);
                if (reqOpt.isEmpty()) {
                    exchange.sendResponseHeaders(400, -1);
                    break;
                }

                UserDeleteRequest req = reqOpt.get();
                userDao.delete(req.id());

                exchange.sendResponseHeaders(200, -1);
                break;
            }

            default: {
                exchange.sendResponseHeaders(404, 0);
                break;
            }
        }

        exchange.close();
    }
}
