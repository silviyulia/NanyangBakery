"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import { ordersData } from "../../lib/orders";

export default function OrdersPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState("semua");

  const menuItems = [
    { name: "Dashboard", icon: "📊", href: "/owner" },
    { name: "Pesanan Real-time", icon: "🛒", href: "/owner/orders" },
    { name: "Laporan", icon: "📄", href: "/owner/reports" },
    { name: "Produk & Menu", icon: "🍪", href: "/owner/products" },
    { name: "Stok Bahan", icon: "📦", href: "/owner/inventory" },
    { name: "Resep Produk", icon: "👨‍🍳", href: "/owner/recipes" },
    { name: "Karyawan", icon: "👥", href: "/owner/employees" },
  ];

  const orders = ordersData;

  const filteredOrders = orders.filter(
    (order) => activeFilter === "semua" || order.status === activeFilter,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "selesai":
        return "bg-green-100 text-green-700";
      case "proses":
        return "bg-yellow-100 text-yellow-700";
      case "batal":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "selesai":
        return "Selesai";
      case "proses":
        return "Proses";
      case "batal":
        return "Batal";
      default:
        return status;
    }
  };

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
                item.href === "/owner/orders"
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
            <div>
              <h2 className="text-3xl font-bold">Pesanan Real-time</h2>
              <p className="text-sm text-amber-200 mt-1">
                Monitor pesanan yang sedang berlangsung per meja
              </p>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-8">
          <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-3xl border border-orange-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-gray-400">
                    Total Pesanan
                  </p>
                  <p className="mt-2 text-2xl font-bold text-amber-950">
                    {orders.length}
                  </p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 text-lg font-bold">
                  📦
                </span>
              </div>
            </div>
            <div className="rounded-3xl border border-orange-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-gray-400">
                    Dalam Proses
                  </p>
                  <p className="mt-2 text-2xl font-bold text-orange-600">
                    {orders.filter((order) => order.status === "proses").length}
                  </p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-700 text-lg font-bold">
                  ⏳
                </span>
              </div>
            </div>
            <div className="rounded-3xl border border-orange-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-gray-400">
                    Selesai / Batal
                  </p>
                  <p className="mt-2 text-2xl font-bold text-amber-950">
                    {orders.filter((order) => order.status !== "proses").length}
                  </p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-green-700 text-lg font-bold">
                  ✅
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-3">
            {[
              { label: "Semua", value: "semua" },
              { label: "Proses", value: "proses" },
              { label: "Selesai", value: "selesai" },
              { label: "Dibatalkan", value: "batal" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-5 py-3 rounded-full font-semibold transition ${
                  activeFilter === filter.value
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="mb-6 flex items-center justify-between rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <div>
              <h3 className="text-xl font-semibold text-amber-950">
                Menampilkan Pesanan
              </h3>
              <p className="text-sm text-gray-600">
                {activeFilter === "semua"
                  ? "Semua pesanan ditampilkan"
                  : `Menampilkan pesanan dengan status ${
                      activeFilter === "proses"
                        ? "Proses"
                        : activeFilter === "selesai"
                          ? "Selesai"
                          : "Dibatalkan"
                    }`}
              </p>
            </div>
            <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
              {filteredOrders.length} item
            </span>
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-100"
              >
                {/* Card Header */}
                <div className="bg-orange-50 border-b border-orange-100 p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-orange-500 text-white font-bold px-3 py-1 rounded-lg text-sm">
                        {order.id}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-amber-950">
                      {order.table}
                    </h3>
                    <p className="text-xs text-gray-600">{order.time}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  {/* Items List */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm"
                      >
                        <div>
                          <p className="font-medium text-amber-950">
                            {item.qty}x {item.name}
                          </p>
                        </div>
                        <p className="text-orange-600 font-semibold">
                          Rp {item.price.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-700 font-medium">Total</p>
                    <p className="text-2xl font-bold text-orange-600">
                      Rp {order.total.toLocaleString()}
                    </p>
                  </div>

                  {/* Waiter Info */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-600">
                      Waitres:{" "}
                      <span className="font-semibold">{order.waiter}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-400 text-lg">
                Tidak ada pesanan dengan status ini
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
