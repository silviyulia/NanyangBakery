"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import Link from "next/link";

export default function RecipesPage() {
  const router = useRouter();
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

  const [showModal, setShowModal] = useState(false);
const [activeTab, setActiveTab] = useState("Semua");

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
                item.href === "/owner/recipes"
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
            <h2 className="text-3xl font-bold">Resep Produk</h2>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#f6efe9]">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Resep Produk</h2>

            <button
              onClick={() => setShowModal(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg"
            >
              + Tambah Resep
            </button>
          </div>


          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setShowModal(false)}
              ></div>
              {/* MODAL */}
              <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 z-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Tambah Resep</h3>

                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-black text-xl"
                  >
                    ✖
                  </button>
                </div>
                {/* FORM */}
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nama produk"
                    className="w-full border px-3 py-2 rounded-lg"
                  />
                  <select className="w-full border px-3 py-2 rounded-lg">
                    <option>Roti&Pastry</option>
                    <option>Kue&Cake</option>
                    <option>Minuman</option>
                  </select>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        placeholder="Nama bahan"
                        className="flex-1 border px-3 py-2 rounded-lg"
                      />
                      <input
                        placeholder="Jumlah"
                        className="flex-1 border px-3 py-2 rounded-lg"
                      />
                    </div>

                    <div className="flex gap-2">
                      <input
                        placeholder="Nama bahan"
                        className="flex-1 border px-3 py-2 rounded-lg"
                      />
                      <input
                        placeholder="Jumlah"
                        className="flex-1 border px-3 py-2 rounded-lg"
                      />
                    </div>
                  </div>

                  <button className="text-orange-500 text-sm">
                    + Tambah bahan
                  </button>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Batal
                  </button>

                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
                    Simpan
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB CATEGORY */}
          <div className="flex gap-3">
            {["Semua", "Roti&Pastry", "Kue&Cake", "Minuman"].map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* CARD */}
            {[{
              name: "Croissant",
              category: "Roti&Pastry",
              image: "🥐",
              bahan: [
                ["Tepung terigu", "60 gram"],
                ["Margarin", "25 gram"],
                ["Ragi instan", "5 gram"],
                ["Garam", "12 gram"],
                ["Gula pasir", "10 gram"],
                ["Susu cair", "50 ml"],
                ["Telur", "1 butir (60 gram)"],
              ],
            },
            {
              name: "Red Velvet",
              category: "Kue&Cake",
              image: "🍰",
              bahan: [
                ["Tepung terigu", "260 gram"],
                ["Margarin", "115 gram"],
                ["Bubuk kakao", "20 gram"],
                ["Garam", "12 gram"],
                ["Gula pasir", "250 gram"],
                ["Susu cair", "240 ml"],
                ["Telur", "2 butir (120 gram)"],
              ],
            }].map((item, i) => (

              <div key={i} className="bg-white rounded-2xl shadow border overflow-hidden">

                {/* HEADER CARD */}
                <div className="flex justify-between items-center p-4 bg-orange-100">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{item.image}</div>
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.category}</p>
                    </div>
                  </div>

                  <button className="bg-gray-300 px-4 py-1 rounded-full text-sm">
                    Edit
                  </button>
                </div>

                {/* BODY */}
                <div className="p-4">
                  <p className="text-sm mb-3 font-medium">
                    Komposisi per 1 unit:
                  </p>

                  <div className="space-y-2">
                    {item.bahan.map((b, idx) => (
                      <div key={idx} className="flex justify-between bg-gray-100 px-3 py-2 rounded">
                        <span>{b[0]}</span>
                        <span>{b[1]}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    Max unit : 50
                  </p>
                </div>

              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
