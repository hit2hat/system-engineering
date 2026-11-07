package com.app.util;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.InputStream;
import java.io.OutputStream;
import java.util.Optional;

public class JsonUtil {
    private static final ObjectMapper MAPPER = new ObjectMapper();

    public static <T> Optional<T> fromJson(InputStream stream, Class<T> tClass) {
        try {
            return Optional.of(
                MAPPER.readValue(stream, tClass)
            );
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public static void writeJson(OutputStream stream, Object data) {
        try {
            MAPPER.writeValue(stream, data);
        } catch (Exception e) {
            throw new RuntimeException("Error while json serialization", e);
        }
    }
}
