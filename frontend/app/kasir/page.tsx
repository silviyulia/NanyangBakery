"use client";

import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";

type Order = {
  id: string;
  meja: string;
  status: "proses" | "selesai" | "batal";
  masuk: string;
  selesai?: string;
  waiter: string;
  total: number;
  items: {
    name: string;
    qty: number;
    price: number;
  }[];
};

export default function KasirDashboard() {
  const [activeFilter, setActiveFilter] = useState("semua");
  const [now, setNow] = useState(new Date());

  // realtime timer
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const orders: Order[] = [
    {
      id: "M1",
      meja: "Meja 1",
      status: "selesai",
      masuk: "14:32",
      selesai: "-",
      waiter: "Sarah",
      total: 125000,
      items: [
        { name: "Croissant", qty: 2, price: 30000 },
        { name: "Espresso", qty: 1, price: 25000 },
        { name: "Cake Coklat", qty: 1, price: 40000 },
      ],
    },
    {
      id: "M2",
      meja: "Meja 2",
      status: "batal",
      masuk: "14:35",
      selesai: "-",
      waiter: "Sarah",
      total: 125000,
      items: [
        { name: "Croissant", qty: 2, price: 30000 },
        { name: "Espresso", qty: 1, price: 25000 },
        { name: "Cake Coklat", qty: 1, price: 40000 },
      ],
    },
    {
      id: "M3",
      meja: "Meja 3",
      status: "proses",
      masuk: "14:40",
      waiter: "Sarah",
      total: 125000,
      items: [
        { name: "Croissant", qty: 2, price: 30000 },
        { name: "Espresso", qty: 1, price: 25000 },
        { name: "Cake Coklat", qty: 1, price: 40000 },
      ],
    },
    {
      id: "M4",
      meja: "Meja 4",
      status: "selesai",
      masuk: "14:10",
      selesai: "14:30",
      waiter: "Budi",
      total: 85000,
      items: [
        { name: "Croissant", qty: 2, price: 30000 },
        { name: "Espresso", qty: 1, price: 25000 },
      ],
    },
    {
      id: "M5",
      meja: "Meja 5",
      status: "batal",
      masuk: "14:50",
      waiter: "Andi",
      total: 80000,
      items: [
        { name: "Croissant", qty: 1, price: 30000 },
        { name: "Espresso", qty: 2, price: 25000 },
      ],
    },
    {
      id: "M6",
      meja: "Meja 6",
      status: "proses",
      masuk: "14:55",
      waiter: "Sarah",
      total: 110000,
      items: [
        { name: "Cake Coklat", qty: 2, price: 40000 },
        { name: "Croissant", qty: 1, price: 30000 },
      ],
    },
  ];

  const filteredOrders = orders.filter(
    (order) =>
      activeFilter === "semua" || order.status === activeFilter,
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

  const getDuration = () => {
    const seconds = now.getSeconds();
    return `40${seconds}m 33s`;
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
              <span className="text-sm text-gray-500">hau</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="p-8">
          {/* FILTER */}
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
                Menampilkan Pesanan
              </h3>

              <p className="text-gray-600 text-sm">
                {activeFilter === "semua"
                  ? "Semua pesanan ditampilkan"
                  : `Menampilkan pesanan ${activeFilter}`}
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
                className="bg-white rounded-2xl border border-gray-300 overflow-hidden shadow-sm"
              >
                {/* HEADER CARD */}
                <div className="bg-[#f2dfbf] p-4 border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm font-bold">
                        {order.id}
                      </span>

                      <h3 className="font-bold text-2xl mt-3">
                        {order.meja}
                      </h3>

                      <div className="text-sm mt-2 space-y-1">
                        <p>Masuk: {order.masuk}</p>

                        {order.status === "proses" && (
                          <p className="text-orange-600">
                            Durasi: {getDuration()}
                          </p>
                        )}

                        {order.status === "selesai" && (
                          <p className="text-green-600">
                            Selesai: {order.selesai}
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
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between"
                      >
                        <p>
                          {item.qty}x {item.name}
                        </p>

                        <span className="text-orange-600 font-semibold">
                          Rp {item.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER */}
                  <div className="pt-4">
                    <div className="flex justify-between font-bold text-xl">
                      <span>Total</span>

                      <span className="text-orange-600">
                        Rp {order.total.toLocaleString()}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mt-4">
                      Waiter: {order.waiter}
                    </p>
                  </div>
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
        </section>
      </main>
    </div>
  );
}