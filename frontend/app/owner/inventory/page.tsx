"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, User, LogOut, X } from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Semua");
  const [showTambahModal, setShowTambahModal] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [inputStok, setInputStok] = useState("");

  // form tambah bahan
  const [form, setForm] = useState({
    nama: "",
    stok: "",
    satuan: "Kg",
    min: "",
  });

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

  // DATA
  const stockData = [
    { nama: "Tepung terigu", stok: 2.5, satuan: "Kg", min: 5 },
    { nama: "Gula pasir", stok: 2.5, satuan: "Kg", min: 5 },
    { nama: "Margarin", stok: 2.5, satuan: "Kg", min: 5 },
    { nama: "Ragi Instan", stok: 2.5, satuan: "Kg", min: 2 },
    { nama: "Telur", stok: 3, satuan: "Kg", min: 10 },
    { nama: "Susu cair", stok: 1.5, satuan: "Liter", min: 5 },
    { nama: "Garam", stok: 5, satuan: "Kg", min: 3 },
    { nama: "Coklat bubuk", stok: 8, satuan: "Kg", min: 5 },
    { nama: "Baking soda", stok: 7, satuan: "Kg", min: 3 },
  ];

  // STATUS LOGIC
  const getStatus = (stok: number, min: number) => {
    if (stok <= min * 0.5) return "kritis";
    if (stok < min) return "rendah";
    return "normal";
  };

  // FILTER
  const filteredData = stockData.filter((item) => {
    const status = getStatus(item.stok, item.min);

    if (activeTab === "Semua") return true;
    if (activeTab === "Stok normal") return status === "normal";
    if (activeTab === "Stok rendah") return status === "rendah";
    if (activeTab === "Menipis") return status === "kritis";

    return true;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      {/* SIDEBAR */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-0"} bg-gradient-to-b from-amber-800 to-amber-900 text-white transition-all duration-300 overflow-hidden flex flex-col shadow-lg`}
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
                item.href === "/owner/inventory"
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
        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* TITLE */}
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold">Manajemen stok bahan baku</h2>
            <button onClick={() => setShowTambahModal(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg"
            >
              + Tambah Stok
            </button>
          </div>
{showTambahModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">

    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => setShowTambahModal(false)}
    ></div>

    <div className="relative bg-white w-full max-w-md rounded-2xl shadow-lg p-6 z-10">

      <h3 className="text-lg font-bold mb-4">Tambah Bahan</h3>

      <div className="space-y-3">
        <input
          placeholder="Nama bahan"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          className="w-full border px-3 py-2 rounded-lg"
        />

        <input
          type="number"
          placeholder="jumlah stok"
          value={form.stok}
          onChange={(e) => setForm({ ...form, stok: e.target.value })}
          className="w-full border px-3 py-2 rounded-lg"
        />

        <select
          value={form.satuan}
          onChange={(e) => setForm({ ...form, satuan: e.target.value })}
          className="w-full border px-3 py-2 rounded-lg"
        >
          <option>Kg</option>
          <option>Liter</option>
          <option>Gram</option>
        </select>

        {/* <input
          type="number"
          placeholder="Batas minimum"
          value={form.min}
          onChange={(e) => setForm({ ...form, min: e.target.value })}
          className="w-full border px-3 py-2 rounded-lg"
        /> */}
      </div>

      <div className="flex justify-end gap-3 mt-5">
        <button
          onClick={() => setShowTambahModal(false)}
          className="px-4 py-2 border rounded-lg"
        >
          Batal
        </button>

        <button
          onClick={() => {
            // nanti bisa connect ke state/database
            setShowTambahModal(false);
          }}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Simpan
        </button>
      </div>

    </div>
  </div>
)}
          {/* TAB */}
          <div className="flex gap-3">
            {["Semua", "Stok normal", "Stok rendah", "Menipis"].map(
              (tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full text-sm ${
                    activeTab === tab
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ),
            )}
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3">Nama bahan</th>
                    <th className="px-6 py-3">Stok</th>
                    <th className="px-6 py-3">Satuan</th>
                    <th className="px-6 py-3">Min</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map((item, i) => {
                    const status = getStatus(item.stok, item.min);

                    return (
                      <tr key={i} className="border-t">
                        <td className="px-6 py-4">{item.nama}</td>
                        <td className="px-6 py-4">{item.stok}</td>
                        <td className="px-6 py-4">{item.satuan}</td>
                        <td className="px-6 py-4">{item.min}</td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              status === "normal"
                                ? "bg-green-100 text-green-700"
                                : status === "rendah"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button className="text-orange-500 hover:underline">
                            Input stok
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
