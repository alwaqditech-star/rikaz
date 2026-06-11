USE rikaz_accounting_db;

ALTER TABLE associations
  ADD COLUMN avatar_url VARCHAR(500) NULL AFTER association_name;
