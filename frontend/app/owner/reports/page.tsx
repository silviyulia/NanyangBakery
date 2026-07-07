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
import { Table } from "flowbite-react";
import Link from "next/link";
import XLSX from "xlsx-js-style";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 🔹 TYPE
type Transaction = {
  id: number;
  created_at: string;
  table_id: number;
  items?: {
    quantity: number;
    product?: {
      name: string;
      price: number;
    };
  }[];
  total_amount: string;
  status: string;
  transaction?: {
    transaction_id: number;
    kasir?: {
      name: string;
      user_id?: number;
    } | null;
    waitres?: {
      name: string;
    };
  };
};

export default function ReportsPage() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // DATA LAPORAN
  const [filteredData, setFilteredData] = useState<Transaction[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  // FILTER
  const [periode, setPeriode] = useState("hari_ini");
  const [tglMulai, setTglMulai] = useState("");
  const [tglSelesai, setTglSelesai] = useState("");

  // TRANSAKSI
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);

  // PRODUK TERLARIS
  const [produkTerlaris, setProdukTerlaris] = useState("-");

  // MENU SIDEBAR
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

  // AMBIL DATA TRANSAKSI
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setTransactionData(data);
      })
      .catch((err) => console.error(err));
  }, []);

  //Produk terlaris
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/reports/summary")
      .then((res) => res.json())
      .then((data) => {
        if (data.produkTerlaris) {
          setProdukTerlaris(data.produkTerlaris);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleFilter = () => {
    let result = [...transactionData];

    if (periode === "hari_ini") {
      const today = new Date();

      result = transactionData.filter((trx) => {
        const date = new Date(trx.created_at);

        return (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      });
    } else if (periode === "bulan_ini") {
      const now = new Date();

      result = transactionData.filter((trx) => {
        const date = new Date(trx.created_at);

        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      });
    } else if (periode === "tahun_ini") {
      const year = new Date().getFullYear();

      result = transactionData.filter((trx) => {
        return new Date(trx.created_at).getFullYear() === year;
      });
    } else if (periode === "kustom" && tglMulai && tglSelesai) {
      result = transactionData.filter((trx) => {
        const date = new Date(trx.created_at);

        return date >= new Date(tglMulai) && date <= new Date(tglSelesai);
      });
    } else if (periode === "kemarin") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const dateString = yesterday.toISOString().split("T")[0];

      result = transactionData.filter((trx) =>
        trx.created_at.startsWith(dateString),
      );
    } else if (periode === "minggu_ini") {
      const now = new Date();

      const firstDay = new Date(now);
      firstDay.setDate(now.getDate() - now.getDay());

      result = transactionData.filter((trx) => {
        const d = new Date(trx.created_at);
        return d >= firstDay && d <= now;
      });
    }

    setFilteredData(result);
    setFilteredData(result);
    setIsFiltered(true);
  };

  const dataToShow = isFiltered ? filteredData : transactionData;
  const transaksiSelesai = dataToShow.filter((trx) => trx.status === "selesai");

  const totalPendapatan = transaksiSelesai.reduce(
    (sum, trx) => sum + Number(trx.total_amount || 0),
    0,
  );

  const totalProduk = transaksiSelesai.reduce(
    (sum, trx) =>
      sum + (trx.items?.reduce((total, item) => total + item.quantity, 0) || 0),
    0,
  );

  const chartData = transaksiSelesai.map((trx) => ({
    tanggal: new Date(trx.created_at).toLocaleDateString("id-ID"),

    pendapatan: Number(trx.total_amount),
  }));

  //DOWNLOAD EXCEL
  const downloadExcel = () => {
    const data: any[] = [];

    // RINGKASAN
    data.push({
      Keterangan: " RINGKASAN LAPORAN= ",
    });
    data.push({
      Keterangan: "Total Pendapatan",
      Nilai: totalPendapatan,
    });
    data.push({
      Keterangan: "Total Produk Terjual",
      Nilai: totalProduk,
    });
    data.push({
      Keterangan: "Produk Terlaris",
      Nilai: produkTerlaris,
    });
    data.push({});
    data.push({});
    data.push({
      Keterangan: " DETAIL TRANSAKSI= ",
    });
    transaksiSelesai.forEach((trx) => {
      data.push({
        ID: trx.id,
        Tanggal: new Date(trx.created_at).toLocaleDateString("id-ID"),
        Meja: trx.table_id,
        Kasir: trx.transaction?.kasir?.name || "-",
        Total: Number(trx.total_amount),
        Status: trx.status,
      });

      // PRODUK DALAM TRANSAKSI
      trx.items?.forEach((item: any) => {
        data.push({
          Produk: item.product?.name || "-",
          Qty: item.quantity,
          Harga: Number(item.price),
          Subtotal: Number(item.price) * item.quantity,
        });
      });

      data.push({});
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    XLSX.writeFile(wb, "Laporan_Bakery.xlsx");
  };

  //DOWNLOAD PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("LAPORAN PENJUALAN BAKERY", 14, 18);
    doc.setFontSize(11);
    doc.text(
      `Tanggal Cetak : ${new Date().toLocaleDateString("id-ID")}`,
      14,
      26,
    );

    // TOTAL
    const transaksiSelesai = dataToShow.filter(
      (trx) => trx.status === "selesai",
    );
    const totalPendapatan = transaksiSelesai.reduce(
      (sum, trx) => sum + Number(trx.total_amount),
      0,
    );
    const totalProduk = transaksiSelesai.reduce(
      (sum, trx) =>
        sum +
        (trx.items?.reduce((subtotal, item) => subtotal + item.quantity, 0) ||
          0),
      0,
    );

    doc.setFontSize(13);
    doc.text("Ringkasan", 14, 38);

    autoTable(doc, {
      startY: 42,
      head: [["Keterangan", "Nilai"]],
      body: [
        ["Total Pendapatan", `Rp ${totalPendapatan.toLocaleString("id-ID")}`],
        ["Jumlah Transaksi", transaksiSelesai.length],
        ["Total Produk Terjual", totalProduk],
      ],
    });

    // PRODUK TERJUAL
    const produkMap: any = {};
    transaksiSelesai.forEach((trx) => {
      trx.items?.forEach((item) => {
        const nama = item.product?.name || "Produk";
        if (!produkMap[nama]) {
          produkMap[nama] = 0;
        }
        produkMap[nama] += item.quantity;
      });
    });
    const produkRows = Object.entries(produkMap).map(([nama, qty]: any) => [
      nama,
      qty,
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [["Produk", "Jumlah Terjual"]],
      body: produkRows,
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [["No", "Tanggal", "Meja", "Item", "Total", "Status", "Kasir"]],
      body: transaksiSelesai.map((trx) => {
        const daftarProduk =
          trx.items && trx.items.length > 0
            ? trx.items
                .map(
                  (item) =>
                    `${item.product?.name ?? "Produk"} (${item.quantity})`,
                )
                .join("\n")
            : "-";

        return [
          String(trx.id),
          new Date(trx.created_at).toLocaleDateString("id-ID"),
          `Meja ${trx.table_id}`,
          daftarProduk,
          `Rp ${Number(trx.total_amount).toLocaleString("id-ID")}`,
          trx.status,
          trx.transaction?.kasir?.name || "-",
        ];
      }),
      styles: {
        cellPadding: 3,
        fontSize: 9,
        valign: "middle",
      },
    });
    doc.save("Laporan_Penjualan_Bakery.pdf");
  };

  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/inventory")
      .then((res) => res.json())
      .then((data) => setInventory(data))
      .catch(console.error);
  }, []);

  const lowStockItems = inventory.filter(
    (item) => Number(item.qty) <= Number(item.minimum_stock),
  );

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
        <main className="flex-1 overflow-auto p-4">
          {/* FILTER LAPORAN */}
          <div className="mb-3 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              Filter Laporan
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
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
                Rp {Number(totalPendapatan).toLocaleString("id-ID")}
              </h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-400">
              <p>Total Produk</p>
              <h3 className="text-2xl font-bold">{totalProduk}</h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-orange-400">
              <p>Produk Terlaris</p>
              <h3 className="text-2xl font-bold">{produkTerlaris}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold mb-4 text-amber-950">Grafik Pendapatan</h3>

            {chartData.length > 0 ? (
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
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-gray-500">
                <div className="text-5xl mb-2">📊</div>
                <p className="font-medium">Belum ada data pendapatan</p>
                <p className="text-sm text-gray-400">
                  Grafik akan muncul setelah ada transaksi
                </p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold mb-4 text-amber-950">Detail Transaksi</h3>
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
                  {dataToShow
                    .filter((trx) => trx.status === "selesai")
                    .map((trx) => (
                      <tr
                        key={trx.id}
                        className="bg-white border-b hover:bg-orange-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          #{trx.id}
                        </td>

                        <td className="px-6 py-4">
                          {new Date(trx.created_at).toLocaleDateString("id-ID")}
                        </td>

                        <td className="px-6 py-4">Meja {trx.table_id}</td>

                        <td className="px-6 py-4">
                          {trx.items?.length || 0} item
                        </td>

                        <td className="px-6 py-4 font-semibold">
                          Rp{" "}
                          {Number(trx.total_amount || 0).toLocaleString(
                            "id-ID",
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                            {trx.status}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {trx.transaction?.kasir?.name || "-"}
                        </td>
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
