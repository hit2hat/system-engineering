package com.app.dao;

import com.app.config.DatabaseConfig;
import com.app.model.User;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class UserDao {
    public Optional<User> findByUsername(String username) {
        String sql = "SELECT * FROM users WHERE username = ?";
        try (Connection c = DatabaseConfig.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, username);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                return Optional.of(
                    new User(
                        rs.getInt("id"),
                        rs.getString("username"),
                        rs.getString("password_hash"),
                        rs.getString("role")
                    )
                );
            }
        } catch (SQLException e) {
            System.out.printf("Error while executing query: %s\n", e.getMessage());
        }

        return Optional.empty();
    }

    public List<User> findAll() {
        List<User> list = new ArrayList<>();
        String sql = "SELECT id, username, role FROM users";

        try (Connection c = DatabaseConfig.getConnection(); Statement s = c.createStatement(); ResultSet rs = s.executeQuery(sql)) {
            while (rs.next()) {
                list.add(
                    new User(
                        rs.getInt("id"),
                        rs.getString("username"),
                        "",
                        rs.getString("role")
                    )
                );
            }
        } catch (SQLException e) {
            System.out.printf("Error while executing query: %s\n", e.getMessage());
        }

        return list;
    }

    public void create(String username, String hash, String role) {
        String sql = "INSERT INTO users(username, password_hash, role) VALUES (?, ?, ?)";

        try (Connection c = DatabaseConfig.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, username);
            ps.setString(2, hash);
            ps.setString(3, role);
            ps.executeUpdate();
        } catch (SQLException e) {
            System.out.printf("Error while executing query: %s\n", e.getMessage());
        }
    }

    public void update(int id, String hash) {
        String sql = "UPDATE users SET password_hash = ? WHERE id = ?";

        try (Connection c = DatabaseConfig.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, hash);
            ps.setInt(2, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            System.out.printf("Error while executing query: %s\n", e.getMessage());
        }
    }

    public void delete(int id) {
        String sql = "DELETE FROM users WHERE id = ?";

        try (Connection c = DatabaseConfig.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            System.out.printf("Error while executing query: %s\n", e.getMessage());
        }
    }
}
