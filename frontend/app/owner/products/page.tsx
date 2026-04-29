"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, User, LogOut, X } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [showModal, setShowModal] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: "📊", href: "/owner" },
    { name: "Pesanan Real-time", icon: "🛒", href: "/owner/orders" },
    { name: "Laporan", icon: "📄", href: "/owner/reports" },
    { name: "Produk & Menu", icon: "🍪", href: "/owner/products" },
    { name: "Stok Bahan", icon: "📦", href: "/owner/inventory" },
    { name: "Resep Produk", icon: "👨‍🍳", href: "/owner/recipes" },
    { name: "Karyawan", icon: "👥", href: "/owner/employees" },
  ];

  // 🔥 DATA PRODUK
  const products = [
    {
      id: 1,
      name: "Croissant",
      category: "Roti & Pastry",
      price: 30000,
      img: "https://static01.nyt.com/images/2021/04/07/dining/06croissantsrex1/merlin_184841898_ccc8fb62-ee41-44e8-9ddf-b95b198b88db-jumbo.jpg",
      sold: 40,
      status: "Aktif",
    },
    {
      id: 2,
      name: "Chocolate Cake",
      category: "Kue & Cake",
      price: 45000,
      img: "https://lilluna.com/wp-content/uploads/2019/01/Chocolate-Cake103.jpg",
      stock: 15,
      sold: 30,
      status: "Aktif",
    },
    {
      id: 3,
      name: "Espresso",
      category: "Minuman",
      price: 20000,
      img: "https://img.magnific.com/premium-photo/high-resolution-image-freshly-brewed-cup-espresso-with-creamy-crema-layer_1264082-26795.jpg?w=996",
      stock: 25,
      sold: 50,
      status: "Aktif",
    },
    {
      id: 4,
      name: "Baguette",
      category: "Roti & Pastry",
      price: 28000,
      img: "https://latelierdespains.fr/wp-content/uploads/2023/11/baguette-courte_Atelier-des-pains_1.jpg    ",
      stock: 18,
      sold: 35,
      status: "Aktif",
    },
    {
      id: 5,
      name: "Red Velvet",
      category: "Kue & Cake",
      price: 40000,
      img: "https://www.mommyplates.com/wp-content/uploads/2025/05/Red-Velvet-Cake.webp",
      stock: 10,
      sold: 20,
      status: "Nonaktif",
    },
    {
      id: 6,
      name: "Cappuccino",
      category: "Minuman",
      price: 25000,
      img: "https://tse4.mm.bing.net/th/id/OIP.sORUCLQs6IFavbrcEWRPgAHaE8?pid=Api&P=0&h=180",
      stock: 22,
      sold: 45,
      status: "Aktif",
    },
    {
      id: 7,
      name: "Danish Pastry",
      category: "Roti & Pastry",
      price: 32000,
      img: "https://tse1.mm.bing.net/th/id/OIP.tPkgAvgXjtG-R1fQNlm8ywHaEK?pid=Api&P=0&h=180",
      stock: 12,
      sold: 28,
      status: "Aktif",
    },
    {
      id: 8,
      name: "Brownies",
      category: "Kue & Cake",
      price: 35000,
      img: "https://www.glorioustreats.com/wp-content/uploads/2022/09/cheesecake-brownie-recipe-square.jpeg",
      stock: 14,
      sold: 33,
      status: "Aktif",
    },
  ];

  // 🔥 KATEGORI DINAMIS
  const categories = ["Semua", ...new Set(products.map((p) => p.category))];

  // 🔥 FILTER LOGIC
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      activeCategory === "Semua" || product.category === activeCategory;

    const matchStatus =
      statusFilter === "Semua" || product.status === statusFilter;

    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-0"} bg-gradient-to-b from-amber-800 to-amber-900 text-white transition-all duration-300 overflow-hidden flex flex-col shadow-lg`}
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
                item.href === "/owner/products"
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
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* HEADER*/}
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

        {/*MODAL POP UP TAMBAH PRODUK*/}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowModal(false)}
            ></div>
            {/* MODAL */}
            <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Tambah Produk</h3>

                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-black text-xl"
                >
                  ✖
                </button>
              </div>
              {/* FORM */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nama produk"
                  className="w-full border px-3 py-2 rounded-lg"
                />

                <select className="w-full border px-3 py-2 rounded-lg">
                  <option>Roti & Pastry</option>
                  <option>Kue & Cake</option>
                  <option>Minuman</option>
                </select>

                <input
                  type="number"
                  placeholder="Harga"
                  className="w-full border px-3 py-2 rounded-lg"
                />

                <input
                  type="number"
                  placeholder="Stok"
                  className="w-full border px-3 py-2 rounded-lg"
                />

                <select className="w-full border px-3 py-2 rounded-lg">
                  <option>Aktif</option>
                  <option>Nonaktif</option>
                </select>

                <input
                  type="file"
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              {/* FOOTER */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Batal
                </button>

                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
        {/* CONTENT */}
        <main className="flex-1 overflow-auto p-8">
          {/* HEADER */}
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-bold">Produk & Menu</h2>
              <p className="text-gray-500 text-sm">Kelola produk</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg"
            >
              + Tambah Produk
            </button>
          </div>

          {/* SEARCH + FILTER */}
          <div className="bg-white p-4 rounded-xl flex gap-3">
            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border px-3 py-2 rounded-lg"
            />

            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="border px-3 py-2 rounded-lg"
            >
              {categories.map((cat, i) => (
                <option key={i}>{cat}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-3 py-2 rounded-lg"
            >
              <option>Semua</option>
              <option>Aktif</option>
              <option>Nonaktif</option>
            </select>
          </div>

          {/* TAB CATEGORY */}
          <div className="flex gap-3 mb-6">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeCategory === cat
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded-xl border shadow "
              >
                <div className="h-32 w-full overflow-hidden rounded-lg">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="font-bold mt-2">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.category}</p>

                <p className="text-orange-500 font-bold">
                  Rp {p.price.toLocaleString()}
                </p>

                <div className="text-xs flex justify-between mt-2">
                  <span>Stok: {p.stock}</span>
                  <span>Terjual: {p.sold}</span>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
                    p.status === "Aktif"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {p.status}
                </span>
                {/* BUTTON */}
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 border py-2 rounded-lg text-sm">
                    Edit
                  </button>
                  <button className="px-3 border text-red-500 rounded-lg">
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
