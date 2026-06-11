# Setup Guide: Sistem Kasir dan Waiters Database

## 🚀 Quick Start

### Prerequisites
- MySQL 8.0+
- PHP 8.1+
- Laravel 11+
- Composer

---

## 📝 Langkah Setup

### 1. Update Database Connection

Edit file `.env` di backend folder:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dbnanyang
DB_USERNAME=root
DB_PASSWORD=
```

### 2. Run Migrations

```bash
cd backend

# Run semua migration
php artisan migrate

# Atau jika ingin rollback terlebih dahulu
php artisan migrate:refresh
```

### 3. Alternative: Import SQL Langsung

Jika prefer menggunakan SQL langsung:

```bash
# Dari command line
mysql -u root -p dbnanyang < kasir_waiters_database.sql

# Atau dari MySQL GUI (PHPMyAdmin)
# 1. Buka database dbnanyang
# 2. Import file kasir_waiters_database.sql
```

---

## 📂 File Structure

```
backend/
├── app/Models/
│   ├── Order.php                    ✅ Updated
│   ├── OrderItem.php                ✅ Updated
│   ├── Transaction.php              ✅ Updated
│   ├── CashierSession.php           ✨ NEW
│   ├── Receipt.php                  ✨ NEW
│   ├── Inventory.php                ✅ Updated
│   ├── StockNotification.php        ✨ NEW
│   ├── ActivityLog.php              ✨ NEW
│   ├── User.php                     ✅ Updated
│   ├── Product.php                  ✅ Updated
│   └── Table.php                    ✅ Updated
│
└── database/migrations/
    ├── 2024_06_08_000013_create_orders_table.php           ✨ NEW
    ├── 2024_06_08_000014_create_order_items_table.php      ✨ NEW
    ├── 2024_06_08_000015_create_cashier_sessions_table.php ✨ NEW
    ├── 2024_06_08_000016_create_transactions_table.php     ✨ NEW
    ├── 2024_06_08_000017_create_receipts_table.php         ✨ NEW
    ├── 2024_06_08_000018_create_inventory_table.php        ✨ NEW
    ├── 2024_06_08_000019_create_stock_notifications_table.php ✨ NEW
    └── 2024_06_08_000020_create_activity_logs_table.php    ✨ NEW
```

---

## 🔧 API Routes Recommendations

### Waiters Routes

```php
Route::middleware(['auth:sanctum', 'role:waitres'])->group(function () {
    // FR-18: Lihat daftar meja
    Route::get('/api/waiters/tables', 'TableController@index');
    
    // FR-19: Input pesanan
    Route::post('/api/waiters/orders', 'OrderController@store');
    
    // FR-20: Tambah/batalkan item
    Route::post('/api/waiters/orders/{order}/items', 'OrderItemController@store');
    Route::delete('/api/waiters/orders/{order}/items/{item}', 'OrderItemController@destroy');
    Route::patch('/api/waiters/orders/{order}/items/{item}', 'OrderItemController@update');
    
    // FR-21: Konfirmasi pesanan ke kasir
    Route::patch('/api/waiters/orders/{order}/confirm', 'OrderController@confirm');
    
    // FR-22: Lihat produk tersedia
    Route::get('/api/waiters/products/available', 'ProductController@available');
});
```

### Cashier Routes

```php
Route::middleware(['auth:sanctum', 'role:kasir'])->group(function () {
    // FR-24: Lihat pesanan terkonfirmasi
    Route::get('/api/cashier/orders/pending', 'OrderController@pendingOrders');
    
    // FR-25: Edit order items
    Route::patch('/api/cashier/orders/{order}/items/{item}', 'OrderItemController@update');
    Route::post('/api/cashier/orders/{order}/items', 'OrderItemController@store');
    
    // FR-26: Proses pembayaran
    Route::post('/api/cashier/transactions', 'TransactionController@store');
    
    // FR-27: Generate struk
    Route::get('/api/cashier/receipts/{receipt}', 'ReceiptController@show');
    Route::post('/api/cashier/receipts/{receipt}/print', 'ReceiptController@print');
    
    // FR-28: Riwayat transaksi
    Route::get('/api/cashier/sessions/active', 'CashierSessionController@active');
    Route::get('/api/cashier/transactions', 'TransactionController@index');
    
    // Session management
    Route::post('/api/cashier/sessions', 'CashierSessionController@open');
    Route::patch('/api/cashier/sessions/{session}/close', 'CashierSessionController@close');
});
```

### Owner Routes

```php
Route::middleware(['auth:sanctum', 'role:owner'])->group(function () {
    // FR-33: Stock notifications
    Route::get('/api/owner/notifications', 'NotificationController@index');
    
    // FR-34: Financial reports
    Route::get('/api/owner/reports/daily', 'ReportController@daily');
    Route::get('/api/owner/reports/monthly', 'ReportController@monthly');
});
```

---

## 🔌 WebSocket Events (FR-35)

Menggunakan Laravel Broadcasting dengan Pusher/Redis:

### Events to Broadcast

```php
// app/Events/OrderCreated.php
class OrderCreated implements ShouldBroadcast {
    public function broadcastOn() {
        return new Channel('orders');
    }
}

