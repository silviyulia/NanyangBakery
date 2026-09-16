<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Http\Middleware\RoleMiddleware;

class AuthController extends Controller
{
public function login(Request $request)
{
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required|string',
    ]);

    $user = \App\Models\User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Email atau password salah.'
        ], 401);
    }

    // Hapus token lama jika ingin satu sesi login per user
    $user->tokens()->delete();

    // Buat token Sanctum
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Login berhasil.',
        'token'   => $token,
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

public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Logout berhasil.'
    ]);
}

public function index()
{
    $users = DB::table('users')
               ->select('user_id', 'name', 'email', 'phone', 'role')
               ->get();

    return response()->json($users);
}

public function update(Request $request, $id)
{
    $validated = $request->validate([
        'name' => 'required',
        'email' => 'required|email|unique:users,email,' . $id . ',user_id',
        'phone' => 'required',
        'role' => 'required',
    ]);

    $data = [
        'name' => $validated['name'],
        'email' => $validated['email'],
        'phone' => $validated['phone'],
        'role' => $validated['role'],
    ];

    if ($request->filled('password')) {
        $data['password'] = bcrypt($request->password);
    }

    DB::table('users')
        ->where('user_id', $id)
        ->update($data);

    return response()->json([
        'message' => 'Karyawan berhasil diperbarui'
    ]);
}
public function destroy($id)
{
    DB::table('users')
        ->where('user_id', $id)
        ->delete();

    return response()->json([
        'message' => 'Karyawan berhasil dihapus'
    ]);
}
}