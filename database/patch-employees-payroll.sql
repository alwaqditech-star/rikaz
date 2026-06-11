USE rikaz_accounting_db;

CREATE TABLE IF NOT EXISTS employees (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  association_id      INT NOT NULL,
  name                VARCHAR(255) NOT NULL,
  job_title           VARCHAR(255) NOT NULL,
  id_number           VARCHAR(50) DEFAULT NULL,
  hire_date           DATE DEFAULT NULL,
  basic_salary        DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  housing_allowance   DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  transport_allowance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  commission          DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  gosi_percent        DECIMAL(5, 2) NOT NULL DEFAULT 9.00,
  status              ENUM('active', 'inactive', 'leave') NOT NULL DEFAULT 'active',
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_employees_association (association_id),
  INDEX idx_employees_status (association_id, status),
  CONSTRAINT fk_employees_association
    FOREIGN KEY (association_id) REFERENCES associations(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payroll_runs (
  id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  association_id     INT NOT NULL,
  payroll_month      TINYINT UNSIGNED NOT NULL,
  payroll_year       YEAR NOT NULL,
  total_gross        DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  total_gosi         DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  total_net          DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  employee_count     INT UNSIGNED NOT NULL DEFAULT 0,
  manual_journal_id  INT UNSIGNED DEFAULT NULL,
  created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_payroll_period (association_id, payroll_year, payroll_month),
  INDEX idx_payroll_association (association_id),
  CONSTRAINT fk_payroll_association
    FOREIGN KEY (association_id) REFERENCES associations(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
