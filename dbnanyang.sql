-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 01, 2026 at 03:06 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbnanyang`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` bigint UNSIGNED NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `description`) VALUES
(1, 'Roti & Pastry', 'Produk roti dan pastry'),
(2, 'Kue & Cake', 'Produk kue dan cake'),
(3, 'Minuman', 'Produk minuman');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ingredients`
--

CREATE TABLE `ingredients` (
  `ingredient_id` bigint UNSIGNED NOT NULL,
  `ingredient_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qty` decimal(12,0) NOT NULL DEFAULT '0',
  `unit` enum('Kg','Gram','Butir','Ml','Liter') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('available','empty') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `minimum_stock` decimal(12,0) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ingredients`
--

INSERT INTO `ingredients` (`ingredient_id`, `ingredient_name`, `qty`, `unit`, `status`, `minimum_stock`) VALUES
(1, 'tepung terigu', 36, 'Kg', 'available', 5),
(2, 'gula pasir', 32, 'Kg', 'available', 5),
(3, 'margarin', 5, 'Kg', 'available', 3),
(4, 'susu cair', 5, 'Liter', 'available', 2),
(5, 'Espresso', 3, 'Kg', 'available', 1),
(7, 'Telur', 24, 'Butir', 'available', 10),
(8, 'bubuk coklat', 2, 'Kg', 'available', 1),
(9, 'bubuk macha', 3, 'Kg', 'available', 1);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_06_08_000000_create_products_table', 1),
(5, '2024_06_08_000001_create_productions_table', 1),
(6, '2024_06_08_000002_create_inventory_table', 1),
(7, '2024_06_08_000003_create_orders_table', 1),
(8, '2024_06_08_000004_create_order_items_table', 1),
(10, '2024_06_08_000007_add_phone_and_role_to_users_table', 1),
(11, '2024_06_08_000008_create_categories_table', 1),
(12, '2024_06_08_000009_create_ingredients_table', 1),
(13, '2024_06_08_000010_create_stok_bahan_table', 1),
(14, '2024_06_08_000011_create_tables_table', 1),
(15, '2024_06_08_000012_create_recipes_table', 1),
(16, '2026_06_11_151642_create_orders_table', 2),
(17, '2026_06_11_151653_create_order_items_table', 3),
(18, '2024_06_08_000005_create_transactions_table', 4),
(19, '2024_06_08_000017_create_receipts_table', 5),
(20, '2026_06_21_210216_add_waitres_id_to_orders_table', 6);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint UNSIGNED NOT NULL,
  `table_id` bigint UNSIGNED DEFAULT NULL,
  `waitres_id` bigint UNSIGNED DEFAULT NULL,
  `total_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `status` enum('pending','proses','selesai','batal') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `table_id`, `waitres_id`, `total_amount`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 28000.00, 'selesai', '2026-06-21 14:35:45', '2026-06-21 15:01:37'),
(2, 2, 3, 60000.00, 'selesai', '2026-06-21 14:37:35', '2026-06-21 15:02:13'),
(3, 3, 3, 66000.00, 'selesai', '2026-06-21 14:38:09', '2026-06-21 15:02:44'),
(4, 1, 3, 58000.00, 'selesai', '2026-06-21 15:21:35', '2026-06-21 15:22:14'),
(5, 1, 3, 50000.00, 'selesai', '2026-06-28 16:18:08', '2026-06-29 13:51:42'),
(6, 2, 3, 65000.00, 'selesai', '2026-06-29 13:54:15', '2026-06-29 13:55:34'),
(7, 1, 3, 17000.00, 'selesai', '2026-06-29 16:03:49', '2026-06-29 16:06:41'),
(8, 4, 1, 34000.00, 'selesai', '2026-06-29 16:08:12', '2026-06-29 16:08:44'),
(9, 5, 1, 30000.00, 'selesai', '2026-06-29 16:13:26', '2026-06-29 16:13:52'),
(10, 6, 1, 17000.00, 'selesai', '2026-06-29 16:34:14', '2026-06-29 16:46:14'),
(11, 3, 1, 20000.00, 'selesai', '2026-06-29 17:16:49', '2026-06-29 17:17:24');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint UNSIGNED NOT NULL,
  `order_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `subtotal`, `created_at`, `updated_at`) VALUES
