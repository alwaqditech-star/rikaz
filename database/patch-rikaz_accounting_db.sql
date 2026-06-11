-- إصلاح قاعدة rikaz_accounting_db (XAMPP)
-- ينشئ جدول admins ويضبط كلمات المرور المعروفة

USE rikaz_accounting_db;

CREATE TABLE IF NOT EXISTS admins (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(200) NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- مدير النظام: admin / admin123
INSERT INTO admins (username, password_hash, name) VALUES
(
  'admin',
  '$2b$10$1fg2dHAanHUyyi5mIhKZQeC9nVw5UkfuCLA5u30XfdcHAe3DEh7l2',
  'مدير النظام'
)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  name = VALUES(name);

-- جمعية موجودة: rikaz_admin / demo123
UPDATE associations
SET password_hash = '$2b$10$30Onq8zUj9QGpeXka4it7OJ9t8QtEP.Ce8uxu3RYGjZwP94v8VKP.',
    is_first_login = 1,
    status = 'active'
WHERE username = 'rikaz_admin';

-- حساب تجريبي إضافي: demo001 / demo123
INSERT INTO associations (
  association_name, username, password_hash,
  is_first_login, subscription_start, subscription_end, status
) VALUES (
  'جمعية ركاز النموذجية',
  'demo001',
  '$2b$10$30Onq8zUj9QGpeXka4it7OJ9t8QtEP.Ce8uxu3RYGjZwP94v8VKP.',
  1,
  CURDATE(),
  DATE_ADD(CURDATE(), INTERVAL 1 YEAR),
  'active'
)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  status = 'active';
