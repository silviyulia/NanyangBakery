"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {  Menu,BarChart3,Package,AlertTriangle,TrendingUp,User,LogOut,X, } from "lucide-react";
import { Table } from "flowbite-react";
import Link from "next/link";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {AreaChart,Area, XAxis, YAxis, Tooltip,ResponsiveContainer,} from "recharts";

// 🔹 TYPE
type Report = {
  id: number;
  produk: string;
  jumlah: number;
  total: number;
  tanggal: string;
};

export default function ReportsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [filterType, setFilterType] = useState("hari");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [filteredData, setFilteredData] = useState<Report[]>([]);

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

  // 🔹 DATA
  const reportData: Report[] = [
    { id: 1, produk: "Croissant", jumlah: 40, total: 400000, tanggal: "2026-04-24" },
    { id: 2, produk: "Roti Coklat", jumlah: 50, total: 500000, tanggal: "2026-04-24" },
    { id: 3, produk: "Kopi Latte", jumlah: 30, total: 300000, tanggal: "2026-04-24" },
  ];
  type Transaction = {id: string; tanggal: string; meja: string; items: number; total: number; metode: string; kasir: string;
  };

  // data grafik
  const chartData = reportData.map((item) => ({
  tanggal: item.tanggal,
  pendapatan: item.total,
}));

const transactionData: Transaction[] = [
  {
    id: "#001",
    tanggal: "05/04/2026 14:30",
    meja: "Meja 1",
    items: 4,
    total: 125000,
    metode: "Tunai",
    kasir: "Rina",
  },
  {
    id: "#002",
    tanggal: "05/04/2026 14:30",
    meja: "Meja 2",
    items: 4,
    total: 125000,
    metode: "Tunai",
    kasir: "Rina",
  },
];

  // 🔹 FILTER
  const handleFilter = () => {
    const today = new Date();

    const result = reportData.filter((item) => {
      const itemDate = new Date(item.tanggal);

      if (filterType === "hari") {
        return itemDate.toDateString() === today.toDateString();
      }

      if (filterType === "bulan") {
        return (
          itemDate.getMonth() === today.getMonth() &&
          itemDate.getFullYear() === today.getFullYear()
        );
      }

      if (filterType === "tahun") {
        return itemDate.getFullYear() === today.getFullYear();
      }

      if (filterType === "custom" && startDate && endDate) {
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      }

      return true;
    });

    setFilteredData(result);
  };

  const dataToShow = filteredData.length ? filteredData : reportData;

  // 🔹 SUMMARY (PAKAI DATA HASIL FILTER)
  const totalPendapatan = dataToShow.reduce((a, b) => a + b.total, 0);
  const totalProduk = dataToShow.reduce((a, b) => a + b.jumlah, 0);
  const [periode, setPeriode] = useState("hari_ini");
  const [tglMulai, setTglMulai] = useState("");
  const [tglSelesai, setTglSelesai] = useState("");
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dataToShow);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    XLSX.writeFile(wb, "laporan_keuangan.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Laporan Keuangan Bakery", 14, 15);

    doc.setFontSize(10);
    doc.text(`Total Pendapatan: Rp ${totalPendapatan.toLocaleString()}`, 14, 25);
    doc.text(`Total Produk: ${totalProduk}`, 14, 32);

    autoTable(doc, {
      startY: 40,
      head: [["ID", "Produk", "Jumlah", "Total", "Tanggal"]],
      body: dataToShow.map((item) => [
        item.id,
        item.produk,
        item.jumlah,
        `Rp ${item.total.toLocaleString()}`,
        item.tanggal,
      ]),
    });

    doc.save("laporan_keuangan.pdf");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
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
                item.href === "/owner/reports"
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

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
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
        <main className="flex-1 overflow-auto p-8">

     {/* FILTER LAPORAN */}
