<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Snap;

class PaymentController extends Controller
{

public function create(Request $request)
{

Config::$serverKey = config('midtrans.serverKey');
Config::$isProduction = config('midtrans.isProduction');
Config::$isSanitized = true;
Config::$is3ds = true;


$params = [

    'transaction_details' => [

        'order_id' => $order->order_id,

        'gross_amount' => $order->total,

    ],

    'customer_details' => [

        'first_name' => $customer->name,

        'email' => $customer->email,

    ]

];

$snapToken = Snap::getSnapToken($params);


return response()->json([
    'token' => $snapToken
]);


}

}