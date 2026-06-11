USE rikaz_accounting_db;

ALTER TABLE chart_of_accounts
  ADD COLUMN is_custom TINYINT(1) NOT NULL DEFAULT 0 AFTER allow_payment;

CREATE TABLE IF NOT EXISTS association_settings (
  association_id        INT PRIMARY KEY,
  name_en               VARCHAR(255) DEFAULT NULL,
  cr_number             VARCHAR(50) DEFAULT NULL,
  license_number        VARCHAR(50) DEFAULT NULL,
  founded_date          DATE DEFAULT NULL,
  city                  VARCHAR(100) DEFAULT NULL,
  address               TEXT DEFAULT NULL,
  phone                 VARCHAR(50) DEFAULT NULL,
  email                 VARCHAR(255) DEFAULT NULL,
  website               VARCHAR(255) DEFAULT NULL,
  description           TEXT DEFAULT NULL,
  fiscal_year_start     TINYINT UNSIGNED NOT NULL DEFAULT 1,
  current_fiscal_year   YEAR NOT NULL,
  currency              VARCHAR(10) NOT NULL DEFAULT 'SAR',
  journal_seq_start     INT UNSIGNED NOT NULL DEFAULT 1,
  stamp_url             VARCHAR(500) DEFAULT NULL,
  logo_url              VARCHAR(500) DEFAULT NULL,
  updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_settings_association
    FOREIGN KEY (association_id) REFERENCES associations(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bank_accounts (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  association_id   INT NOT NULL,
  description      VARCHAR(255) NOT NULL,
  bank_name        VARCHAR(255) NOT NULL,
  account_number   VARCHAR(50) NOT NULL,
  iban             VARCHAR(34) NOT NULL,
  account_owner    VARCHAR(255) DEFAULT NULL,
  account_code     VARCHAR(20) NOT NULL DEFAULT '11101001',
  opening_balance  DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  status           ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_banks_association (association_id),
  CONSTRAINT fk_banks_association
    FOREIGN KEY (association_id) REFERENCES associations(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS association_users (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  association_id   INT NOT NULL,
  display_name     VARCHAR(255) NOT NULL,
  username         VARCHAR(100) NOT NULL,
  password_hash    VARCHAR(255) NOT NULL,
  role             ENUM('admin', 'accountant', 'auditor') NOT NULL DEFAULT 'accountant',
  status           ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_association_username (association_id, username),
  INDEX idx_assoc_users_association (association_id),
  CONSTRAINT fk_assoc_users_association
    FOREIGN KEY (association_id) REFERENCES associations(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS fiscal_years (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  association_id   INT NOT NULL,
  fiscal_year      YEAR NOT NULL,
  closed_date      DATE NOT NULL,
  journal_count    INT UNSIGNED NOT NULL DEFAULT 0,
  total_income     DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  total_expenses   DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  manual_journal_id INT UNSIGNED DEFAULT NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_fiscal_year (association_id, fiscal_year),
  INDEX idx_fiscal_association (association_id),
  CONSTRAINT fk_fiscal_association
    FOREIGN KEY (association_id) REFERENCES associations(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
