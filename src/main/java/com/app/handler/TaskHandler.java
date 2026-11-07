package com.app.handler;

import com.app.dao.TaskDao;
import com.app.model.Task;
import com.app.util.*;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public class TaskHandler implements HttpHandler {
    private final TaskDao taskDao;
    public record TaskCreateRequest(String title, String description) {}
    public record TaskDeleteRequest(int id) {}

    public TaskHandler(TaskDao taskDao) {
        this.taskDao = taskDao;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String auth = exchange.getRequestHeaders().getFirst("authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            exchange.sendResponseHeaders(401, -1);
            return;
        }

        Optional<JwtUtil.UserClaims> claimsOpt = JwtUtil.validateAndExtract(auth.substring(7));
        if (claimsOpt.isEmpty()) {
            exchange.sendResponseHeaders(403, -1);
            return;
        }

        JwtUtil.UserClaims user = claimsOpt.get();
        switch (exchange.getRequestMethod()) {
            case "GET": {
                List<Task> tasks = user.role().equals("ADMIN")
                    ? taskDao.findAll()
                    : taskDao.findByUserId(user.id());

                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, 0);
                JsonUtil.writeJson(exchange.getResponseBody(), tasks);
                break;
            }

            case "POST": {
                Optional<TaskCreateRequest> reqOpt = JsonUtil.fromJson(exchange.getRequestBody(), TaskCreateRequest.class);
                if (reqOpt.isEmpty()) {
                    exchange.sendResponseHeaders(400, -1);
                    break;
                }

                TaskCreateRequest req = reqOpt.get();
                if (req.title.isEmpty() || req.title.length() > 100) {
                    exchange.sendResponseHeaders(400, -1);
                    break;
                }

                if (req.description.length() > 255) {
                    exchange.sendResponseHeaders(400, -1);
                    break;
                }

                taskDao.create(req.title(), req.description(), "created", user.id());

                exchange.sendResponseHeaders(200, -1);
                break;
            }

            case "DELETE": {
                Optional<TaskDeleteRequest> reqOpt = JsonUtil.fromJson(exchange.getRequestBody(), TaskDeleteRequest.class);
                if (reqOpt.isEmpty()) {
                    exchange.sendResponseHeaders(400, -1);
                    break;
                }

                TaskDeleteRequest req = reqOpt.get();
                taskDao.delete(req.id());

                exchange.sendResponseHeaders(200, -1);
                break;
            }

            default: {
                exchange.sendResponseHeaders(404, -1);
                break;
            }
        }

        exchange.close();
    }
}
