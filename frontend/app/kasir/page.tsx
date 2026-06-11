"use client";

import Sidebar from "./components/Sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
  order_id: string;
  table_id: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
  updated_at?: string;
  waitres_id: number;
  total_price: number;
  items: {
    order_item_id: string;
    product_id: string;
    quantity: number;
    price: number;
  }[];
  table?: { table_number: string };
  waitres?: { name: string };
};

export default function KasirDashboard() {
  const [activeFilter, setActiveFilter] = useState("semua");
  const [now, setNow] = useState(new Date());
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // realtime timer
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch orders dari API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:8000/api/orders");
        if (!res.ok) throw new Error("Gagal mengambil data pesanan");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Error loading orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    
    // Refresh setiap 5 detik
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const getOrderTotal = (items: any[]) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredOrders = orders.filter(
    (order) =>
      activeFilter === "semua" || order.status === activeFilter,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "confirmed":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Selesai";
      case "confirmed":
        return "Dikonfirmasi";
      case "cancelled":
        return "Batal";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-[#f4ece7] flex">
      <Sidebar />

      {/* Main */}
      <main className="flex-1">
        {/* Header tetap */}
        <header className="bg-[#b65a00] px-8 py-5 flex items-center justify-between shadow-md">
          <h2 className="text-4xl font-bold text-white">
            Dashboard Kasir
          </h2>

          <div className="bg-white rounded-full px-5 py-2 flex items-center gap-3 shadow">
            <div className="w-10 h-10 rounded-full border flex items-center justify-center">
              👤
            </div>

            <div>
              <p className="font-bold text-[#b65a00] leading-none">
                kasir
              </p>
              <span className="text-sm text-gray-500">System</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="p-8">
          {/* FILTER */}
          <div className="mb-8 flex flex-wrap gap-3">
            {[
              { label: "Semua", value: "semua" },
              { label: "Pending", value: "pending" },
              { label: "Dikonfirmasi", value: "confirmed" },
              { label: "Selesai", value: "completed" },
              { label: "Dibatalkan", value: "cancelled" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-5 py-3 rounded-full font-semibold transition ${
                  activeFilter === filter.value
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* INFO */}
          <div className="mb-6 flex items-center justify-between rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <div>
              <h3 className="text-2xl font-semibold text-[#5c2500]">
                {loading ? "Loading..." : "Pesanan Terbaru"}
              </h3>

              <p className="text-gray-600 text-sm">
                {loading
                  ? "Mengambil data..."
                  : `Total: ${filteredOrders.length} pesanan`}
              </p>
            </div>

            <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
              {filteredOrders.length} item
            </span>
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.order_id}
                className={`bg-white rounded-2xl border border-gray-300 overflow-hidden shadow-sm transition-all duration-300 ease-in-out`}
              >
                {/* HEADER CARD */}
                <div className="bg-[#f2dfbf] p-4 border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`px-3 py-1 rounded-md text-sm font-bold text-white ${getStatusColor(order.status)}`}>
                        {order.order_id}
                      </span>

                      <h3 className="font-bold text-2xl mt-3">
                        Meja {order.table?.table_number || order.table_id}
                      </h3>

                      <div className="text-sm mt-2 space-y-1">
                        <p>Masuk: {formatTime(order.created_at)}</p>

                        {order.status === "confirmed" && (
                          <p className="text-orange-600">
                            Status: Dikonfirmasi
                          </p>
                        )}

                        {order.status === "completed" && (
                          <p className="text-green-600">
                            Selesai
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                {/* BODY */}
                <div className="p-4">
                  <div className="space-y-3 border-b pb-4">
                    {order.items && order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between"
                      >
                        <p>
                          {item.quantity}x Item
                        </p>

                        <span className="text-orange-600 font-semibold">
                          Rp {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER */}
                  <div className="pt-4">
                    <div className="flex justify-between font-bold text-xl">
                      <span>Total</span>

                      <span className="text-orange-600">
                        Rp {order.total_price.toLocaleString()}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mt-4">
                      Waiter: {order.waitres?.name || "System"}
                    </p>
                    {order.status === "confirmed" && (
                      <div className="mt-4">
                        <Link
                          href={`/kasir/transaksi?order=${order.order_id}`}
                          className="w-full inline-block text-center py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600"
                        >
                          Proses Transaksi
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY */}
          {!loading && filteredOrders.length === 0 && (
            <div className="text-center text-gray-400 mt-20">
              Tidak ada pesanan
            </div>
          )}
        </section>
      </main>
    </div>
  );
}