package com.app.dao;

import com.app.config.DatabaseConfig;
import com.app.model.Task;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class TaskDao {
    public Optional<Task> findById(int id) {
        List<Task> list = new ArrayList<>();
        String sql = "SELECT * FROM tasks WHERE id = ?";

        try (Connection c = DatabaseConfig.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, id);

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return Optional.of(
                    new Task(
                        rs.getInt("id"),
                        rs.getString("title"),
                        rs.getString("description"),
                        rs.getString("status"),
                        rs.getInt("user_id")
                    )
                );
            }
        } catch (SQLException e) {
            System.out.printf("Error while executing query: %s\n", e.getMessage());
        }

        return Optional.empty();
    }

    public List<Task> findByUserId(int userId) {
        List<Task> list = new ArrayList<>();
        String sql = "SELECT * FROM tasks WHERE user_id = ?";

        try (Connection c = DatabaseConfig.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, userId);

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                list.add(
                    new Task(
                        rs.getInt("id"),
                        rs.getString("title"),
                        rs.getString("description"),
                        rs.getString("status"),
                        rs.getInt("user_id")
                    )
                );
            }
        } catch (SQLException e) {
            System.out.printf("Error while executing query: %s\n", e.getMessage());
        }

        return list;
    }

    public List<Task> findAll() {
        List<Task> list = new ArrayList<>();
        String sql = "SELECT * FROM tasks";

        try (Connection c = DatabaseConfig.getConnection(); Statement s = c.createStatement(); ResultSet rs = s.executeQuery(sql)) {
            while (rs.next()) {
                list.add(
                    new Task(
                        rs.getInt("id"),
                        rs.getString("title"),
                        rs.getString("description"),
                        rs.getString("status"),
                        rs.getInt("user_id")
                    )
                );
            }
        } catch (SQLException e) {
            System.out.printf("Error while executing query: %s\n", e.getMessage());
        }

        return list;
    }

    public void create(String title, String description, String status, int userId) {
        String sql = "INSERT INTO tasks(title, description, status, user_id) VALUES (?, ?, ?, ?)";

        try (Connection c = DatabaseConfig.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, title);
            ps.setString(2, description);
            ps.setString(3, status);
            ps.setInt(4, userId);
            ps.executeUpdate();
        } catch (SQLException e) {
            System.out.printf("Error while executing query: %s\n", e.getMessage());
        }
    }

    public void updateStatus(int id, String status) {
        String sql = "UPDATE tasks SET status = ? WHERE id = ?";

        try (Connection c = DatabaseConfig.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setInt(2, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            System.out.printf("Error while executing query: %s\n", e.getMessage());
        }
    }

    public void delete(int id) {
        String sql = "DELETE FROM tasks WHERE id = ?";

        try (Connection c = DatabaseConfig.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            System.out.printf("Error while executing query: %s\n", e.getMessage());
        }
    }
}
