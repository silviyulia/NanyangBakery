<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller; 
use App\Models\Order;
use App\Models\Table;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // GET /api/orders
public function index()
{
    $orders = Order::with(['table', 'waitres', 'items'])
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($orders);
}

    // GET /api/orders?table_id=1&status=pending
    public function filter(Request $request)
    {
        $query = Order::with(['table', 'waitres', 'items']);

        if ($request->filled('table_id')) {
            $query->where('table_id', $request->table_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('waitres_id')) {
            $query->where('waitres_id', $request->waitres_id);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    // GET /api/orders/{id}
    public function show($id)
    {
        try {
            $order = Order::with(['table', 'waitres', 'items.product'])
                ->findOrFail($id);
            return response()->json($order);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Order not found'], 404);
        }
    }

    // POST /api/orders
   public function store(Request $request)
{
    $request->validate([
        'table_id' => 'required|exists:tables,table_id',
        'items' => 'required|array|min:1',
    ]);

    DB::beginTransaction();

    try {

        $order = Order::create([
            'table_id' => $request->table_id,
            'total_amount' => 0,
            'status' => 'pending',
        ]);

        $total = 0;

        foreach ($request->items as $item) {

            $product = Product::findOrFail($item['product_id']);

            $subtotal = $product->price * $item['quantity'];

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->product_id,
                'quantity' => $item['quantity'],
                'price' => $product->price,
                'subtotal' => $subtotal,
            ]);

            $total += $subtotal;
        }

        $order->update([
            'total_amount' => $total
        ]);

        DB::commit();

        return response()->json([
            'message' => 'Pesanan berhasil dibuat',
            'order' => $order
        ], 201);

    } catch (\Exception $e) {

        DB::rollBack();

        return response()->json([
            'message' => $e->getMessage()
        ], 500);
    }
}

    // PUT /api/orders/{id}
    public function update(Request $request, $id)
    {
        try {
            $order = Order::findOrFail($id);

            $validated = $request->validate([
                'status' => 'sometimes|in:pending,confirmed,completed,cancelled',
                'notes' => 'nullable|string',
            ]);

            if ($request->filled('status')) {
                $order->status = $validated['status'];
            }

            if ($request->filled('notes')) {
                $order->notes = $validated['notes'];
            }

            $order->save();

            return response()->json($order);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Order not found'], 404);
        }
    }

    // DELETE /api/orders/{id}
    public function destroy($id)
    {
        try {
            $order = Order::findOrFail($id);
            $order->delete();
            return response()->json(['message' => 'Order deleted']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Order not found'], 404);
        }
    }

    // GET /api/orders/table/{table_id}/active
    public function getTableActiveOrder($table_id)
    {
        $order = Order::where('table_id', $table_id)
            ->whereIn('status', ['pending', 'proses'])
            ->with(['items.product', 'waitres'])
            ->first();

        if (!$order) {
            return response()->json(['message' => 'No active order'], 404);
        }

        return response()->json($order);
    }
public function occupiedTables()
{
    $tables = Order::whereIn('status', ['pending', 'proses'])
        ->pluck('table_id');

    return response()->json($tables);
}

}