// app/Events/OrderConfirmed.php
class OrderConfirmed implements ShouldBroadcast {
    public function broadcastOn() {
        return new Channel('cashier');
    }
}

// app/Events/TransactionCompleted.php
class TransactionCompleted implements ShouldBroadcast {
    public function broadcastOn() {
        return new Channel('tables');
    }
}

// app/Events/InventoryUpdated.php
class InventoryUpdated implements ShouldBroadcast {
    public function broadcastOn() {
        return new Channel('inventory');
    }
}
```

### Frontend Subscription (Next.js)

```javascript
// lib/websocket.ts
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

// Waiters listening
echo.channel('orders')
    .listen('OrderCreated', (data) => {
        // Update table list
    });

// Cashier listening
echo.channel('cashier')
    .listen('OrderConfirmed', (data) => {
        // Show new pending order
    });
```

---

## 🗄️ Database Indexes

Sudah dibuat otomatis, tapi verify:

```sql
-- Verify indexes
SHOW INDEX FROM orders;
SHOW INDEX FROM transactions;
SHOW INDEX FROM receipts;
SHOW INDEX FROM inventory;
```

Key indexes:
- `orders`: table_id, waitres_id, status, created_at
- `transactions`: order_id, kasir_id, session_id, payment_method
- `order_items`: order_id, product_id

---

## 🎯 Business Logic Implementation

### 1. Automatic Stock Reduction (FR-30, FR-31)

```php
// app/Services/OrderService.php
class OrderService {
    public function confirmOrder(Order $order) {
        // Loop through order items
        foreach ($order->items as $item) {
            // Reduce inventory (FR-31)
            $inventory = $item->product->inventory;
            $inventory->updateStock(-$item->quantity);
            
            // Reduce ingredients (FR-30)
            foreach ($item->product->recipes as $recipe) {
                $ingredient = $recipe->ingredient;
                $newQty = $ingredient->qty - ($recipe->quantity * $item->quantity);
                $ingredient->update(['qty' => $newQty]);
                
                // Check if need notification (FR-33)
                $this->checkStockNotification($ingredient);
            }
        }
        
        $order->status = 'confirmed';
        $order->save();
    }
    
    private function checkStockNotification(Ingredient $ingredient) {
        $notification = StockNotification::where('ingredient_id', $ingredient->ingredient_id)->first();
        if ($notification && $ingredient->qty <= $notification->minimum_threshold) {
            // Send notification to owner
            event(new StockLowNotification($notification));
        }
    }
}
```

### 2. Auto Deactivate Product (FR-32)

```php
// app/Observers/InventoryObserver.php
class InventoryObserver {
    public function updated(Inventory $inventory) {
        if ($inventory->stock_quantity <= 0) {
            $inventory->product->update(['status' => 'inactive']);
            $inventory->status = 'out_of_stock';
            $inventory->save();
        }
    }
}
```

### 3. Receipt Generation (FR-27)

```php
// app/Services/ReceiptService.php
class ReceiptService {
    public function generateReceipt(Transaction $transaction) {
        $receipt = Receipt::create([
            'transaction_id' => $transaction->transaction_id,
            'receipt_number' => Receipt::generateReceiptNumber(),
            'table_id' => $transaction->order->table_id,
            'items_detail' => json_encode(
                $transaction->order->items->map(function($item) {
                    return [
                        'product' => $item->product->name,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'subtotal' => $item->subtotal,
                    ];
                })
            ),
            'subtotal' => $transaction->total_amount,
            'discount' => 0,
            'total' => $transaction->total_amount,
            'amount_paid' => $transaction->amount_paid,
            'change' => $transaction->change_amount,
            'payment_method' => $transaction->payment_method,
        ]);
        
        return $receipt;
    }
}
```

---

## 📊 Testing Checklist

- [ ] Login untuk 3 role (owner, kasir, waitres)
- [ ] Waitres bisa lihat meja & create order
- [ ] Waiters bisa add/remove item
- [ ] Kasir bisa terima order & process payment
- [ ] Struk di-generate dengan benar
- [ ] Stok berkurang otomatis
- [ ] Product di-nonaktifkan saat stok habis
- [ ] Notification terkirim ke owner
- [ ] Real-time updates via WebSocket
- [ ] Activity logs recorded correctly
- [ ] Financial reports working

---

## 🐛 Troubleshooting

### Migration Error
```bash
# Check migration status
php artisan migrate:status

# Rollback last batch
php artisan migrate:rollback

# Fresh migrate
php artisan migrate:refresh
```

### Foreign Key Constraint Error
```sql
-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS=0;

-- Then enable again
SET FOREIGN_KEY_CHECKS=1;
```

### WebSocket Not Working
```bash
# Check if Pusher/Redis is running
# Verify .env configuration
# Check Laravel broadcasting config
php artisan config:cache
```

---

## 📚 Additional Resources

- [Laravel Eloquent Relations](https://laravel.com/docs/11.x/eloquent-relationships)
- [Laravel Migrations](https://laravel.com/docs/11.x/migrations)
- [Laravel Broadcasting](https://laravel.com/docs/11.x/broadcasting)
- [Database Documentation](./DATABASE_DOCUMENTATION.md)

---

**Last Updated:** 2024-06-10
**Database Version:** 1.0
