package com.app;

import com.app.config.DatabaseConfig;
import com.app.dao.*;
import com.app.handler.*;
import com.app.middleware.CorsMiddleware;
import com.sun.net.httpserver.HttpServer;

import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

public class Main {
    public static void main(String[] args) throws Exception {
        DatabaseConfig.init();
        UserDao userDao = new UserDao();
        TaskDao taskDao = new TaskDao();

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.setExecutor(Executors.newVirtualThreadPerTaskExecutor());
        server.createContext("/", new StaticHandler());
        server.createContext("/api/login", new CorsMiddleware(new AuthHandler(userDao)));
        server.createContext("/api/task", new CorsMiddleware(new TaskHandler(taskDao)));
        server.createContext("/api/user", new CorsMiddleware(new UserHandler(userDao)));

        server.start();
        System.out.println("Server started on localhost:8080");
    }
}
