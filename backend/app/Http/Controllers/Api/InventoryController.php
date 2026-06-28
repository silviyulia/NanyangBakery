<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ingredient;
use App\Models\Recipe;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function index()
    {
        return response()->json(
            DB::table('ingredients')
                ->orderBy('ingredient_name')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ingredient_name' => 'required|string|max:100',
            'qty' => 'required|numeric|min:0',
            'unit' => 'required|string|max:20',
            'minimum_stock' => 'required|numeric',

        ]);

        DB::table('ingredients')->insert([
            'ingredient_name' => $validated['ingredient_name'],
            'qty' => $validated['qty'],
            'unit' => $validated['unit'],
            'status' => $validated['qty'] > 0
                ? 'available'
                : 'empty',
         'minimum_stock' => $request->minimum_stock,

        ]);

        return response()->json([
            'message' => 'Bahan berhasil ditambahkan'
        ], 201);
    }

public function update(Request $request, $id)
{
    $request->validate([
        'ingredient_name' => 'required',
        'qty' => 'required|numeric|min:0',
        'unit' => 'required',
        'minimum_stock' => 'required|numeric|min:0',
    ]);

    $ingredient = Ingredient::findOrFail($id);

    $ingredient->update([
        'ingredient_name' => $request->ingredient_name,
        'qty' => $request->qty,
        'unit' => $request->unit,
        'minimum_stock' => $request->minimum_stock,
    ]);

    return response()->json([
        'message' => 'Bahan berhasil diperbarui'
    ]);
}
public function destroy($id)
{
    $ingredient = Ingredient::find($id);

    if (!$ingredient) {
        return response()->json([
            'message' => 'Bahan tidak ditemukan'
        ],404);
    }

    $used = Recipe::where('ingredient_id', $id)->exists();

    if ($used) {
    return response()->json([
    'message' =>
        'Bahan masih digunakan pada resep. Hapus atau ubah resep yang menggunakan bahan ini terlebih dahulu.'
], 400);
    }

    $ingredient->delete();

    return response()->json([
        'message' => 'Bahan berhasil dihapus'
    ]);
}
    public function updateStock(Request $request, $id)
{
    $request->validate([
        'qty' => 'required|numeric|min:1'
    ]);

    $ingredient = DB::table('ingredients')
        ->where('ingredient_id', $id)
        ->first();

    if (!$ingredient) {
        return response()->json([
            'message' => 'Bahan tidak ditemukan'
        ], 404);
    }

    DB::table('ingredients')
        ->where('ingredient_id', $id)
        ->update([
            'qty' => $ingredient->qty + $request->qty
        ]);

    return response()->json([
        'message' => 'Stok berhasil ditambahkan'
    ]);
}
}