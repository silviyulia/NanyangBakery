-- =====================================================
-- SQL Database Schema untuk Sistem Kasir dan Waiters
-- Nanyang Bakery POS System
-- =====================================================

-- Update users table untuk memastikan memiliki kolom yang tepat
ALTER TABLE `users` MODIFY `user_id` int NOT NULL AUTO_INCREMENT;

-- =====================================================
-- Table: orders
-- Untuk menyimpan data pesanan dari waiters
-- =====================================================
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` bigint NOT NULL AUTO_INCREMENT,
  `table_id` bigint NOT NULL,
  `waitres_id` int NOT NULL,
  `status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `total_price` decimal(12,2) DEFAULT '0.00',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `table_id` (`table_id`),
  KEY `waitres_id` (`waitres_id`),
  KEY `status` (`status`),
  CONSTRAINT `fk_order_table` FOREIGN KEY (`table_id`) REFERENCES `tables` (`table_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_waitres` FOREIGN KEY (`waitres_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: order_items
-- Untuk menyimpan detail item dalam pesanan
-- =====================================================
CREATE TABLE IF NOT EXISTS `order_items` (
  `order_item_id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `fk_order_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: cashier_sessions
-- Untuk tracking session kerja kasir
-- =====================================================
CREATE TABLE IF NOT EXISTS `cashier_sessions` (
  `session_id` bigint NOT NULL AUTO_INCREMENT,
  `kasir_id` int NOT NULL,
  `opened_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `closed_at` timestamp NULL,
  `status` enum('active','closed') DEFAULT 'active',
  `opening_balance` decimal(12,2) DEFAULT '0.00',
  `closing_balance` decimal(12,2) NULL,
  PRIMARY KEY (`session_id`),
  KEY `kasir_id` (`kasir_id`),
  KEY `status` (`status`),
  CONSTRAINT `fk_cashier_session_user` FOREIGN KEY (`kasir_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: transactions
-- Untuk menyimpan data transaksi pembayaran
-- =====================================================
CREATE TABLE IF NOT EXISTS `transactions` (
  `transaction_id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NULL,
  `kasir_id` int NOT NULL,
  `session_id` bigint NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `payment_method` enum('cash','qris','transfer') DEFAULT 'cash',
  `payment_status` enum('pending','completed','cancelled') DEFAULT 'pending',
  `amount_paid` decimal(12,2) NOT NULL,
  `change_amount` decimal(12,2) DEFAULT '0.00',
  `reference_number` varchar(255) NULL COMMENT 'Nomor referensi untuk QRIS/Transfer',
  `notes` text NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`),
  KEY `order_id` (`order_id`),
  KEY `kasir_id` (`kasir_id`),
  KEY `session_id` (`session_id`),
  KEY `payment_method` (`payment_method`),
  KEY `payment_status` (`payment_status`),
  CONSTRAINT `fk_transaction_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_transaction_kasir` FOREIGN KEY (`kasir_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_transaction_session` FOREIGN KEY (`session_id`) REFERENCES `cashier_sessions` (`session_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: receipts
-- Untuk menyimpan data struk digital
-- =====================================================
CREATE TABLE IF NOT EXISTS `receipts` (
  `receipt_id` bigint NOT NULL AUTO_INCREMENT,
  `transaction_id` bigint NOT NULL,
  `receipt_number` varchar(50) NOT NULL UNIQUE,
  `table_id` bigint NULL,
  `items_detail` json NOT NULL COMMENT 'Detail items dalam format JSON',
  `subtotal` decimal(12,2) NOT NULL,
  `discount` decimal(12,2) DEFAULT '0.00',
  `total` decimal(12,2) NOT NULL,
  `amount_paid` decimal(12,2) NOT NULL,
  `change` decimal(12,2) DEFAULT '0.00',
  `payment_method` enum('cash','qris','transfer') NOT NULL,
  `notes` text NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`receipt_id`),
  UNIQUE KEY `receipt_number` (`receipt_number`),
  KEY `transaction_id` (`transaction_id`),
  KEY `table_id` (`table_id`),
  CONSTRAINT `fk_receipt_transaction` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_receipt_table` FOREIGN KEY (`table_id`) REFERENCES `tables` (`table_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: inventory
-- Untuk tracking stok produk siap jual
-- =====================================================
CREATE TABLE IF NOT EXISTS `inventory` (
  `inventory_id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `stock_quantity` int DEFAULT '0',
  `minimum_threshold` int DEFAULT '5',
  `maximum_threshold` int DEFAULT '100',
  `status` enum('available','low_stock','out_of_stock') DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`inventory_id`),
  UNIQUE KEY `product_id` (`product_id`),
  KEY `status` (`status`),
  CONSTRAINT `fk_inventory_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: stock_notifications
-- Untuk notifikasi minimum stok bahan baku
-- =====================================================
CREATE TABLE IF NOT EXISTS `stock_notifications` (
  `notification_id` bigint NOT NULL AUTO_INCREMENT,
  `ingredient_id` bigint NOT NULL,
  `minimum_threshold` decimal(12,2) NOT NULL,
  `status` enum('active','inactive','triggered') DEFAULT 'active',
  `last_notified_at` timestamp NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `ingredient_id` (`ingredient_id`),
  KEY `status` (`status`),
  CONSTRAINT `fk_stock_notification_ingredient` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: activity_logs
-- Untuk tracking aktivitas pengguna
-- =====================================================
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `log_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `action` varchar(255) NOT NULL,
  `entity_type` varchar(100) NULL,
  `entity_id` bigint NULL,
  `old_values` json NULL,
  `new_values` json NULL,
  `ip_address` varchar(45) NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `user_id` (`user_id`),
  KEY `action` (`action`),
  KEY `entity_type` (`entity_type`),
  CONSTRAINT `fk_activity_log_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- View: active_orders_view
-- View untuk melihat pesanan aktif per meja
-- =====================================================
CREATE OR REPLACE VIEW `active_orders_view` AS
SELECT 
    t.table_id,
    t.table_number,
    t.capacity,
    o.order_id,
    o.status,
    o.total_price,
    COUNT(oi.order_item_id) as item_count,
    GROUP_CONCAT(CONCAT(p.name, ' x', oi.quantity) SEPARATOR ', ') as items_summary,
    u.name as waitres_name,
    o.created_at,
    TIMESTAMPDIFF(MINUTE, o.created_at, NOW()) as duration_minutes
FROM tables t
LEFT JOIN orders o ON t.table_id = o.table_id AND o.status NOT IN ('completed', 'cancelled')
LEFT JOIN order_items oi ON o.order_id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.product_id
LEFT JOIN users u ON o.waitres_id = u.user_id
GROUP BY t.table_id, t.table_number, t.capacity, o.order_id, o.status, o.total_price, u.name, o.created_at;

-- =====================================================
-- View: daily_sales_summary
-- View untuk ringkasan penjualan harian
-- =====================================================
CREATE OR REPLACE VIEW `daily_sales_summary` AS
SELECT 
    DATE(t.created_at) as transaction_date,
    COUNT(DISTINCT t.transaction_id) as total_transactions,
    COUNT(DISTINCT t.order_id) as total_orders,
    SUM(t.total_amount) as total_revenue,
    SUM(CASE WHEN t.payment_method = 'cash' THEN t.total_amount ELSE 0 END) as cash_total,
    SUM(CASE WHEN t.payment_method = 'qris' THEN t.total_amount ELSE 0 END) as qris_total,
    SUM(CASE WHEN t.payment_method = 'transfer' THEN t.total_amount ELSE 0 END) as transfer_total,
    COUNT(DISTINCT t.kasir_id) as active_cashiers,
    SUM(t.change_amount) as total_change
FROM transactions t
WHERE t.payment_status = 'completed'
GROUP BY DATE(t.created_at);

-- =====================================================
-- Indexes untuk performa query
-- =====================================================
ALTER TABLE `orders` ADD INDEX `idx_created_updated` (`created_at`, `updated_at`);
ALTER TABLE `transactions` ADD INDEX `idx_created_updated` (`created_at`, `updated_at`);
ALTER TABLE `receipts` ADD INDEX `idx_created_updated` (`created_at`, `updated_at`);
ALTER TABLE `activity_logs` ADD INDEX `idx_created_updated` (`created_at`, `updated_at`);

-- =====================================================
-- Data Awal
-- =====================================================

-- Insert data awal untuk tables (meja) jika belum ada
INSERT IGNORE INTO `tables` (`table_id`, `table_number`, `capacity`, `status`) VALUES
(1, '1', 4, 'available'),
(2, '2', 4, 'available'),
(3, '3', 6, 'available'),
(4, '4', 6, 'available'),
(5, '5', 2, 'available'),
(6, '6', 2, 'available'),
(7, '7', 8, 'available'),
(8, '8', 4, 'available');

-- Ensure products table has proper status column
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `status` enum('active','inactive') DEFAULT 'active';

-- Insert initial inventory for existing products
INSERT IGNORE INTO `inventory` (`product_id`, `stock_quantity`, `minimum_threshold`, `maximum_threshold`, `status`) 
SELECT `product_id`, 50, 5, 100, 'available' FROM `products` WHERE `product_id` NOT IN (SELECT `product_id` FROM `inventory`);

COMMIT;
