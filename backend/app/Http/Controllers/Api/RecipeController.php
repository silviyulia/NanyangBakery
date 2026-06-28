<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Recipe;
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
    \Log::info("UPDATE RECIPE");
    \Log::info([
        'id' => $id,
        'request' => $request->all()
    ]);

    $request->validate([
        'product_id' => 'required|exists:products,product_id',
        'ingredients' => 'required|array|min:1',
        'ingredients.*.ingredient_id' => 'required|exists:ingredients,ingredient_id',
        'ingredients.*.quantity' => 'required|numeric|min:0.01',
    ]);

    DB::beginTransaction();

    try {

        $deleted = Recipe::where('product_id', $id)->delete();

        \Log::info("Deleted: ".$deleted);

        foreach ($request->ingredients as $ingredient) {

            Recipe::create([
                'product_id' => $request->product_id,
                'ingredient_id' => $ingredient['ingredient_id'],
                'quantity' => $ingredient['quantity'],
            ]);

        }

        DB::commit();

        return response()->json([
            'message' => 'Recipe updated successfully'
        ]);

    } catch (\Exception $e) {

        DB::rollBack();

        \Log::error($e->getMessage());

        return response()->json([
            'message' => $e->getMessage()
        ],500);

    }
}
    // DELETE /api/recipes/{id}
  public function destroy($productId)
{
    Recipe::where('product_id', $productId)->delete();

    return response()->json([
        'message' => 'Resep berhasil dihapus'
    ]);
}
}