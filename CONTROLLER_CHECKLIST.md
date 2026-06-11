# 🎯 Implementation Checklist - Controllers & API Endpoints

## 📋 Phase 1: Core Setup ✅ COMPLETED

- [x] Database schema designed
- [x] Migration files created
- [x] Eloquent models created
- [x] Relationships defined
- [x] Database documentation completed

---

## 📋 Phase 2: API Development

### Waiters Functionality

#### FR-17: Login
- [ ] Create `AuthController@login`
- [ ] Validate email/password
- [ ] Return JWT/Sanctum token
- [ ] Log activity (ActivityLog)
- [ ] Test: POST `/api/auth/login`

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "waitres@gmail.com",
  "password": "password"
}

Response:
{
  "token": "...",
  "user": { "user_id": 3, "name": "Waitres", "role": "waitres" }
}
```

#### FR-18: Lihat Daftar Meja
- [ ] Create `TableController@index` with orders
- [ ] Query: tables + active orders + items count
- [ ] Return table status with order summary
- [ ] Test: GET `/api/waiters/tables`

```bash
GET /api/waiters/tables

Response:
[
  {
    "table_id": 1,
    "table_number": "1",
    "capacity": 4,
    "status": "available",
    "order": null,
    "items_count": 0
  },
  {
    "table_id": 2,
    "table_number": "2",
    "capacity": 4,
    "status": "occupied",
    "order": {
      "order_id": 1,
      "status": "pending",
      "items_count": 3,
      "total_price": 125000
    }
  }
]
```

#### FR-19: Input Pesanan
- [ ] Create `OrderController@store`
- [ ] Validate table_id exists & available
- [ ] Create order record
- [ ] Log activity
- [ ] Broadcast OrderCreated event
- [ ] Test: POST `/api/waiters/orders`

```bash
POST /api/waiters/orders
Content-Type: application/json

{
  "table_id": 2
}

Response:
{
  "order_id": 1,
  "table_id": 2,
  "waitres_id": 3,
  "status": "pending",
  "total_price": 0,
  "created_at": "2024-06-10T10:00:00Z"
}
```

#### FR-20: Tambah/Batalkan Item
- [ ] Create `OrderItemController@store` - Add item
- [ ] Create `OrderItemController@destroy` - Remove item
- [ ] Create `OrderItemController@update` - Change quantity
- [ ] Validate product exists & available
- [ ] Validate order status is pending
- [ ] Auto-calculate subtotal
- [ ] Update parent order total
- [ ] Test: POST/DELETE/PATCH `/api/waiters/orders/{order}/items`

```bash
# Add item
POST /api/waiters/orders/1/items
{
  "product_id": 6,
  "quantity": 2
}

# Remove item
DELETE /api/waiters/orders/1/items/5

# Update quantity
PATCH /api/waiters/orders/1/items/5
{
  "quantity": 3
}
```

#### FR-21: Konfirmasi Pesanan ke Kasir
- [ ] Create `OrderController@confirm`
- [ ] Validate order has items
- [ ] Update status to 'confirmed'
- [ ] Broadcast OrderConfirmed event
- [ ] Update table status to 'occupied'
- [ ] Log activity
- [ ] Test: PATCH `/api/waiters/orders/{order}/confirm`

```bash
PATCH /api/waiters/orders/1/confirm

Response:
{
  "order_id": 1,
  "status": "confirmed",
  "message": "Pesanan telah dikirim ke kasir"
}
```

#### FR-22: Filter Produk Tersedia
- [ ] Create `ProductController@available`
- [ ] Join with inventory table
- [ ] Filter where status='available' AND stock_quantity > 0
- [ ] Include category info
- [ ] Test: GET `/api/waiters/products/available`

```bash
GET /api/waiters/products/available

