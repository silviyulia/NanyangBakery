<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        DB::table('productions')->insert([
            'product_id' => $validated['product_id'],
            'quantity_produced' => $validated['quantity_produced'],
            'production_date' => now()
        ]);

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
        DB::table('productions')
            ->where('production_id', $id)
            ->delete();

        return response()->json([
            'message' => 'Produksi berhasil dihapus'
        ]);
    }
}