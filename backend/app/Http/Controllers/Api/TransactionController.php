<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Recipe;
use App\Models\Ingredient;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TransactionController extends Controller
{
    // GET /api/transactions
public function index()
{
    $transactions = Transaction::orderBy('created_at', 'desc')
        ->get();

    return response()->json($transactions);
}

    // GET /api/transactions?kasir_id=1&session_id=1
    public function filter(Request $request)
    {
        $query = Transaction::with(['order', 'kasir', 'session']);

        if ($request->filled('kasir_id')) {
            $query->where('kasir_id', $request->kasir_id);
        }

        if ($request->filled('session_id')) {
            $query->where('session_id', $request->session_id);
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->filled('date')) {
            $date = $request->date;
            $query->whereDate('created_at', $date);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    // POST /api/transactions
public function store(Request $request)
{
    $validated = $request->validate([
        'order_id' => 'nullable|exists:orders,id',
        'kasir_id' => 'required|exists:users,user_id',
        'session_id' => 'nullable|exists:cashier_sessions,session_id',
        'total_amount' => 'required|numeric|min:0',
        'payment_method' => 'required|in:cash,qris,transfer',
        'amount_paid' => 'required|numeric|min:0',
        'reference_number' => 'nullable|unique:transactions,reference_number',
    ]);

    DB::beginTransaction();

    try {

        $order = \App\Models\Order::with('items')->find($validated['order_id']);

        $transaction = Transaction::create([
            'order_id' => $validated['order_id'],
            'kasir_id' => $validated['kasir_id'],
            'session_id' => $validated['session_id'] ?? null,
            'total_amount' => $validated['total_amount'],
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'completed',
            'amount_paid' => $validated['amount_paid'],
            'reference_number' => $validated['reference_number'] ?? null,
        ]);

        if ($order) {

            // Kurangi bahan baku MINUMAN
            foreach ($order->items as $item) {
\Log::info("ORDER ITEM", [
    'order_item_product_id' => $item->product_id,
    'order_item_qty' => $item->quantity,
]);

$product = Product::find($item->product_id);

\Log::info("PRODUCT", [
    'product_id' => $product?->product_id,
    'product_name' => $product?->name,
    'category_id' => $product?->category_id,
]);
                if (!$product) {
                    continue;
                }

                // hanya kategori minuman
                if ($product->category_id == 3) {

                    $recipes = Recipe::where(
                        'product_id',
                        $product->product_id
                    )->get();

                    \Log::info([
    'jumlah_recipe' => $recipes->count(),
    'recipes' => $recipes->toArray(),
]);

                    foreach ($recipes as $recipe) {

                        $ingredient = Ingredient::find(
                            $recipe->ingredient_id
                        );

                        if (!$ingredient) {
                            continue;
                        }

                        $usedQty =
                            $recipe->quantity * $item->quantity;

\Log::info("SEBELUM UPDATE", [
    'ingredient' => $ingredient->ingredient_name,
    'stok_awal' => $ingredient->qty,
    'dipakai' => $usedQty,
]);

$ingredient->qty = max(
    0,
    $ingredient->qty - $usedQty
);

$ingredient->save();

$ingredient->refresh();

DB::table('ingredients')
    ->where('ingredient_id', $recipe->ingredient_id)
    ->decrement('qty', $usedQty);          }
                }
            }
            $order->update([
                'status' => 'selesai'
            ]);
        }
        DB::commit();
        return response()->json([
            'message' => 'Pembayaran berhasil',
            'transaction' => $transaction,
            'order' => $order
        ], 201);

    } catch (\Exception $e) {

    DB::rollBack();

    return response()->json([
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
    ], 500);
}
}
    // GET /api/transactions/{id}
    public function show($id)
    {
        try {
            $transaction = Transaction::with(['order', 'kasir', 'session', 'receipt'])
                ->findOrFail($id);
            return response()->json($transaction);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }
    }

    // GET /api/transactions/daily-summary?date=2026-06-10
    public function dailySummary(Request $request)
    {
        $date = $request->date ?? date('Y-m-d');
        
        $summary = Transaction::whereDate('created_at', $date)
            ->selectRaw('COUNT(*) as total_transactions')
            ->selectRaw('SUM(total_amount) as total_revenue')
            ->selectRaw('SUM(CASE WHEN payment_method = "cash" THEN total_amount ELSE 0 END) as cash_total')
            ->selectRaw('SUM(CASE WHEN payment_method = "qris" THEN total_amount ELSE 0 END) as qris_total')
            ->selectRaw('SUM(CASE WHEN payment_method = "transfer" THEN total_amount ELSE 0 END) as transfer_total')
            ->first();

        return response()->json($summary);
    }

    private function generateReceiptNumber()
    {
        $prefix = 'RCP' . date('YmdHi');
        $count = Receipt::whereDate('created_at', today())->count() + 1;
        return $prefix . str_pad($count, 4, '0', STR_PAD_LEFT);
    }
}
