<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductionController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\RecipeController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TableController;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::middleware(['auth:sanctum', 'role:owner'])->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/users', [AuthController::class, 'index']);
    Route::put('/users/{id}', [AuthController::class, 'update']);
    Route::delete('/users/{id}', [AuthController::class, 'destroy']);

    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::get('/products/production', [ProductController::class, 'productionProducts']);

    Route::get('/productions', [ProductionController::class, 'index']);
    Route::get('/productions/{id}', [ProductionController::class, 'index']);
    Route::put('/productions/{id}', [ProductionController::class, 'update']);
    Route::post('/productions', [ProductionController::class, 'store']);
    Route::get('/productions/today', [ProductionController::class, 'today']);
    Route::delete('/productions/{id}', [ProductionController::class, 'destroy']);

    Route::get('/reports', [ReportController::class, 'index']);
    Route::get('/reports/summary', [ReportController::class, 'summary']);
    Route::get('/reports/orders', [ReportController::class, 'orders']);

    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/sales-chart', [DashboardController::class, 'salesChart']);
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
    Route::get('/dashboard/orders', [DashboardController::class, 'orders']);

    Route::get('/inventory', [InventoryController::class, 'index']);
    Route::post('/inventory', [InventoryController::class, 'store']);
    Route::put('/inventory/{id}', [InventoryController::class, 'update']);
    Route::delete('/inventory/{id}', [InventoryController::class, 'destroy']);
    Route::put('/inventory/{id}/stock', [InventoryController::class, 'updateStock']);


    Route::get('/recipes', [RecipeController::class,'index']);
    Route::post('/recipes', [RecipeController::class,'store']);
    Route::put('/recipes/{productId}', [RecipeController::class, 'update']);
    Route::delete('/recipes/{productId}', [RecipeController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}/products', [CategoryController::class, 'getProducts']);

    Route::get('/tables', [TableController::class, 'index']);
    Route::get('/tables/{id}', [TableController::class, 'show']);
    Route::put('/tables/{id}/status', [TableController::class, 'updateStatus']);
    Route::get('/tables/status/available', [TableController::class, 'getAvailableTables']);
    Route::get('/tables/status/occupied', [TableController::class, 'getOccupiedTables']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);
    Route::delete('/orders/{id}', [OrderController::class, 'destroy']);
    Route::get('/orders/table/{table_id}/active', [OrderController::class, 'getTableActiveOrder']);
    Route::get('/occupied-tables', [OrderController::class, 'occupiedTables']);
    Route::get('/orders/{id}/receipt', [OrderController::class, 'receipt']);
    Route::put('/orders/{id}/items',[OrderController::class,'updateItems']);

});

Route::middleware(['auth:sanctum', 'role:owner,kasir'])->group(function () {
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::get('/transactions/{id}', [TransactionController::class, 'show']);
    Route::get('/transactions/daily-summary', [TransactionController::class, 'dailySummary']);
    Route::get('/transactions/{id}/download', [TransactionController::class, 'downloadReceipt']);

});

Route::middleware(['auth:sanctum', 'role:kasir'])->group(function () {
    Route::post('/payment', [PaymentController::class,'create']);

});


    Route::post('/payment/notification', [PaymentController::class,'notification']);


