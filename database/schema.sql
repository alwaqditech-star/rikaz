-- Rikaz Accounting System - MySQL Schema (Engineering Plan V2)
-- Run: mysql -u root -p < database/schema.sql

CREATE DATABASE IF NOT EXISTS rikaz_accounting_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE rikaz_accounting_db;

-- ============================================================
-- Super Admin
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(200) NOT NULL,
  avatar_url    VARCHAR(500) DEFAULT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Associations (Subscribers)
-- ============================================================
CREATE TABLE IF NOT EXISTS associations (
  id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  association_name   VARCHAR(255) NOT NULL,
  avatar_url         VARCHAR(500) DEFAULT NULL,
  username           VARCHAR(100) NOT NULL UNIQUE,
  password_hash      VARCHAR(255) NOT NULL,
  is_first_login     TINYINT(1) NOT NULL DEFAULT 1,
  subscription_start DATE NOT NULL,
  subscription_end   DATE NOT NULL,
  status             ENUM('active', 'expired') NOT NULL DEFAULT 'active',
  created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_associations_status (status),
  INDEX idx_associations_subscription_end (subscription_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Chart of Accounts
-- ============================================================
CREATE TABLE IF NOT EXISTS chart_of_accounts (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  association_id INT UNSIGNED NOT NULL,
  account_code   VARCHAR(20) NOT NULL,
  account_name   VARCHAR(255) NOT NULL,
  account_type   VARCHAR(50) NOT NULL,
  parent_code    VARCHAR(20) DEFAULT NULL,
  allow_payment  ENUM('Yes', 'No') NOT NULL DEFAULT 'No',
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_coa_association_code (association_id, account_code),
  INDEX idx_coa_parent (association_id, parent_code),
  CONSTRAINT fk_coa_association
    FOREIGN KEY (association_id) REFERENCES associations(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Financial Vouchers (Receipts & Disbursements)
-- ============================================================
CREATE TABLE IF NOT EXISTS financial_vouchers (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  association_id   INT UNSIGNED NOT NULL,
  voucher_type     ENUM('receipt', 'disbursement') NOT NULL,
  voucher_number   VARCHAR(50) NOT NULL,
  voucher_date     DATE NOT NULL,
  total_amount     DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  beneficiary_name VARCHAR(255) DEFAULT NULL,
  description      TEXT DEFAULT NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_voucher_number (association_id, voucher_type, voucher_number),
  INDEX idx_vouchers_date (association_id, voucher_date),
  CONSTRAINT fk_vouchers_association
    FOREIGN KEY (association_id) REFERENCES associations(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Journal Entries
-- ============================================================
CREATE TABLE IF NOT EXISTS journal_entries (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  voucher_id    INT UNSIGNED NOT NULL,
  account_code  VARCHAR(20) NOT NULL,
  debit_amount  DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  credit_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_journal_voucher (voucher_id),
  INDEX idx_journal_account (account_code),
  CONSTRAINT fk_journal_voucher
    FOREIGN KEY (voucher_id) REFERENCES financial_vouchers(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Safety Financial Inputs (Per Fiscal Year)
-- ============================================================
CREATE TABLE IF NOT EXISTS safety_financial_inputs (
  id                              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  association_id                  INT UNSIGNED NOT NULL,
  fiscal_year                     YEAR NOT NULL,
  total_expenses                  DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  admin_expenses                  DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  program_expenses                DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  activity_admin_expenses         DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  total_activity_expenses         DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  sustainability_returns          DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  sustainability_expenses         DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  sustainability_assets           DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  total_donations                 DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  fundraising_expenses            DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  cash_equivalents                DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  net_restricted_assets           DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  net_endowment_cash              DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  current_liabilities             DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  net_current_cash_investments    DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  estimated_annual_admin_expenses DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  created_at                      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_safety_association_year (association_id, fiscal_year),
  CONSTRAINT fk_safety_association
    FOREIGN KEY (association_id) REFERENCES associations(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Seed Data
-- ============================================================

-- Super admin: username=admin, password=admin123
INSERT INTO admins (username, password_hash, name) VALUES
(
  'admin',
  '$2b$10$aSmz80GhDOvWH75cxlopm.1x.zepGvmK/0wd7DuBa.jckezh52sby',
  'مدير النظام'
)
ON DUPLICATE KEY UPDATE username = username;

-- Sample association: username=demo001, password=demo123
INSERT INTO associations (
  association_name,
  username,
  password_hash,
  is_first_login,
  subscription_start,
  subscription_end,
  status
) VALUES (
  'جمعية ركاز النموذجية',
  'demo001',
  '$2b$10$79tTjLrIs6QXtanJQHA1lOg444C3J8iyJ0WSnZbWAkrDENEqeVACu',
  1,
  CURDATE(),
  DATE_ADD(CURDATE(), INTERVAL 1 YEAR),
  'active'
)
ON DUPLICATE KEY UPDATE username = username;
