"use client";

import Sidebar from "../components/Sidebar";

export default function RiwayatPage() {
  const transaksi = [
    {
      no: 1,
      tanggal: "2025-05-20",
      meja: "Meja 1",
      items: "2x Croissant, 1x Espresso",
      total: "Rp 125.000",
      metode: "Cash",
      kasir: "Hau",
    },
    {
      no: 2,
      tanggal: "2025-05-20",
      meja: "Meja 2",
      items: "1x Cake Coklat, 2x Espresso",
      total: "Rp 110.000",
      metode: "QRIS",
      kasir: "Hau",
    },
    {
      no: 3,
      tanggal: "2025-05-20",
      meja: "Meja 3",
      items: "2x Croissant",
      total: "Rp 60.000",
      metode: "Debit",
      kasir: "Hau",
    },
    {
      no: 4,
      tanggal: "2025-05-20",
      meja: "Meja 4",
      items: "1x Espresso, 1x Cake Coklat",
      total: "Rp 65.000",
      metode: "Cash",
      kasir: "Hau",
    },
  ];

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
              <span className="text-sm text-gray-500">hau</span>
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
                Semua data transaksi kasir
              </p>
            </div>

            <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
              {transaksi.length} item
            </span>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                {/* TABLE HEADER */}
                <thead className="bg-[#f2dfbf] text-[#5c2500]">
                  <tr>
                    <th className="px-6 py-4 text-left">NO</th>
                    <th className="px-6 py-4 text-left">Tanggal</th>
                    <th className="px-6 py-4 text-left">Meja</th>
                    <th className="px-6 py-4 text-left">Items</th>
                    <th className="px-6 py-4 text-left">Total</th>
                    <th className="px-6 py-4 text-left">Metode</th>
                    <th className="px-6 py-4 text-left">Kasir</th>
                    <th className="px-6 py-4 text-center">Struk</th>
                  </tr>
                </thead>

                {/* TABLE BODY */}
                <tbody>
                  {transaksi.map((item, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-orange-50 transition"
                    >
                      <td className="px-6 py-4 font-semibold">
                        {item.no}
                      </td>

                      <td className="px-6 py-4">
                        {item.tanggal}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {item.meja}
                      </td>

                      <td className="px-6 py-4">
                        {item.items}
                      </td>

                      <td className="px-6 py-4 font-semibold text-orange-600">
                        {item.total}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${
                              item.metode === "Cash"
                                ? "bg-green-100 text-green-700"
                                : item.metode === "QRIS"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }
                          `}
                        >
                          {item.metode}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {item.kasir}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition">
                          Unduh
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* EMPTY */}
            {transaksi.length === 0 && (
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