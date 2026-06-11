<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/users', [AuthController::class, 'index']);


use App\Http\Controllers\Api\ProductController;
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

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

use App\Http\Controllers\Api\TransactionController;
Route::get('/transactions', [TransactionController::class, 'index']);
Route::post('/transactions', [TransactionController::class, 'store']);
Route::get('/transactions/{id}', [TransactionController::class, 'show']);
Route::get('/transactions/daily-summary', [TransactionController::class, 'dailySummary']);

use App\Http\Controllers\Api\DashboardController;
Route::get('/dashboard', [DashboardController::class, 'index']);
Route::get('/sales-chart', [DashboardController::class, 'salesChart']);