(1, 1, 5, 1, 28000.00, 28000.00, '2026-06-21 14:35:45', '2026-06-21 14:35:45'),
(2, 2, 3, 2, 30000.00, 60000.00, '2026-06-21 14:37:35', '2026-06-21 14:37:35'),
(3, 3, 9, 1, 36000.00, 36000.00, '2026-06-21 14:38:09', '2026-06-21 14:38:09'),
(4, 3, 3, 1, 30000.00, 30000.00, '2026-06-21 14:38:09', '2026-06-21 14:38:09'),
(5, 4, 3, 1, 30000.00, 30000.00, '2026-06-21 15:21:35', '2026-06-21 15:21:35'),
(6, 4, 5, 1, 28000.00, 28000.00, '2026-06-21 15:22:13', '2026-06-21 15:22:13'),
(7, 5, 3, 1, 30000.00, 30000.00, '2026-06-28 16:18:08', '2026-06-28 16:18:08'),
(8, 5, 4, 1, 20000.00, 20000.00, '2026-06-28 16:18:08', '2026-06-28 16:18:08'),
(9, 6, 3, 1, 30000.00, 30000.00, '2026-06-29 13:54:16', '2026-06-29 13:54:16'),
(10, 6, 2, 1, 35000.00, 35000.00, '2026-06-29 13:54:16', '2026-06-29 13:54:16'),
(11, 7, 6, 1, 17000.00, 17000.00, '2026-06-29 16:03:49', '2026-06-29 16:03:49'),
(12, 8, 6, 2, 17000.00, 34000.00, '2026-06-29 16:08:12', '2026-06-29 16:08:12'),
(13, 9, 3, 1, 30000.00, 30000.00, '2026-06-29 16:13:26', '2026-06-29 16:13:26'),
(14, 10, 6, 1, 17000.00, 17000.00, '2026-06-29 16:34:14', '2026-06-29 16:34:14'),
(15, 11, 4, 1, 20000.00, 20000.00, '2026-06-29 17:16:49', '2026-06-29 17:16:49');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `productions`
--

