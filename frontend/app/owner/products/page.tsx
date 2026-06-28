"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Menu, User, LogOut, X } from "lucide-react";
import Link from "next/link";

interface Product {
  product_id: number;
  category_id: number;
  name: string;
  price: number;
  image?: string;
  status: string;
  stock?: number | string;
}
interface Category {
  category_id: number;
  name: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [category_id, setCategory_id] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("active");
  const [imagePreview, setImagePreview] = useState<string>("");
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

  // DATA PRODUK
  const [products, setProducts] = useState<Product[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const loadProducts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/products");

      if (!res.ok) {
        throw new Error("Gagal mengambil data produk");
      }

      const data = await res.json();

      console.log("Products:", data);

      setProducts(data);
    } catch (error) {
      console.error("Load Product Error:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/categories");

      if (!res.ok) {
        throw new Error("Gagal mengambil kategori");
      }

      const data = await res.json();

      setCategories(data);
    } catch (error) {
      console.error("Load Category Error:", error);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const handleAddProduct = async () => {
    if (!name || !category_id || !price) {
      alert("Semua field harus diisi");
      return;
    }
    const res = await fetch("http://127.0.0.1:8000/api/products");
    console.log(await res.json());
    try {
      const formData = new FormData();

      formData.append("category_id", category_id);
      formData.append("name", name);
      formData.append("price", price);
      formData.append("status", status);

      if (image) {
        formData.append("image", image);
      }
      const url = editId
        ? `http://127.0.0.1:8000/api/products/${editId}`
        : "http://127.0.0.1:8000/api/products";

      if (editId) {
        formData.append("_method", "PUT");
      }

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      console.log({
        name,
        category_id,
        price,
        status,
      });

      console.log("Request URL:", url);
      console.log("Edit ID:", editId);
      console.log("Image:", image);

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const responseText = await res.text();
      console.log(responseText);

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        data = {};
      }

      console.log(responseText);

      console.log("Response:", data, "Status:", res.status);

      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan produk");
      }

      alert(
        editId ? "Produk berhasil diperbarui" : "Produk berhasil ditambahkan",
      );

      setName("");
      setCategory_id("");
      setPrice("");
      setStatus("active");
      setImage(null);
      setImagePreview("");
      setEditId(null);

      setShowModal(false);

      await loadProducts();
    } catch (error) {
      console.error("Error:", error);
      alert(
        `${editId ? "Gagal memperbarui" : "Gagal menambahkan"} produk: ${error}`,
      );
    }
  };

  const handleEdit = (product: Product) => {
    console.log("Editing product:", product);
    setEditId(product.product_id);
    setName(product.name);
    setCategory_id(String(product.category_id));
    setPrice(String(product.price));
    setStatus(product.status);
    setImage(null);
    setImagePreview(
      product.image ? `http://127.0.0.1:8000/storage/${product.image}` : "",
    );
    setShowModal(true);
  };

  const handleDelete = async (product_id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/products/${product_id}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert("Produk berhasil dihapus");
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus produk");
    }
  };

  const [filterSearch, setFilterSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [categories, setCategories] = useState<Category[]>([]);
  const categoryTabs = ["Semua", ...categories.map((c) => c.name)];
  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.category_id === categoryId);

    return category?.name || "Tidak diketahui";
  };
  // FILTER LOGIC
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(filterSearch.toLowerCase());
    const categoryName = getCategoryName(product.category_id);
    const matchCategory =
      filterCategory === "Semua" || categoryName === filterCategory;
    return matchSearch && matchCategory;
  });

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
                <h3 className="text-lg font-bold">
                  {editId ? "Edit Produk" : "Tambah Produk"}
                </h3>

                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
                    setName("");
                    setCategory_id("");
                    setPrice("");
                    setStatus("active");
                    setImage(null);
                    setImagePreview("");
                  }}
                  className="text-gray-400 hover:text-black text-xl"
                >
                  ✖
                </button>
              </div>
              {/* FORM */}
              <div className="space-y-4">
                {/* Nama Produk */}
                <input
                  type="text"
                  placeholder="Nama produk"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />

                {/* Kategori */}
                <select
                  value={category_id}
                  onChange={(e) => setCategory_id(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                >
                  <option value="">Pilih Kategori</option>

                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>

                {/* Harga */}
                <input
                  type="number"
                  placeholder="Harga"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />

                {/* Status */}
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>

                {/* Gambar */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Foto Produk
                  </label>
                  {imagePreview && (
                    <div className="mb-3">
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      {editId && !image && (
                        <p className="text-xs text-gray-500 mt-1">
                          Foto produk saat ini
                        </p>
                      )}
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setImage(file);
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full border px-3 py-2 rounded-lg"
                    accept="image/*"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {editId
                      ? "Pilih gambar baru untuk mengganti (opsional)"
                      : "JPG, PNG,webp max 2MB"}
                  </p>
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
                    setName("");
                    setCategory_id("");
                    setPrice("");
                    setStatus("active");
                    setImage(null);
                    setImagePreview("");
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Batal
                </button>

                <button
                  onClick={handleAddProduct}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                >
                  {editId ? "Perbarui" : "Simpan"}
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
              onClick={() => {
                setEditId(null);
                setName("");
                setCategory_id("");
                setPrice("");
                setStatus("active");
                setImage(null);
                setImagePreview("");
                setShowModal(true);
              }}
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
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          {/* TAB CATEGORY */}
          <div className="flex gap-3 mb-6">
            {categoryTabs.map((cat, i) => (
              <button
                key={i}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm ${
                  filterCategory === cat
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
                key={p.product_id}
                className="bg-white p-2 rounded-xl border shadow"
              >
                <div className="h-32 w-full overflow-hidden rounded-lg">
                  <img
                    src={
                      p.image
                        ? `http://127.0.0.1:8000/storage/${p.image}`
                        : "/no-image.png"
                    }
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="font-bold mt-2">{p.name}</h3>

                <p className="text-sm text-gray-500">
                  {getCategoryName(p.category_id)}
                </p>

                <p className="text-orange-500 font-bold">
                  Rp {Number(p.price).toLocaleString("id-ID")}
                </p>

                <span
                  className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${
                    Number(p.stock) <= 5
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  Stok: {p.stock}
                </span>

                <span
                  className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
                    p.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {p.status}
                </span>

                <div className="h-7 mt-3">
                  {Number(p.stock) <= 0 && (
                    <div className="bg-red-500 text-white text-center py-1 rounded text-xs font-bold">
                      STOK HABIS
                    </div>
                  )}
                </div>
                
                {/* BUTTON */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(p)}
                    className="flex-1 border py-2 rounded-lg text-sm hover:bg-blue-50"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p.product_id)}
                    className="flex-1 border text-red-500 rounded-lg hover:bg-red-50"
                  >
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
