<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name'     => 'Owner',
                'email'    => 'owner@gmail.com',
                'password' => Hash::make('owner123'),
                'phone'    => '081234567890',
                'role'     => 'owner',
            ],
            [
                'name'     => 'Kasir',
                'email'    => 'kasir@gmail.com',
                'password' => Hash::make('kasir123'),
                'phone'    => '081234567891',
                'role'     => 'kasir',
            ],
            [
                'name'     => 'Waitres',
                'email'    => 'waitres@gmail.com',
                'password' => Hash::make('waitres123'),
                'phone'    => '081234567892',
                'role'     => 'waitres',
            ],
        ]);
    }
}