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

// 🔹 TYPE
type Order = {
  order_id: string;
  table_id: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  waitres?: { name: string; user_id?: number };
  total_price: number;
  order_items?: {
    product_id: number;
    product?: { name: string };
    quantity: number;
    price: number;
  }[];
  created_at: string;
  updated_at?: string;
};

export default function OrdersPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState("semua");
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID").format(value);
  };

  const menuItems = [
    { name: "Dashboard", icon: "📊", href: "/owner" },
    { name: "Pesanan Real-time", icon: "🛒", href: "/owner/orders" },
    { name: "Laporan", icon: "📄", href: "/owner/reports" },
    { name: "Produk & Menu", icon: "🍪", href: "/owner/products" },
    { name: "Produksi harian", icon: "🏭", href: "/owner/productions" },
    { name: "Stok Bahan", icon: "📦", href: "/owner/inventory" },
    { name: "Resep Produk", icon: "👨‍🍳", href: "/owner/recipes" },
    { name: "Karyawan", icon: "👥", href: "/owner/employees" },
  ];

  // 🔹 FETCH ORDERS FROM API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:8000/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // 🔹 REAL TIME CLOCK
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredOrders = orders.filter(
    (order) => activeFilter === "semua" || order.status === activeFilter,
  );
  // 🔹 STATUS STYLE
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "confirmed":
        return "bg-yellow-100 text-yellow-700";
      case "pending":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Selesai";
      case "confirmed":
        return "Proses";
      case "pending":
        return "Pending";
      case "cancelled":
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
    if (!start || !now) return "-";

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
                    {
                      orders.filter((order) => order.status === "confirmed")
                        .length
                    }
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
                    {
                      orders.filter(
                        (order) =>
                          order.status === "completed" ||
                          order.status === "cancelled",
                      ).length
                    }
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
              { label: "Pending", value: "pending" },
              { label: "Proses", value: "confirmed" },
              { label: "Selesai", value: "completed" },
              { label: "Dibatalkan", value: "cancelled" },
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
                {loading
                  ? "Memuat..."
                  : `${filteredOrders.length} pesanan ditemukan`}
              </p>
            </div>
            <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
              {filteredOrders.length} item
            </span>
          </div>

          {/* GRID ORDERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order.order_id}
                  className="bg-white rounded-xl shadow border overflow-hidden"
                >
                  {/* HEADER CARD */}
                  <div className="bg-orange-50 p-4 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-orange-500 text-white px-3 py-1 rounded text-sm">
                          Meja {order.table_id}
                        </span>
                        <h3 className="font-bold mt-2">
                          Order #{order.order_id}
                        </h3>

                        {/* 🕒 WAKTU */}
                        <div className="text-xs text-gray-600 mt-1 space-y-1">
                          <p>Masuk: {formatTime(order.created_at)}</p>
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
                  <div className="p-4">
                    <div className="max-h-40 overflow-y-auto border-b pb-3">
                      {order.order_items && order.order_items.length > 0 ? (
                        <ul className="space-y-2 text-sm">
                          {order.order_items.map((item, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span>
                                {item.quantity}x{" "}
                                {item.product?.name || "Produk"}
                              </span>
                              <span>
                                Rp {item.price.toLocaleString("id-ID")}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">Tidak ada item</p>
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">
                          Total:
                        </span>
                        <span className="font-bold text-lg text-orange-600">
                          Rp {order.total_price.toLocaleString("id-ID")}
                        </span>
                      </div>

                      <div className="text-xs text-gray-600">
                        <p>Waitres: {order.waitres?.name || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  {/* ITEMS */}
                  <div className="p-4 border-b max-h-40 overflow-y-auto">
                    {order.order_items && order.order_items.length > 0 ? (
                      <ul className="space-y-2 text-sm">
                        {order.order_items.map((item, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span className="font-medium">
                              {item.quantity}x {item.product?.name || "Produk"}
                            </span>
                            <span className="text-gray-600">
                              Rp {item.price.toLocaleString("id-ID")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">Tidak ada item</p>
                    )}
                  </div>

                  {/* FOOTER */}
                  <div className="p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-gray-700">
                        Total:
                      </span>
                      <span className="font-bold text-lg text-orange-600">
                        Rp {order.total_price.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-3">
                      <p>Waitres: {order.waitres?.name || "N/A"}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                {loading
                  ? "Memuat pesanan..."
                  : "Tidak ada pesanan untuk filter ini"}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
