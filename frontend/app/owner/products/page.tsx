"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  User,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const menuItems = [
    { name: "Dashboard", icon: "📊", href: "/owner" },
    { name: "Pesanan Real-time", icon: "🛒", href: "/owner/orders" },
    { name: "Laporan", icon: "📄", href: "/owner/reports" },
    { name: "Produk & Menu", icon: "🍪", href: "/owner/products" },
    { name: "Stok Bahan", icon: "📦", href: "/owner/inventory" },
    { name: "Resep Produk", icon: "👨‍🍳", href: "/owner/recipes" },
    { name: "Karyawan", icon: "👥", href: "/owner/employees" },
  ];

  // 🔥 DATA PRODUK
  const products = [
    { id: 1, name: "Croissant", category: "Roti & Pastry", price: 30000, stock: 20, sold: 40, status: "Aktif" },
    { id: 2, name: "Chocolate Cake", category: "Kue & Cake", price: 45000, stock: 15, sold: 30, status: "Aktif" },
    { id: 3, name: "Espresso", category: "Minuman", price: 20000, stock: 25, sold: 50, status: "Aktif" },
    { id: 4, name: "Baguette", category: "Roti & Pastry", price: 28000, stock: 18, sold: 35, status: "Aktif" },
    { id: 5, name: "Red Velvet", category: "Kue & Cake", price: 40000, stock: 10, sold: 20, status: "Nonaktif" },
    { id: 6, name: "Cappuccino", category: "Minuman", price: 25000, stock: 22, sold: 45, status: "Aktif" },
    { id: 7, name: "Danish Pastry", category: "Roti & Pastry", price: 32000, stock: 12, sold: 28, status: "Aktif" },
    { id: 8, name: "Brownies", category: "Kue & Cake", price: 35000, stock: 14, sold: 33, status: "Aktif" },
  ];

  // 🔥 KATEGORI DINAMIS
  const categories = ["Semua", ...new Set(products.map(p => p.category))];

  // 🔥 FILTER LOGIC
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      activeCategory === "Semua" || product.category === activeCategory;

    const matchStatus =
      statusFilter === "Semua" || product.status === statusFilter;

    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="flex h-screen bg-gray-50">

      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0"} bg-gradient-to-b from-amber-800 to-amber-900 text-white transition-all duration-300 overflow-hidden flex flex-col shadow-lg`}>
        <div className="p-6 border-b border-amber-700">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 rounded-lg p-2 font-bold text-lg">🥖</div>
            <div>
              <h1 className="font-bold text-lg">Bakery POS</h1>
              <p className="text-xs text-amber-200">Owner</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, idx) => (
            <Link key={idx} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                item.href === "/owner/products"
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
          <button onClick={() => router.push("/login")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition text-white">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER*/}
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
        <main className="p-8 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-bold">Produk & Menu</h2>
              <p className="text-gray-500 text-sm">Kelola produk</p>
            </div>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
              + Tambah Produk
            </button>
          </div>

          {/* SEARCH + FILTER */}
          <div className="bg-white p-4 rounded-xl flex gap-3">
            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border px-3 py-2 rounded-lg"
            />

            <select
              onChange={(e) => setActiveCategory(e.target.value)}
              className="border px-3 py-2 rounded-lg"
            >
              {categories.map((cat, i) => (
                <option key={i}>{cat}</option>
              ))}
            </select>

            <select
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-3 py-2 rounded-lg"
            >
              <option>Semua</option>
              <option>Aktif</option>
              <option>Nonaktif</option>
            </select>
          </div>

          {/* TAB CATEGORY */}
          <div className="flex gap-3">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeCategory === cat
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-xl border shadow ">

                <div className="h-32 bg-gray-200 flex items-center justify-center">
                  Foto
                </div>

                <h3 className="font-bold mt-2">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.category}</p>

                <p className="text-orange-500 font-bold">
                  Rp {p.price.toLocaleString()}
                </p>

                <div className="text-xs flex justify-between mt-2">
                  <span>Stok: {p.stock}</span>
                  <span>Terjual: {p.sold}</span>
                </div>

                <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
                  p.status === "Aktif"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}>
                  {p.status}
                </span>
                 {/* BUTTON */}
                  <div className="flex gap-2 pt-3">
                    <button className="flex-1 border rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-1 hover:bg-gray-50">
                      ✏️ Edit
                    </button>

                    <button className="border rounded-lg px-3 text-red-500 hover:bg-red-50">
                      🗑️
                    </button>


              </div>
              </div>
              
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}