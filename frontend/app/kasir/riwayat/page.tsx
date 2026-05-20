"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MenuCard, { MenuItem } from "@/app/waitres/MenuCard";
import { usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";

export default function RiwayatPage() {
  const transaksi = [
    {
      no: 1,
      tanggal: "2023-10-01",
      meja: "Meja 5",
      items: "Croissant, Espresso",
      total: "Rp 50.000",
      metode: "Cash",
      kasir: "Kasir 1",
    },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
  <div className="min-h-screen bg-amber-50">
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-amber-800 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-4">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-2xl"
            >
              ☰
            </button>

            <div className="text-2xl font-bold">🍞</div>

            <h1 className="text-lg font-semibold">
              Kasir - Nanyang Bakery
            </h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <button className="text-sm text-amber-100 hover:text-white transition">
              👤 Kasir
            </button>

            <Link
              href="/login"
              className="bg-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= LAYOUT ================= */}
      <div className="flex pt-20">
        {/* ================= SIDEBAR ================= */}

        {/* MOBILE OVERLAY */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
            fixed top-20 left-0 z-50 h-[calc(100vh-80px)]
            w-64 bg-white shadow-lg transition-transform duration-300
            lg:translate-x-0 lg:static lg:h-auto lg:shadow-none
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >
          <Sidebar />
        </aside>

      <main className="flex-1">
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

        <section className="p-10">
          <h1 className="text-5xl font-bold text-black mb-10">
            Riwayat Transaksi
          </h1>

          <div className="bg-[#efefef] rounded-3xl border border-gray-300 p-8 min-h-[500px] shadow-sm overflow-auto">
            <table className="w-full border border-gray-500 text-center">
              <thead className="bg-gray-300 text-black">
                <tr>
                  <th className="border border-gray-500 px-4 py-4">NO</th>
                  <th className="border border-gray-500 px-4 py-4">Tanggal</th>
                  <th className="border border-gray-500 px-4 py-4">Meja</th>
                  <th className="border border-gray-500 px-4 py-4">Items</th>
                  <th className="border border-gray-500 px-4 py-4">Total</th>
                  <th className="border border-gray-500 px-4 py-4">Metode</th>
                  <th className="border border-gray-500 px-4 py-4">Kasir</th>
                  <th className="border border-gray-500 px-4 py-4">Struk</th>
                </tr>
              </thead>

              <tbody>
                {transaksi.map((item, index) => (
                  <tr key={index} className="bg-white">
                    <td className="border border-gray-500 px-4 py-4 font-semibold">
                      {item.no}
                    </td>
                    <td className="border border-gray-500 px-4 py-4">
                      {item.tanggal}
                    </td>
                    <td className="border border-gray-500 px-4 py-4 font-semibold">
                      {item.meja}
                    </td>
                    <td className="border border-gray-500 px-4 py-4 font-semibold">
                      {item.items}
                    </td>
                    <td className="border border-gray-500 px-4 py-4 font-semibold">
                      {item.total}
                    </td>
                    <td className="border border-gray-500 px-4 py-4 font-semibold">
                      {item.metode}
                    </td>
                    <td className="border border-gray-500 px-4 py-4 font-semibold">
                      {item.kasir}
                    </td>
                    <td className="border border-gray-500 px-4 py-4">
                      <button className="bg-green-200 text-green-700 px-5 py-1 rounded-full font-medium hover:bg-green-300 transition">
                        Unduh
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  </div>
  );
}