Response:
[
  {
    "product_id": 6,
    "name": "Croissant",
    "price": 30000,
    "category": "Roti & Pastry",
    "stock": 15,
    "image": "..."
  },
  {
    "product_id": 7,
    "name": "Chocolate Cake",
    "price": 35000,
    "category": "Kue & Cake",
    "stock": 8,
    "image": "..."
  }
]
```

---

### Cashier Functionality

#### FR-23: Login
- [ ] Reuse `AuthController@login` (same as waiters)
- [ ] Validate role='kasir'
- [ ] Create CashierSession automatically on first action
- [ ] Test: POST `/api/auth/login`

#### FR-24: Terima Pesanan Real-time
- [ ] Create `OrderController@pendingOrders`
- [ ] Query orders with status='confirmed' + items detail
- [ ] Order by created_at ascending (FIFO)
- [ ] Include waitres name & table info
- [ ] Real-time via WebSocket channel 'cashier'
- [ ] Test: GET `/api/cashier/orders/pending`

```bash
GET /api/cashier/orders/pending

Response:
[
  {
    "order_id": 1,
    "table_number": "2",
    "waitres_name": "Waitres",
    "items": [
      { "name": "Croissant", "quantity": 2, "price": 30000, "subtotal": 60000 }
    ],
    "total_price": 60000,
    "created_at": "2024-06-10T10:00:00Z"
  }
]
```

#### FR-25: Edit/Tambah Item
- [ ] Reuse OrderItemController (same endpoints)
- [ ] Additional validation: order must exist (not yet payment)
- [ ] Check: order.status != 'completed'
- [ ] Log changes with old/new values in ActivityLog
- [ ] Test: PATCH/POST `/api/cashier/orders/{order}/items`

#### FR-26: Proses Pembayaran
- [ ] Create `TransactionController@store`
- [ ] Validate order_id & cashier has active session
- [ ] Validate payment_method is valid
- [ ] Calculate change amount for cash payments
- [ ] Reduce inventory for each order item
- [ ] Reduce ingredient stock based on recipes (FR-30)
- [ ] Update product status if needed (FR-32)
- [ ] Emit TransactionCompleted event
- [ ] Log activity
- [ ] Test: POST `/api/cashier/transactions`

```bash
POST /api/cashier/transactions
{
  "order_id": 1,
  "payment_method": "cash",
  "amount_paid": 100000
}

Response:
{
  "transaction_id": 1,
  "order_id": 1,
  "total_amount": 60000,
  "amount_paid": 100000,
  "change_amount": 40000,
  "payment_method": "cash",
  "payment_status": "completed",
  "receipt_id": 1
}
```

#### FR-27: Cetak/Kirim Struk
- [ ] Create `ReceiptController@show` - Get receipt data
- [ ] Create `ReceiptController@print` - Format for printing
- [ ] Create `ReceiptController@email` - Send via email (optional)
- [ ] Auto-generate receipt_number (RCP + timestamp + sequence)
- [ ] Format items_detail JSON for display
- [ ] Include all payment details
- [ ] Test: GET/POST `/api/cashier/receipts/{receipt}`

```bash
GET /api/cashier/receipts/1

Response:
{
  "receipt_id": 1,
  "receipt_number": "RCP20240610100000001",
  "table_number": "2",
  "items": [
    { "product": "Croissant", "quantity": 2, "price": 30000, "subtotal": 60000 }
  ],
  "subtotal": 60000,
  "discount": 0,
  "total": 60000,
  "amount_paid": 100000,
  "change": 40000,
  "payment_method": "cash",
  "created_at": "2024-06-10T10:05:00Z"
}
```

#### FR-28: Riwayat Transaksi
- [ ] Create `TransactionController@index`
- [ ] Get active cashier session automatically
- [ ] Filter by session_id & payment_status='completed'
- [ ] Include order & table info
- [ ] Order by created_at descending
- [ ] Test: GET `/api/cashier/transactions`

```bash
GET /api/cashier/transactions

Response:
[
  {
    "transaction_id": 1,
    "order_id": 1,
    "table_number": "2",
    "total_amount": 60000,
    "payment_method": "cash",
    "amount_paid": 100000,
    "change_amount": 40000,
    "receipt_number": "RCP20240610100000001",
    "created_at": "2024-06-10T10:05:00Z"
  }
]
```

#### Cashier Session Management
- [ ] Create `CashierSessionController@show` - Get active session
- [ ] Create `CashierSessionController@open` - Open new session
- [ ] Create `CashierSessionController@close` - Close session
- [ ] Validate only one active session per cashier
- [ ] Calculate total transactions in session on close
- [ ] Test: POST/PATCH `/api/cashier/sessions`

```bash
POST /api/cashier/sessions
{
  "opening_balance": 500000
}

