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

export default function EmployeesPage() {
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

  const [form, setForm] = useState({
    nama: "",
    email: "",
    telp: "",
    posisi: "Waitress",
  });

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
                item.href === "/owner/employees"
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

      {/*MODAL POP UP TAMBAH WARYAWAN */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowModal(false)}
          ></div>
          {/* MODAL */}
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-lg p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Tambah Karyawan</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-black text-xl"
              >
                ✖
              </button>
            </div>
            {/* FORM */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nama"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className="w-full border px-3 py-2 rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border px-3 py-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="No. Telepon"
                value={form.telp}
                onChange={(e) => setForm({ ...form, telp: e.target.value })}
                className="w-full border px-3 py-2 rounded-lg"
              />
              <select
                value={form.posisi}
                onChange={(e) => setForm({ ...form, posisi: e.target.value })}
                className="w-full border px-3 py-2 rounded-lg"
              >
                <option>Waitress</option>
                <option>Kasir</option>
                <option>Baker</option>
                <option>Barista</option>
              </select>
            </div>

            {/* ACTION */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Batal
              </button>

              <button
                onClick={() => {
                  alert("Karyawan berhasil ditambahkan (dummy)");
                  setShowModal(false);

                  // reset form
                  setForm({
                    nama: "",
                    email: "",
                    telp: "",
                    posisi: "Waitress",
                  });
                }}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-gradient-to-r from-amber-800 to-amber-900 text-white shadow-md p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X /> : <Menu />}
            </button>
            <h2 className="text-3xl font-bold">Karyawan</h2>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-8 space-y-6">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Data Karyawan</h2>

            <button
              onClick={() => setShowModal(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg"
            >
              + Tambah Karyawan
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow border overflow-x-auto">
            <table className="w-full text-sm text-left">
              {/* HEADER */}
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-6 py-3">No.</th>
                  <th className="px-6 py-3">Nama</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">No. Telepon</th>
                  <th className="px-6 py-3">Posisi</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {[
                  {
                    nama: "Sarah Riyanti",
                    email: "sarah@gmail.com",
                    telp: "09826251678",
                    posisi: "Waitress",
                  },
                  {
                    nama: "Ayu Asri",
                    email: "ayu@gmail.com",
                    telp: "09826251678",
                    posisi: "Waitress",
                  },
                  {
                    nama: "Bagus",
                    email: "bagus@gmail.com",
                    telp: "09826251678",
                    posisi: "Waitress",
                  },
                  {
                    nama: "Dika",
                    email: "dika@gmail.com",
                    telp: "09826251678",
                    posisi: "Kasir",
                  },
                ].map((emp, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{i + 1}</td>
                    <td className="px-6 py-4 font-medium">{emp.nama}</td>
                    <td className="px-6 py-4">{emp.email}</td>
                    <td className="px-6 py-4">{emp.telp}</td>
                    <td className="px-6 py-4">{emp.posisi}</td>

                    {/* AKSI */}
                    <td className="px-6 py-4 text-center space-x-2">
                      <button className="text-blue-500 hover:underline text-sm">
                        Edit
                      </button>
                      <button className="text-red-500 hover:underline text-sm">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
