"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, User, LogOut, X } from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Semua");
  const [showTambahModal, setShowTambahModal] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);

const [selectedItem, setSelectedItem] = useState<any>(null);
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
    { name: "Produksi harian", icon: "🏭", href: "/owner/productions" },
    { name: "Stok Bahan Baku", icon: "📦", href: "/owner/inventory" },
    { name: "Resep Produk", icon: "👨‍🍳", href: "/owner/recipes" },
    { name: "Karyawan", icon: "👥", href: "/owner/employees" },
  ];

  // DATA
  const [stockData, setStockData] = useState<any[]>([]);
  const loadInventory = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/inventory");

      const data = await res.json();

      setStockData(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    loadInventory();
  }, []);

  const handleAddIngredient = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredient_name: form.nama,
          qty: Number(form.stok),
          unit: form.satuan,
          minimum_stock: Number(form.min),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      await loadInventory();
      setForm({
        nama: "",
        stok: "",
        satuan: "Kg",
        min: "",
      });
      setShowTambahModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  // STATUS LOGIC
const getStatus = (qty: number, minimum_stock: number) => {
  if (qty <= minimum_stock ) return "kritis";
  if (qty <= minimum_stock * 2) return "rendah";
  return "normal";
};

  const lowStockItems = stockData.filter(
    (item) => Number(item.qty) <= Number(item.minimum_stock),
  );
  // FILTER
  const filteredData = stockData.filter((item) => {
    const status = getStatus(Number(item.qty), Number(item.minimum_stock));
    if (activeTab === "Semua") return true;
    if (activeTab === "Stok normal") return status === "normal";
    if (activeTab === "Stok rendah") return status === "rendah";
    if (activeTab === "Menipis") return status === "kritis";

    return true;
  });

const handleInputStock = async () => {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/api/inventory/${selectedItem.ingredient_id}/stock`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qty: Number(inputStok),
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    await loadInventory();

    setShowInputModal(false);
    setInputStok("");
    setSelectedItem(null);
  } catch (error) {
    console.error(error);
  }
};

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

{showInputModal && selectedItem && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => setShowInputModal(false)}
    />

    <div className="relative bg-white p-6 rounded-xl shadow-lg w-full max-w-md z-10">
      <h3 className="text-lg font-bold mb-4">
        Input Stok - {selectedItem.ingredient_name}
      </h3>

      <input
        type="number"
        placeholder="Jumlah stok masuk"
        value={inputStok}
        onChange={(e) => setInputStok(e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
      />

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setShowInputModal(false)}
          className="px-4 py-2 border rounded-lg"
        >
          Batal
        </button>

        <button
          onClick={handleInputStock}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg"
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
)}

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
              🔔 Notifikasi ({lowStockItems.length})
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
            <button
              onClick={() => setShowTambahModal(true)}
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
                    onChange={(e) =>
                      setForm({ ...form, satuan: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded-lg"
                  >
                    <option>Kg</option>
                    <option>Liter</option>
                    <option>Gram</option>
                  </select>

                  <input
                    type="number"
                    placeholder="Batas minimum"
                    value={form.min}
                    onChange={(e) => setForm({ ...form, min: e.target.value })}
                    className="w-full border px-3 py-2 rounded-lg"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-5">
                  <button
                    onClick={() => setShowTambahModal(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Batal
                  </button>

                  <button
                    onClick={handleAddIngredient}
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
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Nama Bahan</th>
                    <th className="px-6 py-3">Stok</th>
                    <th className="px-6 py-3">Satuan</th>
                    <th className="px-6 py-3">Minimum</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => {
                      const status = getStatus(
                        Number(item.qty),
                        Number(item.minimum_stock),
                      );

                      return (
                        <tr
                          key={item.ingredient_id}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {item.ingredient_name}
                          </td>

                          <td className="px-6 py-4">{item.qty}</td>

                          <td className="px-6 py-4">{item.unit}</td>

                          <td className="px-6 py-4">{item.minimum_stock}</td>

                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
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

                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setShowInputModal(true);
                              }}
                              className="font-medium text-orange-600 hover:underline"
                            >
                              tambah jumlah
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        Tidak ada data stok bahan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
