USE rikaz_accounting_db;

ALTER TABLE admins
  ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500) NULL AFTER name;
