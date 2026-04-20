"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  BarChart3,
  Package,
  AlertTriangle,
  TrendingUp,
  User,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";
import { ordersData } from "../lib/orders";

export default function OwnerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: "📊", href: "/owner" },
    { name: "Pesanan Real-time", icon: "🛒", href: "/owner/orders" },
    { name: "Laporan", icon: "📄", href: "/owner/reports" },
    { name: "Produk & Menu", icon: "🍪", href: "/owner/products" },
    { name: "Stok Bahan", icon: "📦", href: "/owner/inventory" },
    { name: "Resep Produk", icon: "👨‍🍳", href: "/owner/recipes" },
    { name: "Karyawan", icon: "👥", href: "/owner/employees" },
  ];

  const router = useRouter();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-gradient-to-b from-amber-800 to-amber-900 text-white transition-all duration-300 overflow-hidden flex flex-col shadow-lg`}
      >
        <div className="p-6 border-b border-amber-700">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 rounded-lg p-2 font-bold text-lg">
              🥖
            </div>
            <div>
              <h1 className="font-bold text-lg">Bakery POS</h1>
              <p className="text-xs text-amber-200">Owner</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                item.href === "/owner"
                  ? "bg-orange-500 text-white"
                  : "hover:bg-amber-700 text-amber-100"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-amber-700">
          <button
            onClick={() => router.push("/login")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition text-white"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-gradient-to-r from-amber-800 to-amber-900 text-white shadow-md p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-amber-700 rounded-lg transition"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2 className="text-3xl font-bold">Dashboard Monitoring</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition">
              🔔 Notifikasi (3)
            </button>
            <div className="flex items-center gap-2 bg-amber-500 bg-opacity-20 px-4 py-2 rounded-lg">
              <User size={20} />
              <div>
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs text-amber-200">Owner</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-8">
          <p className="text-gray-600 mb-8">Real-time overview sistem bakery</p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Menu Total", value: "42" },
              { label: "Karyawan Aktif", value: "8" },
              { label: "Rating", value: "4.8/5" },
              { label: "Jam Operasional", value: "07:00 - 22:00" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition"
              >
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Monitoring Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Revenue Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-400 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <span className="text-3xl">💰</span>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  +12%
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">Pendapatan Hari Ini</p>
              <h3 className="text-3xl font-bold text-amber-950">
                Rp 2.450.000
              </h3>
            </div>

            {/* Total Transactions Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-400 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="text-3xl">✅</span>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                  +8%
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">Total Transaksi</p>
              <h3 className="text-3xl font-bold text-amber-950">127</h3>
            </div>

            {/* Best Seller Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-400 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <TrendingUp className="text-orange-600" size={24} />
                </div>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                  +15%
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">Produk Terlaris</p>
              <h3 className="text-3xl font-bold text-amber-950">Croissant</h3>
            </div>

            {/* Low Stock Alert Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-400 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <span className="text-red-600 text-2xl font-bold">!</span>
              </div>
              <p className="text-gray-600 text-sm mb-2">Stok Memipis</p>
              <h3 className="text-3xl font-bold text-amber-950">5 Item</h3>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Chart */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-amber-950 mb-4">
                Grafik Penjualan
              </h3>
              <div className="h-64 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-400 text-center">
                  📈 Grafik Penjualan Minggu Ini
                  <br />
                  <span className="text-sm">
                    (Data akan ditampilkan di sini)
                  </span>
                </p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-amber-950">
                  Pesanan Terbaru
                </h3>
                <Link
                  href="/owner/orders"
                  className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
                >
                  Lihat Semua →
                </Link>
              </div>
              <div className="space-y-3">
                {ordersData.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition"
                  >
                    <div>
                      <p className="font-semibold text-sm text-amber-950">
                        {order.id}
                      </p>
                      <p className="text-xs text-gray-600">{order.table}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-amber-950">
                        Rp {order.total.toLocaleString()}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          order.status === "selesai"
                            ? "bg-green-100 text-green-700"
                            : order.status === "proses"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status === "selesai"
                          ? "Selesai"
                          : order.status === "proses"
                            ? "Proses"
                            : "Batal"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
