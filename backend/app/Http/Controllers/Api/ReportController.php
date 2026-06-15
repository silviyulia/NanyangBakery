<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        $data = OrderItem::join(
                'products',
                'order_items.product_id',
                '=',
                'products.product_id'
            )
            ->join(
                'orders',
                'order_items.order_id',
                '=',
                'orders.id'
            )
->select(
    DB::raw('ROW_NUMBER() OVER () as id'),
    'products.name as produk',
    DB::raw('SUM(order_items.quantity) as jumlah'),
    DB::raw('SUM(order_items.subtotal) as total'),
    DB::raw('DATE(orders.created_at) as tanggal')
)
            
            ->groupBy(
                'products.name',
                DB::raw('DATE(orders.created_at)')
            )
            ->get();

        return response()->json($data);
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