Response:
{
  "session_id": 1,
  "kasir_id": 2,
  "status": "active",
  "opening_balance": 500000,
  "opened_at": "2024-06-10T09:00:00Z"
}

PATCH /api/cashier/sessions/1/close
{
  "closing_balance": 650000
}
```

---

### Owner Functionality

#### FR-33: Notifikasi Stok Minimum
- [ ] Create notification check job (Laravel Job)
- [ ] Query stock_notifications where status='active'
- [ ] Compare ingredient qty vs minimum_threshold
- [ ] Trigger notification if threshold reached
- [ ] Send via email/in-app notification
- [ ] Test: Artisan command `/api/owner/notifications`

#### FR-34: Laporan Keuangan
- [ ] Create `ReportController@daily`
- [ ] Use daily_sales_summary view
- [ ] Include total, cash, qris, transfer breakdown
- [ ] Optional filters: date range, payment method
- [ ] Test: GET `/api/owner/reports/daily`

```bash
GET /api/owner/reports/daily?date=2024-06-10

Response:
{
  "date": "2024-06-10",
  "total_transactions": 25,
  "total_orders": 25,
  "total_revenue": 1500000,
  "cash": 800000,
  "qris": 500000,
  "transfer": 200000,
  "active_cashiers": 2,
  "total_change": 150000
}
```

#### FR-35: Real-time WebSocket Updates
- [ ] Setup Laravel Broadcasting with Pusher/Redis
- [ ] Create Events:
  - [ ] OrderCreated
  - [ ] OrderConfirmed
  - [ ] OrderCompleted
  - [ ] TransactionCompleted
  - [ ] InventoryUpdated
  - [ ] TableStatusChanged
- [ ] Broadcast to appropriate channels
- [ ] Test: Subscribe to channels & verify events

```php
// In OrderController@confirm
event(new OrderConfirmed($order));

// In TransactionController@store
event(new TransactionCompleted($transaction));
event(new InventoryUpdated($inventory));
```

---

## 📋 Phase 3: Business Logic Services

### Service Classes to Create

#### OrderService
- [ ] `confirmOrder()` - Set status to confirmed
- [ ] `completeOrder()` - Set status to completed
- [ ] `cancelOrder()` - Set status to cancelled
- [ ] `calculateTotal()` - Sum order items
- [ ] `validateOrder()` - Check if order is valid for confirmation

#### TransactionService
- [ ] `processPayment()` - Create transaction
- [ ] `reduceInventory()` - Decrease product stock
- [ ] `reduceIngredients()` - Decrease raw materials based on recipes
- [ ] `checkProductAvailability()` - Check if product can be deactivated
- [ ] `generateReceipt()` - Create receipt record

#### InventoryService
- [ ] `updateStock()` - Update product inventory
- [ ] `checkStockStatus()` - Determine available/low_stock/out_of_stock
- [ ] `checkMinimumThreshold()` - Trigger notifications
- [ ] `deactivateProduct()` - Auto-deactivate if stock = 0

#### NotificationService
- [ ] `checkLowStockAlerts()` - Check all ingredients
- [ ] `sendToOwner()` - Send notification to owner/admin
- [ ] `updateStatus()` - Mark notification as triggered/sent

---

## 📋 Phase 4: Testing

### Unit Tests
- [ ] OrderItem subtotal calculation
- [ ] Transaction change amount calculation
- [ ] Inventory stock update logic
- [ ] Product availability checking
- [ ] Receipt number generation

### Feature Tests
- [ ] Complete order flow (create → items → confirm → payment)
- [ ] Payment processing with different methods
- [ ] Inventory reduction workflow
- [ ] Ingredient stock tracking
- [ ] Activity logging

### API Tests
- [ ] All endpoints return correct HTTP status codes
- [ ] Authentication & authorization working
- [ ] Input validation
- [ ] Error handling
- [ ] Pagination (if applicable)

---

## 🗺️ Controller File Structure (to Create)

```
backend/app/Http/Controllers/

