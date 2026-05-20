"use client";
import Sidebar from "./components/Sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";
import MenuCard, { MenuItem } from "@/app/waitres/MenuCard";
import { usePathname } from "next/navigation";
export default function KasirDashboard() {
  const orders = [
    {
      id: "M1",
      meja: "Meja 1",
      status: "selesai",
      statusColor: "bg-green-200 text-green-700",
      masuk: "14:32",
      selesai: "-",
      waiter: "Sarah",
      total: "Rp 125.000",
      items: [
        { name: "Croissant", qty: 2, price: "Rp 30.000" },
        { name: "Expresso", qty: 1, price: "Rp 25.000" },
        { name: "Cake coklat", qty: 1, price: "Rp 40.000" },
      ],
    },
    {
      id: "M2",
      meja: "Meja 2",
      status: "selesai",
      statusColor: "bg-red-200 text-red-700",
      masuk: "14:35",
      selesai: "-",
      waiter: "Ayu",
      total: "Rp 55.000",
      items: [
        { name: "Croissant", qty: 1, price: "Rp 30.000" },
        { name: "Expresso", qty: 1, price: "Rp 25.000" },
      ],
    },
    {
      id: "M3",
      meja: "Meja 3",
      status: "selesai",
      statusColor: "bg-blue-200 text-blue-700",
      masuk: "14:40",
      selesai: "17:25",
      waiter: "Dita",
      total: "Rp 110.000",
      items: [
        { name: "Croissant", qty: 1, price: "Rp 30.000" },
        { name: "Cake coklat", qty: 2, price: "Rp 40.000" },
      ],
    },
  ];

  return (
    
    <div className="min-h-screen bg-[#f4ece7] flex">
     <Sidebar />
      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-[#b65a00] px-8 py-5 flex items-center justify-between shadow-md">
          <h2 className="text-4xl font-bold text-white">Dashboard Kasir</h2>

          <div className="bg-white rounded-full px-5 py-2 flex items-center gap-3 shadow">
            <div className="w-10 h-10 rounded-full border flex items-center justify-center">
              👤
            </div>
            <div>
              <p className="font-bold text-[#b65a00] leading-none">kasir</p>
              <span className="text-sm text-gray-500">hau</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="p-8">
          {/* Filter */}
          <div className="flex gap-8 mb-10">
            <button className="bg-orange-500 text-white px-10 py-3 rounded-2xl font-bold text-2xl shadow">
              Semua
            </button>

            <button className="bg-gray-100 text-gray-700 px-10 py-3 rounded-2xl font-bold text-2xl border shadow-sm hover:bg-gray-200 transition">
              Proses
            </button>

            <button className="bg-gray-100 text-gray-700 px-10 py-3 rounded-2xl font-bold text-2xl border shadow-sm hover:bg-gray-200 transition">
              selesai
            </button>

            <button className="bg-gray-100 text-gray-700 px-10 py-3 rounded-2xl font-bold text-2xl border shadow-sm hover:bg-gray-200 transition">
              Dibatalkan
            </button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-orange-200 shadow-md overflow-hidden"
              >
                {/* Top */}
                <div className="bg-[#f2dfbf] p-4 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      {order.id}
                    </span>

                    <span
                      className={`px-5 py-1 rounded-full text-sm font-bold ${order.statusColor}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <h3 className="text-2xl font-semibold text-gray-700">
                    {order.meja}
                  </h3>

                  <p className="text-sm text-gray-600 mt-2">
                    Masuk : {order.masuk}
                  </p>

                  <p className="text-sm text-gray-600">
                    Selesai : {order.selesai}
                  </p>
                </div>

                {/* Items */}
                <div className="p-4 border-b space-y-4 min-h-[170px]">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-lg"
                    >
                      <p className="text-gray-700">
                        {item.qty}x {item.name}
                      </p>
                      <span className="text-orange-500 font-medium">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="text-3xl font-semibold text-gray-700">
                      Total :
                    </h4>

                    <span className="text-orange-500 text-xl font-semibold">
                      {order.total}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    Waitres: {order.waiter}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
