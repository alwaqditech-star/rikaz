USE rikaz_accounting_db;

CREATE TABLE IF NOT EXISTS manual_journals (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  association_id   INT NOT NULL,
  journal_number   VARCHAR(50) NOT NULL,
  journal_date     DATE NOT NULL,
  description      TEXT NOT NULL,
  reference        VARCHAR(100) DEFAULT NULL,
  entry_type       VARCHAR(50) NOT NULL DEFAULT 'قيد عادي',
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_manual_journal_number (association_id, journal_number),
  INDEX idx_manual_journal_date (association_id, journal_date),
  CONSTRAINT fk_manual_journal_association
    FOREIGN KEY (association_id) REFERENCES associations(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS manual_journal_lines (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  manual_journal_id INT UNSIGNED NOT NULL,
  account_code      VARCHAR(20) NOT NULL,
  debit_amount      DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  credit_amount     DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  line_description  TEXT DEFAULT NULL,
  INDEX idx_manual_line_journal (manual_journal_id),
  CONSTRAINT fk_manual_line_journal
    FOREIGN KEY (manual_journal_id) REFERENCES manual_journals(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
