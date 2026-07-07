"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";

type Order = {
  id: number;
  table_id: number;
  status: string;
  created_at: string;
  updated_at?: string;
  total_amount: string;

  items: {
    id: number;
    product_id: number;
    quantity: number;
    price: string;
    subtotal: string;

    product?: {
      product_id: number;
      name: string;
    };
  }[];

  table?: {
    table_number: number;
  };

  waitres?: {
    name: string;
  };
};

export default function KasirDashboard() {
  const router = useRouter();
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

        if (!res.ok) {
          throw new Error("Gagal mengambil data pesanan");
        }

        const data = await res.json();

        console.log("ORDERS =", data);

        setOrders(data);
      } catch (error) {
        console.error("Error loading orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    //refres setiap 5 detik
    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, []);

  const getOrderTotal = (items: any[]) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredOrders = orders.filter((order) => {
    console.log(
      "Filter:",
      activeFilter,
      "Status:",
      order.status,
      "Match:",
      activeFilter === "semua" || order.status === activeFilter,
    );

    return activeFilter === "semua" || order.status === activeFilter;
  });

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
        return "Proses";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Batal";
      default:
        return status;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const confirmOrder = async (id: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "confirmed",
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal konfirmasi");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: "confirmed" } : order,
        ),
      );

      router.push(`/kasir/transaksi?order=${id}`);
    } catch (error) {
      console.error(error);
      alert("Gagal mengkonfirmasi pesanan");
    }
  };

  console.log("ORDERS =", orders);
  console.log(
    "STATUS SAAT RENDER =",
    orders.map((o) => o.status),
  );
  return (
    <Sidebar>
      <section className="p-8 bg-[#f6f1ea] min-h-screen">
        {" "}
        <div className="mb-8 flex flex-wrap gap-3">
      {[
              { label: "Semua", value: "semua" },
              { label: "Pending", value: "pending" },
              { label: "Proses", value: "proses" },
              { label: "Selesai", value: "selesai" },
              { label: "Dibatalkan", value: "dibatalkan" },
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
              key={order.id}
              className="
  bg-orange-100
  border border-[#d6c1aa]
  rounded-3xl
  overflow-hidden
  shadow-md
  hover:shadow-xl
  transition-all duration-300
  flex
  flex-col
  h-full
  "
            >
              {/* HEADER */}
              <div className="bg-[#f8efe4] px-5 py-4 border-b border-[#d6c1aa]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                      Meja {order.table?.table_number || order.table_id}
                    </span>

                    <h3 className="mt-3 text-2xl font-bold text-[#3a2a1a]">
                      Order {order.id}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      Masuk: {formatTime(order.created_at)}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>

              {/* BODY */}
              <div className="p-4 bg-white flex flex-col flex-1">
                {" "}
                <div className="space-y-3 flex-1">
                  {" "}
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between pb-2">
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.quantity}x {item.product?.name}
                        </p>

                        <p className="text-sm text-gray-400">
                          Rp {Number(item.price).toLocaleString("id-ID")}
                        </p>
                      </div>

                      <span className="font-bold text-gray-700">
                        Rp{" "}
                        {(Number(item.price) * item.quantity).toLocaleString(
                          "id-ID",
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                {/* TOTAL */}
<div className="mt-auto border-t pt-4">                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-700">
                      Total
                    </span>

                    <span className="text-xl font-bold text-orange-600">
                      Rp {Number(order.total_amount).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
                <div className="mt-5 text-sm text-gray-500">
                  Waitres: {order.waitres?.name || "N/A"}
                </div>
                {/* BUTTON */}
                {order.status === "pending" && (
                  <button
                    onClick={() =>
                      router.push(`/kasir/transaksi?order=${order.id}`)
                    }
                    className="
  w-full
  mt-5
  bg-orange-500
  hover:bg-orange-600
  text-white
  py-3
  rounded-xl
  font-semibold
  transition
  "
                  >
                    Proses Pembayaran
                  </button>
                )}
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
    </Sidebar>
  );
}
