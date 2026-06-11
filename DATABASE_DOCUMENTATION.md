# Dokumentasi Database Sistem Kasir dan Waiters
## Nanyang Bakery POS System

---

## 📋 Daftar Isi
1. [Ringkasan](#ringkasan)
2. [Struktur Tabel](#struktur-tabel)
3. [Relasi Antar Tabel](#relasi-antar-tabel)
4. [Functional Requirements Mapping](#functional-requirements-mapping)
5. [Queries Penting](#queries-penting)
6. [Panduan Implementasi](#panduan-implementasi)

---

## Ringkasan

Database ini dirancang untuk mendukung operasional sistem kasir dan waiters pada bakery dengan fitur-fitur:
- **Order Management**: Pengelolaan pesanan dari waiters hingga transaksi
- **Inventory Management**: Tracking stok produk dan bahan baku
- **Transaction Management**: Pencatatan pembayaran dengan berbagai metode
- **Activity Logging**: Tracking semua aktivitas user untuk audit trail
- **Real-time Updates**: Support untuk WebSocket dan notifikasi

---

## Struktur Tabel

### 1. **orders** - Tabel Pesanan
Menyimpan data pesanan dari waiters

```
┌─────────────────────────────────────────────────┐
│ orders                                          │
├─────────────────────────────────────────────────┤
│ order_id (PK)       bigint AUTO_INCREMENT       │
│ table_id (FK)       bigint → tables.table_id    │
│ waitres_id (FK)     int → users.user_id        │
│ status              enum (pending, confirmed,   │
│                          completed, cancelled)  │
│ total_price         decimal(12,2)               │
│ notes               text                        │
│ created_at          timestamp                   │
│ updated_at          timestamp                   │
└─────────────────────────────────────────────────┘
```

**Penggunaan:**
- FR-19: Waitres input pesanan berdasarkan nomor meja
- FR-21: Kirim pesanan ke kasir real-time (UPDATE status)
- FR-29: Total dihitung otomatis dari order_items

---

### 2. **order_items** - Detail Item Pesanan
Menyimpan detail item dalam setiap pesanan

```
┌──────────────────────────────────────────────────┐
│ order_items                                      │
├──────────────────────────────────────────────────┤
│ order_item_id (PK)  bigint AUTO_INCREMENT        │
│ order_id (FK)       bigint → orders.order_id     │
│ product_id (FK)     bigint → products.product_id │
│ quantity            int                          │
│ price               decimal(12,2)                │
│ subtotal            decimal(12,2) (auto-calc)    │
│ status              enum (pending, confirmed,    │
│                          cancelled)              │
│ created_at          timestamp                    │
│ updated_at          timestamp                    │
└──────────────────────────────────────────────────┘
```

**Penggunaan:**
- FR-20: Tambah/batalkan item sebelum dikonfirmasi
- FR-22: Filter hanya produk dengan inventory > 0
- FR-29: Hitung total dari subtotal (qty × price)

---

### 3. **cashier_sessions** - Session Kerja Kasir
Tracking sesi kerja kasir untuk pemisahan transaksi per session

```
┌──────────────────────────────────────────────────┐
│ cashier_sessions                                 │
├──────────────────────────────────────────────────┤
│ session_id (PK)     bigint AUTO_INCREMENT        │
│ kasir_id (FK)       int → users.user_id          │
│ opened_at           timestamp                    │
│ closed_at           timestamp NULL               │
│ status              enum (active, closed)        │
│ opening_balance     decimal(12,2)                │
│ closing_balance     decimal(12,2) NULL           │
└──────────────────────────────────────────────────┘
```

**Penggunaan:**
- FR-28: Melihat riwayat transaksi dalam session aktif
- Track total transaksi per session untuk rekonsiliasi
- Support multiple kasir dengan session terpisah

---

### 4. **transactions** - Data Transaksi Pembayaran
Menyimpan data pembayaran untuk setiap pesanan

```
┌──────────────────────────────────────────────────────┐
│ transactions                                         │
├──────────────────────────────────────────────────────┤
│ transaction_id (PK) bigint AUTO_INCREMENT            │
│ order_id (FK)       bigint → orders.order_id NULL    │
│ kasir_id (FK)       int → users.user_id              │
│ session_id (FK)     bigint → cashier_sessions        │
│ total_amount        decimal(12,2)                    │
│ payment_method      enum (cash, qris, transfer)      │
│ payment_status      enum (pending, completed,        │
│                          cancelled)                  │
│ amount_paid         decimal(12,2)                    │
│ change_amount       decimal(12,2) (auto-calc)        │
│ reference_number    varchar(255) [QRIS/Transfer]     │
│ notes               text                             │
│ created_at          timestamp                        │
│ updated_at          timestamp                        │
└──────────────────────────────────────────────────────┘
```

**Penggunaan:**
- FR-26: Proses pembayaran (cash/QRIS/transfer)
- FR-27: Data untuk struk digital
- FR-28: Riwayat transaksi dalam session
- FR-34: Laporan keuangan berdasarkan data transaksi

---

### 5. **receipts** - Struk Digital
Menyimpan struk digital untuk setiap transaksi

```
┌──────────────────────────────────────────────────┐
│ receipts                                         │
├──────────────────────────────────────────────────┤
│ receipt_id (PK)     bigint AUTO_INCREMENT        │
│ transaction_id (FK) bigint → transactions        │
│ receipt_number      varchar(50) UNIQUE           │
│ table_id (FK)       bigint → tables NULL         │
│ items_detail        json                         │
│ subtotal            decimal(12,2)                │
│ discount            decimal(12,2)                │
│ total               decimal(12,2)                │
│ amount_paid         decimal(12,2)                │
│ change              decimal(12,2)                │
│ payment_method      enum (cash, qris, transfer) │
│ notes               text                         │
│ created_at          timestamp                    │
│ updated_at          timestamp                    │
└──────────────────────────────────────────────────┘
```

**Penggunaan:**
- FR-27: Cetak/kirim struk dengan detail lengkap
- items_detail: JSON array berisi [{ product, qty, price, subtotal }]
- Trace pembayaran dan detail pesanan untuk customer

---

### 6. **inventory** - Stok Produk Siap Jual
Tracking stok barang jadi yang siap dijual

```
┌──────────────────────────────────────────────────┐
│ inventory                                        │
├──────────────────────────────────────────────────┤
│ inventory_id (PK)   bigint AUTO_INCREMENT        │
│ product_id (FK)     bigint → products UNIQUE     │
│ stock_quantity      int                          │
│ minimum_threshold   int DEFAULT 5                │
│ maximum_threshold   int DEFAULT 100              │
│ status              enum (available, low_stock,  │
│                          out_of_stock)           │
│ created_at          timestamp                    │
│ updated_at          timestamp                    │
└──────────────────────────────────────────────────┘
```

**Penggunaan:**
- FR-22: Filter produk yang tersedia (qty > 0)
- FR-31: Kurangi stok saat produk langsung jual dipesan
- FR-32: Nonaktifkan produk otomatis jika stok = 0
- FR-33: Notifikasi jika mencapai minimum_threshold

---

### 7. **stock_notifications** - Notifikasi Stok Bahan Baku
Untuk tracking dan notifikasi minimum stok bahan baku

```
┌──────────────────────────────────────────────────────┐
│ stock_notifications                                  │
├──────────────────────────────────────────────────────┤
│ notification_id (PK) bigint AUTO_INCREMENT           │
│ ingredient_id (FK)   bigint → ingredients            │
│ minimum_threshold    decimal(12,2)                   │
│ status               enum (active, inactive,         │
│                           triggered)                 │
│ last_notified_at     timestamp NULL                  │
│ created_at           timestamp                       │
│ updated_at           timestamp                       │
└──────────────────────────────────────────────────────┘
```

**Penggunaan:**
- FR-30: Kurangi stok bahan baku berdasarkan resep
- FR-33: Notifikasi Owner/Admin jika stok minimum tercapai
- Prevent over-ordering dan waste

---

### 8. **activity_logs** - Log Aktivitas
Untuk audit trail dan tracking aktivitas user

```
┌──────────────────────────────────────────────────┐
│ activity_logs                                    │
├──────────────────────────────────────────────────┤
│ log_id (PK)         bigint AUTO_INCREMENT        │
│ user_id (FK)        int → users.user_id          │
│ action              varchar(255)                 │
│ entity_type         varchar(100) NULL            │
│ entity_id           bigint NULL                  │
│ old_values          json NULL                    │
│ new_values          json NULL                    │
│ ip_address          varchar(45)                  │
│ created_at          timestamp                    │
│ updated_at          timestamp                    │
└──────────────────────────────────────────────────┘
```

**Penggunaan:**
- Track semua perubahan order, transaksi, inventory
- Compliance dan audit trail
- Contoh: `{action: 'edit_order', entity_type: 'order', entity_id: 5, old_values: {status: 'pending'}, new_values: {status: 'confirmed'}}`

---

## Relasi Antar Tabel

```
                     ┌─────────────────┐
                     │     users       │
                     └────────┬────────┘
                              │
                   ┌──────────┼──────────┐
                   │          │          │
          ┌────────▼─────┐  ┌─┴────────────┐  ┌──────────────┐
          │   orders     │  │ transactions │  │ cashier_     │
          │ (waitres_id) │  │ (kasir_id)   │  │ sessions     │
          └────────┬─────┘  └─┬────────┬───┘  └──────────────┘
                   │          │        │
        ┌──────────▼────┐  ┌──┴────┐  │
        │  order_items  │  │orders │  │
        │               │  └───────┘  │
        └────────┬──────┘             │
                 │                    │
        ┌────────▼──────┐         ┌───▼────────┐
        │  products     │         │   receipts │
        │               │         │            │
        └────────┬──────┘         └────────────┘
                 │
        ┌────────▼──────────┐
        │   inventory       │
        │ (stok produk)     │
        └──────────────────┘

        ┌──────────────────────┐
        │  ingredients         │
        │  (bahan baku)        │
        └──────────┬───────────┘
                   │
        ┌──────────▼────────────────────┐
        │  stock_notifications          │
        │  (notifikasi minimum stok)    │
        └───────────────────────────────┘
```

---

## Functional Requirements Mapping

| FR # | Requirement | Table(s) | Implementation |
|------|-------------|----------|----------------|
| FR-17 | Waitres login | users | Authenticate via email/password (existing) |
| FR-18 | Lihat daftar meja & status | orders, tables, active_orders_view | Query view untuk meja dengan order aktif |
| FR-19 | Input pesanan per meja | orders, order_items | INSERT ke orders + order_items |
| FR-20 | Tambah/batalkan item | order_items | INSERT/UPDATE status before confirmed |
| FR-21 | Kirim pesanan ke kasir | orders | UPDATE orders.status = 'confirmed' |
| FR-22 | Filter produk tersedia | inventory | WHERE inventory.status = 'available' |
| FR-23 | Kasir login | users | Authenticate via email/password (existing) |
| FR-24 | Terima pesanan real-time | orders | SELECT dengan status='confirmed' + WebSocket |
| FR-25 | Edit/tambah item | order_items, transactions | UPDATE order_items before payment |
| FR-26 | Proses pembayaran | transactions, inventory | INSERT transaction, UPDATE inventory |
| FR-27 | Struk digital | receipts, transactions | Generate receipt_number, INSERT receipts |
| FR-28 | Riwayat transaksi | transactions, cashier_sessions | SELECT FROM transactions WHERE session_id=? |
| FR-29 | Hitung total otomatis | order_items | SUM(quantity * price) in order_items |
| FR-30 | Kurangi stok bahan baku | stok_bahan, recipes | Query recipes, UPDATE stok_bahan qty |
| FR-31 | Kurangi stok barang jadi | inventory | UPDATE inventory.stock_quantity -= 1 |
| FR-32 | Nonaktifkan produk | products, inventory | UPDATE products.status='inactive' |
| FR-33 | Notifikasi minimum stok | stock_notifications, ingredients | Trigger jika ingredients.qty <= threshold |
| FR-34 | Laporan keuangan | transactions, daily_sales_summary | Query view daily_sales_summary |
| FR-35 | Update real-time WebSocket | Semua | Event broadcasting pada setiap INSERT/UPDATE |

---

## Queries Penting

### 1. Daftar Meja dengan Status Pesanan (FR-18)
```sql
SELECT 
    t.table_id,
    t.table_number,
    t.capacity,
    t.status,
    o.order_id,
    o.status as order_status,
    COUNT(oi.order_item_id) as item_count,
    SUM(oi.subtotal) as total,
    u.name as waitres_name,
    TIME_FORMAT(SEC_TO_TIME(TIMESTAMPDIFF(SECOND, o.created_at, NOW())), '%H:%i:%s') as duration
FROM tables t
LEFT JOIN orders o ON t.table_id = o.table_id AND o.status NOT IN ('completed', 'cancelled')
LEFT JOIN order_items oi ON o.order_id = oi.order_id
LEFT JOIN users u ON o.waitres_id = u.user_id
GROUP BY t.table_id
ORDER BY t.table_number;
```

### 2. Daftar Pesanan Terkonfirmasi untuk Kasir (FR-24)
```sql
SELECT 
    o.order_id,
    t.table_number,
    GROUP_CONCAT(CONCAT(p.name, ' x', oi.quantity) SEPARATOR ', ') as items,
    o.total_price,
    u.name as waitres_name,
    o.created_at
FROM orders o
JOIN tables t ON o.table_id = t.table_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
JOIN users u ON o.waitres_id = u.user_id
WHERE o.status = 'confirmed'
GROUP BY o.order_id
ORDER BY o.created_at ASC;
```

### 3. Produk Tersedia untuk Waiters (FR-22)
```sql
SELECT 
    p.product_id,
    p.name,
    p.price,
    p.image,
    c.name as category,
    i.stock_quantity,
    i.status
FROM products p
JOIN categories c ON p.category_id = c.category_id
LEFT JOIN inventory i ON p.product_id = i.product_id
WHERE p.status = 'active' 
  AND (i.stock_quantity > 0 AND i.status = 'available')
ORDER BY c.name, p.name;
```

### 4. Riwayat Transaksi Kasir (FR-28)
```sql
SELECT 
    t.transaction_id,
    o.order_id,
    tb.table_number,
    t.total_amount,
    t.payment_method,
    t.amount_paid,
    t.change_amount,
    r.receipt_number,
    t.created_at
FROM transactions t
JOIN cashier_sessions cs ON t.session_id = cs.session_id
LEFT JOIN orders o ON t.order_id = o.order_id
LEFT JOIN tables tb ON o.table_id = tb.table_id
LEFT JOIN receipts r ON t.transaction_id = r.transaction_id
WHERE cs.session_id = ? AND t.payment_status = 'completed'
ORDER BY t.created_at DESC;
```

### 5. Laporan Penjualan Harian (FR-34)
```sql
SELECT 
    DATE(t.created_at) as tanggal,
    COUNT(t.transaction_id) as jumlah_transaksi,
    SUM(t.total_amount) as total_penjualan,
    SUM(CASE WHEN t.payment_method = 'cash' THEN t.total_amount ELSE 0 END) as cash,
    SUM(CASE WHEN t.payment_method = 'qris' THEN t.total_amount ELSE 0 END) as qris,
    SUM(CASE WHEN t.payment_method = 'transfer' THEN t.total_amount ELSE 0 END) as transfer,
    AVG(t.total_amount) as avg_transaksi
FROM transactions t
WHERE t.payment_status = 'completed'
  AND DATE(t.created_at) = CURDATE()
GROUP BY DATE(t.created_at);
```

---

## Panduan Implementasi

### Setup Database

1. **Run Migration Files** (Laravel)
```bash
cd backend
php artisan migrate
```

2. **Atau Run SQL File Langsung**
```bash
mysql -u root -p dbnanyang < kasir_waiters_database.sql
```

### Model Relationships (Eloquent)

**Order Model:**
```php
$order->table;        // Ambil data meja
$order->waitres;      // Ambil data waitres
$order->items;        // Ambil semua items
$order->transaction;  // Ambil data transaksi
```

**Transaction Model:**
```php
$transaction->order;      // Ambil pesanan
$transaction->kasir;      // Ambil data kasir
$transaction->session;    // Ambil session kasir
$transaction->receipt;    // Ambil struk
```

### Real-time Updates (WebSocket)

Events yang harus di-broadcast:
1. **OrderCreated** - Saat waiters buat pesanan
2. **OrderConfirmed** - Saat pesanan dikonfirmasi
3. **OrderCompleted** - Saat pesanan selesai
4. **TransactionCreated** - Saat pembayaran
5. **InventoryUpdated** - Saat stok berubah
6. **TableStatusChanged** - Saat status meja berubah

### Skenario Bisnis

**Skenario 1: Customer Order to Payment**
```
1. Waitres lihat meja tersedia (FR-18)
2. Waitres input pesanan (FR-19)
3. Waitres tambah item (FR-20)
4. Waitres konfirmasi ke kasir (FR-21)
5. Kasir terima pesanan (FR-24)
6. Kasir proses pembayaran (FR-26)
7. Sistem generate struk (FR-27)
8. Stok berkurang otomatis (FR-30, FR-31)
9. Meja status berubah ke available (automatic)
10. Laporan diupdate (FR-34)
```

---

## Notes

- Semua timestamp menggunakan UTC untuk consistency
- Foreign keys menggunakan CASCADE/RESTRICT sesuai business logic
- JSON field untuk flexibility data items_detail di receipt
- Views dibuat untuk query yang kompleks dan sering diakses
- Activity logs penting untuk audit dan compliance
- Stock notifications memerlukan scheduled job untuk real-time alert

---

Generated: 2024-06-10 | Database Version: 1.0
