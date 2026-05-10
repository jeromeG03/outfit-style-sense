-- =============================================
-- Authentication Enhancement Migration
-- Adds email-based authentication and password reset
-- =============================================

USE outfit_recommendation_db;

-- 1. Add email and authProvider columns to users table
ALTER TABLE users 
ADD COLUMN email VARCHAR(255) UNIQUE AFTER user_name,
ADD COLUMN auth_provider VARCHAR(50) DEFAULT 'local' AFTER password;

-- 2. Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(6) NOT NULL UNIQUE,
    expiry_date DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_token (token),
    INDEX idx_expiry (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Update existing users to have email (optional - for existing users)
-- You can manually update existing users with their emails or leave them for users to update
-- Example: UPDATE users SET email = CONCAT(user_name, '@example.com') WHERE email IS NULL;

-- 4. Verify changes
SELECT 'Users table updated successfully' AS Status;
DESCRIBE users;

SELECT 'Password reset tokens table created successfully' AS Status;
DESCRIBE password_reset_tokens;

-- 5. Show current users count
SELECT COUNT(*) AS total_users FROM users;

-- =============================================
-- Notes:
-- - Existing users will have NULL email initially
-- - New signups will require email (enforced by backend validation)
-- - Password reset codes expire in 15 minutes (handled by backend)
-- - For production, consider adding indexes on email in users table
-- =============================================
