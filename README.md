## DB Schema

### Users
```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
);
```

### Tasks
```sql
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE CASCADE
);
```

### Initial user (admin:1234567890)
```sql
INSERT INTO users (username, password_hash, role) VALUES 
('admin', '/XtkDcq6LqxEyTqq6kA8AA==:jRH0G7F3wU0uBjUJpCQmYy5040Yak5Yw6dG/iJx/iao=', 'ADMIN')
ON CONFLICT (username) DO NOTHING;
```
