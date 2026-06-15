<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
        $validated = $request->validate([
            'qty' => 'required|numeric|min:0',
        ]);

        DB::table('ingredients')
            ->where('ingredient_id', $id)
            ->update([
                'qty' => $validated['qty'],
                'status' => $validated['qty'] > 0
                    ? 'available'
                    : 'empty'
            ]);

        return response()->json([
            'message' => 'Stok berhasil diperbarui'
        ]);
    }

    public function destroy($id)
    {
        DB::table('ingredients')
            ->where('ingredient_id', $id)
            ->delete();

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