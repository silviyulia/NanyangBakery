"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    {
      name: "Pesanan",
      href: "/kasir",
      icon: "🍪",
    },
    {
      name: "Transaksi",
      href: "/kasir/transaksi",
      icon: "🧾",
    },
    {
      name: "Riwayat transaksi",
      href: "/kasir/riwayat",
      icon: "📄",
    },
  ];

  return (
    <aside className="w-[220px] bg-[#b65a00] flex flex-col justify-between shadow-lg">
      <div>
        <div className="flex items-center gap-3 px-5 py-6 border-b border-orange-300">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl">
            ☕
          </div>

          <h1 className="text-white font-bold text-lg">
            Nanyang Bakery
          </h1>
        </div>

        <nav className="mt-6 px-4 space-y-4">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-4 rounded-2xl font-semibold transition ${
                pathname === item.href
                  ? "bg-orange-500 text-white"
                  : "text-white hover:bg-orange-400"
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <Link
          href="/login"
          className="block text-center w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold shadow-md transition"
        >
          Log out →
        </Link>
      </div>
    </aside>
  );
}