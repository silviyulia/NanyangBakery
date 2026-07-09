<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/users', [AuthController::class, 'index']);
Route::put('/users/{id}', [AuthController::class, 'update']);
Route::delete('/users/{id}', [AuthController::class, 'destroy']);


use App\Http\Controllers\Api\ProductController;
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
Route::get('/products/production', [ProductController::class, 'productionProducts']);

use App\Http\Controllers\Api\CategoryController;
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}/products', [CategoryController::class, 'getProducts']);

use App\Http\Controllers\Api\TableController;
Route::get('/tables', [TableController::class, 'index']);
Route::get('/tables/{id}', [TableController::class, 'show']);
Route::put('/tables/{id}/status', [TableController::class, 'updateStatus']);
Route::get('/tables/status/available', [TableController::class, 'getAvailableTables']);
Route::get('/tables/status/occupied', [TableController::class, 'getOccupiedTables']);

use App\Http\Controllers\Api\OrderController;
Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::put('/orders/{id}', [OrderController::class, 'update']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);
Route::get('/orders/table/{table_id}/active', [OrderController::class, 'getTableActiveOrder']);
Route::get('/occupied-tables', [OrderController::class, 'occupiedTables']);
Route::get('/orders/{id}/receipt', [OrderController::class, 'receipt']);
Route::put('/orders/{id}/items',[OrderController::class,'updateItems']);

use App\Http\Controllers\Api\TransactionController;
Route::get('/transactions', [TransactionController::class, 'index']);
Route::post('/transactions', [TransactionController::class, 'store']);
Route::get('/transactions/{id}', [TransactionController::class, 'show']);
Route::get('/transactions/daily-summary', [TransactionController::class, 'dailySummary']);
Route::get('/transactions/{id}/download', [TransactionController::class, 'downloadReceipt']);

use App\Http\Controllers\Api\DashboardController;
Route::get('/dashboard', [DashboardController::class, 'index']);
Route::get('/sales-chart', [DashboardController::class, 'salesChart']);
Route::get('/reports/summary', [DashboardController::class, 'summary']);
Route::get('/reports/orders', [DashboardController::class, 'orders']);

use App\Http\Controllers\Api\ReportController;
Route::get('/reports', [ReportController::class, 'index']);
Route::get('/reports/summary', [ReportController::class, 'summary']);
Route::get('/reports/orders', [ReportController::class, 'orders']);

use App\Http\Controllers\Api\ProductionController;
Route::get('/productions', [ProductionController::class, 'index']);
Route::get('/productions/{id}', [ProductionController::class, 'index']);
Route::put('/productions/{id}', [ProductionController::class, 'update']);
Route::post('/productions', [ProductionController::class, 'store']);
Route::get('/productions/today', [ProductionController::class, 'today']);
Route::delete('/productions/{id}', [ProductionController::class, 'destroy']);

use App\Http\Controllers\Api\InventoryController;
Route::get('/inventory', [InventoryController::class, 'index']);
Route::post('/inventory', [InventoryController::class, 'store']);
Route::put('/inventory/{id}', [InventoryController::class, 'update']);
Route::delete('/inventory/{id}', [InventoryController::class, 'destroy']);
Route::put('/inventory/{id}/stock', [InventoryController::class, 'updateStock']);

use App\Http\Controllers\Api\RecipeController;
Route::get('/recipes', [RecipeController::class,'index']);
Route::post('/recipes', [RecipeController::class,'store']);
Route::put('/recipes/{productId}', [RecipeController::class, 'update']);
Route::delete('/recipes/{productId}', [RecipeController::class, 'destroy']);

use App\Http\Controllers\Api\PaymentController;
Route::post('/payment', [PaymentController::class,'create']);
Route::post('/payment/notification', [PaymentController::class,'notification']);
