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
import Swal from "sweetalert2";

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
  const [editId, setEditId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState("");
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
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toLocaleDateString("id-ID"));
  }, []);

  useEffect(() => {
    loadProducts();
    loadProductions();
  }, []);
const loadProducts = async () => {
  const res = await fetch("http://127.0.0.1:8000/api/products/production");

  console.log("Status:", res.status);

  const data = await res.json();

  console.log("DATA =", data);

  setProducts(data);
};
  const [productions, setProductions] = useState<any[]>([]);
  const [totalProduction, setTotalProduction] = useState(0);
  const [productCount, setProductCount] = useState(0);

  const loadProductions = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/productions");

      const data = await res.json();

      setProductions(data);

      const total = data.reduce(
        (sum: number, item: any) => sum + Number(item.quantity_produced),
        0,
      );

      setTotalProduction(total);

      setProductCount(new Set(data.map((item: any) => item.product_id)).size);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
  if (!productId || !quantity) {
    Swal.fire({
      icon: "warning",
      title: "Data Belum Lengkap",
      text: "Pilih produk dan masukkan jumlah produksi.",
    });
    return;
  }

  try {
    const url = editId
      ? `http://127.0.0.1:8000/api/productions/${editId}`
      : "http://127.0.0.1:8000/api/productions";

    const method = editId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: Number(productId),
        quantity_produced: Number(quantity),
      }),
    });

    const data = await response.json();

if (!response.ok) {
  const result = await Swal.fire({
    icon: "error",
    title: "Produksi Gagal",
    html: `
      <b>${data.message}</b><br><br>
      Silakan lakukan <b>restok bahan baku</b> terlebih dahulu.
    `,
    confirmButtonText: "Ke Halaman Stok",
    showCancelButton: true,
    cancelButtonText: "Tutup",
  });

  if (result.isConfirmed) {
    router.push("/owner/inventory");
  }

  return;
}

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: data.message,
      timer: 2000,
      showConfirmButton: false,
    });

    await loadProductions();
    setProductId("");
    setQuantity("");
  } catch (error: any) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Terjadi Kesalahan",
      text: error.message || "Tidak dapat terhubung ke server.",
    });
  }
};

  const handleEdit = (item: any) => {
    setEditId(item.production_id);
    setProductId(String(item.product_id));
    setQuantity(String(item.quantity_produced));
  };

 {/* const handleDelete = async (id: number) => {
  const ok = confirm(`yakin ingin menghapus ini?`);

  console.log("Confirm =", ok);

  if (!ok) return;

  try {
    console.log("Mulai DELETE");

    const response = await fetch(
      `http://127.0.0.1:8000/api/productions/${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      }
    );

    console.log("Status =", response.status);

    const text = await response.text();

    console.log("Response =", text);

    await loadProductions();

    alert("Selesai");
  } catch (err) {
    console.error("ERROR DELETE:", err);
    alert("Error saat delete");
  }
}; */}

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
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
                item.href === "/owner/productions"
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

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-amber-950">
              Produksi Harian
            </h1>

            <p className="text-gray-600">
              Catat jumlah produk yang diproduksi 
            </p>
          </div>

          {/* Statistik */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-400">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Produksi </p>

                  <h2 className="text-3xl font-bold text-amber-950">
                    {totalProduction}
                  </h2>
                </div>

                <Factory className="text-orange-500" size={40} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-400">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Produk Diproduksi</p>

                  <h2 className="text-3xl font-bold text-amber-950">
                    {productCount}
                  </h2>
                </div>

                <Package className="text-green-500" size={40} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-400">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Tanggal</p>

                  <h2 className="text-xl font-bold text-amber-950">{today}</h2>
                </div>

                <Calendar className="text-blue-500" size={40} />
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
                <label className="block mb-2 font-medium">Produk</label>

                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3"
                >
                  <option value="">Pilih Produk</option>

                  {products.map((product) => (
                    <option key={product.product_id} value={product.product_id}>
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
                  onChange={(e) => setQuantity(e.target.value)}
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
              Riwayat Produksi 
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-amber-50">
                    <th className="p-3 text-left">Produk</th>
                    <th className="p-3 text-left">Jumlah</th>
                    <th className="p-3 text-left">Waktu</th>
                    {/*<th className="p-3 text-left">Aksi</th>*/}
                  </tr>
                </thead>

                <tbody>
                  {productions.map((item: any) => (
                    <tr key={item.production_id} className="border-b">
                      <td className="p-3">{item.product_name}</td>

                      <td className="p-3">{item.quantity_produced} pcs</td>

                      <td className="p-3">
                        {new Date(
                          item.production_date.replace(" ", "T"),
                        ).toLocaleString("id-ID")}
                      </td>
                     {/*<td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-yellow-500 text-white px-2 py-1 rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(item.production_id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Hapus
                          </button> 
                        </div>
                      </td>*/}
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
