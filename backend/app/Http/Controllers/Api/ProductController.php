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
        $products = DB::table('products')->get();

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
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
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


        $data = [

            'category_id'=>$request->category_id,

            'name'=>$request->name,

            'price'=>$request->price,

            'status'=>$request->status,

        ];



        if($request->hasFile('image')){


            $imagePath = $request
                ->file('image')
                ->store('products','public');


            $data['image']=$imagePath;

        }



        DB::table('products')
        ->where('product_id',$id)
        ->update($data);



        return response()->json([
            'message'=>'Produk berhasil diupdate'
        ]);

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