<div className="mb-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

  <p className="text-sm font-semibold text-gray-800 mb-5">
    Filter Laporan
  </p>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">

  {/* PERIODE */}
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-gray-500">
      Periode
    </label>

    <select
      value={periode}
      onChange={(e) => setPeriode(e.target.value)}
      className="w-full h-11 px-4 text-sm border border-gray-300 rounded-xl bg-white 
      focus:outline-none focus:ring-2 focus:ring-orange-300"
    >
      <option value="hari_ini">Hari Ini</option>
      <option value="kemarin">Kemarin</option>
      <option value="minggu_ini">Minggu Ini</option>
      <option value="bulan_ini">Bulan Ini</option>
      <option value="tahun_ini">Tahun Ini</option>
      <option value="kustom">Kustom</option>
    </select>
  </div>

  {/* TANGGAL MULAI */}
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-gray-500">
      Tanggal Mulai
    </label>

    <input
      type="date"
      value={tglMulai}
      onChange={(e) => setTglMulai(e.target.value)}
      disabled={periode !== "kustom"}
      className="w-full h-11 px-4 text-sm border border-gray-300 rounded-xl 
      focus:outline-none focus:ring-2 focus:ring-orange-300
      disabled:bg-gray-100"
    />
  </div>

  {/* TANGGAL SELESAI */}
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-gray-500">
      Tanggal Selesai
    </label>

    <input
      type="date"
      value={tglSelesai}
      onChange={(e) => setTglSelesai(e.target.value)}
      disabled={periode !== "kustom"}
      className="w-full h-11 px-4 text-sm border border-gray-300 rounded-xl 
      focus:outline-none focus:ring-2 focus:ring-orange-300
      disabled:bg-gray-100"
    />
  </div>

</div>

  {/* BUTTON HARUS DI DALAM DIV INI */}
  <div className="flex gap-3 pt-3 border-t">

    <button
      onClick={handleFilter}
      className="bg-orange-500 text-white px-4 py-2 rounded-xl"
    >
      Tampilkan Laporan
    </button>

    <button
      onClick={downloadPDF}
      className="border px-4 py-2 rounded-xl"
    >
      Download PDF
    </button>

    <button
      onClick={downloadExcel}
      className="border px-4 py-2 rounded-xl"
    >
      Download Excel
    </button>

  </div>
</div>

          {/* SUMMARY */}
          <div className="grid md:grid-cols-3 gap-4">

            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-400">
              <p>Total Pendapatan</p>
              <h3 className="text-2xl font-bold">
                Rp {totalPendapatan.toLocaleString()}
              </h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-400">
              <p>Total Produk</p>
              <h3 className="text-2xl font-bold">{totalProduk}</h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-orange-400">
              <p>Produk Terlaris</p>
              <h3 className="text-2xl font-bold">Croissant</h3>
            </div>
       </div>

<div className="bg-white p-6 rounded-xl shadow">
  <h3 className="font-bold mb-4 text-amber-950">
    Grafik Pendapatan
  </h3>

  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={chartData}>
      <XAxis dataKey="tanggal" />
      <YAxis />
      <Tooltip />
      <Area
        type="monotone"
        dataKey="pendapatan"
        stroke="#f97316"
        fill="#fdba74"
      />
    </AreaChart>
  </ResponsiveContainer>
</div>

<div className="bg-white p-6 rounded-xl shadow">
  <h3 className="font-bold mb-4 text-amber-950">
    Detail Transaksi
  </h3>

  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-100">
        <tr>
          <th className="px-6 py-3">No</th>
          <th className="px-6 py-3">Tanggal</th>
          <th className="px-6 py-3">Meja</th>
          <th className="px-6 py-3">Items</th>
          <th className="px-6 py-3">Total</th>
          <th className="px-6 py-3">Metode</th>
          <th className="px-6 py-3">Kasir</th>
        </tr>
      </thead>

      <tbody>
        {transactionData.map((trx, i) => (
          <tr
            key={i}
            className="bg-white border-b hover:bg-orange-50"
          >
            <td className="px-6 py-4 font-medium text-gray-900">
              {trx.id}
            </td>

            <td className="px-6 py-4">{trx.tanggal}</td>

            <td className="px-6 py-4">{trx.meja}</td>

            <td className="px-6 py-4">
              {trx.items} items
            </td>

            <td className="px-6 py-4">
              Rp {trx.total.toLocaleString()}
            </td>

            <td className="px-6 py-4">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                {trx.metode}
              </span>
            </td>

            <td className="px-6 py-4">{trx.kasir}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
        </main>
      </div>
    </div>
  );
}