Shared/
├── AuthController.php              [FR-17, FR-23]
├── ProductController.php            [FR-22]
└── TableController.php              [FR-18]

Waiters/
├── OrderController.php              [FR-19, FR-21]
└── OrderItemController.php          [FR-20]

Cashier/
├── OrderController.php              [FR-24, FR-25]
├── OrderItemController.php          [FR-25]
├── TransactionController.php        [FR-26]
├── ReceiptController.php            [FR-27]
├── CashierSessionController.php     [Session Management]
└── TransactionHistoryController.php [FR-28]

Owner/
├── ReportController.php             [FR-34]
├── NotificationController.php       [FR-33]
└── DashboardController.php          [Owner Dashboard]
```

---

## 🔗 Routes Structure (to Create)

```php
// api.php

// Authentication
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Shared Resources
Route::get('/products/available', [ProductController::class, 'available']);

// Waiters Routes
Route::middleware(['auth:sanctum', 'role:waitres'])->prefix('/waiters')->group(function () {
    Route::get('/tables', [TableController::class, 'index']);
    
    Route::resource('orders', 'Waiters\OrderController')->except(['destroy']);
    Route::patch('/orders/{order}/confirm', [OrderController::class, 'confirm']);
    
    Route::resource('orders.items', 'Waiters\OrderItemController')->shallow();
});

// Cashier Routes
Route::middleware(['auth:sanctum', 'role:kasir'])->prefix('/cashier')->group(function () {
    Route::get('/orders/pending', [OrderController::class, 'pendingOrders']);
    
    Route::resource('orders', 'Cashier\OrderController')->except(['store', 'destroy']);
    Route::resource('orders.items', 'Cashier\OrderItemController')->shallow();
    
    Route::resource('transactions', TransactionController::class)->only(['store', 'index']);
    Route::get('/receipts/{receipt}', [ReceiptController::class, 'show']);
    Route::post('/receipts/{receipt}/print', [ReceiptController::class, 'print']);
    
    Route::resource('sessions', CashierSessionController::class)->only(['show', 'store']);
    Route::patch('/sessions/{session}/close', [CashierSessionController::class, 'close']);
});

// Owner Routes
Route::middleware(['auth:sanctum', 'role:owner'])->prefix('/owner')->group(function () {
    Route::get('/reports/daily', [ReportController::class, 'daily']);
    Route::get('/reports/monthly', [ReportController::class, 'monthly']);
    
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{notification}', [NotificationController::class, 'markAsRead']);
});
```

---

## ✅ Validation Rules (to Create)

### Order Validation
```php
'table_id' => 'required|exists:tables,table_id',
'notes' => 'nullable|string|max:500',
```

### OrderItem Validation
```php
'product_id' => 'required|exists:products,product_id',
'quantity' => 'required|integer|min:1',
```

### Transaction Validation
```php
'order_id' => 'required|exists:orders,order_id',
'payment_method' => 'required|in:cash,qris,transfer',
'amount_paid' => 'required|numeric|min:0',
'reference_number' => 'nullable|required_if:payment_method,qris',
```

---

## 📅 Recommended Implementation Order

1. **Week 1: Authentication & Setup**
   - AuthController
   - Middleware setup
   - Basic CRUD operations

2. **Week 2: Waiters Features**
   - FR-17, FR-18, FR-19, FR-20, FR-21, FR-22

3. **Week 3: Cashier Features**
   - FR-23, FR-24, FR-25, FR-26, FR-27, FR-28

4. **Week 4: Business Logic**
   - FR-29, FR-30, FR-31, FR-32, FR-33
   - Service classes
   - Event broadcasting

5. **Week 5: Owner Features & WebSocket**
   - FR-34, FR-35
   - Real-time updates

6. **Week 6: Testing & Optimization**
   - Unit & Feature tests
   - Performance optimization
   - Bug fixes

---

## 🧪 Testing Commands

```bash
# Run all tests
php artisan test

# Run specific test class
php artisan test tests/Feature/OrderControllerTest.php

# Run with coverage
php artisan test --coverage

# Create test file
php artisan make:test OrderControllerTest --feature
```

---

**Generated:** 2024-06-10  
**Status:** Ready for Implementation  
**Version:** 1.0
