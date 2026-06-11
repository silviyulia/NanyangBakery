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

//use App\Http\Controllers\Api\ProductionController;
//Route::post('/productions', [ProductionController::class, 'store']);

use App\Http\Controllers\Api\DashboardController;
Route::get('/dashboard', [DashboardController::class, 'index']);
Route::get('/sales-chart', [DashboardController::class, 'salesChart']);

use App\Http\Controllers\Api\CategoryController;
Route::get('/categories', [CategoryController::class, 'index']);

use App\Http\Controllers\Api\OrderController;
Route::get('/orders', [OrderController::class, 'index']);