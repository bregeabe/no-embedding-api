-- No Embedding API Database Schema
-- Created for noembedding.com

-- Create languages table (independent table, no foreign keys to avoid circular dependency)
CREATE TABLE IF NOT EXISTS languages (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_language_code (code),
  INDEX idx_language_name (name)
);

-- Create institutions table (independent table, no foreign keys initially)
CREATE TABLE IF NOT EXISTS institutions (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  type VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_institution_name (name),
  INDEX idx_institution_type (type),
  INDEX idx_institution_location (location)
);

-- Create research_groups table (references institutions)
CREATE TABLE IF NOT EXISTS research_groups (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  institution_id VARCHAR(36),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_research_group_name (name)
);

-- Create literature table (references languages and institutions)
CREATE TABLE IF NOT EXISTS literature (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  author VARCHAR(255) NOT NULL,
  abstract TEXT,
  language_id VARCHAR(36),
  institution_id VARCHAR(36),
  publication_year INT,
  pdf_path VARCHAR(500),
  doi_url VARCHAR(500),
  open_access_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_literature_title (title),
  INDEX idx_literature_author (author),
  INDEX idx_literature_year (publication_year),
  INDEX idx_literature_language (language_id),
  INDEX idx_literature_institution (institution_id)
);

-- Create literature_institutions junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS literature_institutions (
  id VARCHAR(36) PRIMARY KEY,
  literature_id VARCHAR(36) NOT NULL,
  institution_id VARCHAR(36) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (literature_id) REFERENCES literature(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY unique_literature_institution (literature_id, institution_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_literature_created_at ON literature(created_at DESC);
CREATE INDEX idx_languages_created_at ON languages(created_at DESC);
CREATE INDEX idx_institutions_created_at ON institutions(created_at DESC);
CREATE INDEX idx_research_groups_created_at ON research_groups(created_at DESC);