<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // GET /api/categories
    public function index()
    {
        $categories = Category::with('products')->get();

        return response()->json($categories);
    }

    // GET /api/categories/{id}/products
    public function getProducts($id)
    {
        try {
            $category = Category::findOrFail($id);

            $products = $category->products()
                ->where('status', 'active')
                ->get();

            return response()->json($products);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Category not found'
            ], 404);
        }
    }
}