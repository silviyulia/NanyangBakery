<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = DB::table('users')
                  ->where('email', $request->email)
                  ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah.'
            ], 401);
        }

        return response()->json([
            'message' => 'Login berhasil.',
            'user' => [
                'user_id' => $user->user_id,
                'name'    => $user->name,
                'email'   => $user->email,
                'phone'   => $user->phone,
                'role'    => $user->role,
            ]
        ], 200);
    }

    public function register(Request $request)
{
    $request->validate([
        'name'     => 'required|string|max:100',
        'email'    => 'required|email|unique:users,email',
        'password' => 'required|string|min:6',
        'phone'    => 'nullable|string|max:20',
        'role'     => 'required|in:owner,kasir,waitres',
    ]);

    $user = DB::table('users')->insertGetId([
        'name'     => $request->name,
        'email'    => $request->email,
        'password' => Hash::make($request->password),
        'phone'    => $request->phone,
        'role'     => $request->role,
    ]);

    return response()->json([
        'message' => 'User berhasil ditambahkan.',
        'user_id' => $user,
    ], 201);
}

public function index()
{
    $users = DB::table('users')
               ->select('user_id', 'name', 'email', 'phone', 'role')
               ->get();

    return response()->json($users);
}

}