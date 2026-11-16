CREATE DATABASE IF NOT EXISTS ai_proposal_generator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ai_proposal_generator;
CREATE TABLE IF NOT EXISTS projects (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 issuing_company VARCHAR(200) NOT NULL, client_name VARCHAR(200) NOT NULL,
 contact_details VARCHAR(300), project_location VARCHAR(300) NOT NULL,
 project_type VARCHAR(120) NOT NULL, crushing_capacity_tph DECIMAL(10,2), washing_capacity_tph DECIMAL(10,2),
 duration VARCHAR(80), scope_json JSON NOT NULL, equipment_details TEXT, technical_requirements TEXT,
 budget_amount DECIMAL(16,2), currency VARCHAR(30) NOT NULL DEFAULT 'INR (₹)', tax_status VARCHAR(80),
 payment_terms TEXT, warranty_guarantee TEXT, quotation_validity VARCHAR(100), proposal_type VARCHAR(120),
 special_instructions TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS proposals (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, project_id BIGINT UNSIGNED NOT NULL,
 title VARCHAR(250) NOT NULL, status ENUM('draft','in_review','approved','issued','archived') DEFAULT 'draft',
 content_json JSON NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_documents (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, project_id BIGINT UNSIGNED NOT NULL,
 original_name VARCHAR(255) NOT NULL, stored_name VARCHAR(255) NOT NULL, mime_type VARCHAR(150),
 extracted_text LONGTEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS boq_items (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, project_id BIGINT UNSIGNED NOT NULL,
 item_code VARCHAR(60), description VARCHAR(500) NOT NULL, unit VARCHAR(40), quantity DECIMAL(14,3) NOT NULL DEFAULT 0,
 unit_rate DECIMAL(16,2) NOT NULL DEFAULT 0, amount DECIMAL(18,2) NOT NULL DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
