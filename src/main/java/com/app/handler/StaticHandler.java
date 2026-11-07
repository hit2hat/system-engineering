package com.app.handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class StaticHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        if (path.equals("/")) {
            path = "/index.html";
        }

        try (InputStream is = getClass().getResourceAsStream("/public" + path)) {
            if (is == null) {
                String notFound = "404 Not Found";
                exchange.sendResponseHeaders(404, notFound.length());
                exchange.getResponseBody().write(notFound.getBytes());
                return;
            }

            if (path.endsWith(".html")) {
                exchange.getResponseHeaders().set("Content-Type", "text/html; charset=UTF-8");
            }
            else if (path.endsWith(".js")) {
                exchange.getResponseHeaders().set("Content-Type", "application/javascript");
            }
            else if (path.endsWith(".css")) {
                exchange.getResponseHeaders().set("Content-Type", "text/css");
            }

            byte[] bytes = is.readAllBytes();
            exchange.sendResponseHeaders(200, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        }
    }
}
