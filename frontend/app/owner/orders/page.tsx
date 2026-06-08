"use client";

import { useEffect, useState } from "react";
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
import { ordersData } from "../../lib/orders";

// 🔹 TYPE
type Order = {
  id: string;
  table: string;
  status: "proses" | "selesai" | "batal";
  waiter: string;
  total: number;
  items: {
    name: string;
    qty: number;
    price: number;
  }[];
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
};

export default function OrdersPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState("semua");
  const [now, setNow] = useState<Date>(new Date());

  const menuItems = [
    { name: "Dashboard", icon: "📊", href: "/owner" },
    { name: "Pesanan Real-time", icon: "🛒", href: "/owner/orders" },
    { name: "Laporan", icon: "📄", href: "/owner/reports" },
    { name: "Produk & Menu", icon: "🍪", href: "/owner/products" },
    {name: "Produksi harian", icon: "🏭", href:"/owner/productions"},
    { name: "Stok Bahan", icon: "📦", href: "/owner/inventory" },
    { name: "Resep Produk", icon: "👨‍🍳", href: "/owner/recipes" },
    { name: "Karyawan", icon: "👥", href: "/owner/employees" },
  ];

  // 🔹 REAL TIME CLOCK
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const orders: Order[] = ordersData;

  const filteredOrders = orders.filter(
    (order) => activeFilter === "semua" || order.status === activeFilter,
  );

  // 🔹 STATUS STYLE
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

  // 🔹 FORMAT JAM
  const formatTime = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 🔹 DURASI MEJA DIPAKAI (REAL TIME)
  const getDuration = (start?: string) => {
    if (!start) return "-";

    const startTime = new Date(start).getTime();
    const diff = Math.floor((now.getTime() - startTime) / 1000);

    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
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

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        {/* Top Header */}
        <header className="bg-gradient-to-r from-amber-800 to-amber-900 text-white shadow-md p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X /> : <Menu />}
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

        {/* CONTENT */}
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-8">
          <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-3xl border border-orange-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-black-400">
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
                  <p className="text-[10px] uppercase tracking-[0.32em] text-black-400">
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
                  <p className="text-[10px] uppercase tracking-[0.32em] text-black-400">
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

          {/* GRID ORDERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow border overflow-hidden"
              >
                {/* HEADER CARD */}
                <div className="bg-orange-50 p-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-orange-500 text-white px-3 py-1 rounded text-sm">
                        {order.id}
                      </span>
                      <h3 className="font-bold mt-2">{order.table}</h3>

                      {/* 🕒 WAKTU */}
                      <div className="text-xs text-gray-600 mt-1 space-y-1">
                        <p>Masuk: {formatTime(order.createdAt)}</p>

                        {order.status === "proses" && (
                          <p className="text-orange-600 font-medium">
                            Durasi: {getDuration(order.startedAt)}
                          </p>
                        )}

                        {order.status === "selesai" && (
                          <p className="text-green-600 font-medium">
                            Selesai: {formatTime(order.completedAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                {/* BODY */}
                <div className="p-4 space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>
                        {item.qty}x {item.name}
                      </span>
                      <span className="text-orange-600 font-semibold">
                        Rp {item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}

                  <div className="pt-3 border-t flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">
                      Rp {order.total.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 pt-2">
                    Waiter: {order.waiter}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY */}
          {filteredOrders.length === 0 && (
            <div className="text-center text-gray-400 mt-20">
              Tidak ada pesanan
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
