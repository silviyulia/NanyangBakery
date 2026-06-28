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

public function summary()
{
    $produkTerlaris = OrderItem::join(
            'products',
            'order_items.product_id',
            '=',
            'products.product_id'
        )
        ->select(
            'products.name',
            DB::raw('SUM(order_items.quantity) as total_qty')
        )
        ->groupBy('products.name')
        ->orderByDesc('total_qty')
        ->first();

    return response()->json([
        'totalPendapatan' => Order::sum('total_amount'),
        'totalTransaksi' => Order::count(),
        'totalProduk' => OrderItem::sum('quantity'),
        'produkTerlaris' => $produkTerlaris
            ? $produkTerlaris->name
            : '-',
    ]);
}

 public function orders()
{
    $orders = Order::with('table')
        ->select(
            'id',
            'table_id',
            'kasir_id',
            'total_amount',
            'created_at'
        )
        ->latest()
        ->get()
        ->map(function ($order) {
            return [
                'id' => '#' . $order->id,
                'tanggal' => $order->created_at->format('d/m/Y H:i'),
                'meja' => 'Meja ' . ($order->table->table_number ?? '-'),
                'items' => OrderItem::where('order_id', $order->id)
                    ->sum('quantity'),
                'total' => $order->total_amount,
            ];
        });

    return response()->json($orders);
}

}