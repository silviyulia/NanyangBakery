<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TableController extends Controller
{
    // GET /api/tables
    public function index()
    {
        $tables = Table::with(['orders'])->orderBy('table_number', 'asc')->get();
        return response()->json($tables);
    }

    // GET /api/tables/{id}
    public function show($id)
    {
        try {
            $table = Table::with(['orders', 'activeOrder'])->findOrFail($id);
            return response()->json($table);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Table not found'], 404);
        }
    }

    // PUT /api/tables/{id}/status
    public function updateStatus(Request $request, $id)
    {
        try {
            $table = Table::findOrFail($id);

            $validated = $request->validate([
                'status' => 'required|in:available,occupied,reserved',
            ]);

            $table->status = $validated['status'];
            $table->save();

            return response()->json($table);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Table not found'], 404);
        }
    }

    // GET /api/tables/status/available
    public function getAvailableTables()
    {
        $tables = Table::where('status', 'available')
            ->orderBy('table_number', 'asc')
            ->get();
        return response()->json($tables);
    }

    // GET /api/tables/status/occupied
    public function getOccupiedTables()
    {
        $tables = Table::where('status', 'occupied')
            ->with(['activeOrder.items.product', 'activeOrder.waitres'])
            ->orderBy('table_number', 'asc')
            ->get();
        return response()->json($tables);
    }
}