CREATE TABLE `productions` (
  `production_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `quantity_produced` int NOT NULL,
  `production_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `productions`
--

INSERT INTO `productions` (`production_id`, `product_id`, `quantity_produced`, `production_date`) VALUES
(1, 3, 20, '2026-06-15 12:51:22'),
(3, 5, 5, '2026-06-15 19:59:25'),
(4, 9, 4, '2026-06-18 21:20:47'),
(5, 2, 5, '2026-06-28 22:42:32'),
(6, 7, 3, '2026-06-29 20:58:09');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` bigint UNSIGNED NOT NULL,
  `category_id` bigint UNSIGNED NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `name`, `price`, `status`, `image`, `created_at`, `updated_at`) VALUES
(2, 2, 'chocolate cake', 35000.00, 'active', 'products/Q4C6inQ2ztig2In2vwsbTWwfEZVk1lDfT8XkICwp.jpg', NULL, NULL),
(3, 1, 'croissant', 30000.00, 'active', 'products/SvcJZqby4GeLeb02bcwkMXRHlFVmrxT1Iq7GypPU.jpg', NULL, NULL),
(4, 3, 'matcha latte', 20000.00, 'active', 'products/XULt8N9FyqOZlMbXTbuexmJsRdj3p67ztWlq3Hz6.png', NULL, NULL),
(5, 1, 'Baguette', 28000.00, 'active', 'products/ixEwtqYmmRYuHG0OFBQsvA2xyMv3o54ACdgA0i8h.jpg', NULL, NULL),
(6, 3, 'cappucino', 17000.00, 'active', 'products/gqTW7CjcnYmoFmvMtfQRVOvMMgrjpMxLdCQnnMum.jpg', NULL, NULL),
(7, 1, 'cookies', 24000.00, 'inactive', 'products/yNHJcnG7FnwcTihoR1qABPkjXV2zTYL8NET0z3I7.jpg', NULL, NULL),
(9, 2, 'red velvet cake', 36000.00, 'active', 'products/FOHwYtwzZ3GAdN5o1WzKLBIAscmZnrsil3Xgohaj.webp', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `receipts`
--

CREATE TABLE `receipts` (
  `receipt_id` bigint UNSIGNED NOT NULL,
  `transaction_id` bigint UNSIGNED NOT NULL,
  `receipt_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `table_id` bigint UNSIGNED DEFAULT NULL,
  `items_detail` json NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `discount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total` decimal(12,2) NOT NULL,
  `amount_paid` decimal(12,2) NOT NULL,
  `change` decimal(12,2) NOT NULL DEFAULT '0.00',
  `payment_method` enum('cash','qris','transfer') COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
  `recipe_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `ingredient_id` bigint UNSIGNED NOT NULL,
  `quantity` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `recipes`
--

INSERT INTO `recipes` (`recipe_id`, `product_id`, `ingredient_id`, `quantity`) VALUES
(40, 6, 4, 0.08),
(41, 6, 5, 0.04),
(45, 7, 3, 0.20),
(46, 7, 7, 2.00),
(47, 7, 1, 0.25),
(48, 7, 2, 0.16),
(55, 2, 1, 0.25),
(56, 2, 2, 0.15),
(57, 2, 3, 0.20),
(58, 2, 8, 0.03),
(59, 2, 7, 6.00),
(60, 2, 4, 0.03),
(61, 4, 9, 0.05),
(62, 4, 4, 0.08);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('A43VzoklBDfSBgF9RI0KdtmxMtjhjEBSq4yM2mEC', NULL, '127.0.0.1', 'PostmanRuntime/7.54.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid2RIYWFQSExFempkQTY4QlFhekM3cWhRVDJCQlBRdHo1a0VscDVWayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781285608),
('GXYqusOppZlYLaZQd5aU1uVYysrXfcDqSP6A1geN', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid3Z5SUZIbHRuVWVwMEhRSHBabDlMUms5Z2pIMVJXNG1yNm1vRWpGbSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781021869);

-- --------------------------------------------------------

--
-- Table structure for table `stok_bahan`
--

CREATE TABLE `stok_bahan` (
  `stok_id` bigint UNSIGNED NOT NULL,
  `ingredient_id` bigint UNSIGNED NOT NULL,
  `quantity` decimal(12,2) NOT NULL,
  `reference_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tables`
--

CREATE TABLE `tables` (
  `table_id` bigint UNSIGNED NOT NULL,
  `table_number` int NOT NULL,
  `capacity` int NOT NULL,
  `status` enum('available','occupied','reserved') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tables`
--

INSERT INTO `tables` (`table_id`, `table_number`, `capacity`, `status`) VALUES
(1, 1, 4, 'available'),
(2, 2, 4, 'available'),
(3, 3, 4, 'available'),
(4, 4, 4, 'available'),
(5, 5, 4, 'available'),
(6, 6, 4, 'available'),
(7, 7, 4, 'available'),
(8, 8, 4, 'available'),
(9, 9, 4, 'available'),
(10, 10, 4, 'available'),
(11, 11, 4, 'available'),
(12, 12, 4, 'available');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` bigint UNSIGNED NOT NULL,
  `order_id` bigint UNSIGNED DEFAULT NULL,
  `kasir_id` int UNSIGNED NOT NULL,
  `session_id` bigint UNSIGNED DEFAULT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `payment_method` enum('cash','qris','transfer') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cash',
  `payment_status` enum('pending','completed','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `amount_paid` decimal(12,2) NOT NULL,
  `change_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `reference_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `order_id`, `kasir_id`, `session_id`, `total_amount`, `payment_method`, `payment_status`, `amount_paid`, `change_amount`, `reference_number`, `created_at`, `updated_at`) VALUES
(1, 1, 2, NULL, 30800.00, 'cash', 'completed', 31000.00, 200.00, NULL, '2026-06-21 15:01:37', '2026-06-21 15:01:37'),
(2, 2, 2, NULL, 66000.00, 'cash', 'completed', 67000.00, 1000.00, NULL, '2026-06-21 15:02:13', '2026-06-21 15:02:13'),
(3, 3, 2, NULL, 103400.00, 'cash', 'completed', 105000.00, 1600.00, NULL, '2026-06-21 15:02:44', '2026-06-21 15:02:44'),
(4, 4, 2, NULL, 63800.00, 'cash', 'completed', 64000.00, 200.00, NULL, '2026-06-21 15:22:14', '2026-06-21 15:22:14'),
(5, 5, 2, NULL, 55000.00, 'cash', 'completed', 55000.00, 0.00, NULL, '2026-06-29 13:51:42', '2026-06-29 13:51:42'),
(6, 6, 2, NULL, 71500.00, 'cash', 'completed', 71500.00, 0.00, NULL, '2026-06-29 13:55:34', '2026-06-29 13:55:34'),
(7, 7, 2, NULL, 17000.00, 'cash', 'completed', 20000.00, 3000.00, NULL, '2026-06-29 16:06:41', '2026-06-29 16:06:41'),
(8, 8, 2, NULL, 34000.00, 'cash', 'completed', 34000.00, 0.00, NULL, '2026-06-29 16:08:43', '2026-06-29 16:08:43'),
(9, 9, 2, NULL, 30000.00, 'cash', 'completed', 30000.00, 0.00, NULL, '2026-06-29 16:13:52', '2026-06-29 16:13:52'),
(10, 10, 2, NULL, 17000.00, 'cash', 'completed', 17000.00, 0.00, NULL, '2026-06-29 16:46:14', '2026-06-29 16:46:14'),
(11, 11, 2, NULL, 20000.00, 'cash', 'completed', 20000.00, 0.00, NULL, '2026-06-29 17:17:23', '2026-06-29 17:17:23');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int UNSIGNED NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('owner','kasir','waitres') COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `phone`, `role`) VALUES
(1, 'Owner', 'owner@gmail.com', '$2y$12$n2k8Qel5UrjZvdIJBE6Kb.Ce.wEJ/lVZgcfBb7RNmotj8uWwC8K4O', '081234567890', 'owner'),
(2, 'ro', 'kasir@gmail.com', '$2y$12$7mGsqdGdKdppXT4C83IzB.1TCLWgmkrbU97oYevQURhjAQhxXhw92', '081234567891', 'kasir'),
(3, 'lula', 'waitres@gmail.com', '$2y$12$33l3mVdlFYgY0Rsr2vRXaesjJj6mPfIyLw/fpPc0GPdBU6Vuw..XK', '081234567892', 'waitres'),
(4, 'hau', 'kasir2@gmail.com', '$2y$12$zHGQYquLh661ZRM0pOMPAuwH/nhhLzbbXRMPRsMQuoXYVIlcXXqsW', '0882716218673', 'kasir');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`ingredient_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_table_id_foreign` (`table_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`),
  ADD KEY `order_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `productions`
--
ALTER TABLE `productions`
  ADD PRIMARY KEY (`production_id`),
  ADD KEY `productions_product_id_foreign` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `receipts`
--
ALTER TABLE `receipts`
  ADD PRIMARY KEY (`receipt_id`),
  ADD UNIQUE KEY `receipts_receipt_number_unique` (`receipt_number`),
  ADD KEY `receipts_transaction_id_foreign` (`transaction_id`),
  ADD KEY `receipts_table_id_foreign` (`table_id`);

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`recipe_id`),
  ADD KEY `recipes_product_id_foreign` (`product_id`),
  ADD KEY `recipes_ingredient_id_foreign` (`ingredient_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `stok_bahan`
--
ALTER TABLE `stok_bahan`
  ADD PRIMARY KEY (`stok_id`),
  ADD KEY `stok_bahan_ingredient_id_foreign` (`ingredient_id`);

--
-- Indexes for table `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`table_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD UNIQUE KEY `transactions_reference_number_unique` (`reference_number`),
  ADD KEY `transactions_order_id_foreign` (`order_id`),
  ADD KEY `transactions_kasir_id_foreign` (`kasir_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `ingredient_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `productions`
--
ALTER TABLE `productions`
  MODIFY `production_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `receipts`
--
ALTER TABLE `receipts`
  MODIFY `receipt_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `recipe_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `stok_bahan`
--
ALTER TABLE `stok_bahan`
  MODIFY `stok_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tables`
--
ALTER TABLE `tables`
  MODIFY `table_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_table_id_foreign` FOREIGN KEY (`table_id`) REFERENCES `tables` (`table_id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `productions`
--
ALTER TABLE `productions`
  ADD CONSTRAINT `productions_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `receipts`
--
ALTER TABLE `receipts`
  ADD CONSTRAINT `receipts_table_id_foreign` FOREIGN KEY (`table_id`) REFERENCES `tables` (`table_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `receipts_transaction_id_foreign` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`) ON DELETE CASCADE;

--
-- Constraints for table `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ingredient_id_foreign` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `recipes_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `stok_bahan`
--
ALTER TABLE `stok_bahan`
  ADD CONSTRAINT `stok_bahan_ingredient_id_foreign` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_kasir_id_foreign` FOREIGN KEY (`kasir_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `transactions_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
