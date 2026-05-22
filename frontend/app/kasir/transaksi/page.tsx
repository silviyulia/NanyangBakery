"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MenuCard, { MenuItem } from "@/app/waitres/MenuCard";
import Sidebar from "../components/Sidebar";

export default function transaksiPage() {
  const [selectedCategory, setSelectedCategory] =
    useState("Semua");

  const [incomingTable, setIncomingTable] =
    useState<string | null>(null);

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

    const storedOrder =
      window.localStorage.getItem("waitresOrder");

    if (!storedOrder) return;

    try {
      const parsed = JSON.parse(storedOrder);

      if (parsed?.items) {
        setIncomingTable(parsed.tableNumber || null);
        setCart(parsed.items);
      }
    } catch (error) {
      console.error(
        "Gagal memuat pesanan waitres:",
        error
      );
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

  const categories = [
    "Semua",
    "Roti & Pastry",
    "Kue & Cake",
    "Minuman",
  ];

  // ================= FILTER =================
  const filteredMenu = menu.filter((item) => {
    const matchCategory =
      selectedCategory === "Semua" ||
      item.category === selectedCategory;

    const matchSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  // ================= CART =================
  const addToCart = (item: MenuItem) => {
    const existing = cart.find(
      (c) => c.id === item.id
    );

    if (existing) {
      setCart(
        cart.map((c) =>
          c.id === item.id
            ? { ...c, qty: c.qty + 1 }
            : c
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  const updateQty = (
    id: number,
    qty: number
  ) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setCart(
        cart.map((c) =>
          c.id === id ? { ...c, qty } : c
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(
        "waitresOrder"
      );
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

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

              <span className="text-sm text-gray-500">
                hau
              </span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <section className="p-8">
          {incomingTable && (
            <div className="mb-6">
              <div className="bg-orange-100 border border-orange-300 p-4 rounded-2xl text-orange-800 font-medium">
                Pesanan dari{" "}
                <span className="font-bold">
                  {incomingTable}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* LEFT - MENU */}
            <div className="xl:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-[#5c2500] mb-6">
                Menu
              </h2>

              {/* CATEGORY */}
              <div className="flex gap-3 flex-wrap mb-5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      setSelectedCategory(cat)
                    }
                    className={`px-5 py-2 rounded-full font-semibold transition ${
                      selectedCategory === cat
                        ? "bg-orange-500 text-white shadow"
                        : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* SEARCH */}
              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Cari menu..."
                className="w-full border border-gray-200 px-5 py-3 rounded-2xl mb-6 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />

              {/* MENU GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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

            {/* RIGHT - CART */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <h2 className="text-2xl font-bold text-[#5c2500] mb-6">
                  🛒 Pesanan ({totalItems})
                </h2>

                {/* CART ITEMS */}
                <div className="space-y-3 max-h-96 overflow-y-auto mb-6 border-b border-gray-200 pb-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">
                      Keranjang kosong
                    </p>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.id}
                        className="bg-orange-50 p-4 rounded-2xl border border-orange-100"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">
                              {item.name}
                            </h3>

                            <p className="text-sm text-orange-700">
                              Rp{" "}
                              {item.price.toLocaleString(
                                "id-ID"
                              )}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              removeFromCart(item.id)
                            }
                            className="text-red-500 font-bold"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQty(
                                item.id,
                                item.qty - 1
                              )
                            }
                            className="w-8 h-8 rounded-lg bg-orange-200 font-bold"
                          >
                            −
                          </button>

                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) =>
                              updateQty(
                                item.id,
                                parseInt(
                                  e.target.value
                                ) || 0
                              )
                            }
                            className="flex-1 text-center border rounded-lg py-1"
                          />

                          <button
                            onClick={() =>
                              updateQty(
                                item.id,
                                item.qty + 1
                              )
                            }
                            className="w-8 h-8 rounded-lg bg-orange-200 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <p className="text-right font-bold text-orange-600 mt-3">
                          Rp{" "}
                          {(
                            item.price * item.qty
                          ).toLocaleString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* TOTAL */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>

                    <span>
                      Rp{" "}
                      {totalPrice.toLocaleString(
                        "id-ID"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>PPN 10%</span>

                    <span>
                      Rp{" "}
                      {Math.round(
                        totalPrice * 0.1
                      ).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex justify-between bg-orange-100 p-4 rounded-2xl font-bold text-lg">
                    <span>Total</span>

                    <span className="text-orange-600">
                      Rp{" "}
                      {Math.round(
                        totalPrice * 1.1
                      ).toLocaleString("id-ID")}
                    </span>
                  </div>

                  {/* BUTTON */}
                  <div className="space-y-3 pt-4">
                    <button
                      disabled={cart.length === 0}
                      className={`w-full py-3 rounded-2xl font-bold text-white transition ${
                        cart.length === 0
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      ✓ Proses Pembayaran
                    </button>

                    <button
                      onClick={clearCart}
                      disabled={cart.length === 0}
                      className={`w-full py-3 rounded-2xl font-bold transition ${
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
        </section>
      </main>
    </div>
  );
}