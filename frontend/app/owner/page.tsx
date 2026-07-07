"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, AlertTriangle, TrendingUp, User, LogOut, X } from "lucide-react";
import Link from "next/link";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Transaction = {
  id: number;
  created_at: string;
  total_amount: string;
  status: string;
  items?: {
    quantity: number;
    product?: {
      name: string;
    };
  }[];
};

export default function OwnerDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);
  const [filteredData, setFilteredData] = useState<Transaction[]>([]);

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

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/dashboard")
      .then((res) => res.json())
      .then((data) => setDashboardData(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setTransactionData(data);
      })
      .catch(console.error);
  }, []);

  // Data yang ditampilkan
  const dataToShow = filteredData.length > 0 ? filteredData : transactionData;

  // Tanggal hari ini
  const today = new Date();

  // Ambil hanya transaksi hari ini yang sudah selesai
  const transaksiHariIni = dataToShow.filter((trx) => {
    if (trx.status !== "selesai") return false;

    const trxDate = new Date(trx.created_at);

    return (
      trxDate.getFullYear() === today.getFullYear() &&
      trxDate.getMonth() === today.getMonth() &&
      trxDate.getDate() === today.getDate()
    );
  });

  // Hitung total pendapatan hari ini
  const totalPendapatan = transaksiHariIni.reduce(
    (sum, trx) => sum + Number(trx.total_amount || 0),
    0,
  );

  //Produk terlaris
  const [produkTerlaris, setProdukTerlaris] = useState("-");
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

  const [salesData, setSalesData] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/sales-chart")
      .then((res) => res.json())
      .then((data) => setSalesData(data))
      .catch((err) => console.error(err));
  }, []);

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
                item.href === "/owner"
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

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-8">

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Total Menu",
                value: dashboardData?.total_menu ?? 0,
              },
              {
                label: "Total karyawan",
                value: dashboardData?.active_employees ?? 0,
              },
              {
                label: "Jam Operasional",
                value: "07:00 - 22:00",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition"
              >
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Monitoring Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Revenue Card */}
            <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-400 hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <span className="text-2xl">💰</span>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Pendapatan Hari Ini</p>

                  <h3 className="text-xl font-bold text-amber-950">
                    Rp {Number(totalPendapatan).toLocaleString("id-ID")}{" "}
                  </h3>
                </div>
              </div>
            </div>

            {/* Total Transactions */}
            <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-400">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Total Transaksi</p>

                  <h3 className="text-xl font-bold text-amber-950">
                    {dashboardData?.total_transactions || 0}
                  </h3>
                </div>
              </div>
            </div>

            {/* Best Seller Card */}
            <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-400 hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <TrendingUp className="text-orange-600" size={22} />
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Produk Terlaris</p>

                  <h3 className="text-2xl font-bold">{produkTerlaris}</h3>
                </div>
              </div>
            </div>

            {/* Low Stock Alert Card */}
            <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-400 hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <AlertTriangle className="text-red-600" size={22} />
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Stok Menipis</p>

                  <h3 className="text-xl font-bold text-amber-950">
                    {lowStockItems.length} Item
                  </h3>
                </div>

                <span className="ml-auto text-red-600 text-xl font-bold">
                  !
                </span>
              </div>
            </div>
          </div>
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Chart */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-amber-950 mb-4">
                Grafik Pendapatan
              </h3>
              <div className="h-64">
                {salesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#f97316"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-dashed border-orange-200">
                    <span className="text-5xl mb-3">📈</span>
                    <p className="font-semibold text-amber-900">
                      Belum Ada Data Penjualan
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Grafik akan muncul setelah transaksi pertama selesai.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-amber-950">
                  Pesanan Terbaru
                </h3>
                <Link
                  href="/owner/orders"
                  className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
                >
                  Lihat Semua →
                </Link>
              </div>
              <div className="space-y-3">
                {dashboardData?.recent_orders?.length > 0 ? (
                  dashboardData.recent_orders.map((order: any) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition"
                    >
                      <div>
                        <p className="font-semibold text-sm text-amber-950">
                          Order #{order.id}
                        </p>

                        <p className="text-xs text-gray-600">
                          {new Date(order.created_at).toLocaleDateString(
                            "id-ID",
                          )}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-amber-950">
                          Rp{" "}
                          {Number(order.total_amount).toLocaleString("id-ID")}
                        </p>

                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            order.status === "selesai"
                              ? "bg-green-100 text-green-700"
                              : order.status === "proses"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-56 flex flex-col items-center justify-center text-center">
                    <div className="text-5xl mb-3">🛒</div>

                    <h4 className="font-semibold text-amber-950">
                      Belum Ada Pesanan
                    </h4>

                    <p className="text-sm text-gray-500 mt-1">
                      Pesanan terbaru akan muncul di sini.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
