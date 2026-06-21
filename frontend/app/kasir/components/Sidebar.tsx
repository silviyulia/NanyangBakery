"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

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
      name: "Riwayat Transaksi",
      href: "/kasir/riwayat",
      icon: "📄",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4ece7] flex">
      {/* SIDEBAR */}

      <aside
        className={`
        sticky
top-0
      h-screen

${sidebarOpen ? "w-64" : "w-0"}

      overflow-hidden

      bg-gradient-to-b
      from-amber-800
      to-amber-900

      text-white

      transition-all duration-300

      flex flex-col
      z-50

      `}
      >
        <div className="p-6 border-b border-amber-700">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg text-xl">🥐</div>

            <div>
              <h1 className="font-bold">Nanyang Bakery</h1>

              <p className="text-xs text-amber-200">Kasir</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-3">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
              block
              px-4 py-3
              rounded-xl

              ${pathname === item.href ? "bg-orange-500" : "hover:bg-amber-700"}

              `}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-amber-700">
          <button
            onClick={() => router.push("/login")}
            className="
          w-full
          flex
          gap-3
          px-4
          py-3
          rounded-xl
          hover:bg-red-600
          "
          >
            <LogOut />
            Logout
          </button>
        </div>
      </aside>

      {/* KANAN */}

      <div className="flex-1 flex flex-col">
        {/* HEADER */}

        <header
          className="
    bg-gradient-to-r
    from-amber-800
    to-amber-900

    text-white

    px-4 md:px-8
    py-5

    flex
    justify-between
    items-center

    shadow-md

    sticky
    top-0
    z-50
  "
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white"
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>

          <h1 className="text-2xl md:text-4xl font-bold">Dashboard Kasir</h1>

          <div className="flex items-center gap-2">
            <User />

            <div>
              <p className="font-semibold">Kasir</p>

              <p className="text-xs">System</p>
            </div>
          </div>
        </header>

        {/* ISI PAGE */}

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
