<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;
use App\Models\Order;
use App\Models\Transaction;

class PaymentController extends Controller
{
    public function create(Request $request)
    {
        try {
            Config::$serverKey = config('midtrans.server_key');
            Config::$isProduction = config('midtrans.is_production');
            Config::$isSanitized = config('midtrans.isSanitized', true);
            Config::$is3ds = config('midtrans.is3ds', true);

            $order = Order::with(['waitres', 'table', 'items.product'])->findOrFail($request->order_id);

            $itemDetails = $order->items->map(function ($item) {
                return [
                    'id' => $item->product_id,
                    'price' => (int) $item->price,
                    'quantity' => (int) $item->quantity,
                    'name' => $item->product->name ?? 'Item',
                ];
            })->toArray();

            $params = [
                'transaction_details' => [
                    'order_id' => 'ORDER-' . $order->id . '-' . time(),
                    'gross_amount' => (int) $order->total_amount,
                ],
                'item_details' => $itemDetails,
                'customer_details' => [
                    'first_name' => $order->waitres->name ?? 'Customer',
                    'email' => 'customer@example.com',
                    'phone' => $order->waitres->phone ?? '081234567890',
                ],
                'custom_field1' => (string) $order->id,
                'custom_field2' => $order->table?->table_number ?? null,
            ];

            $params['custom_field2'] = $order->table?->table_number ? (string) $order->table->table_number : null;

            $snapToken = Snap::getSnapToken($params);

            return response()->json([
                'token' => $snapToken,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function notification(Request $request)
    {
        try {
            Config::$serverKey = config('midtrans.server_key');
            Config::$isProduction = config('midtrans.is_production');
            Config::$isSanitized = config('midtrans.isSanitized', true);
            Config::$is3ds = config('midtrans.is3ds', true);

            $notification = new Notification();

            $transactionStatus = $notification->transaction_status;
            $orderId = $notification->order_id;
            $transactionId = $notification->transaction_id ?? null;

            $paymentStatus = match ($transactionStatus) {
                'capture', 'settlement', 'success' => 'completed',
                'pending' => 'pending',
                'deny', 'cancel', 'expire', 'failure' => 'failed',
                default => 'pending',
            };

            $localOrderId = null;
            if (preg_match('/ORDER-(\d+)-/', $orderId, $matches)) {
                $localOrderId = $matches[1];
            }

            if (!$localOrderId) {
                return response()->json(['message' => 'Order ID tidak valid'], 400);
            }

            $transaction = Transaction::where('order_id', $localOrderId)
                ->orderBy('created_at', 'desc')
                ->first();

            if ($transaction) {
                $transaction->payment_status = $paymentStatus;
                if ($transactionId) {
                    $transaction->reference_number = $transactionId;
                }
                $transaction->save();
            }

            if ($paymentStatus === 'completed') {
                $order = Order::find($localOrderId);
                if ($order) {
                    $order->status = 'selesai';
                    $order->save();
                }
            }

            return response()->json(['message' => 'Notifikasi Midtrans diterima']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
