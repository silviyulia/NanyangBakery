"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Factory,
  Package,
  Plus,
  Calendar,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";

interface Product {
  product_id: number;
  name: string;
  price?: number;
  status?: string;
}

export default function ProductionPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const menuItems = [
    {
      name: "Dashboard",
      icon: "📊",
      href: "/owner",
    },
    {
      name: "Produk & Menu",
      icon: "🍞",
      href: "/owner/products",
    },
    {
      name: "Stok Bahan",
      icon: "📦",
      href: "/owner/inventory",
    },
    {
      name: "Resep Produk",
      icon: "👨‍🍳",
      href: "/owner/recipes",
    },
    {
      name: "Produksi Harian",
      icon: "🏭",
      href: "/owner/production",
    },
    {
      name: "Laporan",
      icon: "📄",
      href: "/owner/reports",
    },
    {
      name: "Karyawan",
      icon: "👥",
      href: "/owner/employees",
    },
  ];
const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toLocaleDateString("id-ID"));
  }, []);
  
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Gagal mengambil produk:", err);
      });
  }, []);

  const handleSave = async () => {
    if (!productId || !quantity) {
      alert("Pilih produk dan masukkan jumlah produksi");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/productions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: productId,
            quantity: quantity,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert(data.message);

      setProductId("");
      setQuantity("");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan produksi");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-gradient-to-b from-amber-800 to-amber-900 text-white transition-all duration-300 overflow-hidden flex flex-col shadow-lg`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-amber-700">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 rounded-lg p-2 text-lg">
              🥖
            </div>

            <div>
              <h1 className="font-bold text-lg">
                Bakery POS
              </h1>

              <p className="text-xs text-amber-200">
                Owner Panel
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                pathname === item.href
                  ? "bg-orange-500 text-white"
                  : "hover:bg-amber-700 text-amber-100"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-amber-700 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-gradient-to-r from-amber-800 to-amber-900 text-white shadow-md px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setSidebarOpen(!sidebarOpen)
              }
            >
              {sidebarOpen ? <X /> : <Menu />}
            </button>

            <h2 className="text-2xl font-bold">
              Produksi Harian
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg">
              🔔 Notifikasi (3)
            </button>

            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <User size={18} />

              <div>
                <p className="text-sm font-semibold">
                  Admin User
                </p>

                <p className="text-xs text-amber-100">
                  Owner
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-amber-950">
              Produksi Harian
            </h1>

            <p className="text-gray-600">
              Catat jumlah produk yang diproduksi hari
              ini
            </p>
          </div>

          {/* Statistik */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-400">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 text-sm">
                    Produksi Hari Ini
                  </p>

                  <h2 className="text-3xl font-bold text-amber-950">
                    120
                  </h2>
                </div>

                <Factory
                  className="text-orange-500"
                  size={40}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-400">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 text-sm">
                    Produk Diproduksi
                  </p>

                  <h2 className="text-3xl font-bold text-amber-950">
                    6
                  </h2>
                </div>

                <Package
                  className="text-green-500"
                  size={40}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-400">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 text-sm">
                    Tanggal
                  </p>

                  <h2 className="text-xl font-bold text-amber-950">
                    {today}
                  </h2>
                </div>

                <Calendar
                  className="text-blue-500"
                  size={40}
                />
              </div>
            </div>
          </div>

          {/* Form Produksi */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-xl font-bold text-amber-950 mb-6">
              Input Produksi
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  Produk
                </label>

                <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3"
                >
                <option value="">
                    Pilih Produk
                </option>

                {products.map((product) => (
                    <option
                    key={product.product_id}
                    value={product.product_id}
                    >
                    {product.name}
                    </option>
                ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Jumlah Produksi
                </label>

                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder="Masukkan jumlah"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
            >
              <Plus size={18} />
              Simpan Produksi
            </button>
          </div>

          {/* Riwayat */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-xl font-bold text-amber-950 mb-6">
              Riwayat Produksi Hari Ini
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-amber-50">
                    <th className="p-3 text-left">
                      Produk
                    </th>
                    <th className="p-3 text-left">
                      Jumlah
                    </th>
                    <th className="p-3 text-left">
                      Waktu
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b">
                    <td className="p-3">
                      Croissant
                    </td>
                    <td className="p-3">
                      50 pcs
                    </td>
                    <td className="p-3">
                      08:00
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="p-3">
                      Donat Coklat
                    </td>
                    <td className="p-3">
                      30 pcs
                    </td>
                    <td className="p-3">
                      09:30
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}