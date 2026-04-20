"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function KasirPage() {
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [incomingTable, setIncomingTable] = useState<string | null>(null);
  const [cart, setCart] = useState<
    Array<{
      id: number;
      name: string;
      price: number;
      qty: number;
      emoji?: string;
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
        setCart(
          parsed.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            emoji: item.emoji || "🍽️",
          })),
        );
      }
    } catch (error) {
      console.error("Gagal memuat pesanan waitres:", error);
    }
  }, []);

  const menuItems = [
    {
      id: 1,
      name: "Strawberry Blend",
      price: 18000,
      emoji: "🍓",
      category: "blend",
    },
    { id: 2, name: "Taro Latte", price: 22000, emoji: "💜", category: "latte" },
    {
      id: 3,
      name: "Matcha Green",
      price: 24000,
      emoji: "🍵",
      category: "latte",
    },
    {
      id: 4,
      name: "Chocolate Shake",
      price: 20000,
      emoji: "🍫",
      category: "shake",
    },
    {
      id: 5,
      name: "Vanilla Cream",
      price: 19000,
      emoji: "🤍",
      category: "shake",
    },
    {
      id: 6,
      name: "Mango Paradise",
      price: 21000,
      emoji: "🥭",
      category: "blend",
    },
    {
      id: 7,
      name: "Iced Coffee",
      price: 16000,
      emoji: "☕",
      category: "coffee",
    },
    {
      id: 8,
      name: "Blueberry Mix",
      price: 20000,
      emoji: "🫐",
      category: "blend",
    },
    {
      id: 9,
      name: "Oreo Dreams",
      price: 23000,
      emoji: "🍪",
      category: "shake",
    },
    {
      id: 10,
      name: "Avocado Smoothie",
      price: 25000,
      emoji: "🥑",
      category: "smoothie",
    },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const addToCart = (item: (typeof menuItems)[0]) => {
    const existingItem = cart.find((c) => c.id === item.id);
    if (existingItem) {
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

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 bg-amber-800 text-white shadow-lg">
        <div className="max-w-screen-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">🥐 Kasir - Nanyang Bakery</h1>

          {/* Logout Button */}
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
        </div>
      </nav>

      {incomingTable ? (
        <div className="mx-auto max-w-screen-2xl px-4 py-4">
          <div className="rounded-3xl border border-amber-200 bg-amber-100 p-4 text-amber-900 shadow-sm">
            Pesanan baru dari waitres: Meja{" "}
            <span className="font-semibold">{incomingTable}</span>
          </div>
        </div>
      ) : null}

      {/* ================= MAIN CONTENT ================= */}
      <div className="bg-amber-50 min-h-screen py-8">
        <div className="max-w-screen-2xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDE - MENU */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-3xl font-bold text-amber-900 mb-6">
                Menu Minuman
              </h2>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedCategory === "all"
                      ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white"
                      : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setSelectedCategory("blend")}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedCategory === "blend"
                      ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white"
                      : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                  }`}
                >
                  Ice Blend
                </button>
                <button
                  onClick={() => setSelectedCategory("latte")}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedCategory === "latte"
                      ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white"
                      : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                  }`}
                >
                  With Milk
                </button>
                <button
                  onClick={() => setSelectedCategory("shake")}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedCategory === "shake"
                      ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white"
                      : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                  }`}
                >
                  Shake
                </button>
                <button
                  onClick={() => setSelectedCategory("coffee")}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedCategory === "coffee"
                      ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white"
                      : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                  }`}
                >
                  Coffee
                </button>
                <button
                  onClick={() => setSelectedCategory("smoothie")}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedCategory === "smoothie"
                      ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white"
                      : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                  }`}
                >
                  Smoothie
                </button>
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-center hover:shadow-lg hover:scale-105 transition cursor-pointer"
                  >
                    <p className="text-5xl mb-3">{item.emoji}</p>
                    <h3 className="font-bold text-amber-900 text-sm">
                      {item.name}
                    </h3>
                    <p className="text-amber-700 font-semibold mt-2">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>
                    <button
                      onClick={() => addToCart(item)}
                      className="mt-3 w-full bg-gradient-to-r from-amber-700 to-amber-600 text-white py-2 rounded-lg font-bold hover:from-amber-800 hover:to-amber-700 transition"
                    >
                      + Tambah
                    </button>
                  </div>
                ))}
              </div>
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
                          <p className="font-bold text-amber-900">
                            {item.emoji} {item.name}
                          </p>
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
