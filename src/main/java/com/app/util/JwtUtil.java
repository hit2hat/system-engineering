package com.app.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

import java.util.Date;
import java.util.Optional;

public class JwtUtil {
    private static final String ISSUER = "app";
    private static final String SECRET = "development";
    private static final Algorithm ALGORITHM = Algorithm.HMAC256(SECRET);
    public record UserClaims(int id, String username, String role) {}

    public static String createToken(int id, String username, String role) {
        return JWT.create()
            .withIssuer(ISSUER)
            .withSubject(username)
            .withClaim("id", id)
            .withClaim("role", role)
            .withIssuedAt(new Date())
            .withExpiresAt(new Date(System.currentTimeMillis() + 86400000))
            .sign(ALGORITHM);
    }

    public static Optional<UserClaims> validateAndExtract(String token) {
        try {
            JWTVerifier verifier = JWT.require(ALGORITHM)
                .withIssuer(ISSUER)
                .build();

            DecodedJWT jwt = verifier.verify(token);

            int id = jwt.getClaim("id").asInt();
            String username = jwt.getSubject();
            String role = jwt.getClaim("role").asString();

            return Optional.of(
                new UserClaims(
                    id,
                    username,
                    role
                )
            );
        } catch (JWTVerificationException exception) {
            return Optional.empty();
        }
    }
}
