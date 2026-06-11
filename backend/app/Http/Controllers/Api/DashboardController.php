<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Order;


class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_menu' => Product::count(),

            'active_employees' => 0,

            'today_revenue' => Order::whereDate('created_at', today())
                ->sum('total_amount'),

            'total_transactions' => Order::count(),

            'best_seller' => '-',

            'low_stock' => 0,

            'recent_orders' => Order::latest()
                ->take(3)
                ->get()
        ]);
    }

    public function salesChart()
{
    $sales = Order::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(total_amount) as total')
        )
        ->where('status', 'selesai')
        ->groupBy('date')
        ->orderBy('date')
        ->take(7)
        ->get();

    return response()->json($sales);
}
}