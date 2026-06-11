<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

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
        $validated = $request->validate([
            'table_id' => 'required|exists:tables,table_id',
            'waitres_id' => 'required|exists:users,user_id',
            'notes' => 'nullable|string',
        ]);

        $order = Order::create([
            'table_id' => $validated['table_id'],
            'waitres_id' => $validated['waitres_id'],
            'status' => 'pending',
            'total_price' => 0,
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json($order, 201);
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
            ->whereIn('status', ['pending', 'confirmed'])
            ->with(['items.product', 'waitres'])
            ->first();

        if (!$order) {
            return response()->json(['message' => 'No active order'], 404);
        }

        return response()->json($order);
    }
}
