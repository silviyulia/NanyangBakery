"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MenuCard, { MenuItem } from "@/app/waitres/MenuCard";

export default function KasirPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [incomingTable, setIncomingTable] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [cart, setCart] = useState<
    Array<{
      id: number;
      name: string;
      price: number;
      qty: number;
      image?: string;
    }>
  >([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedOrder = window.localStorage.getItem("waitresOrder");
    if (!storedOrder) return;

    try {
      const parsed = JSON.parse(storedOrder);
      if (parsed?.items) {
        setIncomingTable(parsed.tableNumber || null);
        setCart(parsed.items);
      }
    } catch (error) {
      console.error("Gagal memuat pesanan waitres:", error);
    }
  }, []);

  // ================= MENU DATA =================
  const menu: MenuItem[] = [
    {
      id: 1,
      name: "Croissant",
      category: "Roti & Pastry",
      price: 30000,
      image:
        "https://static01.nyt.com/images/2021/04/07/dining/06croissantsrex1/merlin_184841898_ccc8fb62-ee41-44e8-9ddf-b95b198b88db-jumbo.jpg",
    },
    {
      id: 2,
      name: "Chocolate Cake",
      category: "Kue & Cake",
      price: 45000,
      image:
        "https://lilluna.com/wp-content/uploads/2019/01/Chocolate-Cake103.jpg",
    },
    {
      id: 3,
      name: "Espresso",
      category: "Minuman",
      price: 20000,
      image:
        "https://img.magnific.com/premium-photo/high-resolution-image-freshly-brewed-cup-espresso-with-creamy-crema-layer_1264082-26795.jpg?w=996",
    },
    {
      id: 4,
      name: "Baguette",
      category: "Roti & Pastry",
      price: 28000,
      image:
        "https://latelierdespains.fr/wp-content/uploads/2023/11/baguette-courte_Atelier-des-pains_1.jpg",
    },
    {
      id: 5,
      name: "Red Velvet",
      category: "Kue & Cake",
      price: 40000,
      image:
        "https://www.mommyplates.com/wp-content/uploads/2025/05/Red-Velvet-Cake.webp",
    },
    {
      id: 6,
      name: "Cappuccino",
      category: "Minuman",
      price: 25000,
      image:
        "https://tse4.mm.bing.net/th/id/OIP.sORUCLQs6IFavbrcEWRPgAHaE8?pid=Api&P=0&h=180",
    },
    {
      id: 7,
      name: "Danish Pastry",
      category: "Roti & Pastry",
      price: 32000,
      image:
        "https://tse1.mm.bing.net/th/id/OIP.tPkgAvgXjtG-R1fQNlm8ywHaEK?pid=Api&P=0&h=180",
    },
    {
      id: 8,
      name: "Brownies",
      category: "Kue & Cake",
      price: 35000,
      image:
        "https://www.glorioustreats.com/wp-content/uploads/2022/09/cheesecake-brownie-recipe-square.jpeg",
    },
  ];

  const categories = ["Semua", "Roti & Pastry", "Kue & Cake", "Minuman"];

  // ================= FILTER =================
  const filteredMenu = menu.filter((item) => {
    const matchCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;

    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  // ================= CART =================
  const addToCart = (item: MenuItem) => {
    const existing = cart.find((c) => c.id === item.id);

    if (existing) {
      setCart(
        cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c)),
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map((c) => (c.id === id ? { ...c, qty } : c)));
    }
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("waitresOrder");
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  // ================= UI =================
  return (
    <>
      {/* NAVBAR */}
            {/* Top Navbar */}
      <nav className="bg-amber-800 text-white shadow-lg">
        <div className="mx-auto max-w-[1480px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold">🍞</div>
              <h1 className="text-lg font-semibold">
                Waitres - Nanyang Bakery
              </h1>
            </div>
            <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <button className="text-sm text-amber-100 hover:text-white transition">
              👤 Kasir
            </button>
            <Link
              href="/login"
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Logout
            </Link>
          </div>
              {/*<div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-white font-semibold">
                {actorName.charAt(0)}
              </div> */}
            </div>
          </div>
        </div>
      </nav>

      {/* INFO ORDER */}
      {incomingTable && (
        <div className="max-w-screen-2xl mx-auto px-4 py-4">
          <div className="bg-amber-100 border border-amber-300 p-4 rounded-xl">
            Pesanan dari Meja <span className="font-bold">{incomingTable}</span>
          </div>
        </div>
      )}

      <div className="bg-amber-50 min-h-screen py-8">
        <div className="max-w-screen-2xl mx-auto px-4 grid lg:grid-cols-3 gap-6">
          {/* LEFT - MENU */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-4">Menu</h2>

            {/* CATEGORY */}
            <div className="flex gap-2 flex-wrap mb-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === cat
                      ? "bg-orange-600 text-white"
                      : "bg-orange-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* SEARCH */}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari menu..."
              className="w-full border px-4 py-2 rounded-full mb-4"
            />

            {/* MENU GRID */}
            <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredMenu.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  addToCart={addToCart}
                  disabled={false}
                />
              ))}
            </div>
          </div>
          {/* RIGHT SIDE - CART */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">
                🛒 Pesanan ({totalItems})
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 max-h-96 overflow-y-auto mb-6 border-b border-amber-200 pb-4">
                {cart.length === 0 ? (
                  <p className="text-center text-amber-600 py-8">
                    Keranjang kosong
                  </p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-amber-50 p-3 rounded-lg border border-amber-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm text-amber-700">
                            Rp {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="bg-amber-200 text-amber-900 w-7 h-7 rounded font-bold hover:bg-amber-300"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) =>
                            updateQty(item.id, parseInt(e.target.value) || 0)
                          }
                          className="flex-1 text-center border border-amber-300 rounded py-1 text-sm"
                        />
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="bg-amber-200 text-amber-900 w-7 h-7 rounded font-bold hover:bg-amber-300"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-right text-amber-900 font-bold mt-2">
                        Rp {(item.price * item.qty).toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Total */}
              <div className="space-y-3 border-t border-amber-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-amber-900 font-semibold">
                    Subtotal:
                  </span>
                  <span className="text-amber-900 font-bold">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-900 font-semibold">PPN 10%:</span>
                  <span className="text-amber-900 font-bold">
                    Rp {Math.round(totalPrice * 0.1).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between bg-amber-100 p-3 rounded-lg border-2 border-amber-300">
                  <span className="text-amber-900 font-bold">Total:</span>
                  <span className="text-amber-900 font-bold text-xl">
                    Rp {Math.round(totalPrice * 1.1).toLocaleString("id-ID")}
                  </span>
                </div>

                {/* Buttons */}
                <div className="space-y-2 pt-4">
                  <button
                    disabled={cart.length === 0}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-white transition ${
                      cart.length === 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                    }`}
                  >
                    ✓ Proses Pembayaran
                  </button>
                  <button
                    onClick={clearCart}
                    className={`w-full py-3 px-4 rounded-lg font-bold transition ${
                      cart.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    🗑️ Bersihkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
