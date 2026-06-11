"use client";

import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

interface Transaction {
  transaction_id: string;
  order_id?: string;
  created_at: string;
  total_amount: number;
  payment_method: string;
  amount_paid: number;
  payment_status: string;
  kasir?: { name: string };
  receipt?: { receipt_number: string };
}

export default function RiwayatPage() {
  const [transaksi, setTransaksi] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:8000/api/transactions");
        if (!res.ok) throw new Error("Gagal mengambil data transaksi");
        const data = await res.json();
        setTransaksi(data);
      } catch (err) {
        console.error("Error loading transactions:", err);
        setError("Gagal memuat data transaksi");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#f4ece7] flex">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <main className="flex-1">
        {/* HEADER */}
        <header className="bg-[#b65a00] px-8 py-5 flex items-center justify-between shadow-md">
          <h2 className="text-4xl font-bold text-white">
            Dashboard Kasir
          </h2>

          <div className="bg-white rounded-full px-5 py-2 flex items-center gap-3 shadow">
            <div className="w-10 h-10 rounded-full border flex items-center justify-center">
              👤
            </div>

            <div>
              <p className="font-bold text-[#b65a00] leading-none">
                kasir
              </p>
              <span className="text-sm text-gray-500">System</span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <section className="p-8">
          {/* TITLE CARD */}
          <div className="mb-6 flex items-center justify-between rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <div>
              <h3 className="text-2xl font-semibold text-[#5c2500]">
                Riwayat Transaksi
              </h3>

              <p className="text-sm text-gray-600">
                {loading ? "Loading..." : "Semua data transaksi kasir"}
              </p>
            </div>

            <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
              {transaksi.length} item
            </span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* TABLE */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                {/* TABLE HEADER */}
                <thead className="bg-[#f2dfbf] text-[#5c2500]">
                  <tr>
                    <th className="px-6 py-4 text-left">ID TRANSAKSI</th>
                    <th className="px-6 py-4 text-left">TANGGAL</th>
                    <th className="px-6 py-4 text-left">WAKTU</th>
                    <th className="px-6 py-4 text-left">TOTAL</th>
                    <th className="px-6 py-4 text-left">BAYAR</th>
                    <th className="px-6 py-4 text-left">METODE</th>
                    <th className="px-6 py-4 text-left">STATUS</th>
                    <th className="px-6 py-4 text-center">STRUK</th>
                  </tr>
                </thead>

                {/* TABLE BODY */}
                <tbody>
                  {!loading && transaksi.length > 0 ? (
                    transaksi.map((item, index) => (
                      <tr
                        key={item.transaction_id}
                        className="border-t hover:bg-orange-50 transition"
                      >
                        <td className="px-6 py-4 font-semibold">
                          {item.receipt?.receipt_number || item.transaction_id}
                        </td>

                        <td className="px-6 py-4">
                          {formatDate(item.created_at)}
                        </td>

                        <td className="px-6 py-4">
                          {formatTime(item.created_at)}
                        </td>

                        <td className="px-6 py-4 font-semibold text-orange-600">
                          Rp {item.total_amount.toLocaleString("id-ID")}
                        </td>

                        <td className="px-6 py-4">
                          Rp {item.amount_paid.toLocaleString("id-ID")}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              item.payment_method === "cash"
                                ? "bg-green-100 text-green-700"
                                : item.payment_method === "qris"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.payment_method.toUpperCase()}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              item.payment_status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.payment_status === "completed"
                              ? "Lunas"
                              : item.payment_status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition">
                            Unduh
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : !loading ? (
                    <tr>
                      <td colSpan={8} className="text-center text-gray-400 py-16">
                        Tidak ada riwayat transaksi
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center text-gray-400 py-16">
                        Loading...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* EMPTY */}
            {!loading && transaksi.length === 0 && (
              <div className="text-center text-gray-400 py-16">
                Tidak ada riwayat transaksi
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}