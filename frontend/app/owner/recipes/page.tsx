"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, User, LogOut, X } from "lucide-react";
import Link from "next/link";

interface Product {
  product_id: number;
  category_id: number;
  name: string;
  price?: number;
  status?: string;
}

export default function RecipesPage() {
  const router = useRouter();
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return null;
    }

    return {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
  };
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Semua");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [ingredientsMaster, setIngredientsMaster] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");

  const loadProducts = async () => {
    try {
      const headers = getAuthHeaders();

      if (!headers) return;

      const res = await fetch("http://127.0.0.1:8000/api/products", {
        method: "GET",
        headers,
      });

      const text = await res.text();

      console.log("PRODUCTS STATUS:", res.status);
      console.log("PRODUCTS RESPONSE:", text);

      if (!res.ok) {
        throw new Error("Gagal mengambil data produk");
      }

      const data = JSON.parse(text);

      setProducts(data);
    } catch (error) {
      console.error("Load Product Error:", error);
    }
  };

  const loadIngredients = async () => {
    try {
      const headers = getAuthHeaders();

      if (!headers) return;

      const res = await fetch("http://127.0.0.1:8000/api/inventory", {
        method: "GET",
        headers,
      });

      const text = await res.text();

      console.log("INVENTORY STATUS:", res.status);
      console.log("INVENTORY RESPONSE:", text);

      if (!res.ok) {
        throw new Error("Gagal mengambil data inventory");
      }

      const data = JSON.parse(text);

      setIngredientsMaster(data);

      console.log("INGREDIENTS:", data);
    } catch (error) {
      console.error("Load Ingredients Error:", error);
    }
  };

  useEffect(() => {
    loadRecipes();
    loadProducts();
    loadIngredients();
  }, []);

  const loadRecipes = async () => {
    try {
      const headers = getAuthHeaders();

      if (!headers) return;

      const res = await fetch("http://127.0.0.1:8000/api/recipes", {
        method: "GET",
        headers,
      });

      const text = await res.text();

      console.log("RECIPES STATUS:", res.status);
      console.log("RECIPES RESPONSE:", text);

      if (!res.ok) {
        throw new Error("Gagal mengambil data resep");
      }

      const data = JSON.parse(text);

      console.log("RECIPES", data);

      setRecipes(data);
    } catch (err) {
      console.error("Load Recipes Error:", err);
    }
  };

  const groupedRecipes: any[] = Object.values(
    recipes.reduce((acc: any, item: any) => {
      if (!acc[item.product_id]) {
        acc[item.product_id] = {
          product_id: item.product_id,
          product_name: item.product_name,
          bahan: [],
        };
      }

      acc[item.product_id].bahan.push({
        ingredient_id: item.ingredient_id,
        ingredient_name: item.ingredient_name,
        quantity: item.quantity,
        unit: item.unit,
      });

      return acc;
    }, {}),
  );

  console.log("recipes", recipes);
  console.log("groupedRecipes", groupedRecipes);

  const [ingredients, setIngredients] = useState([
    {
      ingredient_id: "",
      quantity: "",
      unit: "",
    },
  ]);
  const [editMode, setEditMode] = useState(false);
  const [editRecipeId, setEditRecipeId] = useState<number | null>(null);

  const handleEdit = (recipe: any) => {
    setEditMode(true);
    setEditRecipeId(recipe.product_id);

    setSelectedProduct(recipe.product_id.toString());

    setIngredients(
      recipe.bahan.map((b: any) => ({
        ingredient_id: b.ingredient_id.toString(),
        quantity: b.quantity.toString(),
        unit: b.unit,
      })),
    );

    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedProduct) {
      alert("Pilih produk terlebih dahulu");
      return;
    }

    try {
      const headers = getAuthHeaders();

      if (!headers) return;

      const validIngredients = ingredients.filter(
        (item) =>
          item.ingredient_id && item.quantity && Number(item.quantity) > 0,
      );

      let url = "http://127.0.0.1:8000/api/recipes";
      let method = "POST";

      if (editMode) {
        url = `http://127.0.0.1:8000/api/recipes/${editRecipeId}`;
        method = "PUT";
      }

      console.log({
        url,
        method,
        editRecipeId,
        selectedProduct,
        ingredients,
      });

      const res = await fetch(url, {
        method,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: Number(selectedProduct),
          ingredients: validIngredients.map((item) => ({
            ingredient_id: Number(item.ingredient_id),
            quantity: Number(item.quantity),
          })),
        }),
      });

      const text = await res.text();

      console.log("SAVE RECIPE STATUS:", res.status);
      console.log("SAVE RECIPE RESPONSE:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }

      if (!res.ok) {
        alert(data.message || "Gagal menyimpan resep");
        return;
      }

      alert(
        editMode ? "Resep berhasil diupdate" : "Resep berhasil ditambahkan",
      );

      setEditMode(false);
      setEditRecipeId(null);
      setShowModal(false);

      await loadRecipes();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan resep");
    }
  };

  const handleDeleteRecipe = async (productId: number) => {
    const confirmDelete = confirm(
      "Yakin ingin menghapus seluruh resep produk ini?",
    );

    if (!confirmDelete) return;

    try {
      const headers = getAuthHeaders();

      if (!headers) return;

      const res = await fetch(
        `http://127.0.0.1:8000/api/recipes/${productId}`,
        {
          method: "DELETE",
          headers,
        },
      );

      const text = await res.text();

      console.log("DELETE RECIPE STATUS:", res.status);
      console.log("DELETE RECIPE RESPONSE:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }

      if (!res.ok) {
        alert(data.message || "Gagal menghapus resep");
        return;
      }

      alert(data.message || "Resep berhasil dihapus");

      await loadRecipes();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus resep.");
    }
  };

  const filteredRecipes = groupedRecipes.filter((recipe: any) => {
    const product = products.find((p) => p.product_id === recipe.product_id);
    if (!product) return false;
    if (activeTab === "Semua") return true;
    if (activeTab === "Roti&Pastry") return product.category_id === 1;
    if (activeTab === "Kue&Cake") return product.category_id === 2;
    if (activeTab === "Minuman") return product.category_id === 3;
    return true;
  });

  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const headers = getAuthHeaders();

        if (!headers) return;

        const res = await fetch("http://127.0.0.1:8000/api/inventory", {
          method: "GET",
          headers,
        });

        const text = await res.text();

        console.log("INVENTORY STATUS:", res.status);
        console.log("INVENTORY RESPONSE:", text);

        if (!res.ok) {
          throw new Error(`Gagal mengambil inventory: ${res.status}`);
        }

        const data = JSON.parse(text);

        setInventory(data);
      } catch (error) {
        console.error("Error loadInventory:", error);
      }
    };

    loadInventory();
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
                item.href === "/owner/recipes"
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
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              router.push("/login");
            }}
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
        <main className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#f6efe9]">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-amber-950">Resep Produk</h2>

            <button
              onClick={() => setShowModal(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg"
            >
              + Tambah Resep
            </button>
          </div>

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
                    {editMode ? "Edit Resep" : "Tambah Resep"}
                  </h3>

                  <button
                    onClick={() => {
                      setShowModal(false);
                      setIngredients([
                        {
                          ingredient_id: "",
                          quantity: "",
                          unit: "",
                        },
                      ]);
                    }}
                    className="text-gray-400 hover:text-black text-xl"
                  >
                    ✖
                  </button>
                </div>
                {/* FORM */}
                <div className="space-y-4">
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg"
                  >
                    <option value="">Pilih Produk</option>

                    {products.map((product) => (
                      <option
                        key={product.product_id}
                        value={product.product_id}
                      >
                        {product.name}
                      </option>
                    ))}
                  </select>
                  <div className="space-y-3">
                    {ingredients.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <select
                          value={item.ingredient_id}
                          onChange={(e) => {
                            const updated = [...ingredients];
                            updated[index].ingredient_id = e.target.value;
                            setIngredients(updated);
                          }}
                          className="flex-1 border px-3 py-2 rounded-lg"
                        >
                          <option value="">Pilih Bahan</option>

                          {ingredientsMaster.map((bahan) => (
                            <option
                              key={bahan.ingredient_id}
                              value={bahan.ingredient_id}
                            >
                              {bahan.ingredient_name}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <input
                            type="number"
                            placeholder="Jumlah"
                            value={item.quantity}
                            onChange={(e) => {
                              const updated = [...ingredients];
                              updated[index].quantity = e.target.value;
                              setIngredients(updated);
                            }}
                            className="w-24 px-3 py-2 outline-none"
                          />
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => {
                              const updated = [...ingredients];
                              updated[index].unit = e.target.value;
                              setIngredients(updated);
                            }}
                            className="w-20 px-2 py-2 border-l"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setIngredients([
                        ...ingredients,
                        {
                          ingredient_id: "",
                          quantity: "",
                          unit: "",
                        },
                      ])
                    }
                    className="text-orange-500 text-sm"
                  >
                    + Tambah bahan
                  </button>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Batal
                  </button>

                  <button
                    onClick={() => {
                      console.log("BUTTON CLICK");
                      handleSave();
                    }}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB CATEGORY */}
          <div className="flex gap-3">
            {["Semua", "Roti&Pastry", "Kue&Cake", "Minuman"].map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredRecipes.map((item: any, i: number) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow border overflow-hidden"
              >
                <div className="flex justify-between items-center p-4 bg-orange-100">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {item.product_name}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-green-600 text-white px-4 py-1 rounded-full text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteRecipe(item.product_id)}
                      className="bg-red-500 text-white px-4 py-1 rounded-full text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm mb-3 font-medium text-gray-900">
                    Komposisi bahan:
                  </p>
                  <div className="space-y-2">
                    {item.bahan.map((b: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between bg-gray-100 px-3 py-2 rounded"
                      >
                        <span className="text-gray-900">
                          {b.ingredient_name}
                        </span>

                        <span className="text-gray-900 font-medium">
                          {b.quantity} {b.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
