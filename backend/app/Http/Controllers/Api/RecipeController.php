<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RecipeController extends Controller
{
    // GET /api/recipes
    public function index()
    {
        $recipes = DB::table('recipes')
            ->join(
                'products',
                'recipes.product_id',
                '=',
                'products.product_id'
            )
            ->join(
                'ingredients',
                'recipes.ingredient_id',
                '=',
                'ingredients.ingredient_id'
            )
            ->select(
                'recipes.recipe_id',
                'recipes.product_id',
                'products.name as product_name',
                'recipes.ingredient_id',
                'ingredients.ingredient_name',
                'ingredients.unit',
                'recipes.quantity'
            )
            ->orderBy('products.name')
            ->get();

        return response()->json($recipes);
    }

    // POST /api/recipes
   public function store(Request $request)
{
    $request->validate([
        'product_id' => 'required|exists:products,product_id',
        'ingredients' => 'required|array|min:1',
        'ingredients.*.ingredient_id' => 'required|exists:ingredients,ingredient_id',
        'ingredients.*.quantity' => 'required|numeric|min:0.01',
    ]);

    foreach ($request->ingredients as $ingredient) {
        DB::table('recipes')->insert([
            'product_id' => $request->product_id,
            'ingredient_id' => $ingredient['ingredient_id'],
            'quantity' => $ingredient['quantity'],
        ]);
    }

    return response()->json([
        'message' => 'Resep berhasil ditambahkan'
    ], 201);
}

    // GET /api/recipes/{id}
    public function show($id)
    {
        $recipe = DB::table('recipes')
            ->join(
                'products',
                'recipes.product_id',
                '=',
                'products.product_id'
            )
            ->join(
                'ingredients',
                'recipes.ingredient_id',
                '=',
                'ingredients.ingredient_id'
            )
            ->select(
                'recipes.recipe_id',
                'recipes.product_id',
                'products.name as product_name',
                'recipes.ingredient_id',
                'ingredients.ingredient_name',
                'ingredients.unit',
                'recipes.quantity'
            )
            ->where('recipes.recipe_id', $id)
            ->first();

        if (!$recipe) {
            return response()->json([
                'message' => 'Resep tidak ditemukan'
            ], 404);
        }

        return response()->json($recipe);
    }

    // PUT /api/recipes/{id}
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,product_id',
            'ingredient_id' => 'required|exists:ingredients,ingredient_id',
            'quantity' => 'required|numeric|min:0.01',
        ]);

        $updated = DB::table('recipes')
            ->where('recipe_id', $id)
            ->update([
                'product_id' => $validated['product_id'],
                'ingredient_id' => $validated['ingredient_id'],
                'quantity' => $validated['quantity'],
            ]);

        return response()->json([
            'message' => 'Resep berhasil diperbarui',
            'updated' => $updated
        ]);
    }

    // DELETE /api/recipes/{id}
    public function destroy($id)
    {
        $deleted = DB::table('recipes')
            ->where('recipe_id', $id)
            ->delete();

        return response()->json([
            'message' => 'Resep berhasil dihapus',
            'deleted' => $deleted
        ]);
    }
}