package com.app.model;

public record User(int id, String username, String passwordHash, String role) {}
