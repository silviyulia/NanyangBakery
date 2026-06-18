<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


class ProductionController extends Controller
{
    public function index()
    {
        $productions = DB::table('productions')
            ->join(
                'products',
                'products.product_id',
                '=',
                'productions.product_id'
            )
            ->select(
                'productions.*',
                'products.name as product_name'
            )
            ->orderBy('production_date', 'desc')
            ->get();

        return response()->json($productions);
    }

    public function today()
    {
        $data = DB::table('productions')
            ->join(
                'products',
                'products.product_id',
                '=',
                'productions.product_id'
            )
            ->whereDate(
                'productions.production_date',
                today()
            )
            ->select(
                'productions.*',
                'products.name as product_name'
            )
            ->orderBy('production_date', 'desc')
            ->get();

        return response()->json($data);
    }

   public function store(Request $request)
{
    $validated = $request->validate([
        'product_id' => 'required|integer',
        'quantity_produced' => 'required|integer|min:1'
    ]);

    // Ambil resep produk
    $recipes = DB::table('recipes')
        ->where('product_id', $validated['product_id'])
        ->get();

    // Cek stok bahan dulu
    foreach ($recipes as $recipe) {

        $ingredient = DB::table('ingredients')
            ->where('ingredient_id', $recipe->ingredient_id)
            ->first();

        $needed =
            $recipe->quantity *
            $validated['quantity_produced'];

        if ($ingredient->qty < $needed) {
            return response()->json([
                'message' => 'Stok bahan ' .
                    $ingredient->ingredient_name .
                    ' tidak mencukupi'
            ], 400);
        }
    }

    // Simpan produksi
    DB::table('productions')->insert([
        'product_id' => $validated['product_id'],
        'quantity_produced' => $validated['quantity_produced'],
        'production_date' => now()
    ]);

    // Kurangi stok bahan
    foreach ($recipes as $recipe) {

        $usedQty =
            $recipe->quantity *
            $validated['quantity_produced'];

        DB::table('ingredients')
            ->where('ingredient_id', $recipe->ingredient_id)
            ->decrement('qty', $usedQty);
    }

    return response()->json([
        'message' => 'Produksi berhasil disimpan'
    ], 201);
}

public function update(Request $request, $id)
{
    $validated = $request->validate([
        'product_id' => 'required|integer',
        'quantity_produced' => 'required|integer|min:1'
    ]);

    $oldProduction = DB::table('productions')
        ->where('production_id', $id)
        ->first();

    if (!$oldProduction) {
        return response()->json([
            'message' => 'Data produksi tidak ditemukan'
        ], 404);
    }

    // Kembalikan stok lama
    $oldRecipes = DB::table('recipes')
        ->where('product_id', $oldProduction->product_id)
        ->get();

    foreach ($oldRecipes as $recipe) {

        $returnQty =
            $recipe->quantity *
            $oldProduction->quantity_produced;

        DB::table('ingredients')
            ->where('ingredient_id', $recipe->ingredient_id)
            ->increment('qty', $returnQty);
    }

    // Cek stok untuk data baru
    $newRecipes = DB::table('recipes')
        ->where('product_id', $validated['product_id'])
        ->get();

    foreach ($newRecipes as $recipe) {

        $ingredient = DB::table('ingredients')
            ->where('ingredient_id', $recipe->ingredient_id)
            ->first();

        $needed =
            $recipe->quantity *
            $validated['quantity_produced'];

        if ($ingredient->qty < $needed) {

            // rollback stok lama
            foreach ($oldRecipes as $oldRecipe) {

                $usedQty =
                    $oldRecipe->quantity *
                    $oldProduction->quantity_produced;

                DB::table('ingredients')
                    ->where(
                        'ingredient_id',
                        $oldRecipe->ingredient_id
                    )
                    ->decrement('qty', $usedQty);
            }

            return response()->json([
                'message' =>
                    'Stok bahan ' .
                    $ingredient->ingredient_name .
                    ' tidak mencukupi'
            ], 400);
        }
    }

    // Kurangi stok baru
    foreach ($newRecipes as $recipe) {

        $usedQty =
            $recipe->quantity *
            $validated['quantity_produced'];

        DB::table('ingredients')
            ->where('ingredient_id', $recipe->ingredient_id)
            ->decrement('qty', $usedQty);
    }

    // Update produksi
    DB::table('productions')
        ->where('production_id', $id)
        ->update([
            'product_id' => $validated['product_id'],
            'quantity_produced' => $validated['quantity_produced']
        ]);

    return response()->json([
        'message' => 'Produksi berhasil diperbarui'
    ]);
}

public function destroy($id)
{
    $production = DB::table('productions')
        ->where('production_id', $id)
        ->first();

    if (!$production) {
        return response()->json([
            'message' => 'Data tidak ditemukan'
        ], 404);
    }

    $recipes = DB::table('recipes')
        ->where('product_id', $production->product_id)
        ->get();

    foreach ($recipes as $recipe) {

        $returnQty =
            $recipe->quantity *
            $production->quantity_produced;

        DB::table('ingredients')
            ->where('ingredient_id', $recipe->ingredient_id)
            ->increment('qty', $returnQty);
    }

    DB::table('productions')
        ->where('production_id', $id)
        ->delete();

    return response()->json([
        'message' => 'Produksi berhasil dihapus'
    ]);
}
}