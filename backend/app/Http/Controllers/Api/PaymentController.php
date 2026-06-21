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

Config::$serverKey = config('midtrans.server_key');

Config::$isProduction = false;

Config::$isSanitized = true;

Config::$is3ds = true;



$params = [

'transaction_details'=>[

'order_id'=>$request->order_id,

'gross_amount'=>$request->amount

],


'customer_details'=>[

'first_name'=>'Kasir'

]


];


$snapToken = Snap::getSnapToken($params);


return response()->json([

'token'=>$snapToken

]);


}

}