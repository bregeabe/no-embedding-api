-- No Embedding API Database Schema
-- Created for noembedding.com

CREATE TABLE IF NOT EXISTS languages (
  languageId CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  repoUrl VARCHAR(500) UNIQUE,
  type VARCHAR(100),
  host VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_language_repoUrl (repoUrl),
  INDEX idx_language_name (name)
);

CREATE TABLE IF NOT EXISTS institutions (
  institutionId CHAR(36) PRIMARY KEY,
  shortName VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_institution_name (name),
  INDEX idx_institution_type (type),
  INDEX idx_institution_location (location)
);

CREATE TABLE IF NOT EXISTS research_groups (
  researchGroupId CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(500) UNIQUE,
  institutionId CHAR(36),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (institutionId) REFERENCES institutions(institutionId) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_research_group_name (name)
);

CREATE TABLE IF NOT EXISTS literature (
  literatureId CHAR(36) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  author VARCHAR(255) NOT NULL,
  abstract TEXT,
  languageId CHAR(36),
  institutionId CHAR(36),
  publication_year INT,
  pdf_path VARCHAR(500),
  doi_url VARCHAR(500),
  open_access_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (languageId) REFERENCES languages(languageId) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (institutionId) REFERENCES institutions(institutionId) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_literature_title (title),
  INDEX idx_literature_author (author),
  INDEX idx_literature_year (publication_year),
  INDEX idx_literature_language (languageId),
  INDEX idx_literature_institution (institutionId)
);

CREATE TABLE IF NOT EXISTS literature_institutions (
  literatureInstitutionId CHAR(36) PRIMARY KEY,
  literatureId CHAR(36) NOT NULL,
  institutionId CHAR(36) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (literatureId) REFERENCES literature(literatureId) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (institutionId) REFERENCES institutions(institutionId) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY unique_literature_institution (literatureId, institutionId)
);

CREATE INDEX idx_literature_created_at ON literature(created_at DESC);
CREATE INDEX idx_languages_created_at ON languages(created_at DESC);
CREATE INDEX idx_institutions_created_at ON institutions(created_at DESC);
CREATE INDEX idx_research_groups_created_at ON research_groups(created_at DESC);