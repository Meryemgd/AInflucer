-- Suppression des tables si elles existent
DROP DATABASE IF EXISTS social_manager;
CREATE DATABASE social_manager;
USE social_manager;

-- Table des rôles
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Table des utilisateurs
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    role_id BIGINT,
    enabled BOOLEAN DEFAULT FALSE,
    account_validated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Table des sessions utilisateur
CREATE TABLE user_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    login_time TIMESTAMP NOT NULL,
    logout_time TIMESTAMP NULL,
    ip_address VARCHAR(45),
    session_token VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table de validation des comptes
CREATE TABLE account_validations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    validated_by BIGINT NOT NULL,
    validated_at TIMESTAMP NOT NULL,
    validation_notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (validated_by) REFERENCES users(id)
);

-- Insertion des rôles de base
INSERT INTO roles (name) VALUES 
    ('ROLE_ADMIN'),    -- Super administrateur
    ('ROLE_CM'),       -- Community Manager
    ('ROLE_CLIENT');   -- Client standard

-- Création d'un compte admin par défaut
INSERT INTO users (email, password, username, role_id, enabled, account_validated) VALUES 
    ('admin@admin.com', 'Admin123', 'admin', 
    (SELECT id FROM roles WHERE name = 'ROLE_ADMIN'), TRUE, TRUE);

-- Création d'un compte community manager par défaut
INSERT INTO users (email, password, username, role_id, enabled, account_validated) VALUES 
    ('cm@cm.com', 'Cm123', 'cm', 
    (SELECT id FROM roles WHERE name = 'ROLE_CM'), TRUE, TRUE);

-- Création des index pour améliorer les performances
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_username ON users(username);
CREATE INDEX idx_user_role ON users(role_id);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_login ON user_sessions(login_time);
CREATE INDEX idx_account_validations_user ON account_validations(user_id);
CREATE INDEX idx_account_validations_validator ON account_validations(validated_by);
