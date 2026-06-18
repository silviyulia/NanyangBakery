<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{

    // Read all products
public function index()
{
    $products = DB::table('products')

        ->leftJoinSub(
            DB::table('productions')
                ->select(
                    'product_id',
                    DB::raw('SUM(quantity_produced) as total_produced')
                )
                ->groupBy('product_id'),
            'p',
            'products.product_id',
            '=',
            'p.product_id'
        )

        ->leftJoinSub(
            DB::table('order_items')
                ->select(
                    'product_id',
                    DB::raw('SUM(quantity) as total_sold')
                )
                ->groupBy('product_id'),
            'o',
            'products.product_id',
            '=',
            'o.product_id'
        )

        ->select(
            'products.*',
            DB::raw('
                COALESCE(p.total_produced,0)
                -
                COALESCE(o.total_sold,0)
                as stock
            ')
        )

        ->get();

    return response()->json($products);
}

    // Create product
    public function store(Request $request)
    {

        $validated = $request->validate([
            'category_id' => 'required|integer',
            'name' => 'required|string|max:100',
            'price' => 'required|numeric',
            'status' => 'required|in:active,inactive',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);


        $imagePath = null;


        if($request->hasFile('image')){

            $imagePath = $request
                ->file('image')
                ->store('products','public');

        }



        DB::table('products')->insert([

            'category_id' => $validated['category_id'],

            'name' => $validated['name'],

            'price' => $validated['price'],

            'status' => $validated['status'],

            'image' => $imagePath,

        ]);


        return response()->json([
            'message'=>'Produk berhasil ditambahkan'
        ],201);

    }



    // Update product
    public function update(Request $request,$id)
    {
           \Log::info('UPDATE PRODUCT', [
        'id' => $id,
        'all' => $request->all(),
        'has_image' => $request->hasFile('image'),
    ]);
    
        $validated = $request->validate([
            'category_id' => 'required|integer',
            'name' => 'required|string|max:100',
            'price' => 'required|numeric',
            'status' => 'required|in:active,inactive',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = [
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'price' => $validated['price'],
            'status' => $validated['status'],
        ];

        if($request->hasFile('image')){
            $imagePath = $request
                ->file('image')
                ->store('products','public');

            $data['image'] = $imagePath;
        }

        DB::table('products')
            ->where('product_id',$id)
            ->update($data);

        return response()->json([
            'message' => 'Produk berhasil diupdate'
        ], 200);
    }




    // Delete product
    public function destroy($id)
    {

        $product = DB::table('products')
        ->where('product_id',$id)
        ->first();

        if($product && $product->image){

            Storage::disk('public')
            ->delete($product->image);

        }

        DB::table('products')
        ->where('product_id',$id)
        ->delete();

        return response()->json([
            'message'=>'Produk berhasil dihapus'
        ]);

    }

}